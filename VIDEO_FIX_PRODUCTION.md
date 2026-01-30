# Fix Video 404 Error in Production

## Problem
Video works locally but shows 404 error in production deployment.

## Solutions

### Solution 1: Verify Video File is Committed to Git

1. **Check if video file is in Git:**
   ```bash
   git ls-files | grep Home_video.mp4
   ```

2. **If NOT found, add it to Git:**
   ```bash
   git add public/Home_video.mp4
   git commit -m "Add video file for production"
   git push
   ```

3. **Important:** Make sure `Home_video.mp4` is NOT in `.gitignore`

### Solution 2: Check File Size Limits

**Netlify:**
- Maximum file size: **100MB** per file
- If video > 100MB, compress it:
  ```bash
  # Using ffmpeg to compress video
  ffmpeg -i public/Home_video.mp4 -vcodec h264 -acodec mp2 -crf 23 -preset slow public/Home_video_compressed.mp4
  ```

**Render:**
- No strict file size limit, but large files may timeout
- Consider using CDN for videos > 50MB

### Solution 3: Verify Deployment Includes Public Folder

**For Netlify:**
1. Go to Netlify Dashboard → Site Settings → Build & Deploy
2. Verify "Publish directory" is set to: `.next` (Next.js handles this)
3. Or leave it empty/default

**For Render:**
1. Verify `public/` folder is in repository
2. Next.js automatically copies `public/` during build

### Solution 4: Use CDN for Large Videos (Recommended)

If video is large (>10MB), host it on:
- **Cloudinary** (free tier available)
- **AWS S3** + CloudFront
- **Vimeo** or **YouTube** (embed)

Then update video source:
```tsx
<source src="https://your-cdn-url.com/video.mp4" type="video/mp4" />
```

### Solution 5: Verify File Path in Production

1. **After deployment, check:**
   - Visit: `https://your-site.com/Home_video.mp4`
   - Should return video file, not 404

2. **If 404, check:**
   - File is in `public/` folder (not `public/public/`)
   - File name matches exactly: `Home_video.mp4` (case-sensitive)
   - File is committed to git

### Solution 6: Force Rebuild

1. **Netlify:**
   - Go to Deploys tab
   - Click "Trigger deploy" → "Clear cache and deploy site"

2. **Render:**
   - Go to Manual Deploy
   - Click "Deploy latest commit"

## Quick Checklist

- [ ] Video file exists in `public/Home_video.mp4`
- [ ] File is committed to Git (not in .gitignore)
- [ ] File size < 100MB (for Netlify)
- [ ] Cleared deployment cache and rebuilt
- [ ] Verified file accessible at `https://your-site.com/Home_video.mp4`
- [ ] Checked browser console for specific error messages

## If Still Not Working

### Option A: Compress Video
Use online tools or ffmpeg to reduce file size:
- Target: < 5MB for fast loading
- Resolution: 1920x1080 or lower
- Codec: H.264

### Option B: Use Fallback Image Only
If video continues to fail, the current code will automatically show the fallback image (`/all.jpg`). This is already implemented and working.

### Option C: Host Video Externally
Upload video to:
- YouTube (unlisted)
- Cloudinary
- AWS S3
- Vimeo

Then embed or link to external URL.

## Testing

After deploying, test:
```bash
# Check if video is accessible
curl -I https://your-site.com/Home_video.mp4

# Should return: HTTP/1.1 200 OK
# Not: HTTP/1.1 404 Not Found
```

## Current Code Status

✅ Error handling implemented
✅ Fallback image working
✅ Silent error handling (no console errors)
✅ Production-ready video loading logic

The code will gracefully fallback to image if video fails to load.

