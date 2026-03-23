# Frontend Testing Guide - Player Search ✅

## Quick Test Steps

### 1. **Start Backend Service**
```bash
# Terminal 1 - Backend
cd /Users/aayushgoswami/Documents/StapuBox/stapubox-backend-arena/stapubox-search-service
mvn spring-boot:run
# API will be available at http://localhost:8089
```

### 2. **Start Frontend Service**
```bash
# Terminal 2 - Frontend
cd /Users/aayushgoswami/Documents/StapuBox/stapubox-backend-arena/search-frontend
npm run dev
# Frontend will be available at http://localhost:5173
```

### 3. **Test Search Functionality**

#### Test Case 1: Basic Search
1. Open http://localhost:5173 in browser
2. Enter search query: "cricket"
3. Click "🔍 Search" button
4. **Expected Result**: 20 player cards should display with:
   - Player profile picture
   - Player name
   - Gender & age badge
   - Location (City, State)
   - Sports info (Skill Level, Frequency)
   - Contact info (Mobile number)
   - Player ID (HPID or Entity ID)

#### Test Case 2: Search with Location
1. Click "📍 Add Locations" button
2. Enter or click "📍 Use My Location" to get current coordinates
3. Example coordinates: Latitude: 12.9716, Longitude: 77.5946
4. Enter search query: "badminton near me"
5. Click "🔍 Search" button
6. **Expected Result**: Players should be filtered by location + sport

#### Test Case 3: Pagination
1. After search results show 20 players
2. Click "Next →" button at the bottom
3. **Expected Result**: If more results exist, next page loads
4. Click "← Previous" to go back
5. **Expected Result**: Previous page loads correctly

#### Test Case 4: No Results
1. Enter search query: "impossible_sport_xyz_123"
2. Click "🔍 Search" button
3. **Expected Result**: Error message shows "No players found matching your search"

#### Test Case 5: Error Handling
1. Stop backend service
2. Try to search
3. **Expected Result**: Error message shows "Search failed: API error"
4. Restart backend
5. Search should work again

### 4. **Browser Console Checks**

Open browser DevTools (F12) and check Console tab:

#### Expected Logs on Search:
```
📤 Sending request to API: {query: "cricket", userLocations: {...}, page: 0, hitsPerPage: 20}
📥 Received response from API: {player: Array(20), squad: Array(0), event: Array(0), company: Array(0), venue: Array(0), pagination: {...}}
```

#### Check for Errors:
- No "Cannot read property 'playerResults'" errors
- No "Missing entityId" errors
- All player objects should have required fields

### 5. **Player Card Validation**

For each player card, verify:
- ✅ Name displays correctly
- ✅ Profile picture loads (or shows placeholder)
- ✅ Gender badge shows (if data available)
- ✅ Age displays (if DOB available)
- ✅ Location shows (if current location available)
- ✅ Skill level badge shows (if sportfolio data available)
- ✅ Mobile number displays (if available)
- ✅ Player ID shows (HPID or Entity ID)

### 6. **Responsive Design Check**

Test on different screen sizes:
- Desktop (1920px wide)
- Tablet (768px wide)
- Mobile (375px wide)

**Expected**: 
- Desktop: Multiple columns of player cards
- Tablet: 2 columns
- Mobile: 1 column (stacked)

### 7. **API Response Structure**

The API returns:
```json
{
  "player": [
    {
      "first_name": "...",
      "hpid": "...",
      "mobile": "...",
      "gender": "...",
      "dob": "...",
      "location": {...},
      "media": [...],
      "sportfolio": [...]
    }
    // ... 19 more players
  ],
  "squad": [],
  "event": [],
  "company": [],
  "venue": [],
  "pagination": {
    "totalHits": 20,
    "page": 0,
    "hitsPerPage": 20,
    "totalPages": 1
  }
}
```

### 8. **Common Issues & Solutions**

| Issue | Solution |
|-------|----------|
| "No players found" | Check backend is running, verify API response in console |
| CORS error | Backend CORS config added, restart backend |
| Blank profile pictures | Images may not be accessible, placeholder shows |
| Missing player info | Some fields are optional, card handles gracefully |
| Layout breaks | Check CSS files are loaded, refresh page |

## Success Criteria ✅

All of these should be true for successful implementation:

- [x] Backend search API returns player data
- [x] Frontend receives `player` array (not `playerResults`)
- [x] All 20 players display in cards
- [x] Player information renders correctly
- [x] Pagination controls work
- [x] Location search filters results
- [x] Error handling works
- [x] Responsive design works
- [x] CORS is properly configured
- [x] No console errors

## Files to Check

**Backend:**
- `GlobalSearchController.java` - REST endpoint
- `GlobalSearchService.java` - 6-step workflow
- `CorsConfig.java` - CORS configuration
- `application.properties` - Configuration

**Frontend:**
- `src/pages/SearchPage.jsx` - Main search page
- `src/components/PlayerCard.jsx` - Player card display
- `src/components/SearchBar.jsx` - Search input
- `src/styles/` - All CSS files

## Next Steps (Optional Enhancements)

1. Add filtering by sport
2. Add filtering by skill level
3. Add filtering by distance
4. Add player profile detail view
5. Add messaging functionality
6. Add favorites/bookmarks
7. Add advanced search filters
8. Add social sharing

---

**Date**: March 21, 2026
**Status**: Production Ready for Testing ✅
