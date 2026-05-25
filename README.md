# 💒 Wedding Invitation Website

A beautiful, modern wedding invitation website built with React, Express, and SQLite. Features include an elegant homepage with countdown timer, RSVP management, ceremony details, theme switching, and smooth animations.

## Features

✨ **Beautiful UI**
- Modern, responsive design that works on all devices
- Elegant animations and transitions using Framer Motion
- Sparkle effects on Bible verse
- Smooth scroll navigation

📅 **Countdown Timer**
- Real-time countdown to wedding date
- Days, hours, minutes, seconds display
- Animated counter with theme-aware styling

📝 **RSVP Management**
- Guest RSVP form with validation
- Store responses in SQLite database
- Automatic duplicate email detection
- Real-time form validation feedback

🎨 **Theme Switching**
- Three built-in themes: Dark, Light, Rose
- Easy theme switching with localStorage persistence
- All colors configurable via environment variables

📍 **Ceremony Details**
- Display wedding location, date, and time
- Embedded Google Maps integration
- Responsive layout

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animations
- **TailwindCSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **Prisma** - ORM for database
- **SQLite** - Database
- **express-validator** - Input validation
- **CORS** - Cross-origin requests

## Project Structure

```
Invitation/
├── server/                   # Backend (Express)
│   ├── prisma/
│   │   └── schema.prisma    # Database schema
│   ├── routes/
│   │   ├── rsvp.js          # RSVP endpoints
│   │   └── config.js        # Config endpoint
│   ├── controllers/
│   │   └── rsvpController.js # Business logic
│   ├── middleware/
│   │   └── validation.js     # Input validation
│   ├── config/
│   │   └── database.js       # Prisma client
│   ├── server.js            # Express server
│   ├── .env                 # Environment variables
│   └── package.json
│
├── client/                   # Frontend (React)
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Hero + countdown
│   │   │   ├── RSVPPage.jsx     # RSVP form
│   │   │   └── CeremonyPage.jsx # Ceremony details
│   │   ├── components/
│   │   │   ├── Navigation.jsx   # Header/nav
│   │   │   ├── Countdown.jsx    # Countdown timer
│   │   │   └── Sparkle.jsx      # Sparkle animation
│   │   ├── context/
│   │   │   └── ThemeContext.jsx # Theme provider
│   │   ├── hooks/
│   │   │   └── useCountdown.js  # Countdown hook
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main app component
│   │   ├── main.jsx             # Entry point
│   │   └── index.css            # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── .env                 # Frontend env vars
│   └── package.json
│
├── package.json             # Root package.json
└── .env.example            # Environment template
```

## Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Git** (optional)

### Step 1: Clone/Navigate to Project

```bash
cd "path/to/Cyber Chill/Invitation"
```

### Step 2: Install Dependencies

From the root directory, run:

```bash
npm run install-all
```

Or manually:

```bash
# Install root dependencies
npm install

# Install server dependencies
npm --prefix server install

# Install client dependencies
npm --prefix client install
```

### Step 3: Set Up Environment Variables

Both `.env` files are already created with defaults, but you can customize them:

**Server** (`server/.env`):
```
PORT=5000
NODE_ENV=development
DATABASE_URL="file:./dev.db"
WEDDING_DATE="2026-05-29T14:00:00"
WEDDING_LOCATION="Chavadiyil Jehoash Gardens, Pooyappally, Kerala, India"
WEDDING_COORDINATES_LAT="8.903304700132821"
WEDDING_COORDINATES_LNG="76.76278418645106"
THEME_PRIMARY_COLOR="#000000"
THEME_SECONDARY_COLOR="#ffffff"
THEME_ACCENT_COLOR="#ffd700"
GOOGLE_MAPS_API_KEY="your_api_key_here"
```

**Client** (`client/.env`):
```
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### Step 4: Initialize Database

```bash
cd server
npx prisma migrate dev --name init
cd ..
```

This creates the SQLite database and RSVP table.

### Step 5: Start Development Servers

**Option A: Run both simultaneously (from root)**
```bash
npm run dev
```

**Option B: Run separately**

Terminal 1 - Backend:
```bash
npm --prefix server run dev
```

Terminal 2 - Frontend:
```bash
npm --prefix client run dev
```

### Step 6: Open in Browser

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:5000/api](http://localhost:5000/api)
- Health Check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

## Configuration

### Wedding Date
Edit the `WEDDING_DATE` in `server/.env` to set the countdown date:
```
WEDDING_DATE="2024-12-15T14:00:00"  # ISO 8601 format
```

### Theme Colors
Customize theme colors by editing environment variables:
```
THEME_PRIMARY_COLOR="#000000"        # Main color (black default)
THEME_SECONDARY_COLOR="#ffffff"      # Secondary (white default)
THEME_ACCENT_COLOR="#ffd700"         # Accent (gold default)
```

### Location & Map
Update ceremony location in `server/.env`:
```
WEDDING_LOCATION="Your Venue Name, City, State"
WEDDING_COORDINATES_LAT="40.7580"
WEDDING_COORDINATES_LNG="-73.9855"
```

## API Endpoints

### Configuration
- `GET /api/config` - Get wedding configuration (date, location, theme, Bible verse)

### RSVP Management
- `POST /api/rsvp` - Submit new RSVP
- `GET /api/rsvp` - Get all RSVPs (admin)
- `GET /api/rsvp/count` - Get RSVP statistics

### Health Check
- `GET /api/health` - Server health status

### Request/Response Examples

**Submit RSVP:**
```bash
curl -X POST http://localhost:5000/api/rsvp \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "attendance": true
  }'
```

**Response:**
```json
{
  "message": "RSVP submitted successfully!",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1 (555) 123-4567",
    "attendance": true,
    "createdAt": "2024-12-10T15:30:00Z"
  }
}
```

## Building for Production

### Build Frontend
```bash
npm --prefix client run build
```

Output: `client/dist/`

### Build Backend
No build step needed; run directly with Node.js.

### Deploy

**Frontend:**
- Push `client/dist/` to Vercel, Netlify, or any static host

**Backend:**
- Deploy Node.js app to Render, Railway, Heroku, or VPS
- Ensure persistent volume for SQLite database
- Set environment variables in production host

## Features Guide

### Homepage
- **Hero Section**: Beautiful background image with overlay
- **Bible Verse**: Customizable verse with sparkle animations
- **Countdown Timer**: Real-time countdown in days, hours, minutes, seconds
- **Call-to-Action**: Links to ceremony details and RSVP form

### RSVP Page
- **Form Validation**: Real-time validation feedback
- **Attendance Options**: Yes/No radio buttons
- **Optional Phone Field**: Request contact information
- **Success Message**: Confirmation after submission
- **Error Handling**: Clear error messages for duplicate emails or validation failures

### Ceremony Page
- **Wedding Details**: Date, time, location, dress code
- **Google Maps**: Embedded map showing venue location
- **Responsive Design**: Works on all screen sizes

### Theme Switching
- **Three Themes**: Dark (gold), Light (pink), Rose (dark red)
- **Persistent Selection**: Theme preference saved to localStorage
- **Dynamic Styling**: All components update instantly when theme changes

## Troubleshooting

### Node modules not found
```bash
npm run install-all
```

### Database issues
```bash
cd server
npx prisma migrate reset
cd ..
```

### Port already in use
Edit `.env` files to use different ports:
```
PORT=5001  # for server
# In client vite.config.js, change to port: 3001
```

### CORS errors
Ensure `VITE_API_URL` in `client/.env` matches your backend URL:
```
VITE_API_URL=http://localhost:5000
```

### Google Maps not showing
Get a free API key from [Google Cloud Console](https://console.cloud.google.com/) and add to `.env` files:
```
GOOGLE_MAPS_API_KEY="AIzaSyD..."
VITE_GOOGLE_MAPS_API_KEY="AIzaSyD..."
```

## Contributing & Customization

### Add Custom Pages
1. Create new component in `client/src/pages/`
2. Import and add route in `client/src/App.jsx`
3. Add navigation link in `client/src/components/Navigation.jsx`

### Modify Animations
- Edit `client/src/components/*.jsx` to customize Framer Motion animations
- Adjust keyframes in `client/tailwind.config.js`
- See [Framer Motion Docs](https://www.framer.com/motion/) for animation examples

### Customize Styling
- Edit theme colors in `server/.env`
- Modify TailwindCSS config in `client/tailwind.config.js`
- Add custom CSS in `client/src/index.css`

### Add Database Fields
1. Edit `server/prisma/schema.prisma`
2. Run migration: `npx prisma migrate dev --name add_field_name`
3. Update form in `client/src/pages/RSVPPage.jsx`
4. Update API in `server/controllers/rsvpController.js`

## Security Considerations

- ✅ Input validation on both frontend and backend
- ✅ Duplicate email detection prevents duplicate RSVPs
- ✅ CORS configured for specific origin
- ✅ Environment variables for sensitive data
- ⚠️ TODO: Add rate limiting for RSVP submissions
- ⚠️ TODO: Add admin authentication for viewing RSVPs

## Future Enhancements

- [ ] Admin dashboard to view/manage RSVPs
- [ ] Email confirmation for RSVP submissions
- [ ] Guest list management
- [ ] Dietary restrictions field
- [ ] Photo gallery section
- [ ] Wedding registry/gift registry
- [ ] Plus-one management
- [ ] Mobile app (React Native)
- [ ] Real-time RSVP count updates (WebSockets)
- [ ] Analytics tracking

## License

This project is provided as-is for personal use. Feel free to customize and deploy for your wedding!

## Support

For issues or questions, refer to:
- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Framer Motion Docs](https://www.framer.com/motion/)
- [TailwindCSS Docs](https://tailwindcss.com/docs)

---

Made with 💕 for your special day!
