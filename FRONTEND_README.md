# Search Frontend - Testing UI

A modern React + Vite frontend for testing the StapuBox global search API with beautiful player cards.

## 🎯 Features

✅ **Search Bar** with natural language query support
✅ **Location Support** - Current, Home, Work, Playground locations
✅ **Player Cards** - Display all fields from playerData.json
✅ **Pagination** - Navigate through search results
✅ **Loading State** - Visual feedback during search
✅ **Error Handling** - User-friendly error messages
✅ **Responsive Design** - Works on desktop, tablet, and mobile

## 📁 Project Structure

```
search-frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.jsx        # Search input + location selector
│   │   ├── PlayerCard.jsx       # Individual player card display
│   │   ├── LoadingSpinner.jsx   # Loading indicator
│   │   └── ErrorMessage.jsx     # Error alert component
│   ├── pages/
│   │   └── SearchPage.jsx       # Main search page with orchestration
│   ├── styles/
│   │   ├── SearchPage.css       # Main page styles
│   │   ├── SearchBar.css        # Search bar styles
│   │   ├── PlayerCard.css       # Player card styles
│   │   ├── LoadingSpinner.css   # Loading spinner styles
│   │   └── ErrorMessage.css     # Error message styles
│   ├── App.jsx                  # Root component
│   ├── App.css                  # Global app styles
│   ├── index.css                # Global base styles
│   └── main.jsx                 # Entry point
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── vite.config.js              # Vite configuration
└── README.md                    # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

```bash
cd search-frontend
npm install
```

### Development

```bash
npm run dev
```

The frontend will start at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔌 API Integration

The frontend connects to the search API at:
- **Base URL**: `http://localhost:8089`
- **Endpoint**: `POST /api/search/global`

### Request Format

```json
{
  "query": "badminton players",
  "userLocations": {
    "current": { "lat": 12.9716, "lng": 77.5946 },
    "home": null,
    "work": null,
    "playground": null
  },
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
      "last_name": null,
      "bio": "...",
      "gender": "male",
      "dob": "2004-09-11",
      "mobile": "6006083428",
      "email": null,
      "location": {...},
      "media": [...],
      "sportfolio": [...],
      "locker-room": {...}
    }
  ],
  "squadResults": [],
  "eventResults": [],
  "companyResults": [],
  "venueResults": [],
  "pagination": {
    "totalHits": 1,
    "page": 0,
    "hitsPerPage": 20,
    "totalPages": 1
  }
}
```

## 🎨 UI Components

### SearchBar Component
- Text input for natural language queries
- Location input form (optional)
- "Use My Location" button using browser geolocation API
- Clear locations button

### PlayerCard Component
Displays all player fields from the API response:
- **Profile Picture** - From media array (first item)
- **Name** - first_name + last_name
- **Gender & Age** - Calculated from dob
- **Bio** - Truncated to 100 characters
- **Location** - Current city and state
- **Sports Info** - Skill level and frequency
- **Contact Info** - Mobile and email
- **Entity ID** - For debugging
- **Action Buttons** - View Profile, Message

### LoadingSpinner Component
- Animated spinner icon
- "Searching for players..." message

### ErrorMessage Component
- Alert styling with warning icon
- User-friendly error descriptions

## 🎯 Usage Examples

### Basic Search
1. Enter "badminton players" in search bar
2. Click "Search" button
3. View player results

### Search with Location
1. Click "Add Locations" button
2. Enter latitude and longitude (or use "Use My Location")
3. Click "Search"
4. Results will be filtered by location

### View More Results
1. Use Previous/Next buttons to navigate pages
2. Current page number displayed
3. Pagination disabled at boundaries

## 🔧 Configuration

To change the API base URL, edit `SearchPage.jsx`:

```javascript
const API_BASE_URL = 'http://localhost:8089'  // Change this
```

## 🌐 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Responsive Design

- **Desktop (1200px+)**: 3-column grid
- **Tablet (768px-1199px)**: 2-column grid
- **Mobile (<768px)**: 1-column grid

## 🧪 Testing

### Test Search Examples

```
"badminton players"
"cricket experts near me"
"football intermediate players"
"table tennis state level"
```

### Browser Console Logs

API requests and responses are logged to console:
- `📤 Sending request to API:` - Request payload
- `📥 Received response from API:` - Response data
- `❌ Search error:` - Error details

## 🐛 Troubleshooting

### API Connection Failed
- Ensure backend is running on `http://localhost:8089`
- Check CORS configuration on backend
- Check browser console for detailed error

### No Search Results
- Verify query is not empty
- Check that Algolia index has data
- Check that Sportfolio API is accessible

### Images Not Loading
- Check image URLs in API response
- Verify S3 bucket is accessible
- Placeholder image displays on failure

### Location Not Detected
- Ensure browser geolocation permission granted
- Check if running on HTTPS (required for some browsers)
- Manually enter latitude/longitude instead

## 📝 Notes

- Frontend is for **testing purposes only**
- Production UI should have additional features:
  - User authentication
  - Advanced filters
  - Save favorites
  - Direct messaging
  - Profile ratings/reviews
  - Analytics tracking

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Search API Documentation](../GLOBAL_SEARCH_COMPLETE.md)

---

**Created**: March 2026
**Status**: Testing Ready ✅
