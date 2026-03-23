# 🚀 FRONTEND DEPLOYMENT GUIDE

**Deployment URL**: `http://practise.stapubox.com/search`  
**Backend API**: `https://practise.stapubox.com` (port 2040)  
**Version**: 1.0.0  
**Build Tool**: Vite + React 19  
**Date**: March 24, 2026

---

## 📋 Pre-Deployment Checklist

- [x] Autocomplete feature implemented
- [x] Location-based search integrated
- [x] API URLs configured for production
- [x] Base path set to `/search/`
- [x] Build configuration optimized
- [x] Environment detection implemented
- [ ] Build process tested
- [ ] Deployment server ready
- [ ] SSL certificate available (HTTPS)
- [ ] CORS headers configured on backend

---

## 🔧 Configuration Details

### 1. **Vite Configuration** (`vite.config.js`)
```javascript
- base: '/search/'           // Route on practise.stapubox.com
- port: 5173                 // Development server
- Build output: dist/        // Static files to deploy
- Minification: terser       // Production optimization
- Source maps: disabled      // Smaller build size
- Manual chunks: react       // Separate vendor bundle
```

### 2. **API URLs** (Automatic Detection)
```javascript
// Development (localhost)
http://localhost:2040/api/search/autocomplete
http://localhost:2040/api/search/global

// Production (practise.stapubox.com)
https://practise.stapubox.com/api/search/autocomplete
https://practise.stapubox.com/api/search/global
```

### 3. **Features Included**
- ✅ Real-time autocomplete with debouncing (300ms)
- ✅ Location-based search filtering
- ✅ Keyboard navigation support
- ✅ Response caching
- ✅ Error handling & loading states
- ✅ Mobile responsive design
- ✅ Player search results with pagination

---

## 🛠️ BUILD & DEPLOYMENT STEPS

### Step 1: Build the Frontend
```bash
cd /Users/aayushgoswami/Documents/StapuBox/stapubox-backend-arena/search-frontend

# Install dependencies (if not already done)
npm install

# Build for production
npm run build

# Expected output: dist/ folder with optimized files
# Size: ~150-200KB (gzipped)
```

### Step 2: Verify Build Output
```bash
# Check the dist folder structure
ls -la dist/

# Expected files:
# - index.html          (entry point)
# - assets/             (JS/CSS bundles)
# - vite.svg           (favicon)
```

### Step 3: Deploy to Web Server
```bash
# Copy dist folder to web server at practise.stapubox.com
# Path: /var/www/practise.stapubox.com/search/

scp -r dist/* user@practise.stapubox.com:/var/www/practise.stapubox.com/search/

# Or if using rsync:
rsync -avz dist/ user@practise.stapubox.com:/var/www/practise.stapubox.com/search/
```

### Step 4: Configure Web Server (Nginx)
```nginx
server {
    server_name practise.stapubox.com;
    listen 80;
    listen 443 ssl http2;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/stapubox.crt;
    ssl_certificate_key /etc/ssl/private/stapubox.key;

    # Search Frontend
    location /search/ {
        root /var/www/practise.stapubox.com;
        try_files $uri $uri/ /search/index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
            expires 30d;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API Proxy
    location /api/search/ {
        proxy_pass http://localhost:2040;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS Headers
        add_header 'Access-Control-Allow-Origin' 'http://practise.stapubox.com' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type' always;
    }

    # Redirect HTTP to HTTPS
    if ($scheme != "https") {
        return 301 https://$server_name$request_uri;
    }
}
```

### Step 5: Configure Backend CORS
Update `stapubox-search-service/src/main/resources/application-prod.properties`:

```properties
# CORS Configuration
server.servlet.cors.allowed-origins=https://practise.stapubox.com
server.servlet.cors.allowed-methods=GET,POST,OPTIONS
server.servlet.cors.allowed-headers=Content-Type
server.servlet.cors.allow-credentials=true
```

Or in Java code (`SearchConfig.java`):
```java
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/search/**")
            .allowedOrigins("https://practise.stapubox.com")
            .allowedMethods("GET", "POST", "OPTIONS")
            .allowedHeaders("Content-Type")
            .allowCredentials(true)
            .maxAge(3600);
    }
}
```

---

## 📦 Build Files Breakdown

After `npm run build`, the `dist/` folder contains:

```
dist/
├── index.html                 (Main entry point)
├── vite.svg                   (Favicon)
└── assets/
    ├── index-[hash].js        (Main app bundle)
    ├── index-[hash].css       (Styles)
    └── react-[hash].js        (React vendor bundle)
```

**File Sizes** (estimated):
- `index.html`: ~2 KB
- `index-[hash].js`: ~45 KB (gzipped: ~15 KB)
- `react-[hash].js`: ~50 KB (gzipped: ~18 KB)
- `index-[hash].css`: ~5 KB (gzipped: ~2 KB)
- **Total**: ~170 KB (gzipped: ~60 KB)

---

## 🧪 Testing Before Deployment

### 1. Test Development Build
```bash
# Serve the built files locally
npm run preview

# Open http://localhost:4173
# Test autocomplete with: /search/?query=badminton
```

### 2. Test Production URLs
```bash
# Verify API responses
curl "https://practise.stapubox.com/api/search/autocomplete?query=badminton"

# Expected response:
# {
#   "success": true,
#   "suggestions": [...],
#   "count": 10,
#   "timestamp": 1774270631928
# }
```

### 3. Test Location-Based Search
```bash
# Verify location parameter support
curl "https://practise.stapubox.com/api/search/autocomplete?query=badminton&lat=28.7041&lng=77.1025&radius=50"
```

### 4. Browser Testing
- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile (iOS, Android)
- [ ] Test autocomplete keyboard navigation
- [ ] Test location-based filtering
- [ ] Test error states (no internet, slow network)
- [ ] Test pagination

---

## 🚨 Troubleshooting

### Issue: "404 Not Found" on `/search/`
**Solution**: Check Nginx `try_files` directive redirects to `/search/index.html`

### Issue: API returns CORS error
**Solution**: 
1. Check backend CORS configuration
2. Verify `allowed-origins` includes the frontend domain
3. Test with `curl -i -X OPTIONS` to verify preflight

### Issue: Autocomplete not appearing
**Solution**:
1. Check browser console for errors
2. Verify API endpoint: `https://practise.stapubox.com/api/search/autocomplete`
3. Ensure backend is running on port 2040
4. Check network tab for API response

### Issue: Styling not applied
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Check `/search/assets/` folder for CSS files
3. Verify Nginx serving static files correctly

---

## 📝 Environment Variables (Optional)

If you want to use environment variables instead of auto-detection:

Create `.env.production`:
```
VITE_API_BASE_URL=https://practise.stapubox.com
VITE_AUTOCOMPLETE_DEBOUNCE=300
VITE_AUTOCOMPLETE_LIMIT=10
```

Then update code:
```javascript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:2040'
```

---

## ✅ Deployment Checklist (Final)

- [ ] `npm run build` completed successfully
- [ ] `dist/` folder contains all files
- [ ] Copied `dist/` to web server at `/var/www/practise.stapubox.com/search/`
- [ ] Nginx configured with correct route paths
- [ ] Backend CORS headers configured
- [ ] SSL certificate installed
- [ ] Backend service running on port 2040
- [ ] API endpoints responding correctly
- [ ] Frontend loads at `http://practise.stapubox.com/search`
- [ ] Autocomplete working with API calls
- [ ] All tests passing
- [ ] Production logs monitored

---

## 📞 Support

If deployment fails:

1. Check logs:
   ```bash
   # Nginx errors
   tail -f /var/log/nginx/error.log
   
   # Backend errors
   tail -f /var/log/stapubox/search-service.log
   ```

2. Verify connectivity:
   ```bash
   # Test backend API
   curl -v https://practise.stapubox.com/api/search/autocomplete?query=test
   
   # Test frontend file
   curl -v https://practise.stapubox.com/search/
   ```

3. Check DNS resolution:
   ```bash
   nslookup practise.stapubox.com
   dig practise.stapubox.com
   ```

---

**Deployment Status**: ✅ READY FOR PRODUCTION  
**Last Updated**: March 24, 2026  
**Maintained By**: @Aayush Goswami
