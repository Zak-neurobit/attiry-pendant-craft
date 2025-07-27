# Deployment Guide - Fix for Nginx 404 on Page Reload

## Problem
Getting `404 not found, nginx/1.29.0` when reloading pages on hosted React app.

## Root Cause
React Router handles routing client-side, but on page reload, the server (Nginx) tries to find physical files at those routes, which don't exist.

## Solutions by Hosting Type

### 1. Nginx Server

**Step 1**: Use the provided `nginx.conf` file

**Step 2**: Update your Nginx configuration:
```bash
# Copy the nginx.conf to your server
sudo cp nginx.conf /etc/nginx/sites-available/yoursite.com

# Enable the site
sudo ln -s /etc/nginx/sites-available/yoursite.com /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

**Step 3**: Update the configuration:
- Replace `yoursite.com` with your actual domain
- Update the `root` path to point to your dist/build folder
- Add SSL configuration if needed

### 2. Netlify

The `_redirects` file in the `public` folder will automatically handle this:
```
/*    /index.html   200
```

Just deploy normally - Netlify will use this file automatically.

### 3. Vercel

Vercel handles React Router automatically, but you can also use the `_redirects` file for custom rules.

### 4. Apache Server

The `.htaccess` file in the `public` folder will handle this automatically when deployed.

### 5. Docker with Nginx

If using Docker, add this to your Dockerfile:
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Testing

After deployment, test these scenarios:

1. ✅ Direct navigation: `yoursite.com/shop`
2. ✅ Page reload: Refresh on any route
3. ✅ React Router navigation: Click through the app
4. ✅ Static assets: Check CSS/JS/images load
5. ✅ Favicon: Ensure favicon displays correctly

## Key Configuration Points

### For Nginx:
- `try_files $uri $uri/ /index.html;` - This is the magic line
- Proper static asset caching
- Security headers
- Gzip compression

### For Apache:
- `RewriteRule . /index.html [L]` - Fallback to index.html
- Proper caching headers
- Security headers

## Common Issues

1. **API Routes**: Make sure API endpoints aren't caught by the fallback
2. **Subdirectories**: If app is in a subdirectory, adjust paths accordingly
3. **CORS**: Ensure CORS is properly configured for API calls
4. **SSL**: Add HTTPS configuration if using SSL certificates

## Quick Fix Commands

**For existing Nginx setup:**
```bash
# Edit your existing nginx config
sudo nano /etc/nginx/sites-available/yoursite.com

# Add this location block:
location / {
    try_files $uri $uri/ /index.html;
}

# Reload nginx
sudo systemctl reload nginx
```

The key is ensuring that when a route like `/shop` is requested, the server serves `/index.html` instead of trying to find a `/shop` file or directory.