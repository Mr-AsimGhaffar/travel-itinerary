export async function planTrip(formData) {
  const res = await fetch("http://localhost:3001/plan-trip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });
  const data = await res.json();
  return data.tripPlan;
}

export async function saveTrip(markdown) {
  const res = await fetch("http://localhost:3001/save-trip", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ markdown }),
  });

  if (!res.ok) {
    throw new Error(`Failed to save trip: ${res.statusText}`);
  }

  const data = await res.json();
  return data.tripId;
}

export async function submitFeedback({ tripId, message }) {
  const res = await fetch("http://localhost:3001/feedback", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tripId, message }),
  });

  if (!res.ok) throw new Error("Failed to submit feedback");

  return await res.json();
}

export async function getFeedback(tripId) {
  const res = await fetch(`http://localhost:3001/feedback/${tripId}`);
  const data = await res.json();
  return data.feedback;
}

export async function fetchTripImages(tripData) {
  const res = await fetch("http://localhost:3001/get-unsplash-images", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tripData),
  });

  if (!res.ok) {
    throw new Error("Failed to fetch images from Unsplash");
  }

  const data = await res.json();
  return data.images;
}
