import React, { useEffect, useState } from "react";
import Title from "../../components/ui/Title";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const ListRoom = () => {
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { axios, getToken, user, currency } = useAppContext();

  // Fetch rooms of the hotel owner
  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("api/rooms/owner", {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setRooms(data.rooms);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle room availability
  const toggleRoomAvailability = async (roomId) => {
    try {
      const { data } = await axios.post(
        "api/rooms/toggle-availability",
        { roomId },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
      );
      if (data.success) {
        toast.success(data.message);
        fetchRooms();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRooms();
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="animate-pulse">
              <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-72 sm:w-96"></div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-xl mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-full"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight mb-2">
                Room Management
              </h1>
              <p className="text-base sm:text-lg text-gray-500 font-light">
                Manage your hotel rooms and availability
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center sm:text-right">
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{rooms.length}</p>
                <p className="text-xs sm:text-sm text-gray-500">Total Rooms</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="text-xl sm:text-2xl font-bold text-green-600">
                  {rooms.filter(room => room.isAvailable).length}
                </p>
                <p className="text-xs sm:text-sm text-gray-500">Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {rooms.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 sm:p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Rooms Found</h3>
            <p className="text-gray-600 mb-6">You haven't added any rooms to your hotel yet.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium">
              Add Your First Room
            </button>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Total Rooms</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{rooms.length}</p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Available</p>
                    <p className="text-xl sm:text-2xl font-bold text-green-600">
                      {rooms.filter(room => room.isAvailable).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Unavailable</p>
                    <p className="text-xl sm:text-2xl font-bold text-red-600">
                      {rooms.filter(room => !room.isAvailable).length}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Price</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {currency} {Math.round(rooms.reduce((sum, room) => sum + room.pricePerNight, 0) / rooms.length) || 0}
                    </p>
                  </div>
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {rooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                >
                  {/* Room Image */}
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={room.images[0]}
                      className="absolute inset-0 w-full h-full object-cover object-center"
                      alt={room.roomType}
                      loading="lazy"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        room.isAvailable 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {room.isAvailable ? 'Available' : 'Unavailable'}
                      </div>
                    </div>
                  </div>

                  {/* Room Content */}
                  <div className="p-4 sm:p-6">
                    {/* Room Type */}
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                      {room.roomType}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-xl sm:text-2xl font-bold text-gray-900">
                          {currency} {room.pricePerNight}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">per night</p>
                      </div>
                    </div>

                    {/* Amenities */}
                    <div className="mb-4 sm:mb-6">
                      <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">Amenities</p>
                      <div className="flex flex-wrap gap-2">
                        {room.amenities.slice(0, 3).map((amenity, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{room.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Toggle Switch */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pt-3 sm:pt-4 border-t border-gray-100 gap-3 sm:gap-0">
                      <div>
                        <p className="text-xs sm:text-sm font-medium text-gray-700">Room Status</p>
                        <p className="text-xs text-gray-500">
                          {room.isAvailable ? 'Available for booking' : 'Not available for booking'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          onChange={() => toggleRoomAvailability(room._id)}
                          checked={room.isAvailable}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ListRoom;