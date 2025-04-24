import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Collapse } from "antd";
import { AnimatePresence, motion as Motion } from "framer-motion";
import "antd/dist/reset.css";
import { formatString } from "../../utils/formatString";

const { Panel } = Collapse;

export default function TripPage() {
  const { tripId } = useParams();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const response = await fetch(
          `http://localhost:3001/get-trip/${tripId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch trip data");
        }
        const data = await response.json();
        setTripData(data.markdown);
      } catch (err) {
        console.error("Error fetching trip:", err);
        setError(err.message || "An error occurred while loading the trip.");
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId]);

  if (loading) {
    return (
      <p className="text-center text-gray-600 text-lg mt-8">Loading trip...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-600 text-lg mt-8">Error: {error}</p>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-xl">
      <h1 className="text-3xl font-extrabold text-rose-700 mb-6 text-center">
        Saved Itinerary
      </h1>

      {tripData && (
        <>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-rose-700 mb-2">
              Overview
            </h2>
            <p className="text-gray-800 leading-relaxed">{tripData.overview}</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-rose-700 mb-4">
              Daily Plan
            </h2>
            <Collapse accordion className="bg-white">
              {tripData.days.map((day, index) => (
                <Panel
                  header={`Day ${day.day}: ${day.location}`}
                  key={index}
                  className="bg-gray-50 border border-gray-200 rounded-lg text-base"
                >
                  <AnimatePresence mode="wait">
                    <Motion.div
                      key={`motion-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-gray-700 mt-2 text-sm">
                        {day.description}
                      </p>
                    </Motion.div>
                  </AnimatePresence>
                </Panel>
              ))}
            </Collapse>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-rose-700 mb-4">Costs</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              {Object.entries(tripData.costs).map(([key, value]) => (
                <li key={key}>
                  <span className="text-gray-900 text-rose-700 text-lg">
                    {formatString(key)}:
                  </span>{" "}
                  {value}
                </li>
              ))}
            </ul>
          </section>
        </>
      )}
    </div>
  );
}
