# Components Structure

This directory contains all React components organized by functionality and purpose.

## 📁 Folder Structure

### `/analytics`
Components related to data visualization and analytics
- `BookingTrends.jsx` - Booking trends chart
- `OccupancyRate.jsx` - Occupancy rate visualization
- `RevenueChart.jsx` - Revenue analytics chart
- `RoomTypeAnalytics.jsx` - Room type performance analytics

### `/common`
Reusable utility components used across the application
- `ErrorBoundary.jsx` - Error boundary wrapper
- `LazyImage.jsx` - Lazy loading image component
- `Loader.jsx` - Loading spinner component
- `RoomCardSkeleton.jsx` - Skeleton loader for room cards
- `SearchResultsSkeleton.jsx` - Skeleton loader for search results

### `/forms`
Form-related components and form controls
- `AmenityFilter.jsx` - Amenity selection filter
- `BookingProgressSteps.jsx` - Booking process steps
- `GuestCapacityFilter.jsx` - Guest capacity filter
- `PriceRangeSlider.jsx` - Price range slider component
- `ReviewForm.jsx` - Review submission form
- `StarRatingFilter.jsx` - Star rating filter

### `/hotel`
Hotel-specific components
- `HotelCard.jsx` - Hotel display card
- `HotelReg.jsx` - Hotel registration modal

### `/hotelOwner`
Components specific to hotel owner dashboard
- `Navbar.jsx` - Owner dashboard navigation
- `Sidebar.jsx` - Owner dashboard sidebar

### `/layout`
Layout and navigation components
- `Footer.jsx` - Site footer
- `Navbar.jsx` - Main site navigation

### `/reviews`
Review and rating components
- `ReviewCard.jsx` - Individual review display
- `ReviewList.jsx` - List of reviews

### `/search`
Search-related components
- `SearchModal.jsx` - Search modal dialog
- `SearchSuggestions.jsx` - Search autocomplete suggestions

### `/ui`
General UI components and page sections
- `ExclusiveOffers.jsx` - Exclusive offers section
- `FeaturedDestination.jsx` - Featured destinations section
- `Hero.jsx` - Hero section component
- `InteractiveStarRating.jsx` - Interactive star rating
- `LuxuryStarRating.jsx` - Luxury star rating display
- `NewsLetter.jsx` - Newsletter signup
- `RecommendedHotels.jsx` - Recommended hotels section
- `StarRating.jsx` - Basic star rating component
- `Testimonial.jsx` - Testimonial section
- `Title.jsx` - Page title component

## 📦 Import Usage

### Individual Imports
```javascript
import { Navbar, Footer } from '../components/layout';
import { Hero, Title } from '../components/ui';
import { SearchModal } from '../components/search';
```

### Main Index Import
```javascript
import { 
  Navbar, 
  Footer, 
  Hero, 
  SearchModal,
  HotelCard 
} from '../components';
```

## 🎯 Benefits

1. **Better Organization**: Components are grouped by functionality
2. **Easier Maintenance**: Related components are in the same folder
3. **Cleaner Imports**: Index files provide clean import paths
4. **Scalability**: Easy to add new components to appropriate folders
5. **Team Collaboration**: Clear structure for team members

## 📝 Naming Conventions

- Component files use PascalCase: `HotelCard.jsx`
- Folders use lowercase: `hotel`, `forms`, `ui`
- Index files export components for clean imports
- Each folder has its own index.js for organized exports
