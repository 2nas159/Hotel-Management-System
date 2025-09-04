import React, { useEffect, useState } from "react";
import Title from "../../components/Title";
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
  });
  const [analyticsData, setAnalyticsData] = useState({
    revenueData: [],
    bookingTrends: [],
    occupancyData: {},
    roomTypeData: [],
    isSampleData: false,
  });
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const { data } = await axios.get("/api/bookings/hotel", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setDashboardData(data.dashboardData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
      // Set empty data on error
      setAnalyticsData({
        revenueData: [],
        bookingTrends: [],
        occupancyData: {},
        roomTypeData: [],
      });
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchAnalyticsData();
    }
  }, [user]);

  return (
    <div>
      <Title title="Dashboard" subTitle="Overview of all hotels" />

      <div className="flex gap-4 my-8">
        {/* Total Bookings */}
        <div className="bg-blue-500/3 border border-blue-400/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalBookingIcon}
            alt="total-bookings-icon"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Bookings</p>
            <p className="text-base text-neutral-400">
              {dashboardData.totalBookings}
            </p>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-green-500/3 border border-green-400/10 rounded flex p-4 pr-8">
          <img
            src={assets.totalRevenueIcon}
            alt="total-revenue-icon"
            className="max-sm:hidden h-10"
          />
          <div className="flex flex-col sm:ml-4 font-medium">
            <p className="text-blue-500 text-lg">Total Revenue</p>
            <p className="text-base text-neutral-400">
              {currency} {dashboardData.totalRevenue}
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bookings 
      <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
          <div className="w-full max-w-3xl text-left border border-gray-300 rounded-lg max-h-80 overflow-y-scroll">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    User Name
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Room Name
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium text-center">
                    Total Amount
                  </th>
                  <th className="py-3 px-4 text-gray-800 font-medium">
                    Payment Status
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {dashboardData.bookings.map((item, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                      {item.user.username}
                    </td>
                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                      {item.room.roomType}
                    </td>
                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                      {currency} {item.totalPrice}
                    </td>
                    <td className="py-3 px-4 text-gray-700 border-t border-gray-300">
                      <button
                        className={`py-1 px-3 rounded-full mx-auto ${
                          item.isPaid
                            ? "bg-green-200 text-green-600"
                            : "bg-amber-200 text-yellow-600"
                        }`}
                      >
                        {item.isPaid ? "Completed" : "Pending"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>*/}

      {/* Analytics Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Analytics & Insights</h2>
          {analyticsData.isSampleData && (
            <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-1 rounded-full text-sm">
              📊 Sample Data
            </div>
          )}
        </div>

        {isLoadingAnalytics ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array(4)
              .fill("")
              .map((_, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse"
                >
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <>
            {analyticsData.isSampleData && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <div className="text-blue-500 text-xl">ℹ️</div>
                  <div>
                    <h4 className="font-medium text-blue-900 mb-1">
                      Sample Analytics Data
                    </h4>
                    <p className="text-sm text-blue-700">
                      You're seeing sample data because there are no bookings
                      yet. Once you have real bookings, the charts will display
                      your actual hotel performance data.
                    </p>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RevenueChart data={analyticsData.revenueData} />
              <BookingTrends data={analyticsData.bookingTrends} />
              <OccupancyRate data={analyticsData.occupancyData} />
              <RoomTypeAnalytics data={analyticsData.roomTypeData} />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
