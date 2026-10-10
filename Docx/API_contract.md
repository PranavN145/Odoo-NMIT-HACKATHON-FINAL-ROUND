# Student Organization System — REST API Contract (Updated)



> **Document Status:** Updated for Hackathon Implementation  

> **Database:** PostgreSQL via Prisma  

> **Backend:** Node.js + Express.js REST API  

> **Frontend:** Next.js (React) + Tailwind CSS  

> **Base URL:** `/api`  

> **Content-Type:** `application/json`  

> **Authoritative Schema Reference:** [`schema.md`](./schema.md)



---



## 1. Global Architecture & API Conventions



### 1.1 Authentication & Role-Based Access Control (RBAC)

- **Token Delivery:** Bearer JWT sent only through the `Authorization: Bearer <token>` HTTP header. Do not use an authentication cookie in this API contract.

- **System Roles & Strict Invariants (per `schema.md`):**

  - `PUBLIC`: Unauthenticated visitors (access to login, registration, public event and product catalogues).

  - `MEMBER`: Registered students (`role = 'MEMBER'`). Can manage their own membership, purchase member/standard tickets, place merchandise orders, and view announcements.

  - `VOLUNTEER`: Active student volunteers. Defined strictly as `role = 'MEMBER'` with `isVolunteer = true`.

  - `ADMIN`: Core management team (`role = 'ADMIN'`). Manages events, products, orders, memberships, announcements, and finances.

- **Critical Role Boundary Rules:**

  - **Admin-Volunteer Exclusivity:** An `ADMIN` cannot work as a volunteer and cannot be assigned volunteer tasks. Only users with `role = 'MEMBER'` can have `isVolunteer = true`.

  - **Server-Side Enforcement:** Every route checks permissions server-side. Frontend button visibility is purely cosmetic.



### 1.2 Data Serialization Standards

- **Monetary Values:** All currency and price fields (`amountPaid`, `memberPrice`, `standardPrice`, `effectivePrice`, `basePrice`, `unitPrice`, `totalAmount`, `amount`, `balance`) must be serialized as JSON **strings with exactly two decimal places** (e.g. `"25.00"`). Prisma `Decimal` values must be serialized with `.toFixed(2)` or an equivalent decimal-safe conversion; do not convert monetary values to JavaScript floating-point numbers for calculations.

- **Timestamps:** Standard ISO 8601 UTC format (`YYYY-MM-DDTHH:mm:ss.sssZ`).

- **Identifiers:** Primary keys are UUIDv4 strings.



### 1.3 Payment, Pricing & Financial Rules

- **Pending until confirmed:** Creating a membership application, ticket reservation, or merchandise order does not mean payment succeeded. Do not mark any of these as paid or record income at creation time.
- **Ticket payment:** A ticket starts with `status: RESERVED`. After payment confirmation, update it to `PAID` and create one linked `INCOME` transaction in category `TICKET_SALE`.
- **Merchandise payment:** An order starts with `status: PENDING`. After payment confirmation, update it to `PAID` and create one linked `INCOME` transaction in category `MERCHANDISE_SALE`.
- **Membership payment:** A membership application starts with `status: PENDING` and `amountPaid: "0.00"` (or the schema's equivalent zero value). The backend calculates the fee from server-side membership pricing rules. After payment confirmation, store the confirmed amount in `amountPaid` and create one linked `INCOME` transaction in category `MEMBERSHIP_DUE`. The membership remains `PENDING` until an admin approves/activates it. The admin must not activate an unpaid membership.
- **Payment provider/demo mode:** Use a real provider confirmation or verified provider webhook when available. For the hackathon demo only, `POST /api/payments/mock-confirm` may simulate successful payment; disable or protect this mock route outside demo/development mode. The client must never be allowed to mark a resource paid merely by sending `status: "PAID"`.
- **Server-calculated prices:** Never trust client-submitted prices or totals. Calculate membership dues from configured server-side membership fee rules; tickets from the event's `memberPrice` or `standardPrice` based on the user's active membership; merchandise from server-side product prices and requested quantities. Reject invalid quantities and unavailable/sold-out items.
- **Idempotency:** Repeated confirmation requests must not create duplicate financial transactions, decrement stock again, or apply a payment twice. Use a database transaction and check the current resource state before applying confirmation.
- **Reimbursements:** A member may submit a claim for an eligible organization-related expense. An admin reviews it; only an approved claim can be marked `PAID`. Create the expense transaction exactly once when it transitions to `PAID`. The applicant cannot approve their own claim.
- **Manager-entered finance records:** Admins may record permitted manual income/expenses, such as sponsorships or event costs. Do not create manual income entries for a ticket, membership, order, or reimbursement already represented by an automatically generated linked transaction.

### 1.4 Standard Response Formats



#### Single Resource / Mutation Response

```json

{

  "status": "ok",

  "message": "Optional human-readable description",

  "data": {}

}

```



#### Paginated Collection Response

All listing/collection endpoints return a standardized pagination envelope:

```json

{

  "status": "ok",

  "data": {

    "items": [],

    "pagination": {

      "page": 1,

      "limit": 20,

      "total": 42,

      "totalPages": 3

    }

  }

}

```



### 1.5 Standard Error Response Format

Aligned with `backend/src/middleware/errorHandler.js` and `backend/src/middleware/notFoundHandler.js`:

```json

{

  "status": "error",

  "message": "Descriptive, actionable explanation of the failure"

}

```



### 1.6 Standard HTTP Status Codes

| Code | Meaning | Typical Usage |

| :--- | :--- | :--- |

| `200 OK` | Request succeeded | Standard GET, PATCH, and successful actions |

| `201 Created` | Resource created | Successful POST record creations |

| `204 No Content` | Succeeded with empty body | Successful DELETE operations |

| `400 Bad Request` | Validation failure / malformed body | Missing required fields, invalid formats |

| `401 Unauthorized` | Missing or invalid token | Unauthenticated caller accessing private route |

| `403 Forbidden` | Insufficient permissions | Role/volunteer rule violation |

| `404 Not Found` | Resource does not exist | Invalid ID or unknown route |

| `409 Conflict` | State conflict / duplicate | Email in use, duplicate check-in, duplicate size |

| `422 Unprocessable` | Business rule failed | Capacity sold out, insufficient stock, self-assignment rule |

| `500 Server Error` | Unexpected server exception | Internal unhandled error |



---



## 2. Health & System Module



### 2.1 Server Health Check

* **Method & URL:** `GET /api/health`

* **Access:** `PUBLIC`

* **Description:** Verifies that the Express API process is running.

* **Headers:** None

* **Request Body:** None

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "message": "Student Organization System API is healthy",

      "timestamp": "2026-10-10T09:13:00.966Z",

      "uptime": 12.34

    }

    ```



---



## 3. Authentication & User Profile Module



### 3.1 Register User

* **Method & URL:** `POST /api/auth/register`

* **Access:** `PUBLIC`

* **Description:** Registers a new student account. Always defaults to `role: MEMBER` and `isVolunteer: false`.

* **Request Body:**

  ```json

  {

    "name": "Jane Doe",

    "email": "jane@university.edu",

    "password": "SecurePassword123!",

    "phone": "+1234567890"

  }

  ```

* **Validation:**

  - `name`: string, required (min 2 chars)

  - `email`: valid university email format, required, unique

  - `password`: string, required (min 8 chars)

  - `phone`: string, optional

* **Response:**

  * **201 Created:**

    ```json

    {

      "status": "ok",

      "message": "User registered successfully",

      "data": {

        "user": {

          "id": "uuid-v4",

          "name": "Jane Doe",

          "email": "jane@university.edu",

          "phone": "+1234567890",

          "role": "MEMBER",

          "isVolunteer": false,

          "createdAt": "2026-10-10T10:00:00.000Z"

        },

        "token": "jwt.bearer.token"

      }

    }

    ```

* **Error Codes:** `400 Bad Request`, `409 Conflict (Email already in use)`



### 3.2 User Login

* **Method & URL:** `POST /api/auth/login`

* **Access:** `PUBLIC`

* **Description:** Validates credentials and returns a signed JWT containing `{ id, email, role, isVolunteer }`.

* **Request Body:**

  ```json

  {

    "email": "jane@university.edu",

    "password": "SecurePassword123!"

  }

  ```

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "message": "Login successful",

      "data": {

        "user": {

          "id": "uuid-v4",

          "name": "Jane Doe",

          "email": "jane@university.edu",

          "role": "MEMBER",

          "isVolunteer": false

        },

        "token": "jwt.bearer.token"

      }

    }

    ```

* **Error Codes:** `400 Bad Request`, `401 Unauthorized (Invalid email or password)`



### 3.3 User Logout

* **Method & URL:** `POST /api/auth/logout`

* **Access:** `MEMBER`, `ADMIN`

* **Description:** Client discards the stored bearer token. Because access JWTs are stateless, this endpoint does not revoke an already-issued token; use a short-lived access-token expiry. Token revocation is out of scope unless a server-side denylist is added.

* **Response:**

  * **200 OK:** `{ "status": "ok", "message": "Logged out successfully" }`



### 3.4 Get Current User Profile

* **Method & URL:** `GET /api/auth/me`

* **Access:** `MEMBER`, `ADMIN`

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "id": "uuid-v4",

        "name": "Jane Doe",

        "email": "jane@university.edu",

        "phone": "+1234567890",

        "role": "MEMBER",

        "isVolunteer": false,

        "createdAt": "2026-10-10T10:00:00.000Z"

      }

    }

    ```



### 3.5 Update Current User Profile (Self)

* **Method & URL:** `PATCH /api/users/me`

* **Access:** `MEMBER`, `ADMIN`

* **Description:** Allows an authenticated user to update their own contact details (`name`, `phone`). Users cannot modify their own `role` or `isVolunteer` status here.

* **Request Body:**

  ```json

  {

    "name": "Jane Doe Updated",

    "phone": "+1987654321"

  }

  ```

* **Response:**

  * **200 OK:** Returns updated user object



### 3.6 List Users

* **Method & URL:** `GET /api/users`

* **Access:** `ADMIN`

* **Query Parameters:** `role` (`ADMIN`, `MEMBER`), `isVolunteer` (`true`, `false`), `search` (name/email), `page` (default 1), `limit` (default 20)

* **Response:**

  * **200 OK:** Paginated list of users



### 3.7 Get User by ID

* **Method & URL:** `GET /api/users/:id`

* **Access:** `ADMIN`

* **Response:** `200 OK` with user details, or `404 Not Found`



### 3.8 Update User Role & Volunteer Status

* **Method & URL:** `PATCH /api/users/:id/role`

* **Access:** `ADMIN`

* **Description:** Modifies system privileges. Enforces the strict rule from `schema.md`: If `role === 'ADMIN'`, `isVolunteer` **must** be `false`.

* **Request Body:**

  ```json

  {

    "role": "MEMBER",

    "isVolunteer": true

  }

  ```

* **Business Invariant:**

  - If `role === "ADMIN"`, the backend automatically forces `isVolunteer = false`.

* **Response:**

  * **200 OK:** Returns updated user record

* **Error Codes:** `400 Bad Request`, `403 Forbidden`, `404 Not Found`



---



## 4. Membership Management Module



### 4.1 Get Current User Membership

* **Method & URL:** `GET /api/memberships/me`

* **Access:** `MEMBER`, `ADMIN`

* **Description:** Returns the user's active or latest membership record, including remaining days and validity status.

* **Response:**

  * **200 OK (Active Membership):**

    ```json

    {

      "status": "ok",

      "data": {

        "id": "uuid-v4",

        "userId": "uuid-v4",

        "startDate": "2026-09-01T00:00:00.000Z",

        "expiryDate": "2027-08-31T23:59:59.000Z",

        "amountPaid": "25.00",

        "status": "ACTIVE",

        "daysRemaining": 325,

        "isRenewalDue": false

      }

    }

    ```

  * **200 OK (No Membership):**

    ```json

    {

      "status": "ok",

      "data": null,

      "message": "No membership record found"

    }

    ```



### 4.2 Apply for / Renew Membership

* **Method & URL:** `POST /api/memberships`

* **Access:** `MEMBER`

* **Description:** Submits a membership application or renewal. Creates a `Membership` record with `status: PENDING`; the backend validates `durationYears` and calculates the fee from server-side membership pricing configuration. The client must not submit the amount to be charged.

* **Request Body:**

  ```json

  {

    "durationYears": 1

  }

  ```

* **Response:**

  * **201 Created:** Returns newly created `Membership` with status `PENDING`

* **Error Codes:** `400 Bad Request`, `409 Conflict (Active membership already exists)`



### 4.3 List All Memberships

* **Method & URL:** `GET /api/memberships`

* **Access:** `ADMIN`

* **Query Parameters:** `status` (`PENDING`, `ACTIVE`, `EXPIRED`, `REJECTED`), `page` (default 1), `limit` (default 20)

* **Response:**

  * **200 OK:** Paginated membership collection with user details



### 4.4 Get Membership by ID

* **Method & URL:** `GET /api/memberships/:id`

* **Access:** `ADMIN`

* **Response:** `200 OK` or `404 Not Found`



### 4.5 Update Membership Status (Admin Review)

* **Method & URL:** `PATCH /api/memberships/:id/status`

* **Access:** `ADMIN`

* **Description:** Admin reviews the application and may activate or reject it. Activation is allowed only after payment has been confirmed. Start/expiry dates are calculated by the backend using the approved membership duration and the chosen start-date rule; clients must not set `amountPaid` directly.

* **Request Body:**

  ```json

  {

    "status": "ACTIVE"

  }

  ```

* **Financial Ledger Rule:**

  - The payment-confirmation flow creates the linked `INCOME` transaction in category `MEMBERSHIP_DUE`. Changing the membership to `ACTIVE` must not create another transaction. Reject activation unless payment has been confirmed and `amountPaid` meets the required fee. The backend calculates `startDate` and `expiryDate`; clients cannot set those fields or `amountPaid` directly.

* **Response:** `200 OK` with updated membership



### 4.6 List Expiring Memberships (Calculated)

* **Method & URL:** `GET /api/memberships/expiring`

* **Access:** `ADMIN`

* **Description:** Dynamically calculates and returns active memberships expiring within the given threshold (default 30 days) to power admin renewal oversight without requiring background cron tables.

* **Query Parameters:** `days` (default 30), `page`, `limit`

* **Response:** `200 OK` with paginated expiring memberships



---



## 5. Event & Ticket Management Module



### 5.1 List Events

* **Method & URL:** `GET /api/events`

* **Access:** `PUBLIC` (optional authentication)

* **Description:** Lists events with dates, venue, capacity, seats remaining, and pricing. If the caller provides a valid token with an active membership (`status: ACTIVE` and `expiryDate > NOW()`), `effectivePrice` automatically reflects `memberPrice`.

* **Query Parameters:** `upcoming` (`true`/`false`), `page` (default 1), `limit` (default 20)

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "items": [

          {

            "id": "uuid-v4",

            "title": "Annual Tech Symposium",

            "description": "Keynotes, workshops, and networking",

            "date": "2026-11-15T10:00:00.000Z",

            "venue": "Campus Auditorium",

            "capacity": 200,

            "ticketsSold": 45,

            "seatsRemaining": 155,

            "standardPrice": "25.00",

            "memberPrice": "10.00",

            "effectivePrice": "10.00",

            "isMemberDiscountApplied": true

          }

        ],

        "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }

      }

    }

    ```



### 5.2 Get Event Details

* **Method & URL:** `GET /api/events/:id`

* **Access:** `PUBLIC` (optional authentication)

* **Response:** `200 OK` with event object and `effectivePrice`



### 5.3 Create Event

* **Method & URL:** `POST /api/events`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "title": "Annual Tech Symposium",

    "description": "Keynotes, workshops, and networking",

    "date": "2026-11-15T10:00:00.000Z",

    "venue": "Campus Auditorium",

    "capacity": 200,

    "memberPrice": "10.00",

    "standardPrice": "25.00"

  }

  ```

* **Validation:**

  - `capacity`: integer > 0

  - `date`: future datetime

  - `memberPrice`, `standardPrice`: numbers >= 0

* **Response:** `201 Created`



### 5.4 Update Event

* **Method & URL:** `PATCH /api/events/:id`

* **Access:** `ADMIN`

* **Request Body:** Partial event fields (`title`, `description`, `date`, `venue`, `capacity`, `memberPrice`, `standardPrice`)

* **Response:** `200 OK` with updated event object



### 5.5 Delete Event

* **Method & URL:** `DELETE /api/events/:id`

* **Access:** `ADMIN`

* **Business Rule:** Rejects deletion with `409 Conflict` if active paid tickets exist to protect financial auditability.

* **Response:** `200 OK` or `204 No Content`



### 5.6 Book / Purchase Event Ticket

* **Method & URL:** `POST /api/events/:id/tickets`

* **Access:** `MEMBER`, `ADMIN`

* **Description:** Reserves an event ticket. Uses a database transaction to verify `capacity` and generate a unique `ticketCode`. Calculates the required price using `memberPrice` if the user has an active membership, otherwise `standardPrice`. The new ticket starts as `RESERVED` until payment is confirmed.

* **Cancelled Ticket Handling:** Per `schema.md`, if the user previously held a `CANCELLED` ticket for this event, the backend re-activates/updates the existing row to prevent the `@@unique([eventId, userId])` constraint from blocking valid new bookings.

* **Financial Ledger Rule:** Do not create an income transaction during reservation. After payment confirmation, change `RESERVED` to `PAID` and create exactly one linked `Transaction` (`type: INCOME`, `category: TICKET_SALE`, `ticketId: ticket.id`).

* **Request Body:** None (or optional payment reference)

* **Response:**

  * **201 Created:**

    ```json

    {

      "status": "ok",

      "message": "Ticket reserved; payment is pending",

      "data": {

        "ticket": {

          "id": "uuid-v4",

          "eventId": "uuid-v4",

          "userId": "uuid-v4",

          "ticketCode": "TIC-2026-9A8B7C",

          "pricePaid": "10.00",

          "status": "RESERVED",

          "createdAt": "2026-10-10T12:00:00.000Z"

        }

      }

    }

    ```

* **Error Codes:**

  * `409 Conflict`: User already holds an active ticket for this event

  * `422 Unprocessable`: Event is completely sold out (`seatsRemaining === 0`)



### 5.7 Get User Tickets

* **Method & URL:** `GET /api/tickets/me`

* **Access:** `MEMBER`, `ADMIN`

* **Response:** `200 OK` with list of user tickets and nested event details



### 5.8 Get Ticket Details

* **Method & URL:** `GET /api/tickets/:id`

* **Access:** `MEMBER` (Owner only), `ADMIN`

* **Response:** `200 OK` or `404 Not Found`



### 5.9 Cancel Event Ticket

* **Method & URL:** `PATCH /api/tickets/:id/cancel`

* **Access:** `MEMBER` (Owner), `ADMIN`

* **Description:** Cancels an eligible ticket and frees up 1 seat. A `RESERVED` (unpaid) ticket can be cancelled by its owner. A paid ticket may be cancelled only under an admin-approved refund/cancellation policy; record a financial expense only if a refund is actually paid. Checked-in tickets cannot be cancelled.

* **Response:**

  * **200 OK:** `{ "status": "ok", "message": "Ticket cancelled successfully" }`

* **Error Codes:**

  * `400 Bad Request`: Ticket has already been checked in



### 5.10 Ticket Verification and Check-In

* **Method & URL:** `POST /api/tickets/check-in`

* **Access:** `VOLUNTEER` (`role = 'MEMBER' && isVolunteer = true`), `ADMIN`

* **Description:** Verifies a digital ticket / QR code at the entrance and marks attendee as checked in.

* **Request Body:**

  ```json

  {

    "ticketCode": "TIC-2026-9A8B7C"

  }

  ```

* **Business Rules:**

  - Validates `ticketCode` exists.

  - Requires the ticket to have been paid (`status === 'PAID'`) before first check-in.

  - Rejects with `409 Conflict` if `status === 'CHECKED_IN'` (returns previous check-in timestamp).

  - Rejects with `422 Unprocessable` if `status === 'CANCELLED'`.

  - Sets `status = 'CHECKED_IN'` and `checkedInAt = NOW()`.

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "message": "Check-in successful",

      "data": {

        "ticketId": "uuid-v4",

        "attendeeName": "Jane Doe",

        "eventTitle": "Annual Tech Symposium",

        "checkedInAt": "2026-11-15T09:45:00.000Z"

      }

    }

    ```

* **Error Codes:** `403 Forbidden (Non-volunteer member)`, `404 Not Found`, `409 Conflict`



### 5.11 Event Attendance & Revenue Summary

* **Method & URL:** `GET /api/events/:id/attendance`

* **Access:** `ADMIN`

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "eventId": "uuid-v4",

        "capacity": 200,

        "totalTicketsSold": 150,

        "totalCheckedIn": 128,

        "attendanceRate": "85.3%",

        "totalRevenue": "2150.00"

      }

    }

    ```



---



## 6. Merchandise & Inventory Management Module



### 6.1 List Products (Catalogue)

* **Method & URL:** `GET /api/products`

* **Access:** `PUBLIC`, `MEMBER`, `ADMIN`

* **Description:** Returns merchandise items with pricing, images, and size-level stock. Aligned with `schema.md` (no product material-description field).

* **Query Parameters:** `availableOnly` (`true`/`false`), `page` (default 1), `limit` (default 20)

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "items": [

          {

            "id": "uuid-v4",

            "name": "Organization Hoodie 2026",

            "basePrice": "35.00",

            "imageUrl": "https://...",

            "isAvailable": true,

            "variants": [

              { "id": "var-1", "size": "S", "stockQuantity": 15 },

              { "id": "var-2", "size": "M", "stockQuantity": 30 },

              { "id": "var-3", "size": "L", "stockQuantity": 25 },

              { "id": "var-4", "size": "XL", "stockQuantity": 10 }

            ]

          }

        ],

        "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }

      }

    }

    ```



### 6.2 Get Product Details

* **Method & URL:** `GET /api/products/:id`

* **Access:** `PUBLIC`, `MEMBER`, `ADMIN`

* **Response:** `200 OK` with product and variant list, or `404 Not Found`



### 6.3 Create Product

* **Method & URL:** `POST /api/products`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "name": "Organization Hoodie 2026",

    "basePrice": "35.00",

    "imageUrl": "https://...",

    "variants": [

      { "size": "S", "stockQuantity": 15 },

      { "size": "M", "stockQuantity": 30 },

      { "size": "L", "stockQuantity": 25 },

      { "size": "XL", "stockQuantity": 10 }

    ]

  }

  ```

* **Response:** `201 Created`



### 6.4 Update Product

* **Method & URL:** `PATCH /api/products/:id`

* **Access:** `ADMIN`

* **Request Body:** Partial product fields (`name`, `basePrice`, `imageUrl`, `isAvailable`)

* **Response:** `200 OK`



### 6.5 Delete Product

* **Method & URL:** `DELETE /api/products/:id`

* **Access:** `ADMIN`

* **Response:** `200 OK` or `204 No Content`



### 6.6 Add Product Variant

* **Method & URL:** `POST /api/products/:id/variants`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "size": "XXL",

    "stockQuantity": 20

  }

  ```

* **Response:** `201 Created`

* **Error Codes:** `409 Conflict (Size variant already exists for product)`



### 6.7 Update Variant Stock Level

* **Method & URL:** `PATCH /api/products/:productId/variants/:variantId`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "stockQuantity": 50

  }

  ```

* **Response:** `200 OK`



### 6.8 Low Stock Alerts (Calculated)

* **Method & URL:** `GET /api/products/low-stock`

* **Access:** `ADMIN`

* **Description:** Dynamically queries `ProductVariant` records where `stockQuantity <= threshold` (default 5 units) to power Admin inventory warning cards.

* **Query Parameters:** `threshold` (default 5)

* **Response:** `200 OK` with list of low-stock variants



### 6.9 Place Merchandise Order

* **Method & URL:** `POST /api/orders`

* **Access:** `MEMBER`, `ADMIN`

* **Description:** Submits a merchandise order. Runs inside an atomic database transaction:

  1. Checks stock availability and reserves/decrements variant stock atomically so concurrent orders cannot oversell.

  2. Calculates `totalAmount` server-side from stored product prices and requested quantities. Ignore client-supplied prices and totals.

  3. Creates `Order` and `OrderItem` rows with `status: PENDING`.

  4. Does not create an income transaction yet. After payment confirmation, change the order to `PAID` and create exactly one linked `Transaction` (`type: INCOME`, `category: MERCHANDISE_SALE`, `orderId: order.id`).

* **Request Body:**

  ```json

  {

    "items": [

      { "variantId": "var-2", "quantity": 1 },

      { "variantId": "var-3", "quantity": 2 }

    ]

  }

  ```

* **Response:**

  * **201 Created:**

    ```json

    {

      "status": "ok",

      "message": "Order created; payment is pending",

      "data": {

        "id": "uuid-v4",

        "userId": "uuid-v4",

        "totalAmount": "105.00",

        "status": "PENDING",

        "items": [

          { "variantId": "var-2", "size": "M", "quantity": 1, "unitPrice": "35.00" },

          { "variantId": "var-3", "size": "L", "quantity": 2, "unitPrice": "35.00" }

        ],

        "createdAt": "2026-10-10T14:00:00.000Z"

      }

    }

    ```

* **Error Codes:**

  * `422 Unprocessable`: Insufficient stock for requested variant size



### 6.10 Get User Orders

* **Method & URL:** `GET /api/orders/me`

* **Access:** `MEMBER`, `ADMIN`

* **Response:** `200 OK` with user order history



### 6.11 Get Order Details

* **Method & URL:** `GET /api/orders/:id`

* **Access:** `MEMBER` (Owner), `ADMIN`

* **Response:** `200 OK` with order and line items



### 6.12 List All Orders (Admin)

* **Method & URL:** `GET /api/orders`

* **Access:** `ADMIN`

* **Query Parameters:** `status` (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`), `page`, `limit`

* **Response:** `200 OK` with paginated order collection



### 6.13 Update Order Status

* **Method & URL:** `PATCH /api/orders/:id/status`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "status": "SHIPPED"

  }

  ```

* **Response:** `200 OK`



### 6.14 Cancel Order

* **Method & URL:** `PATCH /api/orders/:id/cancel`

* **Access:** `MEMBER` (Owner if status is PENDING/PAID), `ADMIN`

* **Description:** Cancels an eligible order and restores reserved stock exactly once inside a database transaction. If payment was confirmed, apply the agreed refund policy; do not create a duplicate income or expense transaction. A cancelled order cannot be cancelled again.

* **Response:**

  * **200 OK:** `{ "status": "ok", "message": "Order cancelled and stock replenished" }`



---



## 7. Volunteer & Task Management Module



> **Rule from `schema.md`:** Admins cannot work as volunteers and cannot be assigned volunteer tasks. Only eligible members (`role = 'MEMBER' && isVolunteer = true`) can be assigned tasks. The system uses direct task assignment, not an application/approval sub-table.



### 7.1 List All Volunteer Tasks

* **Method & URL:** `GET /api/tasks`

* **Access:** `ADMIN`

* **Query Parameters:** `status` (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), `eventId`, `assigneeId`, `page`, `limit`

* **Response:** `200 OK` with paginated tasks



### 7.2 Browse Available Open Tasks

* **Method & URL:** `GET /api/tasks/opportunities`

* **Access:** `VOLUNTEER` (`role = 'MEMBER' && isVolunteer = true`), `ADMIN`

* **Description:** Lists open tasks (`assigneeId === null && status === 'PENDING'`) that volunteers can review.

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "items": [

          {

            "id": "uuid-v4",

            "title": "Stage Setup & Sound Check",

            "description": "Assist audio engineer with equipment in Auditorium",

            "eventId": "uuid-v4",

            "deadline": "2026-11-15T08:00:00.000Z",

            "status": "PENDING",

            "assigneeId": null

          }

        ],

        "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }

      }

    }

    ```



### 7.3 Get Tasks Assigned to Current Volunteer

* **Method & URL:** `GET /api/tasks/me`

* **Access:** `VOLUNTEER` (`role = 'MEMBER' && isVolunteer = true`)

* **Description:** Returns tasks assigned to the authenticated volunteer.

* **Response:** `200 OK` with list of assigned tasks



### 7.4 Create Volunteer Task

* **Method & URL:** `POST /api/tasks`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "title": "Badge Distribution Desk",

    "description": "Manage check-in desk at Hall A",

    "assigneeId": "uuid-v4-volunteer",

    "eventId": "uuid-v4-event",

    "deadline": "2026-11-15T09:00:00.000Z"

  }

  ```

* **Validation:** If `assigneeId` is provided, the backend must verify that the user has `role === 'MEMBER' && isVolunteer === true`. It rejects the assignment if the user is an `ADMIN`.

* **Response:** `201 Created`



### 7.5 Update Task Progress / Status

* **Method & URL:** `PATCH /api/tasks/:id/status`

* **Access:** `VOLUNTEER` (Assigned user only), `ADMIN`

* **Request Body:**

  ```json

  {

    "status": "COMPLETED"

  }

  ```

* **Response:** `200 OK` with updated task



### 7.6 Assign / Reassign Task (Admin)

* **Method & URL:** `PATCH /api/tasks/:id/assign`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "assigneeId": "uuid-v4-volunteer"

  }

  ```

* **Validation:** Rejects with `422 Unprocessable` if `assigneeId` belongs to an Admin or a user where `isVolunteer === false`.

* **Response:** `200 OK`



### 7.7 Delete Task

* **Method & URL:** `DELETE /api/tasks/:id`

* **Access:** `ADMIN`

* **Response:** `200 OK` or `204 No Content`



---



## 8. Announcements Module



### 8.1 List Announcements

* **Method & URL:** `GET /api/announcements`

* **Access:** `PUBLIC`, `MEMBER`, `ADMIN`

* **Description:** Retrieves announcements. Automatically filters messages based on caller role (`ALL`, `MEMBERS`, `VOLUNTEERS`).

* **Query Parameters:** `page` (default 1), `limit` (default 20)

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "items": [

          {

            "id": "uuid-v4",

            "title": "General Body Meeting 2026",

            "content": "Meeting scheduled for Friday in Room 204.",

            "audience": "ALL",

            "publishedById": "uuid-v4",

            "createdAt": "2026-10-09T10:00:00.000Z"

          }

        ],

        "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }

      }

    }

    ```



### 8.2 Get Announcement Details

* **Method & URL:** `GET /api/announcements/:id`

* **Access:** `PUBLIC`, `MEMBER`, `ADMIN`

* **Response:** `200 OK` or `404 Not Found`



### 8.3 Create Announcement

* **Method & URL:** `POST /api/announcements`

* **Access:** `ADMIN`

* **Request Body:**

  ```json

  {

    "title": "General Body Meeting 2026",

    "content": "Meeting scheduled for Friday in Room 204.",

    "audience": "ALL"

  }

  ```

* **Response:** `201 Created`



### 8.4 Update Announcement

* **Method & URL:** `PATCH /api/announcements/:id`

* **Access:** `ADMIN`

* **Request Body:** Partial announcement fields (`title`, `content`, `audience`)

* **Response:** `200 OK`



### 8.5 Delete Announcement

* **Method & URL:** `DELETE /api/announcements/:id`

* **Access:** `ADMIN`

* **Response:** `200 OK` or `204 No Content`



---



## 9. Payment Confirmation (Demo/Provider Integration)

### 9.1 Confirm a Payment (Mock Only in Development)

- **Method & URL:** `POST /api/payments/mock-confirm`
- **Access:** Authenticated resource owner or `ADMIN`; route must be disabled outside demo/development mode unless it is replaced by a verified payment-provider webhook.
- **Purpose:** Simulates a successful payment for the hackathon. In production, the backend must trust only verified provider callbacks—not a frontend claim that payment succeeded.
- **Request Body:**

  ```json
  {
    "resourceType": "TICKET",
    "resourceId": "uuid-v4"
  }
  ```

  `resourceType` is one of `MEMBERSHIP`, `TICKET`, or `ORDER`. Do not accept an amount or a target status from the client; the server retrieves the amount and resource from the database.
- **Behavior:**
  - `TICKET`: only a `RESERVED` ticket can be confirmed; set it to `PAID` and create one `TICKET_SALE` income transaction.
  - `ORDER`: only a `PENDING` order can be confirmed; set it to `PAID` and create one `MERCHANDISE_SALE` income transaction.
  - `MEMBERSHIP`: record the server-calculated confirmed fee in `amountPaid` and create one `MEMBERSHIP_DUE` income transaction. Leave membership `PENDING` until an admin separately approves/activates it.
  - If the resource is already paid, return its current state without creating another transaction. If cancelled/rejected or otherwise ineligible, return `409 Conflict`.
- **Response:** `200 OK` with the updated resource and a confirmation message.
- **Important:** This endpoint is a development/demo simulation, not real payment processing. It must not be publicly usable in production.

---

## 10. Finance & Reimbursements Module



### 10.1 Financial Summary & Balance

* **Method & URL:** `GET /api/finance/summary`

* **Access:** `ADMIN`

* **Description:** Aggregates total income, total expenses, and calculates net balance (`Total Income - Total Expenses`) directly from the `Transaction` table.

* **Query Parameters:** `startDate` (optional), `endDate` (optional)

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "totalIncome": "12500.00",

        "totalExpense": "4200.00",

        "currentBalance": "8300.00",

        "breakdownByCategory": {

          "MEMBERSHIP_DUE": "5000.00",

          "TICKET_SALE": "4500.00",

          "MERCHANDISE_SALE": "3000.00",

          "EVENT_EXPENSE": "2800.00",

          "REIMBURSEMENT": "1400.00"

        }

      }

    }

    ```



### 10.2 List Financial Transactions

* **Method & URL:** `GET /api/finance/transactions`

* **Access:** `ADMIN`

* **Query Parameters:** `type` (`INCOME`, `EXPENSE`), `category`, `page` (default 1), `limit` (default 20)

* **Response:** `200 OK` with paginated transaction ledger



### 10.3 Record Manual Transaction

* **Method & URL:** `POST /api/finance/transactions`

* **Access:** `ADMIN`

* **Description:** Records an ad-hoc expense or income entry (e.g. equipment rental, sponsorship).

* **Request Body:**

  ```json

  {

    "type": "EXPENSE",

    "category": "EVENT_EXPENSE",

    "amount": "150.00",

    "description": "AV equipment rental for workshop"

  }

  ```

* **Response:** `201 Created`



### 10.4 Submit Reimbursement Claim

* **Method & URL:** `POST /api/reimbursements`

* **Access:** `MEMBER` (includes eligible volunteers)

* **Description:** Submits an out-of-pocket claim for an eligible organization-related expense. The applicant is derived from the authenticated JWT; never accept `applicantId` from the request body.

* **Request Body:**

  ```json

  {

    "amount": "42.50",

    "reason": "Printouts and banners for event entrance",

    "receiptUrl": "https://..."

  }

  ```

* **Response:**

  * **201 Created:**

    ```json

    {

      "status": "ok",

      "message": "Reimbursement claim submitted",

      "data": {

        "id": "uuid-v4",

        "applicantId": "uuid-v4",

        "amount": "42.50",

        "reason": "Printouts and banners for event entrance",

        "status": "PENDING",

        "createdAt": "2026-10-10T15:00:00.000Z"

      }

    }

    ```

* **Error Codes:** `400 Bad Request` for invalid claim data; `401 Unauthorized` for missing/invalid JWT.



### 10.5 Get User's Own Reimbursements

* **Method & URL:** `GET /api/reimbursements/me`

* **Access:** `MEMBER`

* **Response:** `200 OK` with the authenticated member's own reimbursement claims



### 10.6 List All Reimbursements (Admin Review)

* **Method & URL:** `GET /api/reimbursements`

* **Access:** `ADMIN`

* **Query Parameters:** `status` (`PENDING`, `APPROVED`, `REJECTED`, `PAID`), `page`, `limit`

* **Response:** `200 OK` with paginated claims



### 10.7 Review / Update Reimbursement Status

* **Method & URL:** `PATCH /api/reimbursements/:id/status`

* **Access:** `ADMIN`

* **Description:** Admin approves or rejects a pending claim. Only an `APPROVED` claim may transition to `PAID`. The applicant cannot review their own claim. Repeated requests must not create duplicate expense transactions.

* **Request Body:**

  ```json

  {

    "status": "PAID"

  }

  ```

* **Financial Ledger Automation:**

  - When an `APPROVED` claim transitions to `PAID`, create exactly one linked `Transaction` (`type: EXPENSE`, `category: REIMBURSEMENT`, `amount: reimbursement.amount`, `reimbursementId: id`) inside the same database transaction. Reject attempts to mark a `PENDING` or `REJECTED` claim as paid.

* **Response:** `200 OK`



---



## 11. Aggregated Dashboard Module (PRD Section 7)



> **Rule from `schema.md`:** Dashboards are calculated dynamically on request from existing tables; no separate analytics tables exist.



### 11.1 Admin Dashboard Summary

* **Method & URL:** `GET /api/dashboard/admin`

* **Access:** `ADMIN`

* **Description:** Consolidates all key organizational metrics for the Admin home screen in one round-trip.

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "members": {

          "totalRegistered": 320,

          "activeCount": 280,

          "pendingRenewalCount": 14

        },

        "events": {

          "upcomingCount": 3,

          "totalTicketsSold": 145,

          "totalSeatsRemaining": 155,

          "averageAttendanceRate": "82.5%"

        },

        "volunteers": {

          "totalVolunteers": 24,

          "openTasksCount": 5,

          "completedTasksCount": 18

        },

        "inventory": {

          "lowStockAlertsCount": 2

        },

        "finances": {

          "totalIncome": "12500.00",

          "totalExpense": "4200.00",

          "currentBalance": "8300.00",

          "pendingReimbursementsCount": 3

        },

        "recentAnnouncements": [

          { "id": "uuid-v4", "title": "General Body Meeting 2026", "createdAt": "..." }

        ]

      }

    }

    ```



### 11.2 Volunteer Dashboard Summary

* **Method & URL:** `GET /api/dashboard/volunteer`

* **Access:** `VOLUNTEER` (`role = 'MEMBER' && isVolunteer = true`)

* **Description:** Consolidates assigned tasks, upcoming deadlines, check-in access, and reimbursement summary.

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "assignedTasks": [

          { "id": "uuid-v4", "title": "Badge Distribution Desk", "status": "IN_PROGRESS", "deadline": "..." }

        ],

        "canCheckInTickets": true,

        "reimbursementsSummary": {

          "pendingCount": 1,

          "totalApproved": 75.00

        }

      }

    }

    ```



### 11.3 Member Dashboard Summary

* **Method & URL:** `GET /api/dashboard/member`

* **Access:** `MEMBER`

* **Description:** Consolidates user membership validity, upcoming event tickets, orders, and announcements.

* **Response:**

  * **200 OK:**

    ```json

    {

      "status": "ok",

      "data": {

        "membership": {

          "status": "ACTIVE",

          "daysRemaining": 325,

          "isRenewalDue": false,

          "expiryDate": "2027-08-31T23:59:59.000Z"

        },

        "myTickets": [

          { "ticketId": "uuid-v4", "eventTitle": "Annual Tech Symposium", "ticketCode": "TIC-2026-9A8B7C", "status": "PAID" }

        ],

        "activeOrders": [

          { "orderId": "uuid-v4", "totalAmount": "105.00", "status": "PAID" }

        ],

        "recentAnnouncements": [

          { "id": "uuid-v4", "title": "General Body Meeting 2026", "createdAt": "..." }

        ]

      }

    }

    ```
