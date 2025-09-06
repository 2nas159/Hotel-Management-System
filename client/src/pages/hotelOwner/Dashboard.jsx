import React, { useEffect, useState } from "react";
import Title from "../../components/ui/Title";
import { useAppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import RevenueChart from "../../components/analytics/RevenueChart";
import BookingTrends from "../../components/analytics/BookingTrends";
import OccupancyRate from "../../components/analytics/OccupancyRate";
import RoomTypeAnalytics from "../../components/analytics/RoomTypeAnalytics";

const Dashboard = () => {
  const { currency, user, getToken, toast, axios } = useAppContext();

  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    totalBookings: 0,
    totalRevenue: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
  });
  const [analyticsData, setAnalyticsData] = useState({
    revenueData: [],
    bookingTrends: [],
    occupancyData: {},
    roomTypeData: [],
    isSampleData: false,
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoadingDashboard(true);
      const { data } = await axios.get("/api/bookings/hotel", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
        setLastUpdated(new Date());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const fetchAnalyticsData = async () => {
    try {
      setIsLoadingAnalytics(true);

      // Fetch real analytics data from API endpoints
      const [
        revenueResponse,
        bookingTrendsResponse,
        occupancyResponse,
        roomTypeResponse,
      ] = await Promise.allSettled([
        axios.get("/api/analytics/revenue", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }),
        axios.get("/api/analytics/bookings", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }),
        axios.get("/api/analytics/occupancy", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }),
        axios.get("/api/analytics/room-types", {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }),
      ]);

      const analyticsData = {
        revenueData:
          revenueResponse.status === "fulfilled" &&
          revenueResponse.value.data.success
            ? revenueResponse.value.data.data
            : [],
        bookingTrends:
          bookingTrendsResponse.status === "fulfilled" &&
          bookingTrendsResponse.value.data.success
            ? bookingTrendsResponse.value.data.data
            : [],
        occupancyData:
          occupancyResponse.status === "fulfilled" &&
          occupancyResponse.value.data.success
            ? occupancyResponse.value.data.data
            : {},
        roomTypeData:
          roomTypeResponse.status === "fulfilled" &&
          roomTypeResponse.value.data.success
            ? roomTypeResponse.value.data.data
            : [],
        isSampleData:
          revenueResponse.status === "fulfilled" &&
          revenueResponse.value.data.success
            ? revenueResponse.value.data.isSampleData
            : false,
      };

      setAnalyticsData(analyticsData);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      toast.error("Error loading analytics data");
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchDashboardData(), fetchAnalyticsData()]);
  };

  useEffect(() => {
    if (user) {
      refreshData();
    }
  }, [user]);

  // Calculate additional metrics
  const averageBookingValue =
    dashboardData.totalBookings > 0
      ? Math.round(dashboardData.totalRevenue / dashboardData.totalBookings)
      : 0;

  const confirmationRate =
    dashboardData.totalBookings > 0
      ? Math.round(
          (dashboardData.confirmedBookings / dashboardData.totalBookings) * 100
        )
      : 0;

  const cancellationRate =
    dashboardData.totalBookings > 0
      ? Math.round(
          (dashboardData.cancelledBookings / dashboardData.totalBookings) * 100
        )
      : 0;

  // Recent bookings (last 5)
  const recentBookings = dashboardData.bookings.slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight mb-2">
                Hotel Dashboard
              </h1>
              <p className="text-base sm:text-lg text-gray-500 font-light">
                Welcome back! Here's your hotel performance overview.
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              {lastUpdated && (
                <div className="text-center sm:text-right">
                  <p className="text-xs sm:text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </p>
                </div>
              )}
              <button
                onClick={refreshData}
                disabled={isLoadingDashboard || isLoadingAnalytics}
                className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-medium"
              >
                {(isLoadingDashboard || isLoadingAnalytics) && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                )}
                <span className="hidden sm:inline">Refresh Data</span>
                <span className="sm:hidden">Refresh</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Total Revenue */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Revenue
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {currency} {dashboardData.totalRevenue.toLocaleString()}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">All time earnings</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src={assets.totalRevenueIcon}
                  alt="Revenue"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </div>
            </div>
          </div>

          {/* Total Bookings */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Total Bookings
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {dashboardData.totalBookings}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {dashboardData.confirmedBookings} confirmed
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <img
                  src={assets.totalBookingIcon}
                  alt="Bookings"
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
              </div>
            </div>
          </div>

          {/* Average Booking Value */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Avg Booking Value
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 truncate">
                  {currency} {averageBookingValue}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Per booking</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* Confirmation Rate */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Confirmation Rate
                </p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">
                  {confirmationRate}%
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {cancellationRate}% cancelled
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Booking Status
              </h3>
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Confirmed</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {dashboardData.confirmedBookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {dashboardData.pendingBookings}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Cancelled</span>
                </div>
                <span className="font-semibold text-gray-900">
                  {dashboardData.cancelledBookings}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Bookings
              </h3>
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="space-y-3">
              {recentBookings.length > 0 ? (
                recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          booking.status === "confirmed"
                            ? "bg-green-500"
                            : booking.status === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {booking.room?.roomType || "Room"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(booking.checkInDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {currency} {booking.totalPrice}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">
                        {booking.status}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent bookings</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Analytics & Insights
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Real-time performance metrics and trends
              </p>
            </div>
            {analyticsData.isSampleData && (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-1 rounded-full text-xs sm:text-sm self-start sm:self-auto">
                📊 Sample Data
              </div>
            )}
          </div>

          {isLoadingAnalytics ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-48 sm:h-64 bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {analyticsData.isSampleData && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="text-blue-500 text-lg sm:text-xl flex-shrink-0">ℹ️</div>
                    <div>
                      <h4 className="font-medium text-blue-900 mb-1 text-sm sm:text-base">
                        Sample Analytics Data
                      </h4>
                      <p className="text-xs sm:text-sm text-blue-700">
                        You're seeing sample data because there are no bookings
                        yet. Once you have real bookings, the charts will
                        display your actual hotel performance data.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Revenue Trends
                  </h3>
                  <RevenueChart data={analyticsData.revenueData} />
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Booking Trends
                  </h3>
                  <BookingTrends data={analyticsData.bookingTrends} />
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Occupancy Rate
                  </h3>
                  <OccupancyRate data={analyticsData.occupancyData} />
                </div>

                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                    Room Type Performance
                  </h3>
                  <RoomTypeAnalytics data={analyticsData.roomTypeData} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;