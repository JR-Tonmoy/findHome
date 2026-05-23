# BashaLagbe - House Rental Management System

## Project Overview

BashaLagbe is a full-stack house rental management system built to connect tenants, property owners, and administrators in one platform. It allows users to browse houses, publish listings, request bookings, manage payments, generate invoices, handle cancellations and refunds, and monitor platform activity through role-based dashboards.

The project is implemented as a hybrid web application:

- Frontend: React + Vite
- Backend: Laravel API
- Database: MySQL
- Authentication: Laravel Sanctum
- Payment Gateway: SSLCommerz

The system is designed to solve the common real-world problems of manual rental coordination, fragmented communication, slow approval cycles, and poor visibility over booking and payment status.

---

## 1. Project Introduction

### Project Purpose

The purpose of BashaLagbe is to modernize the house rental process by providing a centralized digital platform for property discovery, booking, payment, and management. Instead of relying on phone calls, manual records, and scattered messaging, the system keeps the rental workflow in a structured application.

### Target Users

- Tenants who want to search, compare, and book houses
- Property owners who want to publish and manage property listings
- Administrators who want to supervise users, properties, bookings, payments, and platform activity

### Real-World Problem Solved

The system solves the problems of:

- Manual property handling
- Unclear booking ownership and status tracking
- Weak payment visibility
- Delayed or lost communication between tenant and owner
- Difficult refund and cancellation tracking
- Lack of unified dashboard visibility for admins

### Why This System Is Useful

BashaLagbe is useful because it turns an informal rental process into a controlled workflow. It improves transparency, reduces human error, supports payment traceability, and gives each user role a dedicated interface.

---

## 2. System Objective

### Primary Objective

The primary objective is to provide a complete online house rental management platform that supports property publishing, booking, payment, refund, invoice generation, and role-based administration.

### Secondary Objectives

- Make property discovery faster and easier
- Reduce dependency on manual communication
- Improve transparency in booking and payment handling
- Store operational records in a structured database
- Provide dashboards for tenants, owners, and admins
- Support secure authentication and protected access

### Automation Benefits

- Booking requests are recorded automatically
- Payment status is updated through gateway callbacks
- Occupied property status is updated when payment completes
- Refund and cancellation records are generated systematically
- Notifications are created automatically for relevant users
- Invoices and refund documents can be generated as downloadable PDFs

---

## 3. Tech Stack Analysis

### React

React is used for the frontend because it supports component-based development, reusable UI, state-driven rendering, and efficient dashboard interfaces. It is a strong choice for a system with multiple user roles and many interactive screens.

### Vite

Vite is used as the frontend build tool because it provides fast development startup, fast HMR, and a modern build pipeline. It helps keep the frontend responsive during development.

### Laravel

Laravel is used for the backend because it offers a mature MVC architecture, clean API development, strong validation support, routing, middleware, authentication, database migrations, and file/PDF handling. It is well suited for a transactional business application.

### MySQL

MySQL is used as the relational database because the system has many linked entities such as users, properties, bookings, payments, notifications, and refunds. A relational database is important for preserving integrity and enforcing foreign key relationships.

### Sanctum

Laravel Sanctum is used for token-based authentication. It is suitable for a React frontend that communicates with a Laravel API because it provides lightweight API authentication without requiring a complex OAuth setup.

### SSLCommerz

SSLCommerz is used as the payment gateway because it supports secure online payment processing and callback-based confirmation. It allows the application to initiate a payment session, verify success or failure, and finalize booking payment status on the backend.

---

## 4. Frontend Structure

### Frontend Organization

The frontend is organized into feature-based folders under `frontend/src`:

- `pages/` for screen-level routes
- `components/` for reusable UI parts
- `layouts/` for dashboard shells and shared structure
- `routes/` for route definitions and protection
- `utils/` for API services and local helper logic
- `hooks/` for custom React hooks

### Pages

The system includes public pages and role-based dashboard pages.

Public and shared screens include:

- Home page
- Login page
- Registration page
- Property details page
- Unauthorized page
- Not found page

Tenant screens include:

- Dashboard
- Browse properties
- Orders and booking requests
- Payment history
- Notifications
- Profile

Owner screens include:

- Owner dashboard
- Add property
- My properties
- Booking requests
- Notifications
- Payments
- Profile

Admin screens include:

- Admin dashboard
- User management
- Owner management
- Property management
- Booking management
- Payment and revenue views
- Notifications
- Profile

### Layouts

The layouts provide persistent navigation and role-specific dashboard structure. They keep the sidebar, top bar, and content area consistent across dashboard pages.

### Components

Reusable components include:

- Navbar
- Hero section
- Property cards
- Footer
- Notification dropdown
- Sidebars
- Dashboard widgets
- Avatar and image helpers

### Reusable UI

The frontend uses reusable property cards, dashboard boxes, and notification elements so that the same visual logic can be reused across home, browse, admin, owner, and tenant screens.

### Routing Structure

The routing system uses public routes and protected routes. It also includes role-based route guards to separate admin, owner, and tenant spaces.

### Dashboard Structure

Each dashboard is structured around the same pattern:

- A sidebar for navigation
- A top area for profile and notifications
- A main content area for analytics, tables, cards, and forms

### Static Pages

These pages are mostly static or fallback-oriented:

- Unauthorized page
- Not found page
- Some legacy content pages that are not part of the main workflow

### Dynamic Pages

These pages are backend-driven or data-driven:

- Home page
- Browse page
- Property details page
- Booking/order page
- Payment history
- Notifications
- Admin dashboard pages
- Owner dashboard pages
- Tenant dashboard pages

### Backend Connected Pages

These pages clearly depend on API data:

- Home page property feed
- Property browse and detail pages
- Booking and order pages
- Admin dashboard statistics and notifications
- Owner property and booking pages
- Tenant booking and payment pages
- Notification panels

### Frontend Design Observation

The current frontend is functional and role-aware, but several pages still use mixed rendering patterns, fallback data, or older UI assumptions. The system is already much more dynamic than the original project summary, especially in the home, booking, payment, and notification areas.

---

## 5. Backend Structure

### Routes

The backend route layer is organized through Laravel API routes. The main route file defines versioned APIs for authentication, properties, bookings, payments, notifications, invoices, home data, and admin functions.

### Controllers

Important controllers include:

- Authentication controller
- Property controller
- Booking controller
- Payment controller
- Notification controller
- Invoice controller
- User controller
- Admin dashboard controller

### Middleware

Middleware is used to protect route groups and enforce role access. Admin-only functionality is separated through admin middleware, while authenticated API endpoints use token-based authorization.

### Models

The core models represent the business entities of the system:

- User
- Property
- Booking
- Payment
- Notification
- BookingRefund

### API Structure

The API is structured around business modules rather than a single flat endpoint set. This makes it easier to maintain and extend:

- Authentication API
- Property API
- Booking API
- Payment API
- Notification API
- Invoice API
- Admin API
- Home aggregation API

### Authentication Flow

The backend issues access tokens after registration or login. The frontend sends the token as a bearer token on each request. Protected routes verify identity and role before allowing access.

---

## 6. Database Analysis

### Main Tables

#### users

Stores user identity and role information such as name, email, phone, password, role, and account status.

#### properties

Stores property details published by owners, including title, description, category, location, price, media, and occupancy status.

#### bookings

Stores booking requests, approval state, cancellation state, payment-related values, and refund-related values.

#### payments

Stores payment records, payment status, payment method, transaction ID, owner earnings, and admin commission.

#### notifications

Stores system notifications for users, including read state and notification type.

#### booking_refunds

Stores refund settlement information, refund PDF file path, status, and ownership/tenant reference.

#### invoices / invoice output

Invoice data is generated from payment records and booking records, with PDF documents produced on demand rather than always stored as a standalone master table.

### Relationships

- One user can own many properties
- One user can create many bookings as a tenant
- One property can have many bookings over time
- One booking can have one payment record
- One booking can have one refund record
- One user can have many notifications
- One payment belongs to one booking, one tenant, and one property

### Foreign Keys

The system uses foreign keys to preserve data consistency between properties, users, bookings, payments, notifications, and refunds. These links are essential for reporting, ownership validation, and payment tracking.

### Normalization

The database is reasonably normalized because each main business entity is separated into its own table. Repeated data is reduced by linking records through IDs instead of storing large duplicated blobs of information.

### Optimization Suggestions

- Index frequently filtered columns such as role, status, created_at, property_id, booking_id, and user_id
- Add direct occupancy timestamps if occupancy reporting becomes more detailed
- Add a dedicated cancellation reason field for analytics
- Add stronger audit fields for admin actions and status changes
- Consider formal invoice persistence if historical invoice querying becomes heavy

### Important Database Observations

The current codebase already supports more than the original summary suggested. It includes booking records, payment records, notification records, and refund records. This means the project is no longer just a UI flow; it is a real transactional system.

---

## 7. Authentication Flow

### Registration

Users register through the Laravel API. A new user record is created and a token is returned for authenticated access.

### Login

Login verifies the user credentials and checks account status. If the account is blocked or inactive, login is rejected.

### Role Management

Roles are used to separate permissions and dashboards:

- Admin
- Owner
- Tenant

### Sanctum Token Flow

After login, the frontend stores the token and sends it in the Authorization header. Every protected API request uses the token to verify identity.

### Protected Routes

Route guards ensure that users can only see pages that match their role. This protects admin pages from tenants and owner pages from unauthorized access.

---

## 8. Property Flow

### Owner Adds Property

The owner creates a property record through the owner dashboard. The backend stores the listing in the properties table.

### Tenant Views Property

Tenants browse properties from the home page and browse pages. Property cards and detail views are loaded from backend data.

### Booking Process

When a tenant selects a property, the booking flow begins from the property detail and order pages. The tenant submits request details, and the booking is stored in the database.

### Occupied Status Logic

Occupied status is determined from property status and booking/payment state. Once a payment is finalized, the property is marked occupied so it can still be shown but not incorrectly booked again.

---

## 9. Booking Flow

### Booking Request

The tenant submits a booking request for a property. The booking record is created and linked to the tenant and property.

### Approval

The owner or the workflow logic can approve or reject the booking depending on the current process.

### Payment

If the booking proceeds, payment is initiated through SSLCommerz.

### Cancellation

The booking can be cancelled within the allowed policy window. Cancellation updates booking status and creates refund-related records.

### Refund

Refund values, owner share, and admin share are calculated, then stored for audit and PDF generation.

---

## 10. Payment System

### SSLCommerz Integration

SSLCommerz is used to create a payment session and handle success, fail, cancel, and IPN callback responses.

### Payment Verification

Payment verification happens on the backend using callback data and transaction ID checks. This is important because payment state should not depend only on the frontend.

### Payment History

Tenant payment history is available through dashboard pages and API-backed lists.

### Invoice Generation

Once payment is successful, the system can generate a PDF invoice for the completed booking.

### Payment Lifecycle

1. Booking is created
2. Payment session is initialized
3. Gateway callback returns success or failure
4. Backend updates payment record
5. Booking is marked paid if successful
6. Property status becomes occupied

---

## 11. Refund & Cancellation System

### 20-Day Cancellation Policy

The project includes a cancellation policy concept that allows refunds only within the permitted day window. This is important for fairness and business control.

### Refund Calculation

Refund logic divides the amount between refund amount, owner share, and admin share according to the project rules.

### Admin Share

The admin share represents the platform service or commission side of the refund settlement.

### Owner Share

The owner share represents the owner’s portion in the refund or settlement workflow.

### Refund Document Generation

Refund records can produce a PDF document for formal proof and audit purposes.

### Cancellation Effects

- Booking status changes
- Payment status updates
- Property can become available again if the cancellation is valid
- Notifications are generated
- Refund documentation is produced

---

## 12. Notification System

### Unread Notifications

Unread notification counts are tracked and displayed in dashboard and bell interfaces.

### Dashboard Notifications

Admin, owner, and tenant dashboards all include notification-related screens or feeds.

### Bell Icon System

The top navigation includes a notification bell pattern that shows recent messages and unread counts. The current notification UI is functional, though the admin bell flow and global role-unified behavior can still be improved further.

### Mark-as-Read Logic

Notifications can be marked as read individually or in bulk. This helps users manage large notification lists efficiently.

### Notification Sources

Notifications are created from events such as:

- Booking requests
- Booking approvals or rejections
- Payment completions
- Booking cancellations

---

## 13. Invoice & PDF System

### Invoice Generation

Invoices are generated from booking and payment records after payment completion.

### PDF Download

The system supports PDF invoice download so users can keep payment records offline.

### Refund PDF

Refunds can also generate PDF documents for documentation and dispute handling.

### Booking Invoice

Each completed booking can be represented as an invoice tied to the payment and booking record.

---

## 14. Dashboard Analysis

### Admin Dashboard

The admin dashboard is the most system-wide view. It displays platform statistics, property moderation data, user management data, payment summaries, and notification feeds.

#### Dynamic Elements

- Total counts
- User activity summaries
- Property records
- Booking/payment summaries
- Notification feeds

#### Backend Connected

Yes, the admin dashboard is connected to backend APIs and is not purely static.

#### Missing Functionality

- A durable admin notification inbox could be more structured
- More analytical charts could be added
- More granular audit logs would improve accountability

### Owner Dashboard

The owner dashboard supports property publishing, property editing, booking-related views, payment-related views, and owner notifications.

#### Dynamic Elements

- Property list
- Property counts
- Booking requests
- Payment-related records

#### Backend Connected

Yes, owner views are data-driven through backend property and booking services.

#### Missing Functionality

- Better property analytics
- More detailed booking decision history
- Richer performance widgets for owners

### Tenant Dashboard

The tenant dashboard focuses on saved houses, property browsing, booking requests, notifications, and payment history.

#### Dynamic Elements

- Orders
- Payments
- Notifications
- Profile data

#### Backend Connected

Yes, tenant dashboard pages are connected to backend data and route protection.

#### Missing Functionality

- More personalized recommendation logic
- More robust saved-property persistence if local fallback is removed

---

## 15. API Analysis

### API List

The project already includes APIs for:

- Authentication
- Properties
- Bookings
- Payments
- Notifications
- Invoices
- Home summary data
- Admin dashboard data
- User management

### Used APIs

Most major UI sections are already backed by API calls, especially:

- Home property feed
- Property details
- Booking creation
- Payment processing
- Notifications
- Admin dashboard data
- Owner and tenant dashboard data

### Missing APIs

- A dedicated persisted admin notification inbox API
- A dedicated analytics API for long-term trends
- A dedicated audit log API
- A richer recommendation API
- A more explicit payment reconciliation API

### Broken or Fragile API Areas

- Some flows still depend on multiple route conventions
- Some frontend utilities use fallback behavior that can hide backend issues
- Notification behavior can differ between roles depending on UI entry point

### Improvement Suggestions

- Standardize route versioning more strictly
- Add paginated response standards
- Add API resource transformers for consistent JSON
- Add centralized error formats
- Add dedicated analytics and audit endpoints

---

## 16. Security Analysis

### Authentication Security

Authentication uses token-based protection through Sanctum. This is suitable for API-driven applications.

### Route Protection

Protected routes prevent unauthenticated or unauthorized access to role-based pages.

### Validation

Laravel request validation is used to protect input forms and reduce invalid data submission.

### SQL Injection Protection

Laravel’s query builder and Eloquent ORM help reduce SQL injection risk by parameterizing queries.

### XSS Prevention

Using React for the frontend helps reduce direct DOM injection risks, provided data is rendered safely and user input is validated.

### Additional Security Strengths

- Account status blocking
- Permission checks before payment, invoice, and notification access
- Backend-side payment verification
- Role-based route guards

### Security Improvements Recommended

- Add stricter rate limiting on auth endpoints
- Add stronger audit logging for admin actions
- Add more server-side ownership checks where needed
- Improve upload validation and file handling rules

---

## 17. Problems Found

### Duplicate Components

The project previously contained duplicated or repeated homepage content patterns. Some of this has already been cleaned up, but reusable content blocks still need careful coordination.

### Missing Backend Connection

Some legacy or fallback UI sections are still less connected than the main booking/payment flow.

### Broken Routes

The application contains route compatibility layers. This is useful for migration, but it increases maintenance complexity.

### Missing Columns

Depending on future features, additional columns for occupancy history, audit logs, and richer cancellation metadata may still be needed.

### Image Loading Issues

Some property and avatar images rely on path normalization, placeholder fallback, or local resolution. Broken media links can still occur when storage paths are missing or inconsistent.

### Payment/Refund Issues

- Payment success depends on proper callback delivery
- Refund logic depends on correct booking status transitions
- Payment and refund state must remain synchronized

### Scalability Problems

- Mixed backend and localStorage data can become hard to maintain at scale
- Notification generation could be made more persistent
- Analytics should eventually move to dedicated aggregated queries or reporting tables

---

## 18. Recommended Improvements

### Optimization

- Add indexes to high-traffic tables
- Paginate large notification and booking lists
- Cache frequently requested home and dashboard summaries

### Performance

- Reduce redundant API calls
- Use API resource formatting consistently
- Avoid unnecessary localStorage dependency for critical data

### UX/UI

- Add richer loading and empty states
- Improve dashboard analytics cards
- Make notification handling more consistent across roles
- Strengthen mobile responsiveness in dashboard layouts

### Backend Improvements

- Add a unified notification event service
- Add audit logs for admin and owner actions
- Add a more formal refund reconciliation module
- Add stronger reporting endpoints

### Database Improvements

- Add missing reporting and history fields where needed
- Consider a formal invoice table if reporting grows
- Add more indexed timestamps for search and filtering

### Security Improvements

- Add throttling on authentication and payment endpoints
- Expand ownership validation checks
- Sanitize file upload handling
- Improve permission auditing for sensitive actions

---

## 19. Final Year Project Report Help

### Abstract Idea

BashaLagbe is a digital house rental management platform that automates property listing, booking, payment, refund handling, invoice generation, and dashboard monitoring for tenants, owners, and admins.

### Introduction Idea

The introduction should explain how the project replaces manual house-rental coordination with a centralized web-based system.

### Literature Review Idea

Compare manual rental processes, real estate portals, booking systems, and digital payment-enabled platforms.

### Methodology Idea

Explain the use of React for the UI, Laravel for the API, MySQL for data storage, Sanctum for authentication, and SSLCommerz for payment processing.

### Implementation Idea

Describe modules for authentication, property management, booking, payment, refund, notifications, and dashboard analytics.

### Testing Idea

Include tests for login, protected routes, booking creation, payment success, refund handling, notification read state, and invoice downloads.

### Conclusion Idea

Conclude that the system improves transparency, automation, and usability in the house rental process.

### Future Work Idea

Possible future enhancements include chat, recommendation engine, map integration, advanced reporting, and mobile app support.

---

## 20. Diagram Explanation

### Use Case Diagram

Show the interactions of admin, owner, and tenant with the system.

### ER Diagram

Show users, properties, bookings, payments, notifications, and refunds with their foreign key relationships.

### Class Diagram

Show the controllers, models, middleware, and service layer relationships.

### Sequence Diagram

Show booking request, approval, payment gateway call, callback response, and completion flow.

### Activity Diagram

Show the step-by-step process of browsing, booking, paying, cancelling, and refunding.

### Deployment Diagram

Show browser frontend, Laravel backend, MySQL database, and SSLCommerz gateway.

### Data Flow Diagram

Show how user input moves through frontend, API, database, and back to the dashboard.

---

## 21. Defense Preparation

### Viva Questions

1. What problem does BashaLagbe solve?
2. Why did you use React and Laravel together?
3. How does Sanctum work in your project?
4. How is booking stored and processed?
5. How is payment verified?
6. What happens after a successful payment?
7. How do refund and cancellation work?
8. How are notifications generated?
9. How is invoice PDF generated?
10. How do role-based routes protect the system?

### Short Answers

1. It centralizes house rental operations.
2. React handles dynamic UI while Laravel provides a strong API backend.
3. Sanctum issues bearer tokens for authenticated API access.
4. Booking is stored in the bookings table and linked to property and tenant.
5. Payment is verified through backend callback handling and transaction IDs.
6. The booking becomes paid and the property can become occupied.
7. Refund data is calculated and stored with a PDF document.
8. Notifications are created on booking and payment events.
9. Invoice PDFs are generated from booking/payment records.
10. Protected routes and middleware separate admin, owner, and tenant access.

### Technical Explanation Topics

- API authentication
- Booking lifecycle
- Payment gateway callbacks
- Refund rules
- Dashboard aggregation
- Notification state management

### Database Explanation Topics

- Table relationships
- Foreign keys
- Booking and payment linkage
- Refund tracking
- Normalization strategy

### API Explanation Topics

- Route grouping
- Controller responsibilities
- Versioned endpoints
- Role-based access
- Payment callback endpoints

---

## 22. Presentation Preparation

### Slide Titles

1. Title Slide
2. Problem Statement
3. Project Objectives
4. Technology Stack
5. System Architecture
6. User Roles
7. Database Design
8. Booking Workflow
9. Payment Workflow
10. Refund Workflow
11. Notification System
12. Dashboard Overview
13. Security Features
14. Testing Results
15. Conclusion
16. Future Enhancements

### Defense Structure

The defense should follow a clear story:

- What the problem is
- Why the project matters
- How the system works
- How the database supports it
- How payments and refunds are handled
- How security and roles are enforced

### Presentation Flow

Start with the problem, then show architecture, then demonstrate user flows, then explain the database and APIs, and finally conclude with testing and future work.

### Demo Explanation

The live demo should show:

- Login
- Browse properties
- View property details
- Create booking request
- Show payment flow
- Show dashboard notifications
- Show invoice or refund output

---

## Complete System Workflow

1. User registers or logs in.
2. Sanctum token is created and stored on the frontend.
3. User enters the role-based dashboard or public browsing area.
4. Tenant searches and views properties.
5. Tenant requests a booking.
6. Booking is recorded in the database.
7. Owner and admin receive notifications.
8. Booking proceeds to payment if approved.
9. SSLCommerz processes the payment.
10. Backend verifies the callback and updates payment status.
11. Booking becomes paid and property status becomes occupied.
12. Invoice can be downloaded.
13. If the booking is cancelled within policy, refund data and PDF are generated.
14. Notifications update read state as users interact with them.
15. Admin monitors all activity from the dashboard.

---

## End-to-End User Flow

### Tenant Flow

Browse home page -> open property -> view details -> create booking -> complete payment -> see invoice -> track notifications and order history.

### Owner Flow

Login -> view owner dashboard -> add property -> manage listing -> receive booking/payment notifications -> update profile.

### Admin Flow

Login -> open admin dashboard -> monitor users and properties -> review bookings and payments -> manage notifications -> oversee overall platform health.

---

## Final Project Summary

BashaLagbe is a practical and scalable house rental management system that combines property publishing, booking workflow, payment processing, refund handling, invoice generation, and dashboard-based administration into a single web application. It is built using a modern React frontend, a Laravel API backend, a MySQL relational database, Sanctum authentication, and SSLCommerz payment integration.

The system is suitable for a final year project because it demonstrates:

- Full-stack development
- Role-based access control
- Real business workflow automation
- Database-driven design
- Payment gateway integration
- Document generation
- Notification management
- Dashboard analytics

The application is already strong enough to present as a real-world rental platform. Its main strengths are the structured database, the role-based dashboards, the backend-driven booking/payment lifecycle, and the practical integration of invoices and refunds.

### Overall Assessment

The project is functional, academically strong, and business-relevant. With future improvements in analytics, audit logging, and notification persistence, it can evolve into a production-grade rental management platform.
