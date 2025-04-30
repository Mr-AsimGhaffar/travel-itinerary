import React from "react";

const TripImageGallery = ({ tripData }) => {
  if (!tripData) return null;

  // If no images exist on tripData
  if (!tripData.images || tripData.images.length === 0) {
    return <p className="text-gray-400">No images found for this trip.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
      {tripData.images.map((img, index) => (
        <img
          key={index}
          src={img.url}
          alt={img.alt}
          className="w-full h-48 object-cover rounded-lg shadow"
        />
      ))}
    </div>
  );
};

export default TripImageGallery;
