import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RoomTypeAnalytics = ({ data = [] }) => {
  // Process and format the data for the chart
  const chartData = data.length > 0 ? data.map(item => ({
    type: item.type,
    bookings: item.bookings || 0,
    revenue: item.revenue || 0,
    occupancy: item.occupancy || 0
  })) : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              ></div>
              <span className="text-sm text-gray-600">{entry.name}:</span>
              <span className="text-sm font-medium text-gray-900">
                {entry.name === 'revenue' ? `$${entry.value.toLocaleString()}` : 
                 entry.name === 'occupancy' ? `${entry.value}%` : entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Calculate summary statistics
  const totalBookings = chartData.reduce((sum, item) => sum + item.bookings, 0);
  const totalRevenue = chartData.reduce((sum, item) => sum + item.revenue, 0);
  const averageOccupancy = chartData.length > 0 
    ? Math.round(chartData.reduce((sum, item) => sum + item.occupancy, 0) / chartData.length) 
    : 0;

  // Colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-900 mb-2">No Room Type Data</p>
        <p className="text-sm text-gray-500 text-center">
          Room type analytics will appear here once you have rooms and bookings.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 bg-blue-50 rounded-lg">
          <p className="text-2xl font-bold text-blue-600">{totalBookings}</p>
          <p className="text-xs text-blue-600">Total Bookings</p>
        </div>
        <div className="text-center p-3 bg-green-50 rounded-lg">
          <p className="text-2xl font-bold text-green-600">${totalRevenue.toLocaleString()}</p>
          <p className="text-xs text-green-600">Total Revenue</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{averageOccupancy}%</p>
          <p className="text-xs text-purple-600">Avg Occupancy</p>
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-6">
        {/* Bar Chart - Bookings and Occupancy */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Bookings & Occupancy by Room Type</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="type" 
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  yAxisId="bookings"
                  orientation="left"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  yAxisId="occupancy"
                  orientation="right"
                  stroke="#6b7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  yAxisId="bookings"
                  dataKey="bookings" 
                  fill="#3b82f6" 
                  name="Bookings"
                  radius={[2, 2, 0, 0]}
                />
                <Bar 
                  yAxisId="occupancy"
                  dataKey="occupancy" 
                  fill="#10b981" 
                  name="Occupancy (%)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Revenue Distribution */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Revenue Distribution</h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Room Type Performance Table */}
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Room Type Performance</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-2 text-gray-600">Room Type</th>
                <th className="text-right py-2 text-gray-600">Bookings</th>
                <th className="text-right py-2 text-gray-600">Revenue</th>
                <th className="text-right py-2 text-gray-600">Occupancy</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-2 font-medium text-gray-900">{item.type}</td>
                  <td className="py-2 text-right text-gray-600">{item.bookings}</td>
                  <td className="py-2 text-right text-gray-600">${item.revenue.toLocaleString()}</td>
                  <td className="py-2 text-right">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      item.occupancy >= 80 ? 'bg-red-100 text-red-700' :
                      item.occupancy >= 60 ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.occupancy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomTypeAnalytics;