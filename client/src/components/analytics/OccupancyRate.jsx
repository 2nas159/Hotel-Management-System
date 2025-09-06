import React from "react";

const OccupancyRate = ({ data = {} }) => {
  const {
    occupancy = 0,
    previousOccupancy = 0,
    totalRooms = 0,
    occupiedRooms = 0,
    availableRooms = 0
  } = data;

  // Calculate occupancy change
  const occupancyChange = occupancy - previousOccupancy;
  const changePercentage = previousOccupancy > 0 ? Math.round((occupancyChange / previousOccupancy) * 100) : 0;

  if (totalRooms === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">No Rooms Available</p>
        <p className="text-sm text-gray-500 text-center">
          Add rooms to see occupancy data.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Occupancy Display */}
      <div className="text-center mb-6">
        <div className="relative w-32 h-32 mx-auto mb-4">
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
              stroke={occupancy >= 80 ? "#ef4444" : occupancy >= 60 ? "#f59e0b" : "#10b981"}
              strokeWidth="3"
              strokeDasharray={`${occupancy}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{occupancy}%</div>
              <div className="text-xs text-gray-500">Occupied</div>
            </div>
          </div>
        </div>
        
        {/* Change indicator */}
        <div className="flex items-center justify-center gap-2">
          {occupancyChange !== 0 && (
            <>
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                occupancyChange > 0 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-green-100 text-green-700'
              }`}>
                <svg 
                  className={`w-3 h-3 ${occupancyChange > 0 ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
                {Math.abs(changePercentage)}%
              </div>
              <span className="text-sm text-gray-500">vs last period</span>
            </>
          )}
        </div>
      </div>

      {/* Room Statistics */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Occupied Rooms</span>
          </div>
          <span className="font-semibold text-gray-900">{occupiedRooms}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
            <span className="text-sm text-gray-600">Available Rooms</span>
          </div>
          <span className="font-semibold text-gray-900">{availableRooms}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm text-gray-600">Total Rooms</span>
          </div>
          <span className="font-semibold text-gray-900">{totalRooms}</span>
        </div>
      </div>

      {/* Occupancy Status */}
      <div className="mt-4 p-3 rounded-lg text-center text-sm font-medium ${
        occupancy >= 90 ? 'bg-red-100 text-red-700' :
        occupancy >= 75 ? 'bg-yellow-100 text-yellow-700' :
        occupancy >= 50 ? 'bg-green-100 text-green-700' :
        'bg-gray-100 text-gray-700'
      }">
        {occupancy >= 90 ? 'High Occupancy - Consider expanding' :
         occupancy >= 75 ? 'Good Occupancy - Monitor closely' :
         occupancy >= 50 ? 'Moderate Occupancy - Room for growth' :
         'Low Occupancy - Focus on marketing'}
      </div>
    </div>
  );
};

export default OccupancyRate;