# 🎯 StapuBox Search Frontend - Complete Setup Guide

A modern React frontend for searching StapuBox players with real-time results, location filtering, and detailed player cards.

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd search-frontend
npm install
```

### Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

### Backend API

Ensure the search service backend is running on `http://localhost:8089`

```bash
cd stapubox-search-service
mvn spring-boot:run
```

## 📁 Project Structure

```
search-frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx          # Search input with location controls
│   │   ├── PlayerCard.jsx          # Individual player card component
│   │   ├── LoadingSpinner.jsx      # Loading state component
│   │   └── ErrorMessage.jsx        # Error display component
│   ├── pages/
│   │   └── SearchPage.jsx          # Main search page
│   ├── styles/
│   │   ├── SearchPage.css          # Page layout styles
│   │   ├── SearchBar.css           # Search bar styles
│   │   ├── PlayerCard.css          # Player card styles
│   │   ├── LoadingSpinner.css      # Loading spinner styles
│   │   └── ErrorMessage.css        # Error message styles
│   ├── App.jsx                     # Root component
│   ├── App.css                     # Global styles
│   ├── index.css                   # Base styles
│   └── main.jsx                    # Entry point
├── package.json
├── vite.config.js
└── index.html
```

## ✨ Features

### 1. **Search Bar**
- Natural language search input
- Location-based filtering (current, home, work, playground)
- Auto-detect current location using geolocation API
- Support for latitude/longitude input

### 2. **Player Cards**
Display comprehensive player information:
- Profile picture
- Name and age (calculated from DOB)
- Gender badge
- Bio/description
- Current location with city & state
- Primary sport with skill level
- Play frequency
- Contact information (mobile, email)
- Entity ID

### 3. **Search Results**
- Responsive grid layout (auto-fit cards)
- Result pagination with page navigation
- Total hits and page information
- Empty state messages

### 4. **Error Handling**
- User-friendly error messages
- Network error handling
- CORS error messages with guidance

### 5. **Loading States**
- Animated loading spinner
- Loading text indicators

## 🔌 API Integration

### Endpoint
```
POST http://localhost:8089/api/search/global
```

### Request Format
```json
{
  "query": "badminton players",
  "userLocations": {
    "current": { "lat": 12.9716, "lng": 77.5946 },
    "home": { "lat": 12.9716, "lng": 77.5946 },
    "work": { "lat": 12.9352, "lng": 77.6245 },
    "playground": { "lat": 12.9279, "lng": 77.6271 }
  },
  "userId": "optional-user-id",
  "page": 0,
  "hitsPerPage": 20
}
```

### Response Format
```json
{
  "playerResults": [
    {
      "entityId": 987,
      "first_name": "Alok Pandit",
      "gender": "male",
      "bio": "...",
      "location": { ... },
      "sportfolio": [ ... ],
      "media": [ ... ],
      ...
    }
  ],
  "squadResults": [],
  "eventResults": [],
  "companyResults": [],
  "venueResults": [],
  "pagination": {
    "totalHits": 20,
    "page": 0,
    "hitsPerPage": 20,
    "totalPages": 1
  }
}
```

## 🎨 Styling

The application uses a modern gradient design:
- **Primary Color**: Purple gradient (#667eea → #764ba2)
- **Responsive**: Mobile-friendly with breakpoints at 640px, 768px, 1024px
- **Cards**: Hover effects with elevation changes
- **Accessibility**: Proper contrast ratios and semantic HTML

## 🔧 Configuration

### CORS Settings
The backend CORS is configured to allow:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `http://localhost:8080` (Generic dev server)
- All GET, POST, PUT, DELETE requests

To add more origins, edit `CorsConfig.java` in the backend.

## 🚦 Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:
1. Verify backend is running on `http://localhost:8089`
2. Check that `CorsConfig.java` is in the classpath
3. Restart the backend service

### No Results Found
- Try a simpler search query (e.g., "badminton" instead of "badminton near me")
- Ensure there are players in the database matching the query
- Check backend logs for query parsing errors

### Location Not Detected
- Grant geolocation permission when prompted
- Ensure HTTPS on production (geolocation requires HTTPS)
- Manually enter coordinates instead

## 📦 Build for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## 🧪 Testing

To test a search request manually using curl:

```bash
curl -X POST http://localhost:8089/api/search/global \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "query": "badminton players",
    "userLocations": {
      "current": { "lat": 12.9716, "lng": 77.5946 }
    },
    "page": 0,
    "hitsPerPage": 20
  }'
```

## 📊 Component Breakdown

### SearchPage.jsx
Main page component that:
- Manages search state and results
- Handles API calls to backend
- Manages pagination
- Shows loading and error states

### SearchBar.jsx
Search input component with:
- Text input for natural language queries
- Location form with 4 location types
- Geolocation button
- Clear locations button

### PlayerCard.jsx
Displays a single player with:
- Avatar image
- Name, age, gender
- Bio excerpt
- Location badge
- Sport info with skill level
- Contact details
- Action buttons

### LoadingSpinner.jsx
Simple loading indicator with:
- Animated spinner
- Loading text

### ErrorMessage.jsx
Error display with:
- Warning icon
- Error message text

## 📚 Technology Stack

- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: CSS3 (Flexbox, Grid, Gradients)
- **HTTP Client**: Fetch API
- **State Management**: React Hooks (useState)

## 📄 License

StapuBox - All Rights Reserved

---

**Happy Searching! 🎯**
