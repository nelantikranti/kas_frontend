# Fix Render Memory Issue - Step by Step

## 🔴 Problem
Render is running `npm run build` **twice**:
1. ✅ First time in Build Command (succeeds)
2. ❌ Second time in Start Command (fails - out of memory)

## ✅ Solution

### Step 1: Fix Render Settings

**Go to:** Render Dashboard → Your Service → **Settings** → **Build & Deploy**

#### Update Build Command:
```bash
npm install && NODE_OPTIONS='--max-old-space-size=400' npm run build
```

#### Update Start Command:
```bash
npm start
```
⚠️ **CRITICAL:** Must be `npm start`, NOT `npm run build`

### Step 2: Add Environment Variable (Optional but Recommended)

**Go to:** Render Dashboard → Your Service → **Environment**

**Add:**
- **Key:** `NODE_OPTIONS`
- **Value:** `--max-old-space-size=400`

This ensures memory limit is applied everywhere.

### Step 3: Verify Settings

**Build Command:** `npm install && NODE_OPTIONS='--max-old-space-size=400' npm run build`  
**Start Command:** `npm start`  
**Environment:** `NODE_OPTIONS=--max-old-space-size=400`

### Step 4: Redeploy

1. Click **"Save"** in Render settings
2. Go to **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment

## Why This Happens

Render runs:
1. **Build Command** → Creates `.next` folder ✅
2. **Start Command** → Should start the server, but was running build again ❌

The Start Command was set to `npm run build` instead of `npm start`.

## Alternative: Use render.yaml

If you want to use configuration as code, commit `render.yaml` and Render will use it automatically.

## Still Having Issues?

### Option 1: Use Netlify Instead (Recommended)
Netlify handles Next.js builds much better:
- Better free tier
- Automatic Next.js optimization
- No memory issues
- Faster builds

### Option 2: Build Locally and Deploy
1. Run `npm run build` locally
2. Commit `.next` folder (add to git)
3. Set Start Command to: `npm start`
4. Skip Build Command (or make it just `npm install`)

### Option 3: Upgrade Render Plan
If you need to stay on Render, consider upgrading to a paid plan with more memory.

---

## Quick Checklist

- [ ] Build Command: `npm install && NODE_OPTIONS='--max-old-space-size=400' npm run build`
- [ ] Start Command: `npm start` (NOT `npm run build`)
- [ ] Environment Variable: `NODE_OPTIONS=--max-old-space-size=400`
- [ ] Saved settings
- [ ] Triggered new deployment

