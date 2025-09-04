import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Line } from 'recharts';

const BookingTrends = ({ data = [] }) => {
  // Use provided data or fallback to empty array
  const chartData = data.length > 0 ? data : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (chartData.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Booking Trends</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No booking data available</p>
        </div>
      </div>
    );
  }

  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);
  const totalCancellations = chartData.reduce((sum, item) => sum + item.cancellations, 0);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Booking Trends</h3>
      
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="day" 
              stroke="#6b7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="bookings" 
              fill="#3b82f6" 
              name="Bookings"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="cancellations" 
              fill="#ef4444" 
              name="Cancellations"
              radius={[4, 4, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {totalBookings}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-red-600">
              {totalCancellations}
            </div>
            <div className="text-sm text-gray-600">Cancellations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingTrends;
