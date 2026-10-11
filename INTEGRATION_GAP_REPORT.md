# Student Organization System — Integration Gap Report & Backend Alignment Plan

**Date:** October 11, 2026  
**Document Status:** Complete Analysis & Gap Matrix  
**Source of Truth:** `Docx/API_contract.md` & `prisma/schema.prisma`  
**Target Database:** PostgreSQL 18 (`student_org_db`)  

---

## 1. Executive Summary & Repository Inspection

### 1.1 Architecture & Stack Confirmation
- **Frontends:**
  - `frontend/home-page/`: Vanilla JavaScript + CSS. Public catalogue for events and merchandise, dynamic search, category filters, 3-step ticket booking modal with simulated UPI/Card/Netbanking gateway, sliding shopping bag drawer.
  - `frontend/member/`: Vanilla JavaScript + CSS. Member portal featuring dashboard metric cards, digital membership pass, event booking, merchandise ordering, announcements feed, and ticket pass QR viewer.
  - `frontend/user/`: Vanilla JavaScript + CSS. Volunteer operations desk featuring check-in barcode scanner terminal, walk-in registration, attendee roster, and task assignment board.
  - `frontend/admin/`: Vanilla JavaScript + CSS. System administrator login gateway.
  - `frontend/manager/`: Next.js 14 (React) + Tailwind CSS management dashboard for admins and executive board. Includes event creation/management, merchandise inventory, volunteer task management, and finance accounting.
- **Backend:**
  - Node.js + Express.js REST API (`backend/src/`).
  - Architecture: Routes → Controllers → Services → Prisma ORM → PostgreSQL (`student_org_db`).
  - Authentication: JWT (`Authorization: Bearer <token>`) + bcryptjs (cost factor 10), role-based middleware (`authenticate`, `authorize`, `requireVolunteer`).
  - Strict Business Invariant: An `ADMIN` cannot simultaneously be a `VOLUNTEER`. Only users with `role = 'MEMBER'` can have `isVolunteer = true`.

### 1.2 Working Baseline Backend Endpoints
The following endpoints are implemented, tested with 21 automated tests, and verified:
- `GET /api/health`
- `POST /api/auth/register` (defaults to `role: 'MEMBER'`, `isVolunteer: false`)
- `POST /api/auth/login` (rate-limited, returns token and user payload)
- `POST /api/auth/logout` (stateless acknowledgement)
- `GET /api/auth/me` (requires Bearer JWT, returns authenticated user)

---

## 2. Integration Gap Matrix

| # | Feature / Action | Required API Endpoint | HTTP Method | API Contract Status | Backend Implementation Status | Database Model / Fields | Resolution Plan |
|---|---|---|---|---|---|---|---|
| **1** | Self Profile Update | `/api/users/me` | PATCH | Documented (Sec 3.5) | Missing | `User` (`name`, `phone`) | Implement controller & route; reject role tampering. |
| **2** | List Users (Admin) | `/api/users` | GET | Documented (Sec 3.6) | Missing | `User` | Implement paginated search & role filtering. |
| **3** | Update User Role | `/api/users/:id/role` | PATCH | Documented (Sec 3.8) | Missing | `User` (`role`, `isVolunteer`) | Enforce Admin-Volunteer exclusivity rule. |
| **4** | Current Membership Status | `/api/memberships/me` | GET | Documented (Sec 4.1) | Missing | `Membership` (`userId`, `status`, `expiryDate`) | Calculate `daysRemaining` and renewal eligibility. |
| **5** | Apply / Renew Membership | `/api/memberships` | POST | Documented (Sec 4.2) | Missing | `Membership` | Server calculates annual fee; starts as `PENDING`. |
| **6** | List Memberships (Admin) | `/api/memberships` | GET | Documented (Sec 4.3) | Missing | `Membership` | Paginated listing with status filter. |
| **7** | Review Membership Status | `/api/memberships/:id/status` | PATCH | Documented (Sec 4.5) | Missing | `Membership`, `Transaction` | Only activate after confirmed payment. |
| **8** | Expiring Memberships | `/api/memberships/expiring` | GET | Documented (Sec 4.6) | Missing | `Membership` | Dynamically query `expiryDate <= NOW() + days`. |
| **9** | List Events | `/api/events` | GET | Documented (Sec 5.1) | Legacy/Mock only | `Event`, `Ticket` | Refactor to Prisma; compute `effectivePrice`, `ticketsSold`, and `seatsRemaining`. |
| **10** | Get Event Details | `/api/events/:id` | GET | Documented (Sec 5.2) | Legacy/Mock only | `Event` | Return full event details + dynamic pricing. |
| **11** | Create Event (Admin) | `/api/events` | POST | Documented (Sec 5.3) | Missing | `Event` | Enforce admin role and input validation. |
| **12** | Update Event (Admin) | `/api/events/:id` | PATCH | Documented (Sec 5.4) | Missing | `Event` | Partial field updates. |
| **13** | Delete Event (Admin) | `/api/events/:id` | DELETE | Documented (Sec 5.5) | Missing | `Event` | Reject if paid tickets exist (409 Conflict). |
| **14** | Book Event Ticket | `/api/events/:id/tickets` | POST | Documented (Sec 5.6) | Legacy/Mock only | `Ticket` (`status: RESERVED`) | Transactionally verify capacity, generate ticket code. |
| **15** | User Tickets | `/api/tickets/me` | GET | Documented (Sec 5.7) | Missing | `Ticket` + `Event` | Return user's tickets with event details. |
| **16** | Cancel Ticket | `/api/tickets/:id/cancel` | PATCH | Documented (Sec 5.9) | Missing | `Ticket` | Owner or admin can cancel; free 1 seat. |
| **17** | Ticket Check-in | `/api/tickets/check-in` | POST | Documented (Sec 5.10) | Missing | `Ticket` (`CHECKED_IN`) | Volunteer / Admin only; reject duplicate or unpaid. |
| **18** | Event Attendance Summary | `/api/events/:id/attendance` | GET | Documented (Sec 5.11) | Missing | `Event`, `Ticket` | Compute capacity, check-in rate, and total revenue. |
| **19** | List Products | `/api/products` | GET | Documented (Sec 6.1) | Legacy/Mock only | `Product`, `ProductVariant` | Include variants, stock quantities, and availability. |
| **20** | Get Product Details | `/api/products/:id` | GET | Documented (Sec 6.2) | Legacy/Mock only | `Product`, `ProductVariant` | Single product with size variant details. |
| **21** | Create Product (Admin) | `/api/products` | POST | Documented (Sec 6.3) | Missing | `Product`, `ProductVariant` | Create product and variants in transaction. |
| **22** | Update Product (Admin) | `/api/products/:id` | PATCH | Documented (Sec 6.4) | Missing | `Product` | Partial product update. |
| **23** | Add Product Variant | `/api/products/:id/variants` | POST | Documented (Sec 6.6) | Missing | `ProductVariant` | Enforce unique size constraint. |
| **24** | Update Variant Stock | `/api/products/:pId/variants/:vId` | PATCH | Documented (Sec 6.7) | Missing | `ProductVariant` (`stockQuantity`) | Update inventory count. |
| **25** | Low Stock Alerts | `/api/products/low-stock` | GET | Documented (Sec 6.8) | Missing | `ProductVariant` | Query variants where stock <= threshold. |
| **26** | Place Order | `/api/orders` | POST | Documented (Sec 6.9) | Missing | `Order`, `OrderItem`, `ProductVariant` | Atomic stock reservation, server pricing, `PENDING`. |
| **27** | User Orders | `/api/orders/me` | GET | Documented (Sec 6.10) | Missing | `Order` + `OrderItem` | Return authenticated user's order history. |
| **28** | List Orders (Admin) | `/api/orders` | GET | Documented (Sec 6.12) | Missing | `Order` | Paginated orders with status filtering. |
| **29** | Cancel Order | `/api/orders/:id/cancel` | PATCH | Documented (Sec 6.14) | Missing | `Order`, `ProductVariant` | Replenish stock inside database transaction. |
| **30** | List Tasks (Admin) | `/api/tasks` | GET | Documented (Sec 7.1) | Missing | `VolunteerTask` | Paginated tasks with status/event filter. |
| **31** | Open Task Opportunities | `/api/tasks/opportunities` | GET | Documented (Sec 7.2) | Missing | `VolunteerTask` | Filter `assigneeId == null && status == PENDING`. |
| **32** | My Assigned Tasks | `/api/tasks/me` | GET | Documented (Sec 7.3) | Missing | `VolunteerTask` | Volunteer role check; return assigned tasks. |
| **33** | Create Task (Admin) | `/api/tasks` | POST | Documented (Sec 7.4) | Missing | `VolunteerTask` | Verify assignee is eligible volunteer (not admin). |
| **34** | Update Task Status | `/api/tasks/:id/status` | PATCH | Documented (Sec 7.5) | Missing | `VolunteerTask` | Assigned volunteer or admin can update status. |
| **35** | Assign Task (Admin) | `/api/tasks/:id/assign` | PATCH | Documented (Sec 7.6) | Missing | `VolunteerTask` | Reject admin assignees (422 Unprocessable). |
| **36** | List Announcements | `/api/announcements` | GET | Documented (Sec 8.1) | Missing | `Announcement` | Role-based filtering (`ALL`, `MEMBERS`, `VOLUNTEERS`). |
| **37** | Create Announcement | `/api/announcements` | POST | Documented (Sec 8.3) | Missing | `Announcement` | Admin only; store `publishedById`. |
| **38** | Mock Payment Confirm | `/api/payments/mock-confirm` | POST | Documented (Sec 9.1) | Missing | `Ticket`, `Order`, `Membership`, `Transaction` | Atomic transaction; creates financial ledger row. |
| **39** | Financial Summary | `/api/finance/summary` | GET | Documented (Sec 10.1) | Missing | `Transaction` | Aggregates income, expenses, and net balance. |
| **40** | List Transactions | `/api/finance/transactions` | GET | Documented (Sec 10.2) | Missing | `Transaction` | Ledger entries with pagination and category filter. |
| **41** | Record Manual Transaction | `/api/finance/transactions` | POST | Documented (Sec 10.3) | Missing | `Transaction` | Admin manual income or expense entry. |
| **42** | Submit Reimbursement | `/api/reimbursements` | POST | Documented (Sec 10.4) | Missing | `Reimbursement` | Member submits expense claim (`PENDING`). |
| **43** | User Reimbursements | `/api/reimbursements/me` | GET | Documented (Sec 10.5) | Missing | `Reimbursement` | Return member's claims. |
| **44** | Review Reimbursement | `/api/reimbursements/:id/status` | PATCH | Documented (Sec 10.7) | Missing | `Reimbursement`, `Transaction` | On `PAID`, atomically create `EXPENSE` transaction. |
| **45** | Admin Dashboard Summary | `/api/dashboard/admin` | GET | Documented (Sec 11.1) | Missing | Dynamic aggregation | Consolidates members, events, volunteers, finances. |
| **46** | Volunteer Dashboard | `/api/dashboard/volunteer` | GET | Documented (Sec 11.2) | Missing | Dynamic aggregation | Assigned tasks, check-in permission, reimbursements. |
| **47** | Member Dashboard | `/api/dashboard/member` | GET | Documented (Sec 11.3) | Missing | Dynamic aggregation | Membership validity, myTickets, orders, notices. |

---

## 3. Implementation Plan & Order of Priority

Following the prompt's mandated priority sequence:

1. **Priority 1: User Profile & Membership Management**
   - Routes: `backend/src/routes/users.routes.js`, `backend/src/routes/memberships.routes.js`
   - Services: `users.service.js`, `memberships.service.js`
   - Validators: `users.validator.js`, `memberships.validator.js`
   - Endpoints: `PATCH /api/users/me`, `GET /api/users`, `PATCH /api/users/:id/role`, `GET /api/memberships/me`, `POST /api/memberships`, `GET /api/memberships`, `PATCH /api/memberships/:id/status`, `GET /api/memberships/expiring`.

2. **Priority 2: Events, Tickets, Check-In & Payment Confirmation**
   - Routes: Refactor `events.routes.js`, add `tickets.routes.js`, `payments.routes.js`
   - Services: `events.service.js`, `tickets.service.js`, `payments.service.js`
   - Endpoints: `GET /api/events`, `GET /api/events/:id`, `POST /api/events`, `PATCH /api/events/:id`, `DELETE /api/events/:id`, `POST /api/events/:id/tickets`, `GET /api/tickets/me`, `PATCH /api/tickets/:id/cancel`, `POST /api/tickets/check-in`, `GET /api/events/:id/attendance`, `POST /api/payments/mock-confirm`.

3. **Priority 3: Merchandise Products, Variants, Inventory & Orders**
   - Routes: Refactor `products.routes.js`, add `orders.routes.js`
   - Services: `products.service.js`, `orders.service.js`
   - Endpoints: `GET /api/products`, `GET /api/products/:id`, `POST /api/products`, `PATCH /api/products/:id`, `DELETE /api/products/:id`, `POST /api/products/:id/variants`, `PATCH /api/products/:productId/variants/:variantId`, `GET /api/products/low-stock`, `POST /api/orders`, `GET /api/orders/me`, `GET /api/orders`, `PATCH /api/orders/:id/status`, `PATCH /api/orders/:id/cancel`.

4. **Priority 4: Volunteer Tasks & Opportunities**
   - Routes: `backend/src/routes/tasks.routes.js`
   - Services: `tasks.service.js`
   - Endpoints: `GET /api/tasks`, `GET /api/tasks/opportunities`, `GET /api/tasks/me`, `POST /api/tasks`, `PATCH /api/tasks/:id/status`, `PATCH /api/tasks/:id/assign`, `DELETE /api/tasks/:id`.

5. **Priority 5: Announcements**
   - Routes: `backend/src/routes/announcements.routes.js`
   - Services: `announcements.service.js`
   - Endpoints: `GET /api/announcements`, `GET /api/announcements/:id`, `POST /api/announcements`, `PATCH /api/announcements/:id`, `DELETE /api/announcements/:id`.

6. **Priority 6: Financial Ledger & Reimbursements**
   - Routes: `backend/src/routes/finance.routes.js`, `backend/src/routes/reimbursements.routes.js`
   - Services: `finance.service.js`, `reimbursements.service.js`
   - Endpoints: `GET /api/finance/summary`, `GET /api/finance/transactions`, `POST /api/finance/transactions`, `POST /api/reimbursements`, `GET /api/reimbursements/me`, `GET /api/reimbursements`, `PATCH /api/reimbursements/:id/status`.

7. **Priority 7: Dashboards & Aggregations**
   - Routes: `backend/src/routes/dashboard.routes.js`
   - Services: `dashboard.service.js`
   - Endpoints: `GET /api/dashboard/admin`, `GET /api/dashboard/volunteer`, `GET /api/dashboard/member`.

8. **Frontend Integration & Centralized Client**
   - Ensure `http://localhost:5000/api` is the uniform base URL.
   - Wire event/product data loaders and forms to real endpoints with fallback preservation.
   - Run complete end-to-end integration tests.
