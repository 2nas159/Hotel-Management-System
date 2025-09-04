import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Review from "../models/Review.js";

// Get revenue analytics
export const getRevenueAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = "monthly" } = req.query;

    console.log("Analytics request from user:", userId);

    // Find hotel owned by user
    const hotel = await Hotel.findOne({ owner: userId });
    console.log("Found hotel:", hotel);
    
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found"
      });
    }

    let dateFormat, groupBy;
    switch (period) {
      case "daily":
        dateFormat = "%Y-%m-%d";
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } };
        break;
      case "weekly":
        dateFormat = "%Y-%U";
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } };
        break;
      default: // monthly
        dateFormat = "%Y-%m";
        groupBy = { $dateToString: { format: dateFormat, date: "$createdAt" } };
    }

    // First, let's check if there are any bookings at all
    const totalBookings = await Booking.countDocuments({ hotel: hotel._id });
    console.log("Total bookings for hotel:", totalBookings);
    
    // Let's also check a sample booking to see the data structure
    const sampleBooking = await Booking.findOne({ hotel: hotel._id });
    console.log("Sample booking:", sampleBooking);

    const revenueData = await Booking.aggregate([
      {
        $match: {
          hotel: hotel._id,
          status: { $ne: "cancelled" } // Include all non-cancelled bookings
        }
      },
      {
        $group: {
          _id: groupBy,
          revenue: { $sum: "$totalPrice" },
          bookings: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      },
      {
        $limit: 12 // Last 12 periods
      }
    ]);

    console.log("Revenue aggregation result:", revenueData);

    // Format data for charts
    const formattedData = revenueData.map(item => ({
      month: item._id,
      revenue: item.revenue,
      bookings: item.bookings
    }));

    console.log("Formatted data:", formattedData);

    // If no data, provide sample data for demonstration
    if (formattedData.length === 0) {
      console.log("No data found, providing sample data");
      
      // Try to get some basic booking data to show at least something
      const basicBookings = await Booking.find({ 
        hotel: hotel._id, 
        status: { $ne: "cancelled" } 
      }).sort({ createdAt: -1 }).limit(6);
      
      if (basicBookings.length > 0) {
        console.log("Found basic bookings, creating simple chart data");
        const basicData = basicBookings.map((booking, index) => ({
          month: `Month ${index + 1}`,
          revenue: booking.totalPrice,
          bookings: 1
        }));
        return res.json({
          success: true,
          data: basicData,
          isSampleData: false
        });
      }
      
      const sampleData = [
        { month: "2024-01", revenue: 12000, bookings: 45 },
        { month: "2024-02", revenue: 15000, bookings: 52 },
        { month: "2024-03", revenue: 18000, bookings: 68 },
        { month: "2024-04", revenue: 16000, bookings: 58 },
        { month: "2024-05", revenue: 22000, bookings: 78 },
        { month: "2024-06", revenue: 25000, bookings: 85 },
      ];
      return res.json({
        success: true,
        data: sampleData,
        isSampleData: true
      });
    }

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Error fetching revenue analytics:", error);
    res.json({
      success: false,
      message: "Error fetching revenue analytics"
    });
  }
};

// Get booking trends analytics
export const getBookingTrends = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find hotel owned by user
    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found"
      });
    }

    // Get last 7 days of booking data
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const bookingTrends = await Booking.aggregate([
      {
        $match: {
          hotel: hotel._id,
          createdAt: { $gte: sevenDaysAgo },
          status: { $ne: "cancelled" }
        }
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          bookings: { $sum: 1 },
          cancellations: {
            $sum: {
              $cond: [{ $eq: ["$status", "cancelled"] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    // Map day numbers to day names
    const dayNames = ["", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const formattedData = bookingTrends.map(item => ({
      day: dayNames[item._id],
      bookings: item.bookings,
      cancellations: item.cancellations
    }));

    // If no data, provide sample data
    if (formattedData.length === 0) {
      const sampleData = [
        { day: "Mon", bookings: 12, cancellations: 2 },
        { day: "Tue", bookings: 18, cancellations: 1 },
        { day: "Wed", bookings: 15, cancellations: 3 },
        { day: "Thu", bookings: 22, cancellations: 1 },
        { day: "Fri", bookings: 28, cancellations: 2 },
        { day: "Sat", bookings: 35, cancellations: 4 },
        { day: "Sun", bookings: 25, cancellations: 2 },
      ];
      return res.json({
        success: true,
        data: sampleData,
        isSampleData: true
      });
    }

    res.json({
      success: true,
      data: formattedData
    });
  } catch (error) {
    console.error("Error fetching booking trends:", error);
    res.json({
      success: false,
      message: "Error fetching booking trends"
    });
  }
};

// Get occupancy analytics
export const getOccupancyAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find hotel owned by user
    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found"
      });
    }

    // Get total rooms
    const totalRooms = await Room.countDocuments({ hotel: hotel._id });

    // Get current occupancy (rooms with active bookings)
    const today = new Date();
    const activeBookings = await Booking.countDocuments({
      hotel: hotel._id,
      checkInDate: { $lte: today },
      checkOutDate: { $gte: today },
      status: { $ne: "cancelled" }
    });

    // Get previous period occupancy (last month)
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthEnd = new Date();
    lastMonthEnd.setMonth(lastMonthEnd.getMonth() - 1);
    lastMonthEnd.setDate(0); // Last day of previous month

    const previousOccupancy = await Booking.countDocuments({
      hotel: hotel._id,
      checkInDate: { $lte: lastMonthEnd },
      checkOutDate: { $gte: lastMonth },
      status: { $ne: "cancelled" }
    });

    const currentOccupancy = totalRooms > 0 ? (activeBookings / totalRooms) * 100 : 0;
    const previousOccupancyRate = totalRooms > 0 ? (previousOccupancy / totalRooms) * 100 : 0;

    // If no rooms or bookings, provide sample data
    if (totalRooms === 0) {
      return res.json({
        success: true,
        data: {
          occupancy: 78,
          previousOccupancy: 72,
          totalRooms: 25,
          occupiedRooms: 19.5,
          availableRooms: 5.5
        },
        isSampleData: true
      });
    }

    res.json({
      success: true,
      data: {
        occupancy: Math.round(currentOccupancy),
        previousOccupancy: Math.round(previousOccupancyRate),
        totalRooms,
        occupiedRooms: activeBookings,
        availableRooms: Math.max(0, totalRooms - activeBookings)
      }
    });
  } catch (error) {
    console.error("Error fetching occupancy analytics:", error);
    res.json({
      success: false,
      message: "Error fetching occupancy analytics"
    });
  }
};

// Get room type analytics
export const getRoomTypeAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find hotel owned by user
    const hotel = await Hotel.findOne({ owner: userId });
    if (!hotel) {
      return res.json({
        success: false,
        message: "Hotel not found"
      });
    }

    const roomTypeData = await Room.aggregate([
      {
        $match: { hotel: hotel._id }
      },
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "room",
          as: "bookings"
        }
      },
      {
        $project: {
          type: "$roomType",
          totalRooms: 1,
          bookings: {
            $size: {
              $filter: {
                input: "$bookings",
                cond: { $ne: ["$$this.status", "cancelled"] }
              }
            }
          },
          revenue: {
            $sum: {
              $map: {
                input: {
                  $filter: {
                    input: "$bookings",
                    cond: { $ne: ["$$this.status", "cancelled"] }
                  }
                },
                as: "booking",
                in: "$$booking.totalPrice"
              }
            }
          }
        }
      },
      {
        $group: {
          _id: "$type",
          bookings: { $sum: "$bookings" },
          revenue: { $sum: "$revenue" },
          totalRooms: { $sum: "$totalRooms" }
        }
      },
      {
        $project: {
          type: "$_id",
          bookings: 1,
          revenue: 1,
          occupancy: {
            $multiply: [
              { $divide: ["$bookings", "$totalRooms"] },
              100
            ]
          }
        }
      }
    ]);

    // If no data, provide sample data
    if (roomTypeData.length === 0) {
      const sampleData = [
        { type: "Single Bed", bookings: 45, revenue: 13500, occupancy: 75 },
        { type: "Double Bed", bookings: 78, revenue: 23400, occupancy: 85 },
        { type: "Luxury Room", bookings: 32, revenue: 19200, occupancy: 65 },
        { type: "Family Suite", bookings: 25, revenue: 17500, occupancy: 70 },
      ];
      return res.json({
        success: true,
        data: sampleData,
        isSampleData: true
      });
    }

    res.json({
      success: true,
      data: roomTypeData
    });
  } catch (error) {
    console.error("Error fetching room type analytics:", error);
    res.json({
      success: false,
      message: "Error fetching room type analytics"
    });
  }
};
