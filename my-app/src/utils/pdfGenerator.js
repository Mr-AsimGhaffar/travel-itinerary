import html2pdf from "html2pdf.js";

export function generatePDF(content) {
  const element = document.createElement("div");

  // Format the content for the PDF
  const formattedContent = formatContentForPDF(content);

  // Set up the HTML structure for the PDF
  element.innerHTML = `
    <style>
      @page {
        margin: 40px 40px 60px 40px;
      }

      body {
        margin: 0;
      }

      .pdf-container {
        font-family: Arial, sans-serif;
        font-size: 14px;
        line-height: 1.6;
        padding: 10px 20px;
      }

      h1 {
        text-align: center;
        margin-bottom: 24px;
        color: #333;
        font-size: 28px;
      }

      h2 {
        color: #e60536;
        font-size: 22px;
        margin-top: 30px;
      }

      h3 {
        color: #e60536;
        font-size: 18px;
        margin-top: 20px;
      }

      p, li {
        margin: 8px 0;
      }

      ul {
        list-style-type: none;
        padding-left: 0;
      }

      li {
        color: #e60536;
      }

      .section {
        margin-top: 40px;
      }

      .no-break {
        page-break-inside: avoid;
      }
    </style>

    <div class="pdf-container">
      ${formattedContent}
    </div>
  `;

  // Generate and save the PDF
  html2pdf().from(element).save("Trip-Itinerary.pdf");
}

function formatContentForPDF(content) {
  const { overview, days, costs } = content;

  let htmlContent = `<h1>Trip Itinerary</h1>`;

  htmlContent += `
    <div class="section">
      <h2>Overview</h2>
      <p>${overview}</p>
    </div>
  `;

  htmlContent += `
    <div class="section">
      <h2>Daily Itinerary</h2>
  `;

  days.forEach((day) => {
    htmlContent += `
      <div class="no-break" style="margin-bottom: 20px;">
        <h3>Day ${day.day}: ${day.location}</h3>
        <p>${day.description.replace(/\n/g, "<br>")}</p>
      </div>
    `;
  });

  htmlContent += `</div>`;

  htmlContent += `
    <div class="section">
      <h2>Cost Breakdown</h2>
      <ul>
  `;

  for (const [key, value] of Object.entries(costs)) {
    htmlContent += `<li><strong>${key
      .replace(/_/g, " ")
      .toUpperCase()}:</strong> ${value}</li>`;
  }

  htmlContent += `
      </ul>
    </div>
  `;

  return htmlContent;
}
