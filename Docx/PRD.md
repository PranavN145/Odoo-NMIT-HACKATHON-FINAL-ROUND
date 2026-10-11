# Skyline Student Association Platform
## Product Requirements Document (PRD)

**Version:** 1.0  
**Scope:** Revised plan  
**Product:** Skyline Student Association Platform

---

## 1. Product Overview

The Skyline Student Association Platform is a unified web platform for public event registration, merchandise browsing, membership features, volunteer participation, and association management.

The platform consists of a public website and four role-based platforms: **Admin, Manager, Member, and User**.

### Product Objective

Provide a single platform where students can explore and register for events, browse merchandise, access membership-related features, and where authorized association personnel can manage events, merchandise, volunteers, and finances.

## 2. Platform Structure

1. **Public Website**
   - Events
   - Merchandise
   - Login / Signup

2. **Authentication and Role Selection**
   - Admin
   - Manager
   - Member
   - User

3. **Role-Based Platforms**
   - Admin platform
   - Manager platform
   - Member platform
   - User platform

Role selection determines the intended login route. The system must verify the user's actual permissions before granting access.

## 3. Public Website

The public website is the entry point for visitors. Visitors can browse events and merchandise without being forced to log in.

### 3.1 Common Header

The header contains:
- Skyline Student Association logo
- Events / Home
- Merchandise
- Login dropdown

### 3.2 Events Page

The first page displays upcoming events in a card-based layout.

Each event card should display:
- Event image or visual
- Event name
- Date and time
- Venue
- Short description
- Register button

#### Event Registration Flow

1. The participant selects **Register** on an event card.
2. A registration form opens without requiring login.
3. The participant enters basic details.
4. The participant submits the form.
5. The system records the registration and displays confirmation.

The exact form fields and confirmation mechanism can be finalized during implementation.

### 3.3 Merchandise Page

The merchandise page uses the same public header and displays products in cards.

Examples of products:
- Club hoodies
- Club T-shirts
- Event-specific merchandise
- Other association merchandise

Each product card should display:
- Product image
- Product name
- Price
- Relevant product details
- View or Order button

The public catalogue displays merchandise created through the management platform.

### 3.4 Login and Signup

Clicking **Login** opens a dropdown containing:
- Admin
- Manager
- Member
- User

Selecting a role redirects the visitor to the appropriate login/signup interface. After successful authentication, the user is redirected to the platform associated with their role.

The system must verify permissions server-side rather than trusting the role selected in the dropdown.

## 4. Admin Platform

The Admin platform is the administrative area of the association.

### 4.1 Header

The header contains:
- Association logo
- Skyline Student Association name
- Profile section

### 4.2 Responsibilities

The Admin platform will provide access to administrative tasks associated with the system.

The specific admin tasks and individual screens have not yet been finalized. They should be defined separately rather than adding unplanned modules to this version of the PRD.

No separate navigation bar has been specified for the Admin platform at this stage.

## 5. Manager Platform

The Manager platform is the main operational workspace for events, merchandise, volunteers, and finances.

### 5.1 Header

The header contains:
- Association logo, without the logo's accompanying name
- Skyline Student Association name
- Profile section

### 5.2 Navigation

The Manager platform has four main navigation items:
1. Dashboard
2. Manage
3. Add
4. Finance

### 5.3 Dashboard

The dashboard provides a basic overview of the Manager platform and summarizes information from Manage, Add, and Finance.

Its purpose is to help managers understand the current state of association operations without opening every section.

### 5.4 Manage

The Manage section contains Events, Merchandise, and Volunteers.

#### Events
- View events in card format.
- Access individual event details.
- Manage existing events and their registrations.

#### Merchandise
- View merchandise in card format.
- Access product details.
- Manage existing merchandise listings.

#### Volunteers
- View volunteer records in a structured list or table rather than cards.
- View volunteers and their assigned event tasks.
- Track whether tasks have been assigned.

### 5.5 Add

The Add section contains two options:

#### Add Event
Create a new event and provide its relevant details.

#### Add Merchandise
Create a new merchandise listing with product details and price.

Newly created records should appear in the corresponding Manage section and, where applicable, on the public website.

### 5.6 Finance

The Finance section provides a view of the association's financial information.

Detailed financial metrics, reports, and transaction controls will be defined later. The intended scope aligns with tracking money collected, expenses, reimbursements, and the remaining budget.

## 6. Member Platform

The Member platform is for students with an active association membership.

### 6.1 Header

The header contains:
- Association logo
- Skyline Student Association name
- Profile section

### 6.2 Features

#### View Events
- Browse available events.
- View event details.
- Register for events using the applicable member price.

#### View Merchandise
- Browse club and event merchandise.
- View product prices with applicable member discounts.

#### Membership Benefits
- View benefits available through membership.
- Understand applicable event and merchandise discounts.

#### Membership Pricing and Status
- View membership pricing.
- View the applicable membership status.

#### Task Status
- See whether the member has been assigned an event task.
- View assigned tasks or see that they are currently free.

Discounted prices shown to members should reflect the applicable membership pricing rather than the standard non-member price.

## 7. User Platform

The User platform is intended for registered users who are not currently accessing the system as members.

### 7.1 Header

The header contains:
- Association logo
- Skyline Student Association name
- Profile section

### 7.2 Features

#### View and Register for Events
- Browse available events.
- View event details.
- Register for events using the standard registration flow.

#### Event Attendance History
- View events the user has attended.
- Access previous participation records.

#### Seek as Volunteer
- Express interest in volunteering.
- Explore opportunities to help with association events.

The User platform retains the basic event browsing and registration functionality available to public visitors while adding personalized attendance history and volunteer interest.

## 8. Role-Based Access Summary

| Feature | Admin | Manager | Member | User |
|---|---|---|---|---|
| View public events | Not specified | Not specified | Yes | Yes |
| Register for events | Not specified | Not specified | Yes | Yes |
| View merchandise | Not specified | Not specified | Yes | Basic public catalogue |
| Manage events | To be defined | Yes | No | No |
| Manage merchandise | To be defined | Yes | No | No |
| Manage volunteers | To be defined | Yes | No | No |
| Add events and products | To be defined | Yes | No | No |
| View finances | To be defined | Yes | No | No |
| Member discounts and benefits | Not applicable | Not applicable | Yes | Not applicable |
| Membership pricing and status | To be defined | Not specified | Yes | Not specified |
| Assigned task status | To be defined | Manage assignments | View own status | Not specified |
| Attendance history | To be defined | Not specified | Not specified | Yes |
| Volunteer interest | Not specified | Manage volunteers | Not specified | Yes |

**Note:** “To be defined” means the capability has not been specified sufficiently in the current plan. It does not mean the feature is confirmed or excluded.

## 9. Core User Flows

### 9.1 Public Event Registration

1. Open the website.
2. Browse event cards.
3. Select Register.
4. Enter basic details.
5. Submit registration and receive confirmation.

### 9.2 Role-Based Login

1. Click Login.
2. Select a role.
3. Open the corresponding login/signup page.
4. Verify identity and permissions.
5. Redirect to the authorized role platform.

### 9.3 Manager Creates an Event

1. Open Add.
2. Select Add Event.
3. Enter event details.
4. Save the event.
5. The event appears in Manage and in the public catalogue when available for registration.

## 10. Functional Requirements

- **FR-01 — Public Access:** Visitors can browse events and merchandise without mandatory login.
- **FR-02 — Event Registration:** Participants can register for events by submitting basic details.
- **FR-03 — Merchandise Catalogue:** Products appear in a card-based public catalogue.
- **FR-04 — Authentication:** Users can access role-specific login/signup routes.
- **FR-05 — Role Access:** The system verifies permissions before allowing access to role-specific platforms.
- **FR-06 — Manager Dashboard:** Managers can view an overview of operational sections.
- **FR-07 — Event Management:** Managers can view and manage events.
- **FR-08 — Merchandise Management:** Managers can view and manage merchandise.
- **FR-09 — Volunteer Management:** Managers can view volunteers and their task assignments.
- **FR-10 — Record Creation:** Managers can add events and merchandise.
- **FR-11 — Finance:** Managers can view association financial information.
- **FR-12 — Membership Features:** Members can view benefits, pricing, status, and applicable discounts.
- **FR-13 — Task Visibility:** Members can check their assignment status.
- **FR-14 — User Participation:** Users can view attendance history and express interest in volunteering.

## 11. Scope Boundaries

To keep this PRD faithful to the current plan, the following items are not added as new requirements at this stage:
- Payment gateway integration
- QR-code ticketing or event check-in
- Automated email or WhatsApp notifications
- Detailed financial reports or expense approval workflows
- Membership renewal reminders
- Inventory forecasting or advanced merchandise analytics
- Additional dashboards or navigation modules
- New user roles or role-specific features not listed above

These can be considered in a later revision alongside any mandatory requirements from the official problem statement.

## 12. Expected Outcome

The final product will provide one consistent platform where:
- Visitors can explore events and merchandise.
- Participants can register for events without first creating an account.
- Users can sign in and access features relevant to their role.
- Members receive membership-specific pricing and can check task status.
- Managers can oversee events, merchandise, volunteers, and finances.
- Admin capabilities can be defined separately without changing the agreed platform structure.

---

**Document status:** Baseline PRD for the revised plan.  
**Next step:** Finalize Admin responsibilities and the detailed behavior of each existing module without expanding the scope prematurely.
