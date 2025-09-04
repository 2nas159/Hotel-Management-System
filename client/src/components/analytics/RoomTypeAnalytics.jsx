import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RoomTypeAnalytics = ({ data = [] }) => {
  // Use provided data or fallback to empty array
  const chartData = data.length > 0 ? data : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' ? `$${entry.value.toLocaleString()}` : entry.value}
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
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Room Type Performance</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          <p>No room type data available</p>
        </div>
      </div>
    );
  }

  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);

  // Prepare data for pie chart (revenue distribution)
  const pieData = chartData.map((item, index) => ({
    name: item.type,
    value: item.revenue,
    color: COLORS[index % COLORS.length]
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Room Type Performance</h3>
      
      {/* Bar Chart for Bookings */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="type" 
              stroke="#6b7280"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={80}
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
              dataKey="occupancy" 
              fill="#10b981" 
              name="Occupancy %"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Pie Chart for Revenue Distribution */}
      <div className="h-64 mb-6">
        <h4 className="text-md font-medium text-gray-700 mb-4 text-center">Revenue Distribution</h4>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      
      {/* Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {totalBookings}
            </div>
            <div className="text-sm text-gray-600">Total Bookings</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Revenue</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeAnalytics;
