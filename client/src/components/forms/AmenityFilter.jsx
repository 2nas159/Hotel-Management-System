import React from "react";
import { facilityIcons } from "../../assets/assets";

const AmenityFilter = ({ 
  selectedAmenities = [], 
  onChange = () => {},
  availableAmenities = [
    "Free Wifi",
    "Breakfast Included", 
    "Room Service",
    "Mountain View",
    "Pool Access"
  ]
}) => {
  const handleAmenityChange = (amenity, checked) => {
    if (checked) {
      onChange([...selectedAmenities, amenity]);
    } else {
      onChange(selectedAmenities.filter(a => a !== amenity));
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-gray-800">Amenities</span>
        {selectedAmenities.length > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-blue-500 hover:text-blue-600 underline"
          >
            Clear All
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {availableAmenities.map((amenity) => (
          <label
            key={amenity}
            className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
          >
            <input
              type="checkbox"
              checked={selectedAmenities.includes(amenity)}
              onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
              className="w-4 h-4 accent-blue-500 rounded border-gray-300 focus:ring-blue-500"
            />
            <div className="flex items-center gap-2">
              <img
                src={facilityIcons[amenity]}
                alt={amenity}
                className="w-4 h-4"
              />
              <span className="text-sm font-light select-none">{amenity}</span>
            </div>
          </label>
        ))}
      </div>
      
      {selectedAmenities.length > 0 && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 font-medium mb-1">Selected:</p>
          <div className="flex flex-wrap gap-1">
            {selectedAmenities.map((amenity) => (
              <span
                key={amenity}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
              >
                <img
                  src={facilityIcons[amenity]}
                  alt={amenity}
                  className="w-3 h-3"
                />
                {amenity}
                <button
                  onClick={() => handleAmenityChange(amenity, false)}
                  className="ml-1 text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenityFilter;
