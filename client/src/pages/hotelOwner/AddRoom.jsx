import React, { useState } from "react";
import Title from "../../components/ui/Title";
import { assets } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AddRoom = () => {
  const { axios, getToken } = useAppContext();

  const [images, setImages] = useState({
    1: null,
    2: null,
    3: null,
    4: null,
  });
  const [inputs, setInputs] = useState({
    roomType: "",
    pricePerNight: 0,
    amenities: {
      "Free Wifi": false,
      "Breakfast Included": false,
      "Room Service": false,
      "Air Conditioning": false,
      "Mountain View": false,
      "Pool Access": false,
    },
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!inputs.roomType) {
      newErrors.roomType = "Please select a room type";
    }

    if (!inputs.pricePerNight || inputs.pricePerNight <= 0) {
      newErrors.pricePerNight = "Please enter a valid price";
    }

    const hasImages = Object.values(images).some((img) => img);
    if (!hasImages) {
      newErrors.images = "Please upload at least one image";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("roomType", inputs.roomType);
      formData.append("pricePerNight", inputs.pricePerNight);

      // Converting amenities to array & keep only enabled amenities
      const amenities = Object.keys(inputs.amenities).filter(
        (key) => inputs.amenities[key]
      );
      formData.append("amenities", JSON.stringify(amenities));

      // Adding Images to formData
      Object.keys(images).forEach((key) => {
        images[key] && formData.append("images", images[key]);
      });

      const { data } = await axios.post("api/rooms/", formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        toast.success("Room added successfully!");
        // Reset form
        setInputs({
          roomType: "",
          pricePerNight: 0,
          amenities: {
            "Free Wifi": false,
            "Breakfast Included": false,
            "Room Service": false,
            "Air Conditioning": false,
            "Mountain View": false,
            "Pool Access": false,
          },
        });
        setImages({
          1: null,
          2: null,
          3: null,
          4: null,
        });
        setErrors({});
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (key, file) => {
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }
    setImages({ ...images, [key]: file });
    // Clear image error if any
    if (errors.images) {
      setErrors({ ...errors, images: "" });
    }
  };

  const removeImage = (key) => {
    setImages({ ...images, [key]: null });
  };

  const getImagePreview = (image) => {
    if (image) {
      return URL.createObjectURL(image);
    }
    return assets.uploadArea;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-gray-900 tracking-tight mb-2">
                Add New Room
              </h1>
              <p className="text-base sm:text-lg text-gray-500 font-light">
                Create a new room listing for your hotel
              </p>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center sm:text-right">
                <p className="text-xs sm:text-sm text-gray-500">
                  All fields are required
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                <svg
                  className="w-4 h-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="hidden sm:inline">Required Fields</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <form onSubmit={onSubmitHandler} className="max-w-4xl mx-auto">
          {/* Room Images Section */}
          <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex items-center gap-3 mb-4">
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Room Images
                </h3>
                <p className="text-sm text-gray-600">
                  Upload up to 4 high-quality images of your room
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.keys(images).map((key) => (
                <div key={key} className="relative group">
                  <label
                    htmlFor={`roomImage${key}`}
                    className="block cursor-pointer"
                  >
                    <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors overflow-hidden">
                      <img
                        className="w-full h-full object-cover"
                        src={getImagePreview(images[key])}
                        alt={`Room image ${key}`}
                      />
                      {!images[key] && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                          <svg
                            className="w-8 h-8 mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                          <span className="text-xs">Click to upload</span>
                        </div>
                      )}
                    </div>
                  </label>

                  {images[key] && (
                    <button
                      type="button"
                      onClick={() => removeImage(key)}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    id={`roomImage${key}`}
                    hidden
                    onChange={(e) => handleImageChange(key, e.target.files[0])}
                  />
                </div>
              ))}
            </div>

            {errors.images && (
              <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errors.images}
              </p>
            )}
          </div>

          {/* Room Details Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Room Details
                </h3>
                <p className="text-sm text-gray-600">
                  Basic information about your room
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  value={inputs.roomType}
                  onChange={(e) => {
                    setInputs({ ...inputs, roomType: e.target.value });
                    if (errors.roomType) {
                      setErrors({ ...errors, roomType: "" });
                    }
                  }}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.roomType ? "border-red-300" : "border-gray-300"
                  }`}
                >
                  <option value="">Select Room Type</option>
                  <option value="Single Bed">Single Bed</option>
                  <option value="Double Bed">Double Bed</option>
                  <option value="Luxury Room">Luxury Room</option>
                  <option value="Family Suite">Family Suite</option>
                  <option value="Deluxe Suite">Deluxe Suite</option>
                  <option value="Presidential Suite">Presidential Suite</option>
                </select>
                {errors.roomType && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.roomType}
                  </p>
                )}
              </div>

              {/* Price Per Night */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price Per Night *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    value={inputs.pricePerNight}
                    onChange={(e) => {
                      setInputs({ ...inputs, pricePerNight: e.target.value });
                      if (errors.pricePerNight) {
                        setErrors({ ...errors, pricePerNight: "" });
                      }
                    }}
                    className={`w-full pl-7 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.pricePerNight
                        ? "border-red-300"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.pricePerNight && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    {errors.pricePerNight}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Amenities
                </h3>
                <p className="text-sm text-gray-600">
                  Select the amenities available in this room
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {Object.keys(inputs.amenities).map((amenity, index) => (
                <label
                  key={index}
                  className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={inputs.amenities[amenity]}
                    onChange={() =>
                      setInputs({
                        ...inputs,
                        amenities: {
                          ...inputs.amenities,
                          [amenity]: !inputs.amenities[amenity],
                        },
                      })
                    }
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {amenity}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Room Preview Section */}
          <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-orange-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Room Preview
                </h3>
                <p className="text-sm text-gray-600">
                  Preview how your room will appear to guests
                </p>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {inputs.roomType || "Room Type"}
                  </h4>
                  <p className="text-sm text-gray-600">
                    ${inputs.pricePerNight || 0} per night
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  {Array(5)
                    .fill("")
                    .map((_, index) => (
                      <img
                        key={index}
                        src={assets.starIconFilled}
                        alt="star"
                        className="w-4 h-4"
                      />
                    ))}
                </div>
              </div>

              {Object.values(images).some((img) => img) && (
                <div className="mb-4">
                  <img
                    src={getImagePreview(
                      Object.values(images).find((img) => img)
                    )}
                    alt="Room preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                {Object.keys(inputs.amenities)
                  .filter((amenity) => inputs.amenities[amenity])
                  .map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {amenity}
                    </span>
                  ))}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4">
            <button
              type="button"
              onClick={() => {
                setInputs({
                  roomType: "",
                  pricePerNight: 0,
                  amenities: {
                    "Free Wifi": false,
                    "Breakfast Included": false,
                    "Room Service": false,
                    "Air Conditioning": false,
                    "Mountain View": false,
                    "Pool Access": false,
                  },
                });
                setImages({
                  1: null,
                  2: null,
                  3: null,
                  4: null,
                });
                setErrors({});
              }}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors w-full sm:w-auto"
            >
              Reset Form
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 px-8 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {loading ? "Adding Room..." : "Add Room"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoom;