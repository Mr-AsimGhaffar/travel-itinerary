import { useState } from "react";
import { Button, Input } from "antd";
import { submitFeedback } from "../utils/api";
import toast from "react-hot-toast";

export function FeedbackForm({ tripId }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast.error("Feedback message is required.");
      return;
    }

    setLoading(true);
    try {
      await submitFeedback({ tripId, message });
      toast.success("Feedback submitted successfully!");
      setMessage("");
    } catch (error) {
      console.error(error);
      toast.error("Feedback not submitted. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-md mt-6">
      <h3 className="text-lg md:text-2xl font-bold text-rose-700 mb-2 text-center">
        Leave Feedback
      </h3>
      <Input.TextArea
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Your feedback..."
        className="mb-2"
      />
      <div className="mt-4 text-center">
        <Button type="primary" onClick={handleSubmit} loading={loading}>
          Submit
        </Button>
      </div>
    </div>
  );
}
