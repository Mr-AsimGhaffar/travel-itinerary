require("dotenv").config();
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Feedback = require("./models/Feedback");
const crypto = require("crypto");
const ImageResult = require("./models/ImageCache");

const app = express();
const port = process.env.PORT || 3001;

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});
db.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// Define the Trip schema and model
const tripSchema = new mongoose.Schema(
  {
    hash: {
      type: String,
      unique: true,
    },
    markdown: {
      overview: {
        type: String,
      },
      days: [
        {
          day: {
            type: Number,
          },
          location: {
            type: String,
          },
          description: {
            type: String,
          },
        },
      ],
      costs: {
        type: Map,
        of: String,
      },
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const corsOptions = {
  origin: "https://trip-planner-itinerary.fly.dev",
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// In-memory trip store (if needed)
const trips = {};

function generateHash(obj) {
  return crypto.createHash("sha256").update(JSON.stringify(obj)).digest("hex");
}

// Gemini setup
app.post("/plan-trip", async (req, res) => {
  try {
    const {
      startingPoint,
      endingPoint,
      duration,
      location,
      numberOfTravellers,
      travelType,
      travelStyle,
      interests,
      mustHave,
      requirements,
    } = req.body;

    const hash = generateHash(req.body);
    const existingTrip = await Trip.findOne({ hash });

    if (existingTrip) {
      return res.json({ tripPlan: existingTrip.markdown });
    }

    const prompt = `Plan a trip with the following details:
  - Starting Point: ${startingPoint}
  - Ending Point: ${endingPoint}
  - Duration: ${duration} days
  - Location: ${location}
  - Number of Travellers: ${numberOfTravellers}
  - Travel Type: ${travelType}
  - Travel Style: ${travelStyle}
  - Interests: ${interests}
  - Must Have: ${mustHave}
  - Requirements: ${requirements}

Please respond with a detailed travel plan in the following format:

{
  "overview": "A brief summary of the trip.",
  "days": [{
                "day": number,
                "location": "",
                "description": ""
            }, ],
  "costs": { // Keys should reflect different cost categories dynamically based on the trip details}
}

Make sure to structure the response to reflect the details provided, adjusting the "days" and "costs" as appropriate. Be sure to include a meaningful "overview" of the trip based on the input.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        responseMimeType: "application/json",
      },
    });
    const result = await model.generateContent(prompt);
    const tripPlan = JSON.parse(result.response.text());

    // Save new trip in DB with the hash
    const newTrip = new Trip({ markdown: tripPlan, hash });
    await newTrip.save();

    res.json({ tripPlan });
  } catch (error) {
    console.error("Gemini API Error →", error);
    res.status(500).json({ error: "Failed to generate trip plan." });
  }
});

// Save trip to MongoDB
app.post("/save-trip", async (req, res) => {
  const { markdown } = req.body;

  if (!markdown) {
    return res.status(400).json({ error: "Trip markdown is required." });
  }

  try {
    delete markdown.images;
    const newTrip = new Trip({ markdown });
    const savedTrip = await newTrip.save();
    res.json({ tripId: savedTrip._id });
  } catch (err) {
    console.error("Save trip error:", err);
    res.status(500).json({ error: "Failed to save trip" });
  }
});

// Get trip by ID from MongoDB
app.get("/get-trip/:tripId", async (req, res) => {
  const { tripId } = req.params;

  try {
    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({ error: "Trip not found." });
    }

    res.json({ markdown: trip.markdown });
  } catch (err) {
    console.error("Get trip error:", err);
    res.status(500).json({ error: "Failed to retrieve trip" });
  }
});

// Submit feedback
app.post("/feedback", async (req, res) => {
  const { tripId, message } = req.body;

  if (!tripId || !message) {
    return res.status(400).json({ error: "Trip ID and message are required." });
  }

  try {
    const feedback = new Feedback({ tripId, message });
    await feedback.save();
    res.json({ success: true });
  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ error: "Failed to submit feedback." });
  }
});

// Get feedback for a trip
app.get("/feedback/:tripId", async (req, res) => {
  try {
    const feedbackList = await Feedback.find({ tripId: req.params.tripId });
    res.json({ feedback: feedbackList });
  } catch (err) {
    console.error("Fetch feedback error:", err);
    res.status(500).json({ error: "Failed to fetch feedback." });
  }
});

// Get Pictures
app.post("/get-unsplash-images", async (req, res) => {
  const hash = generateHash(req.body);

  try {
    const cached = await ImageResult.findOne({ hash });
    if (cached) {
      return res.json({ images: cached.images });
    }

    const toArray = (val) =>
      Array.isArray(val)
        ? val.filter((item) => typeof item === "string" && item.trim() !== "")
        : typeof val === "string" && val.trim() !== ""
        ? [val]
        : [];

    const queryParts = [
      ...toArray(req.body.location),
      ...toArray(req.body.startingPoint),
      ...toArray(req.body.endingPoint),
      ...toArray(req.body.interests),
      ...toArray(req.body.mustHave),
    ];

    const query = queryParts.join(", ").trim() || "travel landscape";

    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=6`,
      {
        headers: {
          Authorization: `Client-ID ${process.env.UNSPLASH_KEY}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Unsplash API Error:", errorText);
      return res.status(500).json({ error: "Failed to fetch images" });
    }

    const data = await response.json();

    const images = Array.isArray(data.results)
      ? data.results.map((img) => ({
          url: img.urls.small,
          alt: img.alt_description || "Trip image",
        }))
      : [];

    await new ImageResult({ hash, images }).save();

    res.json({ images });
  } catch (err) {
    console.error("Unsplash fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch images from Unsplash" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
