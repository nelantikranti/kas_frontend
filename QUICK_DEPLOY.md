# Quick Netlify Deployment Guide

## 🚀 Quick Steps

### 1. Deploy Backend First (Render)

1. Go to https://render.com
2. Sign up/Login
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `kas-crm-backend`
   - **Build Command**: `cd kascrm_backend && npm install && npm run build`
   - **Start Command**: `cd kascrm_backend && npm start`
6. Set Environment Variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `FRONTEND_URL`: Will set after Netlify deployment
   - `NODE_ENV`: `production`
7. Deploy and note your backend URL (e.g., `https://kas-crm-backend.onrender.com`)

### 2. Deploy Frontend (Netlify)

1. Go to https://app.netlify.com
2. Sign up/Login
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub repository
5. Configure Build Settings:
   - **Base directory**: `kascrm_frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `.next` (or leave default)
6. Set Environment Variables:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.onrender.com/api`
   - `NODE_ENV`: `production`
7. Click "Deploy site"

### 3. Update Backend CORS

1. Go back to Render dashboard
2. Update `FRONTEND_URL` to your Netlify URL (e.g., `https://your-site.netlify.app`)
3. Restart the service

### 4. Test

- Visit your Netlify URL
- Login with: `admin@kas.com` / `admin123`

## 📝 Important Notes

- **Backend must be deployed first** to get the API URL
- **MongoDB Atlas**: Add IP `0.0.0.0/0` to Network Access whitelist
- **Environment Variables**: Must be set in both Netlify and Render
- **CORS**: Frontend URL in backend must match Netlify URL exactly

## 🔗 Files Created

- `netlify.toml` - Netlify configuration
- `NETLIFY_DEPLOYMENT.md` - Detailed deployment guide
- `next.config.js` - Updated for Netlify

## ✅ Checklist

- [ ] Backend deployed on Render
- [ ] Frontend deployed on Netlify
- [ ] Environment variables set
- [ ] MongoDB IP whitelisted
- [ ] CORS configured
- [ ] Login working

Good luck! 🎉


