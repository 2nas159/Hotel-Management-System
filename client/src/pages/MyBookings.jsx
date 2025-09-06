import { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import Title from "../components/ui/Title";
import toast from "react-hot-toast";
import ReviewForm from "../components/forms/ReviewForm";

const MyBookings = () => {
  const { user, getToken, axios } = useAppContext();
  const [bookings, setBookings] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setBookings(data.bookings);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      setLoading(true);
      const { data } = await axios.post(
        "/api/bookings/stripe-payment",
        { bookingId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        window.location.href = data.url;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId, reason) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/bookings/${bookingId}/cancel`,
        { reason },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewClick = (booking) => {
    setSelectedBooking(booking);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = (review) => {
    setShowReviewForm(false);
    setSelectedBooking(null);
    toast.success("Review submitted successfully!");
  };

  const handleFixBookingStatus = async (bookingId) => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `/api/bookings/${bookingId}/fix-status`,
        {},
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success("Booking status fixed successfully");
        fetchBookings(); // Refresh bookings
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const canReviewBooking = (booking) => {
    const today = new Date();
    const checkOutDate = new Date(booking.checkOutDate);
    return checkOutDate <= today && booking.isPaid && booking.status === "confirmed";
  };

  const canCancelBooking = (booking) => {
    const today = new Date();
    const checkInDate = new Date(booking.checkInDate);
    const daysUntilCheckIn = Math.ceil((checkInDate - today) / (1000 * 60 * 60 * 24));
    
    // Can cancel if booking is pending or confirmed, and check-in is more than 24 hours away
    return (booking.status === "pending" || booking.status === "confirmed") && daysUntilCheckIn > 1;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "cancelled":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "cancelled":
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const getPaymentStatus = (booking) => {
    return booking.isPaid 
      ? { text: "Paid", color: "text-green-500", bgColor: "bg-green-500" }
      : { text: "Payment Required", color: "text-red-500", bgColor: "bg-red-500" };
  };

  useEffect(() => {
    if (user) {
      fetchBookings();
    }
  }, [user]);

  return (
    <div className="py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32">
      <Title
        title="My Bookings"
        subTitle="Manage your bookings here"
        align="left"
      />

      <div className="max-w-6xl mt-8 w-full text-gray-800">
        <div className="hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3">
          <div className="w-1/3">Hotels</div>
          <div className="w-1/3">Date & Timings</div>
          <div className="w-1/3">Status & Payment</div>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No bookings found</p>
            <p className="text-gray-400 text-sm mt-2">Start exploring and book your next stay!</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t"
            >
              {/* Room Details */}
              <div className="flex flex-col md:flex-row">
                <div className="flex items-center gap-4">
                  <img
                    src={booking.room.images[0]}
                    alt="Room image"
                    className="min-md:w-44 rounded shadow object-cover"
                  />
                  <div className="flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4">
                    <p className="text-2xl font-playfair">
                      {booking.hotel.name}
                      <span className="text-sm font-inter">
                        ({booking.room.roomType})
                      </span>
                    </p>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.locationIcon} alt="location-icon" />
                      <span>{booking.hotel.address}</span>
                    </div>

                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <img src={assets.guestsIcon} alt="guests-icon" />
                      <span>Guests: {booking.guests}</span>
                    </div>
                    <p className="text-base">Total: ${booking.totalPrice}</p>
                  </div>
                </div>
              </div>

              {/* Date & Timings */}
              <div className="flex flex-row md:items-center md:gap-12 mt-3 gap-8">
                <div>
                  <p>Check-In :</p>
                  <span className="text-sm text-gray-500">
                    {new Date(booking.checkInDate).toDateString()}
                  </span>
                </div>
                <div>
                  <p>Check-Out :</p>
                  <span className="text-sm text-gray-500">
                    {new Date(booking.checkOutDate).toDateString()}
                  </span>
                </div>
              </div>

              {/* Status & Payment */}
              <div className="flex flex-col items-start justify-center pt-3 gap-3">
                {/* Booking Status */}
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${getStatusColor(booking.status)}`}></div>
                  <p className="text-sm font-medium">{getStatusText(booking.status)}</p>
                </div>

                {/* Payment Status */}
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${getPaymentStatus(booking).bgColor}`}></div>
                  <p className={`text-sm ${getPaymentStatus(booking).color}`}>
                    {getPaymentStatus(booking).text}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 mt-2">
                  {!booking.isPaid && (
                    <button
                      onClick={() => handlePayment(booking._id)}
                      disabled={loading}
                      className="text-xs border border-blue-500 text-blue-600 transition-all px-4 py-1.5 hover:bg-blue-50 rounded-full cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Processing..." : "Pay with Stripe"}
                    </button>
                  )}
                  
                  {canCancelBooking(booking) && (
                    <button
                      onClick={() => {
                        const reason = prompt("Please provide a reason for cancellation (optional):");
                        if (reason !== null) {
                          handleCancelBooking(booking._id, reason);
                        }
                      }}
                      disabled={loading}
                      className="text-xs border border-red-400 text-red-600 transition-all px-4 py-1.5 hover:bg-red-50 rounded-full cursor-pointer disabled:opacity-50"
                    >
                      Cancel Booking
                    </button>
                  )}

                  {booking.isPaid && booking.status === "pending" && (
                    <button
                      onClick={() => handleFixBookingStatus(booking._id)}
                      disabled={loading}
                      className="text-xs border border-orange-400 text-orange-600 transition-all px-4 py-1.5 hover:bg-orange-50 rounded-full cursor-pointer disabled:opacity-50"
                    >
                      {loading ? "Fixing..." : "Fix Status"}
                    </button>
                  )}

                  {canReviewBooking(booking) && (
                    <button
                      onClick={() => handleReviewClick(booking)}
                      className="text-xs border border-blue-400 text-blue-600 transition-all px-4 py-1.5 hover:bg-blue-50 rounded-full cursor-pointer"
                    >
                      Write Review
                    </button>
                  )}

                  {booking.status === "cancelled" && booking.cancellationReason && (
                    <div className="text-xs text-gray-500 mt-1">
                      <p><strong>Reason:</strong> {booking.cancellationReason}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Form Modal */}
      {showReviewForm && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <ReviewForm
                booking={selectedBooking}
                onReviewSubmitted={handleReviewSubmitted}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;