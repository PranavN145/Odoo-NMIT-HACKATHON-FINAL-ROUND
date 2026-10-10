# Student Organization System — REST API Contract

> **Document Status:** Draft / Provisional  
> **Notice:** The database schema is currently provisional and being finalized by the database team. All endpoints, fields, and relations that depend on unconfirmed schema definitions or pending architectural decisions are explicitly marked with **`[PROVISIONAL / PENDING REVIEW]`**.  
> **Base URL:** `/api`  
> **Data Format:** JSON (`Content-Type: application/json`)

---

## 1. Global Conventions & Standards

### 1.1 Authentication & Authorization
- **Authentication Method:** Bearer JWT in the HTTP `Authorization` header (`Authorization: Bearer <token>`) or secure `HttpOnly` session cookie (as determined in system architecture).
- **User Roles & Hierarchy:**
  - `PUBLIC`: Unauthenticated requests (e.g., login, registration, public event catalog).
  - `MEMBER`: Registered student organization members who access member pricing, benefits, tickets, merchandise, and announcements.
  - `VOLUNTEER`: Users granted volunteer responsibilities (`isVolunteer: true` in provisional schema). Authorized for task management, event check-ins, and expense reimbursement claims.
  - `ADMIN`: Core organization leadership with full administrative privileges across users, memberships, finances, events, products, and announcements.
- **Server-Side Enforcement:** Every protected route must be strictly guarded by Express authentication and role-authorization middleware. Client-side visibility toggles are cosmetic only.

### 1.2 Data Serialization Conventions
- **Monetary Amounts:** All currency and price fields (`amountPaid`, `memberPrice`, `standardPrice`, `effectivePrice`, `basePrice`, `unitPrice`, `totalAmount`, `amount`, `balance`) must be serialized as standard JSON **numeric floats with 2 decimal places** (e.g., `25.00`), never as raw string representations or custom Decimal objects.
- **Timestamps:** All dates and times must follow **ISO 8601 UTC format** (`YYYY-MM-DDTHH:mm:ss.sssZ`).
- **Identifiers:** Primary entity keys are UUIDv4 strings.

### 1.3 Standard Success Response Formats

#### Single Resource / Mutation Response
```json
{
  "status": "ok",
  "message": "Optional human-readable success description",
  "data": {}
}
```

#### Paginated Collection Response
All listing endpoints return a consistent collection envelope containing an `items` array and pagination metadata:
```json
{
  "status": "ok",
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 45,
      "totalPages": 3
    }
  }
}
```

### 1.4 Standard Error Response Format
Aligned with the existing Express error-handling middleware (`backend/src/middleware/errorHandler.js`):
```json
{
  "status": "error",
  "message": "Actionable explanation of error"
}
```

### 1.5 Standard HTTP Status Codes
| Code | Meaning | Typical Usage |
| :--- | :--- | :--- |
| `200 OK` | Request succeeded | Successful GET, PATCH, or general operation |
| `201 Created` | Resource created | Successful POST record creation |
| `204 No Content` | Succeeded with empty body | Successful DELETE operation |
| `400 Bad Request` | Malformed syntax / validation error | Missing required fields, invalid types |
| `401 Unauthorized` | Missing / invalid token | Unauthenticated user accessing private route |
| `403 Forbidden` | Insufficient permissions | Role not authorized for this resource |
| `404 Not Found` | Resource does not exist | Invalid ID or non-existent route |
| `409 Conflict` | State conflict / duplication | Duplicate email, duplicate check-in, oversold capacity |
| `422 Unprocessable` | Business rule failed | Insufficient stock, inactive membership for discount |
| `500 Server Error` | Unhandled internal exception | Server-side unexpected failure |

---

## 2. Health & System Module

### 2.1 Health Check
* **Method & URL:** `GET /api/health`
* **Access:** `PUBLIC`
* **Description:** Verifies that the Express API server process is alive and responsive. *(Implemented & verified)*
* **Headers:** None required
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
* **Error Responses:**
  * `500 Internal Server Error`: Server failure

---

## 3. Authentication & User Profile Module

### 3.1 Register User
* **Method & URL:** `POST /api/auth/register`
* **Access:** `PUBLIC`
* **Description:** Creates a new user account. Defaults to role `MEMBER` with `isVolunteer: false`.
* **Request Body:**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@university.edu",
    "password": "SecurePassword123!",
    "phone": "+1234567890"
  }
  ```
* **Validation Rules:**
  - `name`: string, required (min 2 chars)
  - `email`: valid university email format, required, unique
  - `password`: string, required (min 8 chars)
  - `phone`: string, optional `[PROVISIONAL FIELD]`
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
* **Error Codes:**
  * `400 Bad Request`: Validation failure on input fields
  * `409 Conflict`: Email already registered
  * `500 Server Error`: Hashing/database error

### 3.2 User Login
* **Method & URL:** `POST /api/auth/login`
* **Access:** `PUBLIC`
* **Description:** Authenticates credentials and issues a JWT token.
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
* **Error Codes:**
  * `400 Bad Request`: Email or password omitted
  * `401 Unauthorized`: Invalid email or password

### 3.3 User Logout
* **Method & URL:** `POST /api/auth/logout`
* **Access:** `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Clears session cookies or invalidates client-side JWT token.
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:** None
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Logged out successfully"
    }
    ```
* **Error Codes:**
  * `401 Unauthorized`: Invalid or missing token

### 3.4 Get Current User Profile
* **Method & URL:** `GET /api/auth/me`
* **Access:** `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Retrieves the authenticated user's profile and active roles.
* **Headers:** `Authorization: Bearer <token>`
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
* **Error Codes:**
  * `401 Unauthorized`: Missing, expired, or invalid token
  * `404 Not Found`: User no longer exists

### 3.5 Update Current User Profile (Self)
* **Method & URL:** `PATCH /api/users/me`
* **Access:** `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Allows an authenticated user to update their own contact details (name, phone). Users cannot modify their own `role` or `isVolunteer` status via this endpoint.
* **Headers:** `Authorization: Bearer <token>`
* **Request Body:**
  ```json
  {
    "name": "Jane Doe Updated",
    "phone": "+1987654321"
  }
  ```
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Profile updated successfully",
      "data": {
        "id": "uuid-v4",
        "name": "Jane Doe Updated",
        "email": "jane@university.edu",
        "phone": "+1987654321",
        "role": "MEMBER",
        "isVolunteer": false,
        "updatedAt": "2026-10-10T11:00:00.000Z"
      }
    }
    ```
* **Error Codes:**
  * `400 Bad Request`: Invalid data format
  * `401 Unauthorized`: Not logged in

### 3.6 List Users
* **Method & URL:** `GET /api/users`
* **Access:** `ADMIN`
* **Description:** Paginated list of users with search and role filters.
* **Query Parameters:** `role` (optional: `ADMIN`, `MEMBER`), `isVolunteer` (optional: `true`/`false`), `search` (optional), `page` (default 1), `limit` (default 20)
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "data": {
        "items": [
          {
            "id": "uuid-v4",
            "name": "Jane Doe",
            "email": "jane@university.edu",
            "phone": "+1234567890",
            "role": "MEMBER",
            "isVolunteer": true,
            "createdAt": "2026-10-10T10:00:00.000Z"
          }
        ],
        "pagination": {
          "page": 1,
          "limit": 20,
          "total": 1,
          "totalPages": 1
        }
      }
    }
    ```
* **Error Codes:**
  * `401 Unauthorized`: Not logged in
  * `403 Forbidden`: User is not Admin

### 3.7 Get User by ID
* **Method & URL:** `GET /api/users/:id`
* **Access:** `ADMIN`
* **Description:** Retrieves detailed user information by ID.
* **Response:**
  * **200 OK:** User profile object
  * **404 Not Found:** User does not exist

### 3.8 Update User Role & Volunteer Status `[PENDING REVIEW]`
* **Method & URL:** `PATCH /api/users/:id/role`
* **Access:** `ADMIN`
* **Description:** Promotes/demotes user roles or toggles volunteer privileges.
* **Request Body:**
  ```json
  {
    "role": "ADMIN",
    "isVolunteer": true
  }
  ```
* **Status:** `[PENDING REVIEW: Role model vs Volunteer flag — pending confirmation whether volunteer is a separate Role enum value or a boolean flag on Member]`
* **Response:**
  * **200 OK:** Returns updated user object
* **Error Codes:**
  * `400 Bad Request`: Invalid role value
  * `401 Unauthorized`: Not logged in
  * `403 Forbidden`: User is not Admin
  * `404 Not Found`: User not found

---

## 4. Membership Management Module

### 4.1 Get Current User Membership
* **Method & URL:** `GET /api/memberships/me`
* **Access:** `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Returns the active or latest membership record for the authenticated user, including validity, dues status, and remaining days.
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
        "amountPaid": 25.00,
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
      "message": "No active membership record found"
    }
    ```
* **Error Codes:** `401 Unauthorized`

### 4.2 Apply for / Renew Membership `[PENDING REVIEW]`
* **Method & URL:** `POST /api/memberships`
* **Access:** `MEMBER`
* **Description:** Creates a membership application/renewal with status `PENDING` awaiting payment confirmation.
* **Request Body:**
  ```json
  {
    "durationYears": 1,
    "paymentReference": "REF-MEMB-1002"
  }
  ```
* **Status:** `[PENDING REVIEW: Automatic pricing tier for dues vs fixed config; payment gateway integration vs manual admin approval]`
* **Response:**
  * **201 Created:** Returns newly created Membership with status `PENDING`
* **Error Codes:**
  * `400 Bad Request`: Invalid request data
  * `401 Unauthorized`: Not logged in
  * `409 Conflict`: User already holds an active membership

### 4.3 List All Memberships
* **Method & URL:** `GET /api/memberships`
* **Access:** `ADMIN`
* **Query Parameters:** `status` (optional: `PENDING`, `ACTIVE`, `EXPIRED`, `REJECTED`), `page` (default 1), `limit` (default 20)
* **Response:**
  * **200 OK:** Paginated list of memberships with nested user details
    ```json
    {
      "status": "ok",
      "data": {
        "items": [
          {
            "id": "uuid-v4",
            "userId": "uuid-v4",
            "user": { "name": "Jane Doe", "email": "jane@university.edu" },
            "startDate": "2026-09-01T00:00:00.000Z",
            "expiryDate": "2027-08-31T23:59:59.000Z",
            "amountPaid": 25.00,
            "status": "ACTIVE"
          }
        ],
        "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
      }
    }
    ```

### 4.4 Get Membership by ID
* **Method & URL:** `GET /api/memberships/:id`
* **Access:** `ADMIN`
* **Response:** `200 OK` with membership details, or `404 Not Found`

### 4.5 Update Membership Status `[PENDING REVIEW]`
* **Method & URL:** `PATCH /api/memberships/:id/status`
* **Access:** `ADMIN`
* **Description:** Approves, activates, rejects, or marks a membership paid.
* **Request Body:**
  ```json
  {
    "status": "ACTIVE",
    "startDate": "2026-10-10T00:00:00.000Z",
    "expiryDate": "2027-10-10T00:00:00.000Z",
    "amountPaid": 25.00
  }
  ```
* **Status:** `[PENDING REVIEW: Confirm whether approving membership automatically inserts an INCOME transaction into the Transaction table]`
* **Response:** `200 OK` with updated membership object

### 4.6 List Expiring Memberships
* **Method & URL:** `GET /api/memberships/expiring`
* **Access:** `ADMIN`
* **Description:** Lists active memberships expiring within a specified number of days (useful for renewal reminder campaigns).
* **Query Parameters:** `days` (default 30), `page` (default 1), `limit` (default 20)
* **Response:** `200 OK` with paginated expiring memberships

### 4.7 Send Individual Membership Renewal Reminder `[PENDING REVIEW]`
* **Method & URL:** `POST /api/memberships/:id/remind`
* **Access:** `ADMIN`
* **Description:** Generates and queues a renewal reminder notice / email for a specific expiring member.
* **Status:** `[PENDING REVIEW: External email service provider integration pending]`
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Renewal reminder queued for delivery"
    }
    ```

### 4.8 Batch Send Renewal Reminders `[PENDING REVIEW]`
* **Method & URL:** `POST /api/memberships/reminders/send`
* **Access:** `ADMIN`
* **Description:** Triggers batch reminder notices for all memberships expiring within `days` threshold.
* **Request Body:**
  ```json
  {
    "thresholdDays": 14
  }
  ```
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Reminders dispatched",
      "data": { "remindersSent": 12 }
    }
    ```

---

## 5. Event & Ticket Management Module

### 5.1 List Events
* **Method & URL:** `GET /api/events`
* **Access:** `PUBLIC` (with optional authentication context)
* **Description:** Lists events with dates, venue, capacity, standard price, and member price. If the caller provides an authenticated token with an active membership, the response dynamically populates `effectivePrice` reflecting the member discount.
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
            "standardPrice": 25.00,
            "memberPrice": 10.00,
            "effectivePrice": 10.00,
            "isMemberDiscountApplied": true
          }
        ],
        "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
      }
    }
    ```

### 5.2 Get Event Details
* **Method & URL:** `GET /api/events/:id`
* **Access:** `PUBLIC` (with optional authentication context)
* **Description:** Retrieves detailed event info with remaining seats and user-specific `effectivePrice`.
* **Response:** `200 OK` with event object, or `404 Not Found`

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
    "memberPrice": 10.00,
    "standardPrice": 25.00
  }
  ```
* **Validation:**
  - `capacity` must be an integer > 0
  - `date` must be a future datetime
  - `memberPrice` and `standardPrice` must be numbers >= 0
* **Response:**
  * **201 Created:** Event object with `createdById` set to current Admin.

### 5.4 Update Event
* **Method & URL:** `PATCH /api/events/:id`
* **Access:** `ADMIN`
* **Description:** Modifies existing event metadata.
* **Request Body:** Partial event fields (`title`, `description`, `date`, `venue`, `capacity`, `memberPrice`, `standardPrice`).
* **Response:** `200 OK` with updated event object

### 5.5 Delete Event `[PENDING REVIEW]`
* **Method & URL:** `DELETE /api/events/:id`
* **Access:** `ADMIN`
* **Description:** Removes or cancels an event.
* **Status:** `[PENDING REVIEW: Deletion cascade policy if tickets or tasks have already been issued]`
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Event deleted successfully"
    }
    ```

### 5.6 Book / Purchase Event Ticket
* **Method & URL:** `POST /api/events/:id/tickets`
* **Access:** `MEMBER`, `ADMIN` (Authenticated user)
* **Description:** Issues an event ticket with a unique verification `ticketCode`. Evaluates caller's active membership status to charge `memberPrice` vs `standardPrice`. Must execute in an atomic database transaction to prevent overselling beyond `capacity`.
* **Request Body:**
  ```json
  {
    "paymentReference": "REF-PAY-987"
  }
  ```
* **Status:** `[PENDING REVIEW: One ticket per user constraint (@@unique([eventId, userId])) vs guest ticket purchases; immediate PAID status vs RESERVED pending payment]`
* **Response:**
  * **201 Created:**
    ```json
    {
      "status": "ok",
      "message": "Ticket issued successfully",
      "data": {
        "ticket": {
          "id": "uuid-v4",
          "eventId": "uuid-v4",
          "userId": "uuid-v4",
          "ticketCode": "TIC-2026-9A8B7C",
          "pricePaid": 10.00,
          "status": "PAID",
          "createdAt": "2026-10-10T12:00:00.000Z"
        }
      }
    }
    ```
* **Error Codes:**
  * `401 Unauthorized`: Not logged in
  * `404 Not Found`: Event not found
  * `409 Conflict`: User already holds a ticket for this event (`@@unique([eventId, userId])`)
  * `422 Unprocessable`: Event capacity sold out

### 5.7 Get User Tickets
* **Method & URL:** `GET /api/tickets/me`
* **Access:** `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Lists all event tickets owned by the authenticated user with event details and `ticketCode`.
* **Response:** `200 OK` with ticket collection

### 5.8 Get Ticket Details
* **Method & URL:** `GET /api/tickets/:id`
* **Access:** `MEMBER` (Owner only), `VOLUNTEER`, `ADMIN`
* **Response:** `200 OK` with ticket and check-in details

### 5.9 Cancel Event Ticket `[PENDING REVIEW]`
* **Method & URL:** `PATCH /api/tickets/:id/cancel`
* **Access:** `MEMBER` (Owner only), `ADMIN`
* **Description:** Cancels an issued ticket, updating `status` to `CANCELLED` and releasing seat capacity.
* **Status:** `[PENDING REVIEW: Refund policy and financial reversal transaction creation pending]`
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Ticket cancelled successfully",
      "data": { "id": "uuid-v4", "status": "CANCELLED" }
    }
    ```
* **Error Codes:**
  * `400 Bad Request`: Ticket is already checked in and cannot be cancelled
  * `403 Forbidden`: User does not own this ticket

### 5.10 Ticket Verification and Check-In
* **Method & URL:** `POST /api/tickets/check-in` *(alias: `POST /api/tickets/:id/check-in`)*
* **Access:** `VOLUNTEER`, `ADMIN`
* **Description:** Validates a digital ticket (scanned QR code / `ticketCode` or ID) at the venue entrance and marks attendee as checked in.
* **Request Body:**
  ```json
  {
    "ticketCode": "TIC-2026-9A8B7C"
  }
  ```
* **Business Rules:**
  - Validates `ticketCode` exists.
  - Rejects if `status === 'CHECKED_IN'` with 409 Conflict (includes previous check-in timestamp and staff details).
  - Rejects if `status === 'CANCELLED'`.
  - Sets `status = 'CHECKED_IN'`, `checkedInAt = NOW()`, `checkedInById = staffId`.
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
* **Error Codes:**
  * `400 Bad Request`: Missing ticket identifier
  * `401 Unauthorized`: Not logged in
  * `403 Forbidden`: User is neither Volunteer nor Admin
  * `404 Not Found`: Ticket code not found
  * `409 Conflict`: Ticket already checked in

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
        "totalRevenue": 2150.00
      }
    }
    ```

---

## 6. Merchandise & Inventory Management Module

### 6.1 List Products (Catalogue)
* **Method & URL:** `GET /api/products`
* **Access:** `PUBLIC`, `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Returns merchandise items with pricing, images, and size variant stock levels.
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
            "description": "Embroidered fleece hoodie",
            "basePrice": 35.00,
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
* **Access:** `PUBLIC`, `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Response:** `200 OK` with product and its variants, or `404 Not Found`

### 6.3 Create Product
* **Method & URL:** `POST /api/products`
* **Access:** `ADMIN`
* **Request Body:**
  ```json
  {
    "name": "Organization Hoodie 2026",
    "description": "Embroidered fleece hoodie",
    "basePrice": 35.00,
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
* **Request Body:** Partial product fields (`name`, `description`, `basePrice`, `imageUrl`, `isAvailable`).
* **Response:** `200 OK` with updated product object

### 6.5 Delete / Archive Product
* **Method & URL:** `DELETE /api/products/:id`
* **Access:** `ADMIN`
* **Description:** Soft-deletes or archives product listing.
* **Response:** `200 OK` or `204 No Content`

### 6.6 Add Product Variant
* **Method & URL:** `POST /api/products/:id/variants`
* **Access:** `ADMIN`
* **Description:** Adds a new size variant to an existing product (e.g. adding XXL).
* **Request Body:**
  ```json
  {
    "size": "XXL",
    "stockQuantity": 20
  }
  ```
* **Response:** `201 Created` with new variant record
* **Error Codes:** `409 Conflict (Size already exists for product)`

### 6.7 Update Variant Stock Level
* **Method & URL:** `PATCH /api/products/:productId/variants/:variantId`
* **Access:** `ADMIN`
* **Request Body:**
  ```json
  {
    "stockQuantity": 50
  }
  ```
* **Response:** `200 OK` with updated variant

### 6.8 Low Stock Alerts
* **Method & URL:** `GET /api/products/low-stock`
* **Access:** `ADMIN`
* **Description:** Returns product variants whose `stockQuantity` is below a threshold (default: 5 units). Powers Admin inventory warning banners.
* **Query Parameters:** `threshold` (default 5)
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "data": {
        "items": [
          {
            "productId": "uuid-v4",
            "productName": "Organization Hoodie 2026",
            "variantId": "var-4",
            "size": "XL",
            "stockQuantity": 2
          }
        ]
      }
    }
    ```

### 6.9 Place Merchandise Order `[PENDING REVIEW]`
* **Method & URL:** `POST /api/orders`
* **Access:** `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Places an order for selected size variants. Checks stock availability and deducts inventory atomically inside a database transaction to prevent overselling.
* **Request Body:**
  ```json
  {
    "items": [
      { "variantId": "var-2", "quantity": 1 },
      { "variantId": "var-3", "quantity": 2 }
    ]
  }
  ```
* **Validation & Business Rules:**
  - `items` array must contain at least 1 item.
  - Verifies requested `quantity <= stockQuantity`.
  - Calculates `totalAmount` server-side from product `basePrice`.
* **Status:** `[PENDING REVIEW: Inventory reservation timing — immediate deduction on PENDING vs deduction only upon payment]`
* **Response:**
  * **201 Created:**
    ```json
    {
      "status": "ok",
      "message": "Order created successfully",
      "data": {
        "id": "uuid-v4",
        "userId": "uuid-v4",
        "totalAmount": 105.00,
        "status": "PENDING",
        "items": [
          { "variantId": "var-2", "size": "M", "quantity": 1, "unitPrice": 35.00 },
          { "variantId": "var-3", "size": "L", "quantity": 2, "unitPrice": 35.00 }
        ],
        "createdAt": "2026-10-10T14:00:00.000Z"
      }
    }
    ```
* **Error Codes:**
  * `400 Bad Request`: Invalid payload
  * `422 Unprocessable`: Insufficient stock for requested variant

### 6.10 Get User Orders
* **Method & URL:** `GET /api/orders/me`
* **Access:** `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Response:** `200 OK` with authenticated user's order history and items

### 6.11 Get Order Details
* **Method & URL:** `GET /api/orders/:id`
* **Access:** `MEMBER` (Owner only), `ADMIN`
* **Response:** `200 OK` with full order breakdown

### 6.12 List All Orders (Admin)
* **Method & URL:** `GET /api/orders`
* **Access:** `ADMIN`
* **Query Parameters:** `status` (`PENDING`, `PAID`, `SHIPPED`, `DELIVERED`, `CANCELLED`), `page`, `limit`
* **Response:** `200 OK` with paginated order collection

### 6.13 Update Order Status `[PENDING REVIEW]`
* **Method & URL:** `PATCH /api/orders/:id/status`
* **Access:** `ADMIN`
* **Request Body:**
  ```json
  {
    "status": "PAID"
  }
  ```
* **Status:** `[PENDING REVIEW: Automatic Transaction creation when status transitions to PAID]`
* **Response:** `200 OK`

### 6.14 Cancel Order `[PENDING REVIEW]`
* **Method & URL:** `PATCH /api/orders/:id/cancel`
* **Access:** `MEMBER` (Owner only if still PENDING), `ADMIN`
* **Description:** Cancels an order and automatically replenishes the inventory stock of all order items.
* **Status:** `[PENDING REVIEW: Automatic stock restocking confirmation upon cancellation]`
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Order cancelled and stock replenished",
      "data": { "id": "uuid-v4", "status": "CANCELLED" }
    }
    ```

---

## 7. Volunteer & Task Management Module

### 7.1 List All Volunteer Tasks
* **Method & URL:** `GET /api/tasks`
* **Access:** `ADMIN`
* **Query Parameters:** `status` (`PENDING`, `IN_PROGRESS`, `COMPLETED`, `CANCELLED`), `eventId`, `assigneeId`, `page`, `limit`
* **Response:** `200 OK` with paginated task collection

### 7.2 Browse Available Volunteer Opportunities
* **Method & URL:** `GET /api/tasks/opportunities`
* **Access:** `VOLUNTEER`, `ADMIN`
* **Description:** Lists open, unassigned tasks (`assigneeId === null`) that volunteers can apply for or claim.
* **Query Parameters:** `eventId` (optional), `page`, `limit`
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
* **Access:** `VOLUNTEER`
* **Description:** Returns tasks assigned to the authenticated volunteer.
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "data": {
        "items": [
          {
            "id": "uuid-v4",
            "title": "Badge Distribution Desk",
            "description": "Manage check-in desk at Hall A",
            "eventId": "uuid-v4",
            "deadline": "2026-11-15T09:00:00.000Z",
            "status": "IN_PROGRESS"
          }
        ]
      }
    }
    ```

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
* **Response:** `201 Created`

### 7.5 Apply / Self-Assign for Volunteer Task `[PENDING REVIEW]`
* **Method & URL:** `POST /api/tasks/:id/apply`
* **Access:** `VOLUNTEER`
* **Description:** An authorized volunteer claims or applies for an unassigned task.
* **Status:** `[PENDING REVIEW: Direct self-assignment vs requiring Admin approval step]`
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "message": "Task successfully assigned to you",
      "data": {
        "id": "uuid-v4",
        "assigneeId": "uuid-v4-volunteer",
        "status": "IN_PROGRESS"
      }
    }
    ```
* **Error Codes:**
  * `403 Forbidden`: User is not a registered Volunteer
  * `409 Conflict`: Task is already assigned to someone else

### 7.6 Update Task Progress / Status `[PENDING REVIEW]`
* **Method & URL:** `PATCH /api/tasks/:id/status`
* **Access:** `VOLUNTEER` (Assigned user only), `ADMIN`
* **Request Body:**
  ```json
  {
    "status": "COMPLETED"
  }
  ```
* **Status:** `[PENDING REVIEW: Whether progress tracking includes percentage number/notes or strictly the TaskStatus enum]`
* **Response:** `200 OK`

### 7.7 Assign / Reassign Task (Admin)
* **Method & URL:** `PATCH /api/tasks/:id/assign`
* **Access:** `ADMIN`
* **Request Body:**
  ```json
  {
    "assigneeId": "uuid-v4-volunteer"
  }
  ```
* **Response:** `200 OK`

### 7.8 Delete Task
* **Method & URL:** `DELETE /api/tasks/:id`
* **Access:** `ADMIN`
* **Response:** `200 OK` or `204 No Content`

---

## 8. Announcements & Notifications Module

### 8.1 List Announcements
* **Method & URL:** `GET /api/announcements`
* **Access:** `PUBLIC`, `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Description:** Returns announcements. Automatically filters announcements according to the caller's role (e.g. standard members only see `ALL` and `MEMBERS`; volunteers see `VOLUNTEERS`).
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
            "content": "Meeting scheduled for next Friday in Room 204.",
            "audience": "ALL",
            "publishedBy": { "name": "Admin Team" },
            "createdAt": "2026-10-09T10:00:00.000Z"
          }
        ],
        "pagination": { "page": 1, "limit": 20, "total": 1, "totalPages": 1 }
      }
    }
    ```

### 8.2 Get Announcement Details
* **Method & URL:** `GET /api/announcements/:id`
* **Access:** `PUBLIC`, `MEMBER`, `VOLUNTEER`, `ADMIN`
* **Response:** `200 OK` with announcement record, or `404 Not Found`

### 8.3 Create Announcement
* **Method & URL:** `POST /api/announcements`
* **Access:** `ADMIN`
* **Request Body:**
  ```json
  {
    "title": "General Body Meeting 2026",
    "content": "Meeting scheduled for next Friday in Room 204.",
    "audience": "ALL"
  }
  ```
* **Validation:**
  - `audience`: `"ALL"`, `"MEMBERS"`, or `"VOLUNTEERS"` `[PROVISIONAL FIELD]`
* **Response:** `201 Created`

### 8.4 Update Announcement
* **Method & URL:** `PATCH /api/announcements/:id`
* **Access:** `ADMIN`
* **Request Body:** Partial announcement fields (`title`, `content`, `audience`).
* **Response:** `200 OK` with updated announcement

### 8.5 Delete Announcement
* **Method & URL:** `DELETE /api/announcements/:id`
* **Access:** `ADMIN`
* **Response:** `200 OK` or `204 No Content`

---

## 9. Finance & Reimbursements Module

### 9.1 Financial Overview & Balance
* **Method & URL:** `GET /api/finance/summary`
* **Access:** `ADMIN`
* **Description:** Aggregates total income, total expenses, and calculates current net balance (`Total Income - Total Expenses`).
* **Query Parameters:** `startDate` (optional), `endDate` (optional)
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "data": {
        "totalIncome": 12500.00,
        "totalExpense": 4200.00,
        "currentBalance": 8300.00,
        "breakdownByCategory": {
          "MEMBERSHIP_DUE": 5000.00,
          "TICKET_SALE": 4500.00,
          "MERCHANDISE_SALE": 3000.00,
          "EVENT_EXPENSE": 2800.00,
          "REIMBURSEMENT": 1400.00
        }
      }
    }
    ```

### 9.2 List Financial Transactions
* **Method & URL:** `GET /api/finance/transactions`
* **Access:** `ADMIN`
* **Query Parameters:** `type` (`INCOME`, `EXPENSE`), `category`, `page` (default 1), `limit` (default 20)
* **Response:** `200 OK` with paginated transaction ledger

### 9.3 Record Manual Transaction `[PENDING REVIEW]`
* **Method & URL:** `POST /api/finance/transactions`
* **Access:** `ADMIN`
* **Description:** Records an ad-hoc income or expense item (e.g. equipment purchase, sponsorship, external donation).
* **Request Body:**
  ```json
  {
    "type": "EXPENSE",
    "category": "EVENT_EXPENSE",
    "amount": 150.00,
    "description": "AV equipment rental for workshop"
  }
  ```
* **Response:** `201 Created`

### 9.4 Submit Reimbursement Claim
* **Method & URL:** `POST /api/reimbursements`
* **Access:** `VOLUNTEER` *(Only volunteers who incur approved event expenses)*
* **Description:** Submits an out-of-pocket volunteer expense claim with receipt evidence.
* **Request Body:**
  ```json
  {
    "amount": 42.50,
    "reason": "Printouts and banners for event entrance",
    "receiptUrl": "https://..."
  }
  ```
* **Validation:**
  - `amount`: number > 0
  - `reason`: string required (min 5 chars)
  - `receiptUrl`: string/URL optional `[PROVISIONAL FIELD]`
* **Response:**
  * **201 Created:**
    ```json
    {
      "status": "ok",
      "message": "Reimbursement claim submitted",
      "data": {
        "id": "uuid-v4",
        "applicantId": "uuid-v4",
        "amount": 42.50,
        "reason": "Printouts and banners for event entrance",
        "status": "PENDING",
        "createdAt": "2026-10-10T15:00:00.000Z"
      }
    }
    ```
* **Error Codes:**
  * `400 Bad Request`: Validation failure
  * `403 Forbidden`: User is not a registered Volunteer

### 9.5 Get User's Own Reimbursements
* **Method & URL:** `GET /api/reimbursements/me`
* **Access:** `VOLUNTEER`
* **Response:** `200 OK` with list of user's reimbursement claims and statuses

### 9.6 List All Reimbursements (Admin Review)
* **Method & URL:** `GET /api/reimbursements`
* **Access:** `ADMIN`
* **Query Parameters:** `status` (`PENDING`, `APPROVED`, `REJECTED`, `PAID`), `page`, `limit`
* **Response:** `200 OK` with paginated reimbursement claims

### 9.7 Review / Update Reimbursement Status `[PENDING REVIEW]`
* **Method & URL:** `PATCH /api/reimbursements/:id/status`
* **Access:** `ADMIN`
* **Request Body:**
  ```json
  {
    "status": "APPROVED"
  }
  ```
* **Status:** `[PENDING REVIEW: When status transitions to 'PAID', whether the system automatically generates an EXPENSE transaction in the Transaction ledger]`
* **Response:** `200 OK` with updated reimbursement record

---

## 10. Aggregated Dashboard Module (PRD Section 7)

### 10.1 Admin Dashboard Summary
* **Method & URL:** `GET /api/dashboard/admin`
* **Access:** `ADMIN`
* **Description:** Consolidated operational metrics powering the Admin overview screen in a single request.
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
          "totalIncome": 12500.00,
          "totalExpense": 4200.00,
          "currentBalance": 8300.00,
          "pendingReimbursementsCount": 3
        },
        "recentAnnouncements": [
          { "id": "uuid-v4", "title": "General Body Meeting 2026", "createdAt": "..." }
        ]
      }
    }
    ```

### 10.2 Volunteer Dashboard Summary
* **Method & URL:** `GET /api/dashboard/volunteer`
* **Access:** `VOLUNTEER`
* **Description:** Aggregates a volunteer's assigned tasks, upcoming event schedules, check-in tool permissions, and reimbursement status.
* **Response:**
  * **200 OK:**
    ```json
    {
      "status": "ok",
      "data": {
        "assignedTasks": [
          { "id": "uuid-v4", "title": "Badge Distribution Desk", "status": "IN_PROGRESS", "deadline": "..." }
        ],
        "upcomingAssignedEvents": [
          { "id": "uuid-v4", "title": "Annual Tech Symposium", "date": "...", "venue": "Auditorium" }
        ],
        "canCheckInTickets": true,
        "reimbursementsSummary": {
          "pendingCount": 1,
          "totalApproved": 75.00
        }
      }
    }
    ```

### 10.3 Member Dashboard Summary
* **Method & URL:** `GET /api/dashboard/member`
* **Access:** `MEMBER`
* **Description:** Consolidates a member's active membership validity, ticket passes, merchandise orders, and announcements.
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
          { "orderId": "uuid-v4", "totalAmount": 105.00, "status": "PENDING" }
        ],
        "recentAnnouncements": [
          { "id": "uuid-v4", "title": "General Body Meeting 2026", "createdAt": "..." }
        ]
      }
    }
    ```

---

## 11. Summary of Endpoints Requiring Review After Schema Finalization

The following endpoints directly depend on provisional schema decisions and must be reviewed once teammate schema updates are finalized:

1. **`PATCH /api/users/:id/role` (User Roles & Volunteer Flag Architecture):**
   * *Reason:* The provisional schema uses `Role { ADMIN, MEMBER }` + a separate `isVolunteer: Boolean` flag on `User`. Needs team decision whether `VOLUNTEER` will become a distinct `Role` enum value or remain a dual-role boolean permission flag.
2. **`POST /api/events/:id/tickets` (Single Ticket vs. Guest Tickets):**
   * *Reason:* The provisional schema defines `@@unique([eventId, userId])`, strictly allowing at most 1 ticket per user per event. Needs confirmation if members may purchase multiple tickets for guests or non-members.
3. **`POST /api/orders` & `PATCH /api/orders/:id/cancel` (Inventory Reservation & Restocking Timing):**
   * *Reason:* Provisional schema defines `ProductVariant.stockQuantity` and `OrderStatus (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)`. Needs review on whether stock is deducted upon `PENDING` order creation or only upon payment, and whether cancelling an order triggers automatic stock restocking.
4. **`PATCH /api/memberships/:id/status`, `PATCH /api/orders/:id/status`, and `PATCH /api/reimbursements/:id/status` (Automatic Financial Ledger Integration):**
   * *Reason:* The `Transaction` entity links to `orderId`, `ticketId`, `membershipId`, and `reimbursementId`. Need to verify whether payment confirmations automatically trigger backend `Transaction` row creations within database transactions.
5. **`POST /api/tasks/:id/apply` (Volunteer Application Approval Workflow):**
   * *Reason:* The provisional schema only has `assigneeId` on `VolunteerTask`. Needs decision whether claiming an open opportunity is instant self-assignment or creates an application requiring Admin approval.
6. **`POST /api/reimbursements` (Receipt File Storage Mechanism):**
   * *Reason:* Provisional schema provides an optional `receiptUrl String?`. File upload mechanism (cloud storage URL, base64 payload, or dedicated multipart upload endpoint `POST /api/uploads`) must be confirmed.
7. **`POST /api/memberships/:id/remind` & `POST /api/announcements` (Mailing List / Email Integration):**
   * *Reason:* Email delivery is noted as an integration in `Architecture.md` and `PRD.md`. Specific third-party email provider and template configuration remain unconfirmed.
