# 🏗️ FRONTEND BUILD & DEPLOYMENT QUICK REFERENCE

## Quick Build Command
```bash
cd search-frontend
npm install
npm run build
```

## What Gets Built
- Output folder: `dist/`
- Entry point: `index.html`
- Total size: ~170 KB (gzipped: ~60 KB)
- Contains: All static files ready for deployment

## Deploy To
```
URL: http://practise.stapubox.com/search
Path: /var/www/practise.stapubox.com/search/

Copy from: dist/* → /var/www/practise.stapubox.com/search/
```

## Configuration Included
✅ Base path: `/search/`  
✅ API detection: Auto-detects localhost vs production  
✅ Autocomplete: Enabled with debouncing  
✅ Location filtering: Enabled  
✅ Build optimization: Terser minification, code splitting  

## 3-Step Deployment
```bash
# 1. Build
npm run build

# 2. Copy to server
scp -r dist/* user@practise.stapubox.com:/var/www/practise.stapubox.com/search/

# 3. Test
curl https://practise.stapubox.com/search/
```

## Ready To Deploy?
✅ YES - Everything is configured and ready!

See `DEPLOYMENT.md` for detailed instructions.
