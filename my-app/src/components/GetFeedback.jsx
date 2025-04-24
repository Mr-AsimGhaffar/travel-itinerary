import React, { useState } from "react";
import { Spin, Alert, Button } from "antd";
import { getFeedback } from "../utils/api";
import { MessageOutlined } from "@ant-design/icons";

export function GetFeedback({ tripId }) {
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visible, setVisible] = useState(false);

  const handleShowFeedback = async () => {
    setVisible(true);
    setLoading(true);
    setError(null);

    try {
      const data = await getFeedback(tripId);
      setFeedback(data);
    } catch (err) {
      setError("Failed to load feedback.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 w-full max-w-3xl mx-auto">
      <div className="text-center mb-4">
        <Button
          onClick={handleShowFeedback}
          icon={<MessageOutlined />}
          className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-xl shadow-md hover:scale-105 hover:from-rose-600 hover:to-pink-600 transition-all duration-300"
          loading={loading}
          disabled={loading}
        >
          {visible ? "Refresh Feedback" : "Show Feedback"}
        </Button>
      </div>

      {visible && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-rose-100">
          <h2 className="text-2xl font-bold text-rose-700 mb-4 text-center">
            User Feedback
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-6">
              <Spin size="large" />
            </div>
          ) : error ? (
            <Alert message={error} type="error" showIcon />
          ) : feedback.length === 0 ? (
            <p className="text-gray-500 text-center">No feedback yet.</p>
          ) : (
            <ul className="space-y-3">
              {feedback.map((item, index) => (
                <li
                  key={index}
                  className="bg-rose-50 border border-rose-100 p-4 rounded-lg text-gray-800 shadow-sm"
                >
                  <span className="block text-sm font-medium text-gray-600 mb-1">
                    Feedback
                  </span>
                  <span className="text-base">{item.message}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
