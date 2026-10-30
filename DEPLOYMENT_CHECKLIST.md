# Quick Deployment Checklist

## Before You Deploy

- [ ] Git repository is set up and all files are committed
- [ ] You have a GitHub account
- [ ] You have your wedding details ready:
  - Wedding date
  - Location & coordinates
  - Theme colors
  - Couple names

## Step 1: Deploy Backend (5-10 minutes)
- [ ] Create a Render Web Service at https://render.com
- [ ] Connect your GitHub repository and set Root Directory to `server`
- [ ] Set Build Command to `npm install && npm run build`
- [ ] Set Start Command to `npm run prisma:migrate:deploy && npm start`
- [ ] Add the server environment variables, including a strong `ADMIN_DASHBOARD_TOKEN`
- [ ] Configure persistent storage for SQLite if records must survive restarts
- [ ] Test: Visit `https://your-render-service.onrender.com/api/health`

## Step 2: Deploy Frontend (5-10 minutes)
- [ ] Create Vercel account at https://vercel.com
- [ ] Import your GitHub repository
- [ ] Add `VITE_API_URL` environment variable with the Render backend URL
- [ ] Click Deploy
- [ ] Your site will be live at https://[project].vercel.app

## Step 3: Testing (5 minutes)
- [ ] Visit your Vercel URL
- [ ] Check Ceremony page loads with map
- [ ] Test "Give me directions" button
- [ ] Try RSVP page
- [ ] Open `/dashboard` and enter the Render `ADMIN_DASHBOARD_TOKEN`
- [ ] Verify all pages load correctly

## Step 4: Share & Celebrate! 🎉
- [ ] Share the Vercel URL with guests
- [ ] Add to wedding invitations
- [ ] Monitor RSVPs

---

**Total Time: ~20-30 minutes**

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- See README.md for deployment settings
