import React from "react";
import { assets } from "../../assets/assets";

const GuestCapacityFilter = ({ 
  selectedCapacity = 0, 
  onChange = () => {},
  minCapacity = 1,
  maxCapacity = 8
}) => {
  const capacityOptions = Array.from(
    { length: maxCapacity - minCapacity + 1 }, 
    (_, index) => minCapacity + index
  );

  const handleCapacityChange = (capacity) => {
    if (selectedCapacity === capacity) {
      // If clicking the same capacity, deselect it
      onChange(0);
    } else {
      onChange(capacity);
    }
  };

  const clearCapacity = () => {
    onChange(0);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-3">
        <span className="font-medium text-gray-800">Guest Capacity</span>
        {selectedCapacity > 0 && (
          <button
            onClick={clearCapacity}
            className="text-xs text-blue-500 hover:text-blue-600 underline"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="space-y-2">
        {capacityOptions.map((capacity) => {
          const isSelected = selectedCapacity === capacity;
          
          return (
            <label
              key={capacity}
              className={`
                flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors
                ${isSelected ? 'bg-blue-50 border border-blue-200' : ''}
              `}
            >
              <input
                type="radio"
                name="guestCapacity"
                checked={isSelected}
                onChange={() => handleCapacityChange(capacity)}
                className="w-4 h-4 accent-blue-500"
              />
              <div className="flex items-center gap-2">
                <img
                  src={assets.guestsIcon}
                  alt="guests"
                  className="w-4 h-4"
                />
                <span className="text-sm font-light select-none">
                  {capacity} guest{capacity > 1 ? 's' : ''}
                </span>
              </div>
            </label>
          );
        })}
      </div>
      
      {selectedCapacity > 0 && (
        <div className="mt-3 p-2 bg-blue-50 rounded-lg">
          <p className="text-xs text-blue-700 font-medium">
            Showing rooms suitable for {selectedCapacity} guest{selectedCapacity > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default GuestCapacityFilter;
