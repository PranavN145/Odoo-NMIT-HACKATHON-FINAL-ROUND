# Database Design Specification: Student Organization Management System

## 1. Overview
This document specifies the database architecture, entity-relationship model, data constraints, and transactional business rules for the Student Organization Management System. It is built using **PostgreSQL 18** and **Prisma ORM (v6.19.3)**.

---

## 2. Requirements Traceability Matrix

| Req ID | Requirement Area | Source | Model / Fields | Relevant Endpoints | Verification | Status |
| :---: | :--- | :--- | :--- | :--- | :--- | :---: |
| **REQ-01** | Account Registration & Roles | PRD §4, memory.md | `User` (`role`, `isVolunteer`) | `POST /api/auth/register`, `GET /api/users` | Prisma Validation | **PASS** |
| **REQ-02** | Membership Validity & Dues | PRD §5.1, API §4 | `Membership` (`status`, `expiryDate`, `amountPaid`) | `GET /api/memberships/me`, `PATCH /api/memberships/:id` | Prisma Validation | **PASS** |
| **REQ-03** | Renewal Reminders | PRD §5.1, API §4.7 | `Reminder` (`recipientId`, `type`, `sentAt`) | `POST /api/memberships/:id/remind`, `POST /api/memberships/batch-remind` | Prisma Validation | **PASS** |
| **REQ-04** | Events & Capacity Limits | PRD §5.1, API §5 | `Event` (`capacity`, `memberPrice`, `standardPrice`, `status`) | `GET /api/events`, `POST /api/events` | Prisma Validation | **PASS** |
| **REQ-05** | Ticketing & Digital Check-In | PRD §5.1, API §5.6 | `Ticket` (`ticketCode`, `checkedInAt`, `checkedInById`, `@@unique([eventId, userId])`) | `POST /api/events/:id/tickets`, `POST /api/tickets/:id/check-in` | Prisma Validation | **PASS** |
| **REQ-06** | Merchandise & Size Stock | PRD §5.1, API §6 | `Product`, `ProductVariant` (`size`, `stockQuantity`, `@@unique([productId, size])`) | `GET /api/products`, `POST /api/products/:id/variants` | Prisma Validation | **PASS** |
| **REQ-07** | Merchandise Orders | PRD §5.1, API §6.9 | `Order`, `OrderItem` (`quantity`, `unitPrice`, `totalAmount`) | `POST /api/orders`, `GET /api/orders/:id` | Prisma Validation | **PASS** |
| **REQ-08** | Volunteer Task Assignment | PRD §5.1, API §7 | `VolunteerTask` (`assigneeId`, `eventId`, `deadline`, `status`) | `GET /api/tasks`, `POST /api/tasks` | Prisma Validation | **PASS** |
| **REQ-09** | Task Applications | API §7.5 | `TaskApplication` (`taskId`, `applicantId`, `status`, `@@unique([taskId, applicantId])`) | `POST /api/tasks/:id/apply`, `PATCH /api/tasks/applications/:id` | Prisma Validation | **PASS** |
| **REQ-10** | Announcements | PRD §5.1, API §8 | `Announcement` (`audience`, `content`, `publishedById`) | `GET /api/announcements`, `POST /api/announcements` | Prisma Validation | **PASS** |
| **REQ-11** | Traceable Financial Ledger | PRD §5.1, API §9 | `Transaction` (`type`, `category`, `amount`, `orderId?`, `ticketId?`, `membershipId?`, `reimbursementId?`) | `GET /api/finance/summary`, `POST /api/transactions` | Prisma Validation | **PASS** |
| **REQ-12** | Volunteer Reimbursements | PRD §5.1, API §9.4 | `Reimbursement` (`applicantId`, `receiptUrl`, `status`, `approvedById`) | `POST /api/reimbursements`, `PATCH /api/reimbursements/:id` | Prisma Validation | **PASS** |

---

## 3. Database Constraints vs Backend Business Rules

| Operational Rule | Enforced By | Mechanism |
| :--- | :--- | :--- |
| **Email Uniqueness** | Database | `@unique` on `User.email` |
| **Single Ticket per User/Event** | Database | `@@unique([eventId, userId])` on `Ticket` |
| **Single Size Variant per Product** | Database | `@@unique([productId, size])` on `ProductVariant` |
| **Single Task Application per Volunteer** | Database | `@@unique([taskId, applicantId])` on `TaskApplication` |
| **Preserving Financial History on Deletion** | Database | `onDelete: SetNull` on `Transaction` foreign keys |
| **Preventing Ticket Overselling** | Backend Transaction | `prisma.$transaction()` checks `validTickets < event.capacity` before insertion |
| **Preventing Inventory Overselling** | Backend Transaction | `prisma.$transaction()` checks `variant.stockQuantity >= orderQuantity` before deduction |
| **Member vs Non-Member Price Selection** | Backend Application Logic | Inspects `Membership.status == ACTIVE` to select `memberPrice` vs `standardPrice` |

---

## 4. Key Relationships Summary
- `User` 1:N `Membership` (Tracks validity history)
- `User` 1:N `Ticket` (Tickets held by user)
- `Event` 1:N `Ticket` (Tickets issued per event)
- `Product` 1:N `ProductVariant` (Size stock inventory)
- `Order` 1:N `OrderItem` (Line item details)
- `VolunteerTask` 1:N `TaskApplication` (Applications for tasks)
- `Transaction` N:1 `User` (Recorder) & optional links to `Order`, `Ticket`, `Membership`, `Reimbursement`

---

## 5. Decision Log
1. **User Hybrid Permissions:** Uses `Role { ADMIN, MEMBER }` + `isVolunteer: Boolean` on `User` so members can simultaneously volunteer.
2. **Event Lifecycle:** Added `EventStatus { DRAFT, PUBLISHED, COMPLETED, CANCELLED }` to support event management workflows.
3. **Traceable Accounting:** Financial transactions use explicit optional foreign keys (`orderId`, `ticketId`, `membershipId`, `reimbursementId`) with `onDelete: SetNull` to prevent historical audit corruption.
