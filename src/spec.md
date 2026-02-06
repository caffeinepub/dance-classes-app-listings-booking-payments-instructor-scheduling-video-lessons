# Specification

## Summary
**Goal:** Build a dance classes web app with Internet Identity login, role-based access (student/instructor/admin), class listings, session scheduling, booking with Stripe payments, and an on-demand video lessons library, with a cohesive dance-themed UI.

**Planned changes:**
- Add Internet Identity sign-in/out and backend user profiles keyed by Principal, including roles (student, instructor, admin) and role management by admins with a first-admin bootstrap.
- Implement backend CRUD and frontend browsing/search/filtering for a dance class catalog with class detail pages (cover image URL optional).
- Add instructor/admin schedule management for class sessions (date/time, capacity, location/online link), including remaining-spots tracking based on bookings; provide an instructor dashboard UI.
- Implement booking flow for signed-in students with persisted bookings, status lifecycle (pending_payment/confirmed/cancelled), double-booking prevention, capacity enforcement, “My Bookings,” and instructor rosters.
- Integrate Stripe Checkout for paying pending bookings, keeping Stripe secrets server-side, and confirming bookings + updating capacity after successful payment.
- Add an on-demand video lessons library with lesson metadata CRUD for instructors/admins and student browsing/filtering plus lesson detail playback.
- Apply a consistent, accessible visual theme suitable for a dance brand (not primarily blue/purple).
- Add and use generated static branding images from `frontend/public/assets/generated`, including in the header and landing/catalog area.

**User-visible outcome:** Users can browse classes and video lessons, sign in with Internet Identity to book scheduled sessions, pay via Stripe to confirm bookings, view/manage their bookings, and (if an instructor/admin) manage class listings, sessions, bookings rosters, and video lesson entries in a themed UI.
