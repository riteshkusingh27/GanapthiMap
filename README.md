# 🪔 GanapathiMap

**GanapathiMap** is a modern, interactive web application for discovering verified Ganesha Pandals across Bengaluru. Users can explore pandal locations on an interactive map, check live crowd levels, darshan & aarti timings, eco-friendly status, and locate pandals near their current GPS position.

---

## ✨ Features

- 🗺️ **Interactive Map View**: High-resolution OpenStreetMap powered by Leaflet with custom photo markers for every pandal.
- 📍 **Live Location Calibration**: One-tap geolocation to center the map on your exact position and find nearby pandals.
- 👥 **Real-time Crowd Monitoring**: Live crowd status indicators (Low, Moderate, High, Peak) updated via Supabase.
- 🌿 **Category Filters**: Filter pandals by Eco-Friendly clay idols, Free Prasad / Annadanam availability, Featured, and Trending spots.
- 📸 **Cloud Storage Integration**: Pandal photos hosted on Cloudflare R2 storage for ultra-fast loading.
- ➕ **Community Submissions**: Submit new pandal listings with photo uploads for admin approval.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS, Lucide Icons
- **Mapping**: Leaflet, React-Leaflet, OpenStreetMap / CARTO Tiles
- **Database & Realtime**: Supabase (PostgreSQL)
- **Object Storage**: Cloudflare R2 (S3-compatible bucket)
- **Deployment**: Compatible with Vercel, Cloudflare Pages, Netlify

---

## 🚀 Local Development

### 1. Prerequisites
Ensure you have **Node.js 18+** installed.

### 2. Installation
```bash
# Clone repository
git clone https://github.com/your-username/GanapathiMap.git

# Navigate into project folder
cd GanapathiMap

# Install dependencies
npm install
```


### 4. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📦 Production Build

```bash
npm run build
```
The optimized production bundle will be generated in the `dist/` directory, ready to be deployed on **Cloudflare Pages** or **Vercel**.
