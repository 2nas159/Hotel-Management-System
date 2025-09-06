import React, { useState, useEffect } from "react";

const PriceRangeSlider = ({ 
  min = 0, 
  max = 3000, 
  step = 50, 
  value = [0, 3000], 
  onChange = () => {},
  currency = "$"
}) => {
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleMinChange = (e) => {
    const newMin = parseInt(e.target.value);
    const newValue = [Math.min(newMin, localValue[1]), localValue[1]];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleMaxChange = (e) => {
    const newMax = parseInt(e.target.value);
    const newValue = [localValue[0], Math.max(newMax, localValue[0])];
    setLocalValue(newValue);
    onChange(newValue);
  };

  const getPercentage = (val) => {
    return ((val - min) / (max - min)) * 100;
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Price Range</span>
          <span className="text-sm text-gray-500">
            {currency} {localValue[0]} - {currency} {localValue[1]}
          </span>
        </div>
        
        {/* Range Slider Container */}
        <div className="relative">
          {/* Track */}
          <div className="h-2 bg-gray-200 rounded-lg relative">
            {/* Active Range */}
            <div
              className="absolute h-2 bg-blue-500 rounded-lg"
              style={{
                left: `${getPercentage(localValue[0])}%`,
                width: `${getPercentage(localValue[1]) - getPercentage(localValue[0])}%`
              }}
            />
          </div>
          
          {/* Min Range Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue[0]}
            onChange={handleMinChange}
            className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{
              background: 'transparent',
              zIndex: localValue[0] > max - 100 ? 5 : 3
            }}
          />
          
          {/* Max Range Input */}
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={localValue[1]}
            onChange={handleMaxChange}
            className="absolute top-0 w-full h-2 bg-transparent appearance-none cursor-pointer slider-thumb"
            style={{
              background: 'transparent',
              zIndex: localValue[1] < min + 100 ? 5 : 3
            }}
          />
        </div>
      </div>
      
      {/* Input Fields */}
      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Min Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              {currency}
            </span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={localValue[0]}
              onChange={(e) => {
                const newMin = Math.min(parseInt(e.target.value) || min, localValue[1]);
                const newValue = [newMin, localValue[1]];
                setLocalValue(newValue);
                onChange(newValue);
              }}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex-1">
          <label className="block text-xs text-gray-500 mb-1">Max Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              {currency}
            </span>
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              value={localValue[1]}
              onChange={(e) => {
                const newMax = Math.max(parseInt(e.target.value) || max, localValue[0]);
                const newValue = [localValue[0], newMax];
                setLocalValue(newValue);
                onChange(newValue);
              }}
              className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>
      
      {/* Reset Button */}
      <button
        onClick={() => {
          const resetValue = [min, max];
          setLocalValue(resetValue);
          onChange(resetValue);
        }}
        className="mt-3 text-xs text-blue-500 hover:text-blue-600 underline"
      >
        Reset Range
      </button>
      
      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #ffffff;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;
