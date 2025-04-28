import React, { useState } from "react";
import { PDFExportButton } from "../components/PdfExportButton";
import { TripForm } from "../components/TripForm";
import { TripResults } from "../components/TripResult";
import { saveTrip } from "../utils/api";
import { Button, message } from "antd";
import { CopyLinkButton } from "../components/CopyLinkButton";
import { FeedbackForm } from "../components/FeedbackForm";
import { Toaster } from "react-hot-toast";
import { GetFeedback } from "../components/GetFeedback";
import Footer from "../components/Footer";

export default function HomePage() {
  const [tripData, setTripData] = useState(null);
  const [shareableLink, setShareableLink] = useState(null);

  async function handleSave() {
    try {
      const id = await saveTrip(tripData);
      const link = `http://localhost:5173/trip/${id}`;
      setShareableLink(link);
      message.success("Trip saved! You can share the link.");
    } catch (err) {
      console.error("Failed to save trip:", err);
      message.error("Failed to save trip.");
    }
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-rose-100 p-6 sm:p-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-10 text-center text-rose-700 drop-shadow-lg">
            ✈️ Trip Planner
          </h1>
          <h1 className="text-lg md:text-2xl font-extrabold mb-10 text-center text-rose-700 drop-shadow-lg">
            Craft Your Perfect Journey with Ease!
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-10">
            <Toaster />
            <TripForm onTripPlanned={setTripData} />

            {tripData && (
              <div className="mt-10">
                <TripResults data={tripData} />

                <div className="mt-8 flex flex-col items-center gap-6">
                  <div className="flex flex-wrap gap-4 justify-center">
                    <PDFExportButton content={tripData} />
                    <Button
                      onClick={handleSave}
                      type="primary"
                      className="bg-rose-600 hover:bg-rose-700 border-none text-white font-semibold shadow-md"
                    >
                      Save Trip & Get Link
                    </Button>
                  </div>

                  {shareableLink && (
                    <>
                      <div className="mt-6 bg-gray-50 p-5 rounded-xl shadow-inner w-full max-w-2xl text-center">
                        <p className="text-gray-600 font-medium text-sm mb-2">
                          Share your trip with this link:
                        </p>
                        <a
                          href={shareableLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-rose-600 font-semibold text-lg break-all"
                        >
                          {shareableLink}
                        </a>
                        <div className="mt-2">
                          <CopyLinkButton link={shareableLink} />
                        </div>
                      </div>

                      <div className="mt-8 w-full max-w-2xl">
                        <FeedbackForm tripId={shareableLink.split("/").pop()} />
                        <GetFeedback tripId={shareableLink.split("/").pop()} />
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
