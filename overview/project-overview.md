# BashaLagbe - Online House Rent Management System

## Project Summary
BashaLagbe is a house rent management platform that helps tenants find homes, lets owners publish and manage properties, and gives admins control over the whole system.

The project is built as a hybrid application:
- The frontend is a React + Vite app.
- The backend is a Laravel API with Sanctum token authentication.
- Some member and dashboard data is also stored in browser localStorage for the current UI workflow.

## What The Project Does
The system manages the full house-rent journey in one place:
- Tenants browse properties, view details, save houses, and send booking requests.
- Owners add and manage their properties.
- Admins monitor users, owners, properties, and platform activity.

## Main Features
- Property browsing with filters and detail pages.
- Tenant dashboard with saved houses and property recommendations.
- Owner dashboard with property publishing and editing.
- Admin dashboard for platform management.
- Profile editing for admin, owner, and tenant members.
- Authentication with register, login, logout, and protected routes.
- Property booking request flow.
- Settings storage for authenticated users in the backend.

## User Roles

### Admin
The admin manages the whole platform. In the current UI, admin can:
- View total tenants, owners, and properties.
- See notifications from new properties and booking requests.
- Manage users, owners, and properties.
- Edit admin profile details.

### Owner
The owner is the property publisher. In the current UI, owner can:
- View all of their published properties.
- Add a new property.
- Edit an existing property.
- Update owner profile information.

### Tenant
The tenant is the house seeker. In the current UI, tenant can:
- Browse available properties.
- Open property details.
- Save houses for later.
- Create a booking request.
- Track order/request pages inside the dashboard.

## Frontend Overview
The frontend lives in `frontend/src` and is organized by feature:
- `pages/` contains page-level screens.
- `layouts/` contains the dashboard and shared shell layouts.
- `components/` contains reusable UI parts.
- `routes/` controls navigation and role protection.
- `utils/` stores browser-based helper logic for members, properties, and saved data.

Important frontend files:
- `frontend/src/main.jsx` starts the app.
- `frontend/src/routes/Routers.jsx` defines public and protected routes.
- `frontend/src/features/auth/authSlice.js` keeps auth state.
- `frontend/src/hooks/useAuth.js` reads auth status from Redux.

## Backend Overview
The backend lives in `backend/` and is a Laravel API.

Main backend responsibilities:
- Register users and issue access tokens.
- Log in and log out authenticated users.
- Return the current authenticated user profile.
- Store and update platform settings per user.
- Create, update, list, and delete properties.

Important backend files:
- `backend/routes/api.php` defines API routes.
- `backend/app/Http/Controllers/Api/V1/AuthController.php` handles authentication.
- `backend/app/Http/Controllers/Api/V1/PropertyController.php` handles property CRUD.
- `backend/app/Http/Controllers/Api/V1/SettingController.php` handles user settings.

## Database Overview
The Laravel database currently contains these main tables:
- `users` - stores name, email, phone, role, and password.
- `properties` - stores all property details published by owners.
- `settings` - stores boolean preference values per user.
- `personal_access_tokens` - stores Sanctum tokens.

In the current codebase, booking and payment data are mostly handled in the frontend UI flow and localStorage, not through dedicated Laravel tables yet.

## Dashboard Overview

### Admin Dashboard
The admin dashboard shows:
- Total tenants.
- Total owners.
- Total properties.
- Notification panel for new property uploads and booking requests.

### Owner Dashboard
The owner dashboard shows:
- Total properties published by the owner.
- Property cards with image, location, and price.
- Add Property and Edit Property actions.

### Tenant Dashboard
The tenant dashboard shows:
- Saved house count.
- Recommended properties.
- Recent activity section.
- Links to saved houses and property detail pages.

## Authentication System
The app uses a mix of Redux state and Laravel Sanctum tokens:
- Register and login endpoints are available in the Laravel API.
- On success, the backend returns a user object and token.
- The frontend stores token, user, and auth flags in localStorage.
- Protected routes use role checks before showing dashboard pages.

Current API auth endpoints:
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`
- `POST /api/v1/auth/logout`

## Booking And Payment Workflow
The current workflow is simple and user-friendly:
1. Tenant opens a property from the listing or detail page.
2. Tenant clicks the booking action.
3. The order form collects personal and booking details.
4. The app shows the order summary and owner notice.
5. The tenant confirms the booking request.
6. Admin receives a notification in the dashboard.
7. The system notes that payment is completed directly with the owner after the agreement.

Important note:
- The current UI shows a booking request flow.
- It does not yet use a full online payment gateway or a dedicated booking table in the backend.

## Folder Structure Overview

### Backend
- `backend/app/` - application code, models, controllers, and middleware.
- `backend/bootstrap/` - app bootstrap and cached services.
- `backend/config/` - application configuration.
- `backend/database/` - migrations, seeders, and factories.
- `backend/public/` - web entry point.
- `backend/routes/` - API, web, and console routes.
- `backend/storage/` - logs and generated files.
- `backend/tests/` - automated tests.

### Frontend
- `frontend/src/app/` - app-level setup.
- `frontend/src/components/` - reusable UI components.
- `frontend/src/features/` - Redux features and API slices.
- `frontend/src/hooks/` - custom hooks.
- `frontend/src/layouts/` - shared layouts.
- `frontend/src/pages/` - page screens for admin, owner, tenant, login, register, and home.
- `frontend/src/routes/` - route definitions and route protection.
- `frontend/src/utils/` - storage and data helper functions.

## Simple Project Flow
Home page -> Login/Register -> Role-based dashboard -> Property management or booking flow -> Profile/settings updates

## Final Note
This project is already structured like a real role-based rent management system. The frontend is feature-rich, and the backend provides a clean Laravel API foundation. The next natural step is to connect booking and payment to a dedicated backend module if you want full production-level automation.