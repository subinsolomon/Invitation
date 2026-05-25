# Deployment Guide - Wedding Invitation Website

## Overview
This guide will help you deploy your wedding invitation website to a free domain with a free backend.

**Recommended Setup:**
- **Frontend**: Vercel (Free tier with .vercel.app domain)
- **Backend**: Railway (Free tier)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create a Railway Account
1. Go to https://railway.app
2. Sign up with GitHub (recommended)
3. Authorize Railway

### Step 2: Create a New Project
1. Click "New Project" → "Deploy from GitHub"
2. Connect your GitHub account and select your wedding-invitation repository
3. Railway will auto-detect it's a Node.js project

### Step 3: Configure Environment Variables
1. In Railway, go to the Variables tab
2. Add all environment variables from your `.env` file:
   ```
   PORT=5000
   NODE_ENV=production
   DATABASE_URL=file:./prod.db
   WEDDING_DATE=2026-05-29T14:00:00
   WEDDING_LOCATION=Chavadiyil Jehoash Gardens, Pooyappally, Kerala, India
   WEDDING_COORDINATES_LAT=8.903304700132821
   WEDDING_COORDINATES_LNG=76.76278418645106
   THEME_PRIMARY_COLOR=#000000
   THEME_SECONDARY_COLOR=#ffffff
   THEME_ACCENT_COLOR=#ffd700
   GOOGLE_MAPS_API_KEY=your_api_key_here
   ```

### Step 4: Get Your Backend URL
1. After deployment, go to the Deployments tab
2. Click on your deployment
3. Under "Environment", find the domain (looks like: `https://wedding-api-production.up.railway.app`)
4. Copy this URL - you'll need it for the frontend

### Step 5: Verify Backend is Running
- Visit `https://your-railway-url/api/health`
- You should see: `{"status":"ok","timestamp":"..."}`

---

## Part 2: Deploy Frontend to Vercel

### Step 1: Create a Vercel Account
1. Go to https://vercel.com
2. Sign up with GitHub
3. Authorize Vercel

### Step 2: Update Frontend Environment Variable
1. In your project, update `client/.env.production`:
   ```
   VITE_API_URL=https://your-railway-backend-url
   ```
   (Replace with your actual Railway backend URL from Part 1, Step 4)

2. Or push this change to GitHub first:
   ```bash
   git add .
   git commit -m "Update API URL for production deployment"
   git push
   ```

### Step 3: Deploy to Vercel
1. Go to https://vercel.com/new
2. Click "Import Git Repository"
3. Select your wedding-invitation repository
4. Under "Environment Variables", add:
   ```
   VITE_API_URL=https://your-railway-backend-url
   ```

### Step 4: Configure Build Settings
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `client/dist`
- **Install Command**: `npm run install-all`

### Step 5: Deploy
1. Click "Deploy"
2. Wait for the build to complete
3. You'll get a URL like `https://wedding-invitation-abc123.vercel.app`

---

## Part 3: Get a Custom Free Domain

### Option A: Using Vercel's Free Domain
- Your site is already at `https://[project-name].vercel.app`
- This is your free domain!

### Option B: Use a Free Domain Provider + Point to Vercel
Popular free domain providers:
1. **Freenom** (https://www.freenom.com) - Free .tk, .ml, .ga, .cf domains
2. **Dot.tk** (https://www.dot.tk)

To connect a free domain:
1. Register your free domain
2. In Vercel project settings → Domains
3. Add your custom domain
4. Update your domain's DNS records to point to Vercel (Vercel will provide instructions)

---

## Testing Your Deployment

1. **Visit your site**: Open your Vercel URL in a browser
2. **Check the Ceremony page**: Navigate to Ceremony Details
   - Should see the map with your location
   - "Give me directions" button should work
3. **Test API calls**: 
   - RSVP page should load wedding config
   - All images and content should load correctly

---

## Environment Variables Needed

### For Backend (Railway):
```
PORT=5000
NODE_ENV=production
DATABASE_URL=file:./prod.db
WEDDING_DATE=2026-05-29T14:00:00
WEDDING_LOCATION=Chavadiyil Jehoash Gardens, Pooyappally, Kerala, India
WEDDING_COORDINATES_LAT=8.903304700132821
WEDDING_COORDINATES_LNG=76.76278418645106
THEME_PRIMARY_COLOR=#000000
THEME_SECONDARY_COLOR=#ffffff
THEME_ACCENT_COLOR=#ffd700
GOOGLE_MAPS_API_KEY=your_api_key_here
```

### For Frontend (Vercel):
```
VITE_API_URL=https://your-railway-backend-url
```

---

## Troubleshooting

### Map not showing
- Check that VITE_API_URL is set correctly in Vercel
- Verify backend is running with correct coordinates

### CORS errors
- Backend CORS is already configured, but verify Railway backend URL is correct

### Database errors on Railway
- Railway's free tier uses ephemeral storage, so your database resets daily
- For persistent data, upgrade to paid tier or use a separate database service

### Build fails on Vercel
- Make sure `npm run install-all` works locally first
- Check that all dependencies are in package.json files

---

## Next Steps

1. Complete Steps 1-2 above
2. Test your site thoroughly
3. Share your Vercel URL with guests!

**Your site will be live at:**
```
https://[your-project].vercel.app
```

---

## Free Tier Limitations

### Vercel Free:
- ✅ Free custom domain (.vercel.app)
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless functions (limited)

### Railway Free:
- ✅ $5 free credits monthly
- ⚠️ Database resets daily (ephemeral)
- ⚠️ No persistent data between restarts

**Recommendation**: For production use, consider upgrading Railway to paid tier for persistent database storage.

---

## Support

- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- Project Issues: Check your GitHub repository
