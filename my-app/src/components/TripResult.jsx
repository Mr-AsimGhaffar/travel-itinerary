import React from "react";
import { Collapse } from "antd";
import { twMerge } from "tailwind-merge";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { CaretDownOutlined } from "@ant-design/icons";
import { formatString } from "../utils/formatString";

const { Panel } = Collapse;

const dayColors = [
  "bg-gradient-to-r from-rose-100 to-pink-100",
  "bg-gradient-to-r from-yellow-100 to-amber-100",
  "bg-gradient-to-r from-emerald-100 to-green-100",
  "bg-gradient-to-r from-sky-100 to-blue-100",
  "bg-gradient-to-r from-indigo-100 to-purple-100",
  "bg-gradient-to-r from-fuchsia-100 to-pink-200",
  "bg-gradient-to-r from-rose-100 via-orange-100 to-yellow-100",
];

export function TripResults({ data }) {
  if (!data || !data) {
    return <div>Loading...</div>; // or some error message
  }

  const { overview, days, costs } = data;

  // Formatting costs as an array of key-value pairs for easier rendering
  const costEntries = Object.entries(costs).map(([key, value]) => ({
    label: key.replace(/_/g, " ").toUpperCase(),
    value: value,
  }));

  return (
    <div className="max-w-4xl mx-auto my-12 px-4">
      {/* Main Heading */}
      <Motion.h2
        className="text-2xl md:text-4xl font-bold mb-8 text-center text-rose-600 drop-shadow-sm"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        Your Desired Trip Itinerary 💕
      </Motion.h2>

      {/* Trip Overview Section */}
      {overview && (
        <div className="mb-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
          <h3 className="text-xl md:text-2xl font-semibold text-rose-700 mb-4">
            Trip Overview
          </h3>
          <div
            className="whitespace-pre-wrap text-gray-800 leading-relaxed tracking-wide text-sm md:text-base"
            dangerouslySetInnerHTML={{
              __html: overview.replace(/\n/g, "<br />"),
            }}
          />
        </div>
      )}

      {/* Collapsible Day-by-Day Itinerary */}
      <Collapse
        accordion
        expandIcon={({ isActive }) => (
          <Motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.3 }}
            className="text-rose-500"
          >
            <CaretDownOutlined />
          </Motion.div>
        )}
        bordered={false}
        className="bg-white rounded-xl shadow-xl"
      >
        {days.map((day, index) => (
          <Panel
            header={
              <span className="text-base md:text-lg font-semibold text-rose-700">
                {`Day ${day.day}`}:{" "}
                {day.location.split("/").map((part, index, arr) => (
                  <React.Fragment key={index}>
                    {part}
                    {/* Add slash if it's not the last part */}
                    {index < arr.length - 1 && "/"}
                    {/* On small screens only, break after second slash */}
                    {index === 1 && <br className="block md:hidden" />}
                  </React.Fragment>
                ))}
              </span>
            }
            key={`day-${index}`}
            className={twMerge(
              "rounded-2xl overflow-hidden border-none",
              dayColors[index % dayColors.length]
            )}
            showArrow={true}
          >
            <AnimatePresence mode="wait" initial={false}>
              <Motion.div
                key={`motion-day-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="p-5 whitespace-pre-wrap text-gray-800 leading-relaxed tracking-wide bg-white bg-opacity-80 rounded-lg"
              >
                <p className="text-sm md:text-base">{day.description}</p>
              </Motion.div>
            </AnimatePresence>
          </Panel>
        ))}
      </Collapse>
      {/* Costs Section */}
      {costEntries.length > 0 && (
        <div className="mt-12 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
          {/* Section Title */}
          <h3 className="text-xl md:text-3xl font-bold text-rose-600 mb-8 text-center">
            Estimated Costs
          </h3>

          {/* Cost Entries List */}
          <div className="space-y-4">
            {costEntries.map(({ label, value }) => (
              <div
                key={label}
                className="flex flex-col sm:flex-row justify-start gap-4 items-center px-4 py-3 bg-gray-50 rounded-lg shadow-sm"
              >
                {/* Label */}
                <strong className="text-sm md:text-lg text-rose-700">
                  {formatString(label)}
                </strong>

                {/* Value */}
                <span className="text-sm md:text-base text-gray-700">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
