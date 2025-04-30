require("dotenv").config();
const mongoose = require("mongoose");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const Feedback = require("./models/Feedback");

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

app.use(cors());
app.use(bodyParser.json());

// In-memory trip store (if needed)
const trips = {};

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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Get Pictures
app.post("/get-unsplash-images", async (req, res) => {
  const { location, startingPoint, endingPoint, interests, mustHave } =
    req.body;

  // Flatten and clean inputs
  const toArray = (val) =>
    Array.isArray(val)
      ? val.filter((item) => typeof item === "string" && item.trim() !== "")
      : typeof val === "string" && val.trim() !== ""
      ? [val]
      : [];

  const queryParts = [
    ...toArray(location),
    ...toArray(startingPoint),
    ...toArray(endingPoint),
    ...toArray(interests),
    ...toArray(mustHave),
  ];

  const query = queryParts.join(", ").trim() || "travel landscape";

  try {
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

    res.json({ images });
  } catch (err) {
    console.error("Unsplash fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch images from Unsplash" });
  }
});
