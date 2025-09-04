// Form validation utilities
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validateDate = (date) => {
  const inputDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return inputDate >= today;
};

export const validateDateRange = (checkIn, checkOut) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  return checkOutDate > checkInDate;
};

export const validateGuests = (guests) => {
  const num = parseInt(guests);
  return num >= 1 && num <= 10;
};

export const validatePrice = (price) => {
  const num = parseFloat(price);
  return num > 0 && num <= 10000;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateMinLength = (value, minLength) => {
  return value && value.toString().trim().length >= minLength;
};

export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().trim().length <= maxLength;
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers
};

// Booking form validation
export const validateBookingForm = (formData) => {
  const errors = {};

  // Check-in date validation
  if (!validateRequired(formData.checkInDate)) {
    errors.checkInDate = 'Check-in date is required';
  } else if (!validateDate(formData.checkInDate)) {
    errors.checkInDate = 'Check-in date must be today or later';
  }

  // Check-out date validation
  if (!validateRequired(formData.checkOutDate)) {
    errors.checkOutDate = 'Check-out date is required';
  } else if (!validateDate(formData.checkOutDate)) {
    errors.checkOutDate = 'Check-out date must be today or later';
  }

  // Date range validation
  if (formData.checkInDate && formData.checkOutDate) {
    if (!validateDateRange(formData.checkInDate, formData.checkOutDate)) {
      errors.checkOutDate = 'Check-out date must be after check-in date';
    }
  }

  // Guests validation
  if (!validateRequired(formData.guests)) {
    errors.guests = 'Number of guests is required';
  } else if (!validateGuests(formData.guests)) {
    errors.guests = 'Number of guests must be between 1 and 10';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Hotel registration form validation
export const validateHotelForm = (formData) => {
  const errors = {};

  // Hotel name validation
  if (!validateRequired(formData.name)) {
    errors.name = 'Hotel name is required';
  } else if (!validateMinLength(formData.name, 2)) {
    errors.name = 'Hotel name must be at least 2 characters';
  } else if (!validateMaxLength(formData.name, 100)) {
    errors.name = 'Hotel name must be less than 100 characters';
  }

  // Address validation
  if (!validateRequired(formData.address)) {
    errors.address = 'Address is required';
  } else if (!validateMinLength(formData.address, 10)) {
    errors.address = 'Address must be at least 10 characters';
  }

  // Contact validation
  if (!validateRequired(formData.contact)) {
    errors.contact = 'Contact number is required';
  } else if (!validatePhone(formData.contact)) {
    errors.contact = 'Please enter a valid phone number';
  }

  // City validation
  if (!validateRequired(formData.city)) {
    errors.city = 'City is required';
  } else if (!validateMinLength(formData.city, 2)) {
    errors.city = 'City name must be at least 2 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

// Room form validation
export const validateRoomForm = (formData) => {
  const errors = {};

  // Room type validation
  if (!validateRequired(formData.roomType)) {
    errors.roomType = 'Room type is required';
  }

  // Price validation
  if (!validateRequired(formData.pricePerNight)) {
    errors.pricePerNight = 'Price per night is required';
  } else if (!validatePrice(formData.pricePerNight)) {
    errors.pricePerNight = 'Price must be between $1 and $10,000';
  }

  // Amenities validation
  if (!formData.amenities || formData.amenities.length === 0) {
    errors.amenities = 'At least one amenity is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
