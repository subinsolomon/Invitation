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
- [ ] Create Railway account at https://railway.app
- [ ] Connect your GitHub repository
- [ ] Add environment variables in Railway
- [ ] Copy your Railway backend URL (ends with .up.railway.app)
- [ ] Test: Visit `https://your-url/api/health`

## Step 2: Deploy Frontend (5-10 minutes)
- [ ] Create Vercel account at https://vercel.com
- [ ] Import your GitHub repository
- [ ] Add `VITE_API_URL` environment variable with Railway backend URL
- [ ] Click Deploy
- [ ] Your site will be live at https://[project].vercel.app

## Step 3: Testing (5 minutes)
- [ ] Visit your Vercel URL
- [ ] Check Ceremony page loads with map
- [ ] Test "Give me directions" button
- [ ] Try RSVP page
- [ ] Verify all pages load correctly

## Step 4: Share & Celebrate! 🎉
- [ ] Share the Vercel URL with guests
- [ ] Add to wedding invitations
- [ ] Monitor RSVPs

---

**Total Time: ~20-30 minutes**

## Need Help?
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app
- See DEPLOYMENT_GUIDE.md for detailed instructions
