# 🏨 Hotel Management System

A modern, full-stack hotel booking and management platform built with React and Node.js. This system provides a comprehensive solution for hotel owners to manage their properties and for guests to discover and book accommodations.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge&logo=vercel)](https://hotel-management-system-plum.vercel.app)
![Hotel Management System](https://img.shields.io/badge/Status-Live-brightgreen)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)

## 📋 Table of Contents

- [Live Demo](#-live-demo)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Endpoints](#-api-endpoints)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)

## 🌐 Live Demo

**Experience the Hotel Management System in action!**

🔗 **[Visit Live Demo](https://hotel-management-system-plum.vercel.app)**

The live demo showcases all the features including:
- ✨ Modern, responsive UI with smooth animations
- 🔍 Advanced search and filtering capabilities
- 📱 Mobile-optimized experience
- 🏨 Complete hotel booking workflow
- 📊 Analytics dashboard for hotel owners
- ⭐ Review and rating system

*Note: The demo uses sample data for demonstration purposes.*

## ✨ Features

### 🎯 Guest Features
- **🔍 Advanced Search & Filtering**
  - Destination-based search with autocomplete
  - Price range filtering
  - Amenity-based filtering
  - Star rating filtering
  - Guest capacity filtering
  - Date range selection

- **🏨 Hotel Discovery**
  - Browse available rooms and hotels
  - Detailed room information with high-quality images
  - Interactive room galleries
  - Real-time availability checking

- **📅 Booking Management**
  - Secure booking process with step-by-step guidance
  - Booking confirmation and management
  - Booking history and status tracking
  - Email notifications

- **⭐ Review System**
  - Rate and review hotels and rooms
  - View other guests' reviews
  - Star rating system
  - Review management

### 🏢 Hotel Owner Features
- **📊 Analytics Dashboard**
  - Revenue analytics with interactive charts
  - Booking trends and patterns
  - Occupancy rate monitoring
  - Room type performance analytics

- **🏨 Property Management**
  - Add and manage hotel rooms
  - Upload and manage room images
  - Set pricing and availability
  - Manage amenities and room details

- **📈 Business Intelligence**
  - Real-time booking statistics
  - Revenue tracking
  - Performance metrics
  - Data visualization with charts

### 🎨 User Experience
- **📱 Responsive Design**
  - Mobile-first approach
  - Cross-device compatibility
  - Touch-friendly interface

- **🎭 Modern UI/UX**
  - Clean, minimal design
  - Smooth animations with Framer Motion
  - Interactive components
  - Professional color scheme

- **⚡ Performance**
  - Lazy loading for images
  - Skeleton loaders
  - Optimized bundle size
  - Fast page transitions

## 🛠 Technology Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS 4.1.8** - Utility-first CSS framework
- **Framer Motion 12.23.12** - Animation library
- **React Router DOM 7.6.2** - Client-side routing
- **Axios 1.10.0** - HTTP client
- **Lucide React 0.542.0** - Modern icon library
- **React Hot Toast 2.5.2** - Toast notifications
- **Recharts 3.1.2** - Chart library for analytics

### Backend
- **Node.js** - Runtime environment
- **Express.js 5.1.0** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose 8.15.1** - MongoDB object modeling
- **Cloudinary 2.6.1** - Image storage and management
- **Stripe 18.2.1** - Payment processing
- **Nodemailer 7.0.3** - Email service
- **Multer 2.0.1** - File upload handling

### Authentication & Security
- **Clerk** - Authentication and user management
- **JWT** - Token-based authentication
- **CORS** - Cross-origin resource sharing
- **Input validation** - Form validation and sanitization

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server
- **Git** - Version control

## 📁 Project Structure

```
Hotel-Management-System/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   │   ├── analytics/     # Analytics and charts
│   │   │   ├── common/        # Common utilities
│   │   │   ├── forms/         # Form components
│   │   │   ├── hotel/         # Hotel-specific components
│   │   │   ├── layout/        # Layout components
│   │   │   ├── reviews/       # Review system
│   │   │   ├── search/        # Search functionality
│   │   │   └── ui/            # General UI components
│   │   ├── pages/             # Page components
│   │   │   ├── hotelOwner/    # Owner dashboard pages
│   │   │   └── ...            # Guest pages
│   │   ├── context/           # React context
│   │   ├── assets/            # Static assets
│   │   └── utils/             # Utility functions
│   ├── package.json
│   └── vite.config.js
├── server/                    # Backend Node.js application
│   ├── controllers/           # Route controllers
│   ├── models/                # Database models
│   ├── routes/                # API routes
│   ├── middleware/            # Custom middleware
│   ├── configs/               # Configuration files
│   ├── server.js              # Main server file
│   └── package.json
└── README.md
```

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Git

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/hotel-management-system.git
   cd hotel-management-system
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

4. **Environment Setup**
   
   Create a `.env` file in the server directory:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   STRIPE_SECRET_KEY=your_stripe_secret_key
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

5. **Start the development servers**
   
   **Terminal 1 - Backend:**
   ```bash
   cd server
   npm run server
   ```
   
   **Terminal 2 - Frontend:**
   ```bash
   cd client
   npm run dev
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

## 📖 Usage

### For Guests
1. **Browse Hotels**: Use the search functionality to find hotels by destination, dates, and preferences
2. **Filter Results**: Apply filters for price, amenities, star rating, and guest capacity
3. **View Details**: Click on any hotel to see detailed information, images, and reviews
4. **Make Booking**: Select dates, guests, and complete the booking process
5. **Manage Bookings**: View and manage your bookings in the "My Bookings" section

### For Hotel Owners
1. **Register Hotel**: Use the "Partner With Us" button to register your hotel
2. **Access Dashboard**: Log in to your owner dashboard
3. **Add Rooms**: Create room listings with images, pricing, and amenities
4. **View Analytics**: Monitor your hotel's performance with detailed analytics
5. **Manage Bookings**: Track and manage guest bookings

## 🔌 API Endpoints

### Authentication
- `POST /api/user/register` - User registration
- `POST /api/user/login` - User login
- `GET /api/user/profile` - Get user profile

### Hotels
- `GET /api/hotels` - Get all hotels
- `POST /api/hotels` - Create new hotel
- `GET /api/hotels/:id` - Get hotel by ID
- `PUT /api/hotels/:id` - Update hotel
- `DELETE /api/hotels/:id` - Delete hotel

### Rooms
- `GET /api/rooms` - Get all rooms
- `POST /api/rooms` - Create new room
- `GET /api/rooms/:id` - Get room by ID
- `PUT /api/rooms/:id` - Update room
- `DELETE /api/rooms/:id` - Delete room

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user` - Get user bookings
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### Analytics
- `GET /api/analytics/revenue` - Get revenue analytics
- `GET /api/analytics/bookings` - Get booking trends
- `GET /api/analytics/occupancy` - Get occupancy rates

## 📸 Screenshots

### Guest Interface
- **Home Page**: Modern hero section with search functionality
- **Search Results**: Filtered room listings with detailed cards
- **Room Details**: Comprehensive room information and booking
- **My Bookings**: Booking management interface

### Owner Dashboard
- **Analytics Dashboard**: Revenue charts and performance metrics
- **Room Management**: Add and manage hotel rooms
- **Booking Overview**: Track and manage guest bookings

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

---

**Built with ❤️ using modern web technologies**
