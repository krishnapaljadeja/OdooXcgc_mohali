🏙️ CivicTrack

**CivicTrack** empowers citizens to report and track local civic issues — such as road damage, water leaks, garbage, and safety hazards — within their neighborhood. It ensures transparency and faster resolution by enabling real-time status tracking and hyperlocal engagement.

---
## 🧰 Tech Stack

### 🌐 Frontend
- **React.js**
- **Mapbox GL JS** or **Leaflet.js** for interactive maps
- **Tailwind CSS** for UI styling
- **Axios** for API calls
- **Geolocation API** for fetching user's current position

### 🧠 Backend
- **Node.js + Express**
- **PostgreSQL** for structured data
- **PostGIS** (PostgreSQL extension) for fast geospatial queries
- **Prisma** ORM

### ☁️ Cloud & Integrations
- **Cloudinary** – image uploads (up to 35 per issue)
- **JWT Auth** – for verified users

---

## 🚀 Features

### 🌐 Geo-Restricted Visibility
- Only view issues reported within a **3–5 km radius** of user’s location (GPS or manually selected).
- Prevents browsing or interacting with issues **outside the user's neighborhood zone**.

### ⚡ Quick Issue Reporting
- Submit issues with:
  - **Title** & **short description**
  - **Up to 35 photos**
  - **Category selection**
- Supports **anonymous** or **verified reporting**

### 🗂️ Supported Issue Categories
- Roads (potholes, obstructions)  
- Lighting (broken/flickering streetlights)  
- Water Supply (leaks, low pressure)  
- Cleanliness (overflowing bins, garbage)  
- Public Safety (open manholes, exposed wiring)  
- Obstructions (fallen trees, debris)

### 📊 Status Tracking
- Issue detail pages show **status logs** with timestamps
- Reporters get **notified** on status updates

### 🗺️ Map Mode & Filtering
- View nearby issues as **pins on a map**
- Filter by:
  - **Status** (Reported, In Progress, Resolved)
  - **Category**
  - **Distance** (1 km, 3 km, 5 km)

### 🛡️ Moderation & Safety
- Reports can be **flagged as spam**
- Reports flagged by multiple users are **auto-hidden** pending admin review

### 🛠️ Admin Panel
- Review & manage spam/invalid issues
- View **analytics**:
  - Total issues posted
  - Most reported categories
- **Ban abusive users**

---

## 🧭 Geo Visibility Logic (5km Radius)
We use **Haversine formula** or **PostGIS** to filter issues based on distance:

```sql
SELECT *
FROM issues
WHERE ST_DWithin(
  location::geography,
  ST_SetSRID(ST_MakePoint(:lng, :lat), 4326)::geography,
  5000 -- in meters
);
