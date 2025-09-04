import React from "react";

const OccupancyRate = ({ data = {} }) => {
  // Mock data for demonstration
  const mockData = {
    current: 78,
    previous: 72,
    rooms: 25,
    occupied: 19.5,
    available: 5.5
  };

  const occupancyData = data.occupancy || mockData.current;
  const previousOccupancy = data.previousOccupancy || mockData.previous;
  const totalRooms = data.totalRooms || mockData.rooms;
  const occupiedRooms = data.occupiedRooms || mockData.occupied;
  const availableRooms = data.availableRooms || mockData.available;

  const change = occupancyData - previousOccupancy;
  const changePercentage = previousOccupancy > 0 ? (change / previousOccupancy) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Occupancy Rate</h3>
      
      {/* Main occupancy display */}
      <div className="text-center mb-6">
        <div className="text-4xl font-bold text-blue-600 mb-2">
          {occupancyData}%
        </div>
        <div className="flex items-center justify-center gap-2">
          <span className="text-sm text-gray-600">vs last period</span>
          <span className={`text-sm font-medium ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {change >= 0 ? '+' : ''}{changePercentage.toFixed(1)}%
          </span>
        </div>
      </div>
      
      {/* Circular progress indicator */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
          {/* Background circle */}
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#e5e7eb"
            strokeWidth="2"
          />
          {/* Progress circle */}
          <path
            d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeDasharray={`${occupancyData}, 100`}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">{occupancyData}%</div>
            <div className="text-xs text-gray-500">Occupied</div>
          </div>
        </div>
      </div>
      
      {/* Room breakdown */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span className="text-sm text-gray-600">Occupied Rooms</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{occupiedRooms}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-300 rounded"></div>
            <span className="text-sm text-gray-600">Available Rooms</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{availableRooms}</span>
        </div>
        
        <div className="flex justify-between items-center pt-2 border-t border-gray-200">
          <span className="text-sm font-medium text-gray-900">Total Rooms</span>
          <span className="text-sm font-medium text-gray-900">{totalRooms}</span>
        </div>
      </div>
    </div>
  );
};

export default OccupancyRate;
