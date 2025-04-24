import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/index";
import TripPage from "./pages/trip/[tripId]";
import "./main.css";
import "antd/dist/reset.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        {/* Home Page */}
        <Route path="/" element={<HomePage />} />

        {/* Dynamic Trip Page */}
        <Route path="/trip/:tripId" element={<TripPage />} />
      </Routes>
    </Router>
  </StrictMode>
);
