import React from "react";
import { Button } from "antd";
import { generatePDF } from "../utils/pdfGenerator";

export function PDFExportButton({ content }) {
  return (
    <Button type="primary" onClick={() => generatePDF(content)}>
      Download Itinerary as PDF
    </Button>
  );
}
