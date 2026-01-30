# Fix Render Memory Issue

## Problem
Render free tier has 512MB memory limit. Next.js build is running out of memory.

## Solution

### Option 1: Update Render Build Command (RECOMMENDED)

**Go to Render Dashboard → Your Service → Settings → Build & Deploy**

**Change Build Command to:**
```bash
npm install && NODE_OPTIONS='--max-old-space-size=400' npm run build
```

**Start Command:**
```bash
npm start
```

### Option 2: Use Optimized Build Script

The `package.json` now includes a `build:render` script optimized for Render.

**Change Build Command to:**
```bash
npm install && npm run build:render
```

### Option 3: Add Environment Variable in Render

**Go to:** Render Dashboard → Your Service → **Environment**

**Add:**
- **Key:** `NODE_OPTIONS`
- **Value:** `--max-old-space-size=400`

Then use normal build command: `npm install && npm run build`

## Additional Optimizations Applied

1. ✅ **Next.js Config:**
   - Added `output: 'standalone'` for optimized builds
   - Disabled CSS optimization during build
   - Optimized webpack chunk splitting (max 200KB chunks)
   - Added filesystem caching

2. ✅ **Build Scripts:**
   - Added `build:render` script with memory limit
   - Updated `build` script with memory limit

## Why This Works

- `--max-old-space-size=400` limits Node.js to 400MB (leaving room for system)
- Smaller webpack chunks reduce peak memory usage
- Standalone output reduces build complexity
- Filesystem caching speeds up subsequent builds

## If Still Failing

1. **Upgrade Render Plan** (if possible)
2. **Use Netlify Instead** (better free tier for Next.js)
3. **Split Build Process:**
   - Build locally
   - Commit `.next` folder
   - Deploy without building

## Quick Fix Steps

1. Go to Render Dashboard
2. Your Service → Settings → Build & Deploy
3. Update Build Command: `npm install && NODE_OPTIONS='--max-old-space-size=400' npm run build`
4. Save and redeploy

---

**Note:** The frontend is better suited for Netlify (which handles Next.js builds better). Consider deploying frontend to Netlify instead of Render.

