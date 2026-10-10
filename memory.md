# Student Organization System — Project Memory

> Purpose: concise, evolving reference for project decisions. Distinguish verified decisions from proposals; update this file when implementation changes.

## Problem statement
Student organizations manage membership and dues, event tickets and attendance, announcements, merchandise, volunteer tasks, and finances across disconnected spreadsheets, notebooks, cash records, and messaging groups. This causes fragmented records, coordination problems, stock/payment confusion, and limited financial visibility.

## Objectives
- Centralize core organization operations in one web application.
- Track membership status, dues, benefits, expiry, and renewal reminders.
- Manage events, member/non-member ticket prices, capacity, ticket verification, and actual attendance.
- Manage merchandise orders, payments, and inventory by product size.
- Assign volunteer tasks and track progress.
- Publish announcements and retain their history.
- Record income, expenses, and volunteer reimbursements; report totals and balance.
- Enforce role-based access and protect private/financial data.

## User roles
- **Admin (Core Members):** manage users, memberships, events, ticket pricing/capacity, merchandise and inventory, announcements, volunteer tasks, transactions, reimbursements, and reports.
- **Member:** view own membership and benefits; browse announcements/events; purchase eligible tickets; order merchandise; view own order/payment status.
- **Volunteer:** view assigned tasks and event instructions; update task progress; support ticket verification and attendance when authorized; submit expense/reimbursement information if enabled.
- **Pending:** whether one account can hold both Member and Volunteer permissions.

## Key features
1. Authentication and role-based authorization.
2. Membership records, dues/payment status, validity, benefits, and renewal reminders.
3. Event management, member/non-member pricing, capacity controls, ticket records, digital verification, check-in, attendance and revenue reporting.
4. Merchandise catalogue, size-level stock, orders and payment status.
5. Volunteer opportunities, assignments, deadlines and progress tracking.
6. Announcements, audience targeting, mailing-list distribution and dated history.
7. Finance: membership/event/merchandise/fundraising income, expenses, reimbursements, and balance reporting.

## Agreed technology stack
- **Frontend:** Next.js + React
- **Styling:** Tailwind CSS
- **Backend:** Node.js + Express.js
- **API style:** REST APIs using JSON over HTTP/HTTPS
- **Database:** relational SQL database; PostgreSQL was previously selected in the project discussion
- **ORM:** Prisma
- **Authentication:** bcrypt for password hashing + JWT
- **API testing:** Postman

## Architecture decision
Proposed modular monolith: Next.js frontend → Express REST API (routes/controllers/services/middleware) → Prisma ORM → PostgreSQL. Backend authorization must protect every restricted operation. Email delivery and payment gateway are integrations, not confirmed implementations.

## Proposed project structure (not verified against an actual repository)
```text
student-organization-system/
├── frontend/
│   ├── app/                 # login/, admin/, volunteer/, member/
│   ├── components/
│   ├── lib/
│   └── styles/
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   └── validators/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   └── server.js
├── .gitignore
└── README.md
```

## Proposed database schema (not implemented/verified)
- `User`: id, name, email, password hash, account status; role/role assignments.
- `Membership`: id, user id, start date, expiry date, payment status.
- `Event`: id, title, description, date, venue, capacity, member price, standard price, status.
- `Ticket`: id, event id, user id, price, payment status, check-in status/identifier.
- `CheckIn`: ticket id, check-in time, staff user id.
- `Product`: id, name, description, price, status.
- `InventoryVariant`: product id, size, quantity available.
- `Order`: id, user id, total, payment status, order status.
- `OrderItem`: order id, product id/variant, quantity, unit price.
- `VolunteerTask`: id, title, assignee, deadline, status, progress.
- `Announcement`: id, title, content, audience, publication date.
- `Transaction`: id, category, amount, date, description, reference.
- `Reimbursement`: id, volunteer id, amount, evidence reference, review/payment status.
- Additional payment records/audit logs may be needed; exact fields and relations remain pending.

## Proposed REST API endpoints (not implemented/verified)
- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me`
- Users: `GET /api/users`, `PATCH /api/users/:id`
- Membership: `GET /api/memberships/me`, `PATCH /api/memberships/:id`
- Events: `GET /api/events`, `POST /api/events`, `GET /api/events/:id`
- Tickets: `POST /api/events/:id/tickets`, `POST /api/tickets/:id/check-in`
- Products/orders: `GET /api/products`, `POST /api/products`, `POST /api/orders`
- Volunteer tasks: `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id`
- Announcements: `GET /api/announcements`, `POST /api/announcements`
- Finance: `GET /api/finance/summary`, `POST /api/transactions`
- Reimbursements: `POST /api/reimbursements`, `PATCH /api/reimbursements/:id`

## Implementation progress
- Problem scope and Admin/Member/Volunteer responsibilities documented.
- PRD drafted.
- High-level system architecture drafted for the agreed stack.
- Proposed folder structure, data entities, and endpoint examples documented.
- **Backend foundation initialized and verified:**
  - Minimal Node.js + Express.js setup in `backend/` following modular structure (`backend/server.js`, `backend/src/app.js`, `backend/src/routes/health.routes.js`, `backend/src/middleware/notFoundHandler.js`, `backend/src/middleware/errorHandler.js`).
  - Health check endpoint `GET /api/health` implemented and verified (HTTP 200).
  - 404 handler and centralized error middleware implemented and verified.
  - Automated tests verified passing using Node built-in test runner (`npm test`).
  - Database, business features, authentication, and frontend remain not yet implemented.

## Important decisions and constraints
- Keep all PRD core modules in scope, including announcements, renewal reminders, member/non-member pricing, event capacity, actual attendance, size-wise stock, reimbursements, and financial reporting.
- Start with a modular monolith rather than microservices.
- Enforce permissions in backend middleware/services, not only in the UI.
- Use database transactions/constraints to prevent ticket overselling, duplicate check-ins, and inventory overselling.
- Calculate financial totals from traceable transaction records and define consistent treatment for pending payments, refunds, and reimbursements.
- QR ticketing is a proposed implementation option, not a confirmed requirement.

## Pending decisions / known issues
- Confirm repository layout against actual code.
- Confirm PostgreSQL as the final SQL database choice in the project configuration.
- Decide whether Member and Volunteer access can coexist on one account.
- Decide manual payment verification vs. payment gateway for MVP.
- Define ticket issuance/payment-confirmation policy and inventory reservation/deduction policy.
- Select email provider and reminder timing; mailing-list delivery is not verified as implemented.
- Define reimbursement approval permissions and exact database fields.
- No code-level defects or test failures have been verified because source code and test output were not available.

## Update rule
When the repository becomes available, inspect the actual files and tests before updating this document. Mark a feature as implemented only when supported by code or test evidence; keep proposals and undecided items clearly labelled.
