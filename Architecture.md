# System Architecture: Student Organization System

Based on your finalized technology stack, the system will use a Next.js frontend, Tailwind CSS for styling, a Node.js and Express REST API, PostgreSQL for data storage, and Prisma as the ORM. Authentication will use bcrypt for password hashing and JWT for token-based authentication. Postman will be used to test API endpoints.

The architecture below maps these technologies directly to your PRD and its three user roles: Admin, Volunteer, and Member.

## 1. High-level architecture

## Presentation Layer

Next.js + React

Admin Dashboard · Volunteer Portal · Member Portal

Tailwind CSS for responsive styling

HTTP / HTTPS · JSON · REST API

## Backend Layer

Node.js + Express.js

REST API · Routes · Controllers · Business Logic · Middleware

Authentication

bcrypt + JWT

Business Modules

Membership, Events, Finance, and more

Prisma ORM

## Database Layer

PostgreSQL

Users · Memberships · Events · Tickets · Products · Orders · Tasks · Transactions

### API Testing

Postman: endpoint validation, authentication, permissions, and error handling

## 2. Technology stack and responsibilities

| Layer          | Technology           | Responsibility                                             |
| -------------- | -------------------- | ---------------------------------------------------------- |
| Frontend       | Next.js + React      | Pages, dashboards, forms and user interactions             |
| Styling        | Tailwind CSS         | Responsive layouts, reusable styling and UI consistency    |
| Backend        | Node.js + Express.js | Business logic and REST API endpoints                      |
| Database       | PostgreSQL           | Persistent, relational application data                    |
| ORM            | Prisma               | Database queries, models, migrations and relationships     |
| Authentication | bcrypt + JWT         | Password hashing and token-based authentication            |
| API testing    | Postman              | Testing requests, responses, authorization and error cases |

## 3. Backend module architecture

The Express backend should be divided into modules corresponding to the PRD.

Authentication & Users

Registration, login, password hashing, JWT validation, roles

Membership

Dues, active status, benefits, expiry and renewals

Events & Tickets

Event creation, pricing, capacity, ticket issuance and check-in

Merchandise

Products, sizes, inventory, orders and payment status

Volunteer Management

Applications, task assignments, deadlines and progress

Announcements

Publishing, audience targeting and announcement history

Finance & Reports

Income, expenses, reimbursements, balances and reporting

All modules run inside one Express application and use Prisma to access PostgreSQL. This is a modular monolith, which is simpler to build, debug, test, and deploy than separate microservices.

## 4. Request and authentication flow

\#chatgpt-mermaid-\_r_t1\_{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;fill:rgb(237, 237, 237);}@keyframes edge-animation-frame{from{stroke-dashoffset:0;}}@keyframes dash{to{stroke-dashoffset:0;}}#chatgpt-mermaid-\_r_t1\_ .edge-animation-slow{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 50s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_t1\_ .edge-animation-fast{stroke-dasharray:9,5!important;stroke-dashoffset:900;animation:dash 20s linear infinite;stroke-linecap:round;}#chatgpt-mermaid-\_r_t1\_ .error-icon{fill:rgb(48, 48, 48);}#chatgpt-mermaid-\_r_t1\_ .error-text{fill:rgb(237, 237, 237);stroke:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ .edge-thickness-normal{stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ .edge-thickness-thick{stroke-width:3.5px;}#chatgpt-mermaid-\_r_t1\_ .edge-pattern-solid{stroke-dasharray:0;}#chatgpt-mermaid-\_r_t1\_ .edge-thickness-invisible{stroke-width:0;fill:none;}#chatgpt-mermaid-\_r_t1\_ .edge-pattern-dashed{stroke-dasharray:3;}#chatgpt-mermaid-\_r_t1\_ .edge-pattern-dotted{stroke-dasharray:2;}#chatgpt-mermaid-\_r_t1\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_t1\_ .marker.cross{stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_t1\_ svg{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:16px;}#chatgpt-mermaid-\_r_t1\_ p{margin:0;}#chatgpt-mermaid-\_r_t1\_ .label{font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ .cluster-label text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ .cluster-label span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ .cluster-label span p{background-color:transparent;}#chatgpt-mermaid-\_r_t1\_ .label text,#chatgpt-mermaid-\_r_t1\_ span{fill:rgb(237, 237, 237);color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ .node rect,#chatgpt-mermaid-\_r_t1\_ .node circle,#chatgpt-mermaid-\_r_t1\_ .node ellipse,#chatgpt-mermaid-\_r_t1\_ .node polygon,#chatgpt-mermaid-\_r_t1\_ .node path{fill:rgb(9, 23, 44);stroke:rgb(31, 78, 148);stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ .rough-node .label text,#chatgpt-mermaid-\_r_t1\_ .node .label text,#chatgpt-mermaid-\_r_t1\_ .image-shape .label,#chatgpt-mermaid-\_r_t1\_ .icon-shape .label{text-anchor:middle;}#chatgpt-mermaid-\_r_t1\_ .node .katex path{fill:#000;stroke:#000;stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ .rough-node .label,#chatgpt-mermaid-\_r_t1\_ .node .label,#chatgpt-mermaid-\_r_t1\_ .image-shape .label,#chatgpt-mermaid-\_r_t1\_ .icon-shape .label{text-align:center;}#chatgpt-mermaid-\_r_t1\_ .node.clickable{cursor:pointer;}#chatgpt-mermaid-\_r_t1\_ .root .anchor path{fill:rgb(175, 175, 175)!important;stroke-width:0;stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_t1\_ .arrowheadPath{fill:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_t1\_ .edgePath .path{stroke:rgb(175, 175, 175);stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ .flowchart-link{stroke:rgb(175, 175, 175);fill:none;}#chatgpt-mermaid-\_r_t1\_ .edgeLabel{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_t1\_ .edgeLabel p{background-color:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_t1\_ .edgeLabel rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_t1\_ .labelBkg{background-color:rgba(0, 0, 0, 0.5);}#chatgpt-mermaid-\_r_t1\_ .cluster rect{fill:rgb(48, 48, 48);stroke:rgba(255, 255, 255, 0.15);stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ .cluster text{fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ .cluster span{color:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ div.mermaidTooltip{position:absolute;text-align:center;max-width:200px;padding:2px;font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";font-size:12px;background:rgb(48, 48, 48);border:1px solid rgba(255, 255, 255, 0.15);border-radius:2px;pointer-events:none;z-index:100;}#chatgpt-mermaid-\_r_t1\_ .flowchartTitleText{text-anchor:middle;font-size:18px;fill:rgb(237, 237, 237);}#chatgpt-mermaid-\_r_t1\_ rect.text{fill:none;stroke-width:0;}#chatgpt-mermaid-\_r_t1\_ .icon-shape,#chatgpt-mermaid-\_r_t1\_ .image-shape{background-color:rgb(0, 0, 0);text-align:center;}#chatgpt-mermaid-\_r_t1\_ .icon-shape p,#chatgpt-mermaid-\_r_t1\_ .image-shape p{background-color:rgb(0, 0, 0);padding:2px;}#chatgpt-mermaid-\_r_t1\_ .icon-shape .label rect,#chatgpt-mermaid-\_r_t1\_ .image-shape .label rect{opacity:0.5;background-color:rgb(0, 0, 0);fill:rgb(0, 0, 0);}#chatgpt-mermaid-\_r_t1\_ .label-icon{display:inline-block;height:1em;overflow:visible;vertical-align:-0.125em;}#chatgpt-mermaid-\_r_t1\_ .node .label-icon path{fill:currentColor;stroke:revert;stroke-width:revert;}#chatgpt-mermaid-\_r_t1\_ .node .neo-node{stroke:rgb(31, 78, 148);}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].node rect,#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].cluster rect,#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].node polygon{stroke:url(#chatgpt-mermaid-\_r_t1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].swimlane.cluster rect{filter:none;}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].node path{stroke:url(#chatgpt-mermaid-\_r_t1\_-gradient);stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].node .outer-path{filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].node .neo-line path{stroke:rgb(31, 78, 148);filter:none;}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].node circle{stroke:url(#chatgpt-mermaid-\_r_t1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].node circle .state-start{fill:#000000;}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].icon-shape .icon{fill:url(#chatgpt-mermaid-\_r_t1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_t1\_ [data-look="neo"].icon-shape .icon-neo path{stroke:url(#chatgpt-mermaid-\_r_t1\_-gradient);filter:drop-shadow( 1px 2px 2px rgba(185,185,185,1));}#chatgpt-mermaid-\_r_t1\_ .node text{font-size:14px;font-weight:600;letter-spacing:normal;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_t1\_ .edgeLabels text{font-size:13px;font-weight:600;letter-spacing:-0.08px;fill:rgb(153, 206, 255);}#chatgpt-mermaid-\_r_t1\_ .node tspan[font-weight="normal"],#chatgpt-mermaid-\_r_t1\_ .edgeLabels tspan[font-weight="normal"]{font-weight:600;}#chatgpt-mermaid-\_r_t1\_ .edgeLabel .label rect{opacity:1;rx:13px;ry:13px;fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ .node rect,#chatgpt-mermaid-\_r_t1\_ .node circle,#chatgpt-mermaid-\_r_t1\_ .node ellipse,#chatgpt-mermaid-\_r_t1\_ .node polygon,#chatgpt-mermaid-\_r_t1\_ .node path{fill:rgb(0, 40, 77);stroke:rgba(255, 255, 255, 0.1);stroke-width:1px;}#chatgpt-mermaid-\_r_t1\_ .node rect{rx:16px;ry:16px;}#chatgpt-mermaid-\_r_t1\_ .node.mermaid-decision .label-container{fill:rgb(0, 14, 26);stroke:rgb(26, 62, 95);stroke-dasharray:2,2;}#chatgpt-mermaid-\_r_t1\_ .edgePaths .flowchart-link{stroke:rgb(175, 175, 175);stroke-width:1px;stroke-linecap:round;stroke-linejoin:round;}#chatgpt-mermaid-\_r_t1\_ .marker{fill:rgb(175, 175, 175);stroke:rgb(175, 175, 175);}#chatgpt-mermaid-\_r_t1\_ :root{--mermaid-font-family:-apple-system-body,ui-sans-serif,-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";}User opens Next.js applicationUser submits login formExpress REST APIFind user through PrismaCompare password usingbcryptCredentials valid?Return authentication errorIssue signed JWTAuthenticated API requestJWT authenticationmiddlewareRole authorization middlewarePermission granted?Return 403 ForbiddenController and business logicPrisma ORMPostgreSQLJSON responseUpdate Next.js interfaceNoYesNoYes

Important security choices:

- bcrypt stores password hashes, never plaintext passwords.
- JWTs must be signed and validated on protected API requests.
- Role permissions must be checked by the backend.
- For a browser-based app, prefer secure, `HttpOnly`, `Secure`, appropriately `SameSite` cookies for JWT storage rather than exposing tokens to client-side JavaScript. Cookie-based authentication also requires suitable CSRF protections.
- Use HTTPS in deployment and keep signing secrets in environment variables.

## 5. Database architecture with Prisma

The primary PostgreSQL entities should be:

### Identity and membership

`User` → `Membership` → membership payment records

### Events and attendance

`Event` → `Ticket` → `CheckIn`; tickets reference the purchasing user.

### Merchandise

`Product` → `InventoryVariant` → `Order` → `OrderItem`

### Volunteer operations

`VolunteerTask` → task assignment and progress records

### Communication and finance

`Announcement`, `Transaction`, `Reimbursement`, and payment reference records

Prisma models define these entities, while PostgreSQL enforces relationships and data constraints. Use database transactions for ticket bookings, stock updates, and financial operations that involve multiple related records.

## 6. REST API structure

A proposed endpoint structure for the Express backend:

| Module         | Example endpoints                                                     |
| -------------- | --------------------------------------------------------------------- |
| Authentication | `POST /api/auth/register`, `POST /api/auth/login`, `GET /api/auth/me` |
| Users          | `GET /api/users`, `PATCH /api/users/:id`                              |
| Memberships    | `GET /api/memberships/me`, `PATCH /api/memberships/:id`               |
| Events         | `GET /api/events`, `POST /api/events`, `GET /api/events/:id`          |
| Tickets        | `POST /api/events/:id/tickets`, `POST /api/tickets/:id/check-in`      |
| Merchandise    | `GET /api/products`, `POST /api/products`, `POST /api/orders`         |
| Volunteers     | `GET /api/tasks`, `POST /api/tasks`, `PATCH /api/tasks/:id`           |
| Announcements  | `GET /api/announcements`, `POST /api/announcements`                   |
| Finance        | `GET /api/finance/summary`, `POST /api/transactions`                  |
| Reimbursements | `POST /api/reimbursements`, `PATCH /api/reimbursements/:id`           |

These are proposed API contracts, not existing implemented endpoints. Each route should enforce appropriate permissions and validate request data.

## 7. Suggested project folder structure

```
student-organization-system/
├── frontend/
│   ├── app/
│   │   ├── login/
│   │   ├── admin/
│   │   ├── volunteer/
│   │   └── member/
│   ├── components/
│   ├── lib/
│   └── styles/
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── middleware/
│   │   ├── validators/
│   │   └── app.js
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── migrations/
│   ├── tests/
│   └── server.js
│
├── .gitignore
└── README.md
```

The frontend and backend can be maintained in separate directories in one repository. The frontend communicates with Express through the REST API, and only the backend connects directly to PostgreSQL through Prisma.

## 8. Postman testing strategy

Use Postman to validate:

1. Registration, login, and invalid credentials.
2. JWT validation and expired-token behavior.
3. Admin, Volunteer, and Member permissions.
4. Membership eligibility and ticket pricing.
5. Capacity limits and duplicate ticket check-ins.
6. Merchandise stock and concurrent orders.
7. Financial calculations and reimbursement permissions.
8. Invalid inputs, missing records, and server errors.

For the critical booking and inventory flows, include concurrent-request tests to confirm that the database prevents overselling.

## 9. Recommended implementation sequence

1. Set up Next.js, Tailwind CSS, Express, PostgreSQL, and Prisma.
2. Implement authentication, JWT handling, and role-based authorization.
3. Build membership management and the role-specific dashboards.
4. Implement events, ticket booking, capacity controls, and check-in.
5. Add volunteer tasks, announcements, merchandise, and inventory.
6. Integrate financial records, reimbursements, and dashboard reports.
7. Test the REST API in Postman, validate security and data integrity, and deploy.

Final architecture decision: Next.js + React + Tailwind CSS for the frontend, Node.js + Express REST API for the backend, PostgreSQL + Prisma for data persistence, bcrypt + JWT for authentication, and Postman for API testing. This stack is suitable for implementing the Student Organization System as a maintainable, secure MVP.