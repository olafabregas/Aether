# Apex Weather

**A weather application that translates meteorological data into plain English explanations.**

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](package.json)

Instead of "Humidity: 82%", users see: *"Very humid. Sweat won't evaporate easily. Stay hydrated."*

Built with React 18, TypeScript, Vite, and Tailwind CSS v4. Uses OpenWeatherMap API with client-side caching and rate limiting.

---

## Quick Start

### Prerequisites

- **Node.js 18+** (recommend using [nvm](https://github.com/nvm-sh/nvm))
- **OpenWeatherMap API Key** ([Sign up free](https://openweathermap.org/api))

### Installation

```bash
# Clone and install
git clone https://github.com/roqeebayorinde/apex-weather.git
cd apex-weather
npm install

# Configure environment
cp .env.example .env
# Edit .env and add: VITE_OPENWEATHER_API_KEY=your_actual_key
```

**Verify your API key works:**
```bash
curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"
```

### Development

```bash
# Start dev server (hot reload enabled)
npm run dev
# Open http://localhost:5173

# Build for production
npm run build

# Preview production build
npm run preview
```

**No tests yet** - Test suite planned for future release.

**Linting:** Standard TypeScript compiler checks via `tsc --noEmit`

---

## Architecture

### Data Flow

```
User → Geolocation → Cache Check → Rate Limiter → API Fetch
                                        ↓
                                  Normalize Data
                                        ↓
                              Interpretation Engine
                                        ↓
                                   React UI
```

### Core Components

```
src/
├── components/          # React UI components
├── hooks/               # useWeather (orchestration hook)
├── services/            # weatherAPI, cacheService, geolocation
├── interpretation/      # Rule-based weather explanation engine
├── types/               # TypeScript definitions
└── utils/               # Rate limiting, formatters, processors
```

### Key Technical Decisions

**Client-Side Only**: No backend. All logic in browser using localStorage.

**15-Minute Cache**: Balance between freshness and API quota. Rounded coordinates for cache keys (`${lat.toFixed(2)}_${lng.toFixed(2)}`).

**Rate Limiting**: 10 requests per 60 seconds (client-side enforcement). Prevents accidental quota exhaustion.

**Interpretation Engine**: Rule-based system (not ML). Sequential rule evaluation produces deterministic, explainable outputs.

**Geolocation Fallback Chain**:
1. Browser Geolocation API (requires HTTPS + permission)
2. localStorage cached last search
3. IP-based geolocation (ipapi.co)
4. Manual search modal

---

## API Integration

### OpenWeatherMap Endpoints

| Endpoint | Purpose | Free Tier Limit |
|----------|---------|-----------------|
| `/data/2.5/weather` | Current conditions | 1000 calls/day |
| `/data/2.5/forecast` | 5-day / 3-hour forecast | 1000 calls/day |
| `/data/2.5/air_pollution` | Air Quality Index | 1000 calls/day |
| `/geo/1.0/direct` | City search autocomplete | 1000 calls/day |

**Total**: ~4 API calls per location load (if cache miss).

**Cost Reality**:
- Free tier: 1000 calls/day (~250 unique location loads)
- Paid "Startup" plan: $40/month for 100k calls/day
- Production apps should implement server-side caching

**Rate Limit Handling**:
- Client enforces 10 req/60sec
- On API 429 response: Show stale cache + retry countdown
- Graceful degradation (never show blank screen)

---

## Features

### Weather Interpretation

Every metric includes plain-language explanations:

**Temperature**: 24°C → "Warm. Stay hydrated and wear light clothing."

**Wind**: 25 km/h NW → "Moderate wind flowing from the mountains. Secure loose items outdoors."

**Humidity**: 82% → "Very humid. Sweat won't evaporate easily. Indoor activities recommended."

**UV Index**: 8 → "Very high. Avoid sun 10am-4pm. Use SPF 50+, wear hat, seek shade."

**Air Quality**: AQI 24 → "Clean air, excellent for outdoor activities."

### Data Provided

- Current weather (temp, feels-like, condition)
- Wind (speed, gusts, direction with explanation)
- Humidity with comfort interpretation
- Air Quality Index (EPA scale)
- Precipitation probability
- Visibility distance
- UV Index with protection advice
- Solar cycle (sunrise/sunset with real-time position)
- Hourly forecast (24 hours)
- 5-day forecast (daily highs/lows)

### UI Features

- Glassmorphism dark theme
- Mobile-responsive (custom breakpoints: 2xs, xs, sm, md, lg)
- Staggered card animations (75ms delays)
- City search with autocomplete
- Recent searches (localStorage)
- Error banners (rate limit, API fail, location denied)
- Touch-optimized for mobile

---

## Development

### Project Structure

```
apex-weather/
├── src/
│   ├── components/       # UI components (Navbar, HeroWeather, cards, etc.)
│   ├── hooks/            # useWeather.ts (main orchestrator)
│   ├── services/         # API, cache, geolocation
│   ├── interpretation/   # Rule engine (rules.ts, engine.ts, normalizer.ts)
│   ├── types/            # TypeScript interfaces
│   ├── utils/            # Rate limiter, formatters, processors
│   └── data/             # Mock data for development
├── public/               # Static assets (favicon)
├── .env.example          # Environment template
└── package.json
```

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.3.1 |
| Language | TypeScript | 5.6.3 |
| Build | Vite + SWC | 7.3.1 |
| Styling | Tailwind CSS | 4.1.0 |
| API | OpenWeatherMap | v2.5 |

**Zero runtime dependencies** beyond React core.

### Environment Variables

```bash
# Required
VITE_OPENWEATHER_API_KEY=your_api_key_here

# Optional (not implemented yet)
# VITE_IP_API_KEY=          # For IP geolocation fallback
# VITE_ANALYTICS_ID=        # If adding analytics
```

**Important**: Vite requires `VITE_` prefix for client-side env vars.

---

## Deployment

### Build

```bash
npm run build
# Output: dist/ directory
# Size: ~45KB gzipped
```

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variable in Vercel dashboard:
# VITE_OPENWEATHER_API_KEY = your_key
```

**Important**: Restart deployment after adding env vars.

### Manual Deployment

1. Run `npm run build`
2. Upload `dist/` to any static host (Netlify, Cloudflare Pages, etc.)
3. Configure environment variables in hosting dashboard
4. Ensure SPA routing: redirect all routes to `index.html`

### Environment Variables in Production

**Vercel**: Dashboard → Project → Settings → Environment Variables

**Netlify**: Dashboard → Site settings → Build & deploy → Environment

**Cloudflare Pages**: Dashboard → Pages → Settings → Environment variables

---

## Performance

### Metrics

| Metric | Value | Note |
|--------|-------|------|
| First Contentful Paint | ~1.2s | Initial render |
| Time to Interactive | ~2.8s | Full interactivity |
| Bundle Size (gzipped) | ~45KB | Includes all deps |
| Lighthouse (Desktop) | 95+ | Performance score |
| Lighthouse (Mobile) | 88+ | Lower due to CPU throttling |
| Cache Hit Rate | ~85% | 15-min TTL |

### Trade-offs

**15-min Cache vs Real-time**:
- Pro: Reduces API calls by 85%
- Pro: Instant repeat visits
- Con: Data up to 15 minutes old
- Why: Weather doesn't change minute-to-minute; reasonable staleness

**Client-Side vs Server-Side**:
- Pro: No backend infrastructure
- Pro: Zero hosting costs (static)
- Con: API key visible in browser (rate-limited free tier = acceptable risk)
- Con: No server-side caching (each user's browser caches independently)

**Bundle Size**:
- React + ReactDOM: ~35KB
- App code: ~10KB
- No heavy libraries (no lodash, moment, etc.)
- Room for growth before optimization needed

---

## Troubleshooting

### API Key Not Working

**Symptom**: "API Failed" error banner

**Checks**:
1. Verify key in `.env` file: `VITE_OPENWEATHER_API_KEY=abc123`
2. Restart dev server (Vite doesn't hot-reload env vars)
3. Test key directly:
   ```bash
   curl "https://api.openweathermap.org/data/2.5/weather?q=London&appid=YOUR_KEY"
   ```
4. Check OpenWeatherMap dashboard: key might take 10 minutes to activate
5. Verify free tier quota not exceeded (1000 calls/day)

### Location Detection Fails

**Symptom**: Shows "Location Denied" banner

**Checks**:
1. Ensure HTTPS (geolocation API requires secure context)
2. Check browser permissions: Settings → Privacy → Location
3. Try manual search (search icon in navbar)
4. Check browser console for specific geolocation errors

**Fallback order**:
1. Browser API (user must allow)
2. Last searched city (if exists in localStorage)
3. IP-based (automatic, but less accurate)
4. Manual search (always works)

### Build Failing

**Common issues**:

```bash
# TypeScript errors
npm run build
# Fix type errors shown in output

# Missing dependencies
rm -rf node_modules package-lock.json
npm install

# Node version mismatch
nvm use 18
# or upgrade Node to 18+
```

### Rate Limit Hit

**Symptom**: Yellow banner "Rate Limited - Retry in Xs"

**Expected behavior**: Shows cached data, auto-retries when timer expires

**If persistent**:
1. Clear localStorage: DevTools → Application → Clear Storage
2. Check if multiple tabs open (each counts toward limit)
3. Verify client-side rate limiter working: check `rateLimiter.ts`

### Data Not Updating

**Symptom**: Weather feels stale even after 15 minutes

**Checks**:
1. Open DevTools → Network tab
2. Hard refresh (Ctrl+Shift+R)
3. Check if API calls happening (should see openweathermap.org requests)
4. Verify cache expiry: DevTools → Application → Local Storage → check timestamps
5. Clear cache manually: localStorage.clear() in console

---

## Security Considerations

### API Key Exposure

**Risk**: API key visible in browser (all client-side apps have this)

**Mitigation**:
- Free tier key with rate limits (max damage: ~$0)
- Client-side rate limiting (10 req/min)
- OpenWeatherMap allows key restrictions by domain (set in dashboard)
- For production: use server-side proxy to hide key

**Not Recommended for Production** without server proxy if:
- Using paid API plan
- High traffic volume
- Strict security requirements

### Input Sanitization

**City search**: Input is URL-encoded and passed to OpenWeatherMap's geocoding API. No direct injection risk.
**Coordinates**: Validated as numbers before API calls. Bounded to valid lat/lng ranges.
**LocalStorage**: Only stores weather data (no PII). Keys are predictable but contain no sensitive data.

### Rate Limiting Bypass

**Client-side rate limiter** can be bypassed by:
- Clearing localStorage
- Opening incognito windows
- Modifying JavaScript

**Why it's acceptable**:
- Free tier API key (limited damage)
- OpenWeatherMap has server-side rate limiting
- Real protection requires server-side enforcement

### HTTPS Requirement

**Geolocation API requires HTTPS** in production. Local development (localhost) works over HTTP.

**Vercel/Netlify**: Auto-provisions SSL certificates.

**Custom domain**: Ensure SSL/TLS configured (Let's Encrypt free).

---

## Contributing

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation only
- `refactor/description` - Code restructuring

### Pull Request Criteria

1. **TypeScript**: No `any` types (use `unknown` if necessary)
2. **No Console Errors**: Check browser DevTools
3. **Mobile Tested**: Test responsive breakpoints
4. **Builds Successfully**: `npm run build` must pass
5. **Code Style**: Follow existing patterns (no Prettier config yet)

### Running with Mock Data

To develop without API key:

```typescript
// In src/hooks/useWeather.ts
// Comment out API calls, uncomment:
setWeatherData(mockWeatherData);
setLoading(false);
```

Mock data in `src/data/mockWeatherData.ts` covers all UI states.

### Code Review Focus

- Type safety (avoid type assertions)
- Error handling (all async calls wrapped in try/catch)
- Performance (avoid unnecessary re-renders)
- Accessibility (keyboard navigation, ARIA labels)
- Mobile UX (touch targets, text readability)

---

## Known Issues

### Current Limitations

1. **No Tests**: Test suite not implemented yet
2. **No PWA**: Offline mode not available
3. **Single Location**: Can't save multiple favorite cities
4. **No Notifications**: Weather alerts not implemented
5. **Forecast Accuracy**: Inherits OpenWeatherMap accuracy (~80-95% for 24h, drops beyond)

### Browser Compatibility

- **Works**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Partial**: IE 11 (not supported, unsupported API features)
- **Geolocation**: Requires HTTPS (except localhost)

---

## FAQ

**Q: Why 15-minute cache instead of real-time?**

A: Weather conditions don't change significantly in 15 minutes. Caching reduces API calls by 85%, staying well under free tier limits (1000 calls/day) even with heavy usage.

**Q: Why is the API key exposed in the browser?**

A: All client-side apps expose API keys. We use a free tier key with rate limits. For production, implement a server-side proxy to hide the key. Current risk: minimal (max damage ~$0).

**Q: What happens when I hit the rate limit?**

A: The app shows cached weather data (if available) and displays a countdown timer. When the timer expires, it automatically retries. You never see a blank screen.

---

## License

MIT License - see [LICENSE](LICENSE) file for details.

Free to use, modify, and distribute.

---

## Developer

**Roqeeb Ayorinde**

This project demonstrates:
- React 18 + TypeScript architecture
- Client-side caching strategies
- API integration with error handling
- Rule-based interpretation engine design
- Mobile-first responsive design

---

## Acknowledgments

- Weather data: [OpenWeatherMap](https://openweathermap.org/)
- Icons: [Google Material Symbols](https://fonts.google.com/icons)
- Font: [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk)
