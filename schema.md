# Database Schema — Student Organization System

## 1. Overview

The Student Organization System manages student memberships, events, event tickets, merchandise sales, volunteer tasks, announcements, and financial records.

**Database:** PostgreSQL  
**ORM:** Prisma  
**Architecture:** Node.js, Express.js REST API, and Next.js frontend.

The database is designed to keep the core features simple and suitable for the hackathon.

## 2. User Roles and Permissions

The system has two main user roles:

- **ADMIN:** Core members who manage the organization, events, memberships, merchandise, announcements, and finances.
- **MEMBER:** Registered students who can manage their own memberships, book event tickets, purchase merchandise, and participate in volunteer activities.

A member may also be a volunteer. However, **an admin cannot work as a volunteer**.

The `role` field identifies whether a user is an admin or a member. The `isVolunteer` field indicates whether a member is eligible to volunteer. The backend must ensure that admins cannot be assigned volunteer tasks or access volunteer-only operations.

## 3. Enums

### Role
- `ADMIN`
- `MEMBER`

### MembershipStatus
- `PENDING`
- `ACTIVE`
- `EXPIRED`
- `REJECTED`

### TicketStatus
- `RESERVED`
- `PAID`
- `CANCELLED`
- `CHECKED_IN`

### OrderStatus
- `PENDING`
- `PAID`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

### TaskStatus
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`
- `CANCELLED`

### TransactionType
- `INCOME`
- `EXPENSE`

### TransactionCategory
- `MEMBERSHIP_DUE`
- `TICKET_SALE`
- `MERCHANDISE_SALE`
- `EVENT_EXPENSE`
- `REIMBURSEMENT`
- `OTHER`

### ReimbursementStatus
- `PENDING`
- `APPROVED`
- `REJECTED`
- `PAID`

## 4. Database Models

### 4.1 User

Stores account details for admins and members.

**Fields:**
- `id` — Unique user ID (UUID, primary key)
- `name` — User's full name
- `email` — Email address (unique)
- `passwordHash` — Hashed password
- `phone` — Phone number (optional)
- `role` — ADMIN or MEMBER; defaults to MEMBER
- `isVolunteer` — Indicates whether the member can volunteer; defaults to false
- `createdAt` — Account creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- A user can have multiple memberships over time.
- A user can book multiple tickets.
- A user can place multiple merchandise orders.
- A user can be assigned multiple volunteer tasks.
- A user can submit multiple reimbursement requests.
- A user can publish announcements if authorized.
- A user can record financial transactions if authorized.

**Rule:** Only users with `role = MEMBER` may have `isVolunteer = true`.

### 4.2 Membership

Stores membership records and their validity.

**Fields:**
- `id` — Unique membership ID
- `userId` — ID of the member
- `startDate` — Membership start date
- `expiryDate` — Membership expiry date
- `amountPaid` — Amount paid for membership
- `status` — Membership status; defaults to PENDING
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- Each membership belongs to one user.
- A membership can be linked to financial transactions.

**Rule:** Membership eligibility is determined using the membership status and expiry date. The member price for an event can be calculated from this information.

### 4.3 Event

Stores organization events.

**Fields:**
- `id` — Unique event ID
- `title` — Event name
- `description` — Event details
- `date` — Event date and time
- `venue` — Event location
- `capacity` — Maximum attendee capacity
- `memberPrice` — Ticket price for eligible members
- `standardPrice` — Regular ticket price
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- An event can have multiple tickets.
- An event can have multiple volunteer tasks.

**Simplification:** The system does not store which user created an event. Admin authorization for creating and updating events is handled by the backend.

### 4.4 Ticket

Stores event bookings and check-in information.

**Fields:**
- `id` — Unique ticket ID
- `eventId` — Associated event ID
- `userId` — Ticket owner's user ID
- `ticketCode` — Unique ticket code
- `pricePaid` — Amount paid for the ticket
- `status` — Ticket status; defaults to RESERVED
- `checkedInAt` — Check-in timestamp (optional)
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- Each ticket belongs to one event.
- Each ticket belongs to one user.
- A ticket can be linked to a financial transaction.

**Constraints:**
- `ticketCode` must be unique.
- `eventId` and `userId` form a unique combination, allowing one ticket per user per event.

**Rule:** The backend must check event capacity before confirming a booking and prevent cancelled tickets from incorrectly blocking future bookings.

### 4.5 Product

Stores merchandise available for purchase.

**Fields:**
- `id` — Unique product ID
- `name` — Product name
- `basePrice` — Base product price
- `imageUrl` — Product image URL (optional)
- `isAvailable` — Whether the product is available; defaults to true
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- A product can have multiple product variants.

**Simplification:** No material-description feature is required. Product information is limited to its name, price, image, availability, and variants.

### 4.6 ProductVariant

Stores different sizes or variants of a merchandise product and their stock.

**Fields:**
- `id` — Unique variant ID
- `productId` — Associated product ID
- `size` — Product size or variant label
- `stockQuantity` — Available quantity; defaults to 0
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- Each variant belongs to one product.
- A variant can appear in multiple order items.

**Constraints:**
- The combination of `productId` and `size` must be unique.

### 4.7 Order

Stores merchandise orders placed by users.

**Fields:**
- `id` — Unique order ID
- `userId` — User who placed the order
- `totalAmount` — Total order amount
- `status` — Order status; defaults to PENDING
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- Each order belongs to one user.
- An order can contain multiple order items.
- An order can be linked to financial transactions.

### 4.8 OrderItem

Stores individual products and quantities within an order.

**Fields:**
- `id` — Unique order item ID
- `orderId` — Associated order ID
- `variantId` — Purchased product variant ID
- `quantity` — Number of units purchased
- `unitPrice` — Price per unit at the time of purchase

**Relationships:**
- Each order item belongs to one order.
- Each order item refers to one product variant.

**Rule:** Stock must be checked and updated safely when an order is confirmed. Cancelled orders should restore stock when appropriate.

### 4.9 VolunteerTask

Stores tasks assigned to eligible volunteers.

**Fields:**
- `id` — Unique task ID
- `title` — Task title
- `description` — Task details
- `assigneeId` — Assigned volunteer's user ID (optional)
- `eventId` — Related event ID (optional)
- `deadline` — Task deadline (optional)
- `status` — Task status; defaults to PENDING
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- A task can be assigned to one user or remain unassigned.
- A task may be associated with one event.

**Rule:** Only eligible members can be assigned volunteer tasks. Admins cannot be assigned these tasks.

**Simplification:** The system uses task assignment rather than a separate volunteer application and approval workflow.

### 4.10 Announcement

Stores announcements published by authorized users.

**Fields:**
- `id` — Unique announcement ID
- `title` — Announcement title
- `content` — Announcement message
- `audience` — Intended audience; defaults to ALL
- `publishedById` — ID of the user who published the announcement
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- Each announcement is associated with the user who published it.

**Rule:** Only authorized users can create, update, or delete announcements.

### 4.11 Transaction

Stores income and expense records for the organization's financial ledger.

**Fields:**
- `id` — Unique transaction ID
- `type` — INCOME or EXPENSE
- `category` — Transaction category
- `amount` — Transaction amount
- `description` — Short explanation of the transaction
- `recordedById` — ID of the user who recorded the transaction
- `orderId` — Related order ID (optional)
- `ticketId` — Related ticket ID (optional)
- `membershipId` — Related membership ID (optional)
- `reimbursementId` — Related reimbursement ID (optional)
- `createdAt` — Creation timestamp

**Relationships:**
- A transaction is recorded by one user.
- It may be linked to an order, ticket, membership, or reimbursement.

**Rule:** Financial records should be created consistently when the corresponding payment or expense is confirmed. The backend must avoid creating duplicate transactions for the same payment.

### 4.12 Reimbursement

Stores reimbursement requests submitted by members or eligible volunteers.

**Fields:**
- `id` — Unique reimbursement ID
- `applicantId` — User submitting the request
- `amount` — Requested reimbursement amount
- `reason` — Reason for the expense
- `receiptUrl` — Receipt image or document URL (optional)
- `status` — Reimbursement status; defaults to PENDING
- `approvedById` — Approving admin's user ID (optional)
- `createdAt` — Creation timestamp
- `updatedAt` — Last update timestamp

**Relationships:**
- Each reimbursement belongs to one applicant.
- An optional approver is associated with a user.
- A reimbursement can be linked to financial transactions.

**Rule:** An authorized admin reviews and approves or rejects requests. A transaction representing the payout should be recorded when the reimbursement is actually paid.

## 5. Relationship Summary

- **User → Membership:** One-to-many
- **User → Ticket:** One-to-many
- **Event → Ticket:** One-to-many
- **Event → VolunteerTask:** One-to-many
- **User → VolunteerTask:** One-to-many for assigned tasks
- **Product → ProductVariant:** One-to-many
- **ProductVariant → OrderItem:** One-to-many
- **User → Order:** One-to-many
- **Order → OrderItem:** One-to-many
- **User → Announcement:** One-to-many for published announcements
- **User → Transaction:** One-to-many for recorded transactions
- **User → Reimbursement:** One-to-many for submitted requests
- **Membership, Ticket, Order, and Reimbursement → Transaction:** Optional financial associations

## 6. Features Intentionally Excluded

To keep the project manageable, the following are not separate database features:

- Tracking which user created an event.
- Product material descriptions.
- Admin participation in volunteer tasks.
- A separate volunteer application and approval workflow.
- Separate database tables for dashboards and calculated statistics.
- Dedicated tables for scheduled membership reminders.
- Advanced inventory forecasting or automated low-stock alert history.
- A complex double-entry accounting system.

Dashboard totals, membership expiry lists, and low-stock lists can be calculated from the existing data when requested by the frontend.

## 7. Important Implementation Notes

1. **Authorization:** Backend routes must check user roles and volunteer eligibility. Hiding frontend buttons is not sufficient.
2. **Passwords:** Store only securely hashed passwords, never plain-text passwords.
3. **Money:** Use PostgreSQL decimal fields for prices and amounts. Return monetary values consistently through the API.
4. **Event capacity:** Check and reserve tickets safely to avoid exceeding capacity when multiple users book simultaneously.
5. **Inventory:** Update stock atomically to avoid selling more units than are available.
6. **Transactions:** Record income and expenses consistently and avoid duplicate financial entries.
7. **Data integrity:** Use appropriate foreign keys, unique constraints, and validation for required fields.
8. **Dashboards:** Calculate summary values from existing records rather than storing duplicate totals unnecessarily.
9. **Ticket cancellation:** Ensure cancelled tickets do not permanently prevent a user from booking the same event again.
10. **Schema changes:** Keep `schema.md`, `schema.prisma`, and `API_CONTRACT.md` consistent. Any change to the actual Prisma models should be reviewed by the team before implementation.

