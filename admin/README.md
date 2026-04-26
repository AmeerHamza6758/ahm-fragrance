# AHM Fragrance Admin Panel

This app is a React + Vite admin scaffold aligned to your current backend routes so you can build the full control panel quickly.

## Current Structure

`src/layout/`
- `AdminLayout.jsx`: shell with sidebar + topbar + page outlet

`src/components/`
- `Sidebar.jsx`: left navigation
- `Topbar.jsx`: header actions
- `StatCard.jsx`: dashboard metric card
- `PageSection.jsx`: reusable section card for module pages

`src/pages/`
- `DashboardPage.jsx`
- `ProductsPage.jsx`
- `CategoriesPage.jsx`
- `BrandsPage.jsx`
- `OrdersPage.jsx`
- `StockPage.jsx`
- `FaqPage.jsx`
- `CustomersPage.jsx`
- `SettingsPage.jsx`

`src/services/`
- `http.js`: axios client with token interceptor
- `endpoints.js`: API methods mapped to `/api/*` backend routes

`src/config/`
- `navigation.js`: sidebar route config

`src/styles/`
- `admin.css`: admin UI styles

## Backend Mapping Used

The scaffold is already wired for these existing APIs:
- `/api/product/*`
- `/api/category/*`
- `/api/brand/*`
- `/api/order/*`
- `/api/stock/*`
- `/api/faq/*`
- `/api/auth/*`

## Run Admin App

1. Install dependencies
   - `npm install`
2. Start dev server
   - `npm run dev`
3. Build for production
   - `npm run build`

## Environment

Create `.env` in `admin` if needed:

`VITE_API_URL=http://localhost:4000`

If not set, default base URL is `http://localhost:4000`.
