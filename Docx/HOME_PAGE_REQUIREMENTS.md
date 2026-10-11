# Public Home Page — Requirements and Implementation Brief

## 1. Objective

Refine the **existing public home page** for the Skyline Student Association Platform. The design already exists, so inspect the current implementation, compare it against these requirements, and make only the changes needed to bring it into alignment.

Do not rebuild the page from scratch, replace the existing design without reason, or redesign the Manager platform. Reuse the current components, assets, routing, and project conventions wherever possible.

## 2. Source of Truth

Before editing:
1. Read `PRD.md`, `ARCHITECTURE.md`, `MEMORY.md`, and the project's existing design documentation.
2. Inspect the repository structure and the current home page.
3. Read `package.json` and the existing routing, styling, and component setup to confirm the actual technology stack.
4. Identify which requirements below are already satisfied, partially satisfied, or missing.
5. Make a short gap list, then implement the necessary fixes.

**Do not assume the documents perfectly describe the current code.** Verify the actual repository. If a requirement conflicts with the existing architecture or stack, explain the conflict before making a major change.

## 3. Technology Constraints

Use the project's **existing, verified technology stack**. The intended project stack has been discussed as:
- Frontend: React / Next.js
- Styling: Tailwind CSS
- Backend: Node.js and Express
- Database: PostgreSQL with Prisma
- Authentication: bcrypt and JWT

These are reference decisions, not permission to introduce or migrate technologies blindly. Verify `package.json`, project configuration, and existing implementation first. Do not add a new framework, UI library, backend service, database, or dependency when the existing stack can handle the task.

The project must not be migrated to a Backend-as-a-Service provider. Do not replace existing APIs or database logic with mock data to make the design appear functional.

## 4. Design Direction

Apply the **visual language of the recently defined Manager design**, not its exact dashboard structure, navigation labels, buttons, or page-specific controls.

### Design principles
- Minimal, calm, polished, and practical.
- Clear visual hierarchy and generous but purposeful whitespace.
- Clean alignment and consistent spacing.
- Subtle borders and restrained surface separation.
- Content and event imagery should remain the focus.
- Avoid generic AI-generated design patterns and unnecessary decoration.

### Brand tokens

Use the existing project's design tokens where present. The current Manager design reference specifies:

| Token | Value | Intended use |
|---|---|---|
| Navy | `#13293D` | Primary text and strong brand elements |
| Blue | `#006494` | Secondary emphasis |
| Cerulean | `#247BA0` | Supporting emphasis |
| Accent | `#1B98E0` | Links, active states, and primary actions |
| Canvas | `#E8F1F2` | Page background where appropriate |
| Surface | `#FFFFFF` | Cards, header, and content surfaces |
| Border | `#D8E4E8` | Subtle outlines and dividers |
| Muted text | `#5F7485` | Secondary information |

- Typography: Inter with a system sans-serif fallback, if consistent with the existing setup.
- Spacing: follow the existing 8px rhythm (8, 16, 24, 32, 48px).
- Controls: approximately 8px corner radius.
- Cards: approximately 12px corner radius.
- Borders: thin and subtle.
- Shadows: restrained; use only when they improve hierarchy.
- Motion: subtle transitions only; respect `prefers-reduced-motion`.

Do not introduce a second color palette. Check the repository's `design.md` or theme configuration and resolve token differences in favor of the project's current approved design system.

### What to reuse from the Manager style
Reuse its palette, typography, spacing discipline, restrained borders, corner-radius language, accessible focus states, and overall visual consistency.

### What not to copy
Do **not** copy the Manager page's:
- Sidebar or dashboard shell
- Admin/manager navigation structure
- Dashboard metric cards or operational widgets
- Manager-specific labels and actions
- Exact header layout if it conflicts with the public-site requirements

The public home page is a public-facing experience, not an admin dashboard.

## 5. Home Page Requirements

### 5.1 Header

The public header must contain:
- Skyline Student Association logo
- Association name
- Events / Home navigation
- Merchandise navigation
- Login dropdown

Keep the header clear, balanced, and responsive. Use the existing logo asset and preserve its aspect ratio. Do not create a substitute logo if the project already contains the correct asset.

The public header must remain distinct from the Manager header. The Manager header's exact layout is not a requirement for this page.

### 5.2 Main Content: Events

The home page is the first page users see and must present available/upcoming events in a card-based layout.

Each event card should show the data available in the existing event model, such as:
- Event image, when available
- Event name
- Date and time
- Venue
- Short description
- Registration action

Only render fields that exist or are supported by the current data model. Use a graceful fallback when optional imagery or details are missing. Do not invent events, event details, registration counts, or dates.

Event cards should be consistent in spacing and hierarchy. On smaller screens, cards should reflow into fewer columns without horizontal page overflow.

### 5.3 Event Registration Without Login

A visitor must be able to start and submit an event registration without first logging in or creating an account.

Required flow:
1. Visitor selects the registration action on an event card.
2. A registration form opens or the visitor is routed to the existing registration page.
3. The participant enters the basic details required by the existing registration flow.
4. The form validates required fields and provides clear validation feedback.
5. The application submits the registration through the existing backend/API.
6. The visitor receives a success confirmation or a useful error message.

Requirements:
- Do not introduce a mandatory login gate for public event registration.
- Reuse the existing form, API, validation, and database model where available.
- Do not fake success or save registrations only in local component state.
- Prevent duplicate submissions while a request is in progress.
- Preserve entered values when practical after recoverable errors.
- Never expose private participant data in public event cards or URLs.

If the existing backend does not support public registration, document the gap rather than pretending the flow is complete. Implement only what is supported by the project's architecture and requirements.

### 5.4 Login Dropdown

The Login dropdown must offer these role choices:
- Admin
- Manager
- Member
- User

Selecting a role should open the corresponding existing login/signup route.

Requirements:
- Reuse existing routes and authentication components.
- If a route does not exist, report it clearly instead of linking to a fabricated path.
- Role selection is navigation intent, not proof of authorization.
- The backend must remain responsible for authentication and permission checks.
- The dropdown must work with mouse, keyboard, and touch.

### 5.5 Merchandise Navigation

The Merchandise item in the header must lead to the existing public merchandise page.

The home page does not need to duplicate the complete merchandise catalogue unless the existing product design already includes a preview. Do not create new merchandise workflows beyond the agreed scope.

## 6. Functional and Navigation Checks

Verify that:
- The logo or Home navigation leads to the intended public home page.
- Merchandise opens the actual merchandise page.
- The Login dropdown opens and all four role options are visible.
- Each role option uses a verified route.
- Event registration can be initiated without login.
- The registration form validates input and shows success/error states based on actual API responses.
- Event cards use real application data, not hardcoded demonstration metrics.
- Empty, loading, and error states are handled if event data is fetched dynamically.
- No button or link is decorative/inert when it implies an action.
- The browser console and terminal show no new errors caused by the changes.

## 7. Responsive Design and Accessibility

### Responsive behavior
- Desktop: balanced header and a well-spaced multi-column event-card layout.
- Tablet: reduce card columns and spacing as needed.
- Mobile: compact navigation, readable event cards, accessible controls, and no horizontal overflow.
- Keep primary touch targets practical (approximately 44px where possible).
- Ensure long event names and descriptions do not break the layout.

### Accessibility
- Use semantic header, navigation, main, section, and heading elements.
- Provide meaningful alt text for informative images.
- Ensure all links, dropdown options, and form controls are keyboard accessible.
- Show visible focus indicators.
- Associate labels and validation messages with form fields.
- Maintain readable contrast.
- Do not rely on color alone to communicate status.
- Respect reduced-motion preferences.

## 8. Implementation Rules

- Inspect first; edit second.
- Keep the change focused on the public home page and directly related components/styles needed to meet its requirements.
- Preserve existing working functionality and established route names.
- Reuse components and assets instead of duplicating them.
- Avoid unrelated refactoring and do not change Manager page functionality.
- Do not rewrite the application architecture.
- Do not invent backend endpoints, database fields, or routes.
- If required behavior is blocked by missing backend support, document it explicitly.
- Do not claim tests passed unless they were actually run.
- After implementation, update `MEMORY.md` with the verified changes, files affected, checks run, and unresolved issues.
- Update `ARCHITECTURE.md` only if an architectural decision or structure actually changes.

## 9. Acceptance Checklist

Mark each item as **Pass**, **Partial**, **Fail**, or **Blocked** after inspecting and testing the implementation.

- [ ] Existing home-page design was inspected before editing.
- [ ] Existing tech stack and route setup were verified.
- [ ] Visual style matches the Manager design system without copying its dashboard layout.
- [ ] Header includes logo, association name, Events/Home, Merchandise, and Login dropdown.
- [ ] Events are displayed as responsive cards.
- [ ] Cards show only real, available event data.
- [ ] Registration does not require login.
- [ ] Registration uses the real backend/API where implemented.
- [ ] Registration validation and success/error states work.
- [ ] Login dropdown lists Admin, Manager, Member, and User.
- [ ] Role choices use verified routes and do not bypass authorization.
- [ ] Merchandise navigation works.
- [ ] Loading, empty, and error states are handled where applicable.
- [ ] Responsive behavior and keyboard accessibility were checked.
- [ ] No unrelated Manager functionality was changed.
- [ ] Relevant tests/build checks were run and their actual results recorded.
- [ ] `MEMORY.md` was updated after the completed work.

## 10. Required Final Report

After the changes, report:
1. What already matched the requirements.
2. What was missing or incorrect.
3. What was changed.
4. Files changed.
5. Tests/build checks actually run and their results.
6. Any blocked requirements or backend gaps.
7. Confirmation that `MEMORY.md` was updated.

Do not report a requirement as complete unless it has been verified.
