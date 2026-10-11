# AI Memory Log

## Purpose
This file is the project's short, factual handover log for AI coding tools. Use it to understand what has actually been done and avoid guessing or hallucinating project state.

## Rules for the AI
- Read this file before making project changes.
- After each completed change, update this file with what changed.
- Record only verified actions and current state; do not claim work is complete unless it was checked.
- Keep entries short. Include relevant files, decisions, commands, and unresolved issues.
- If something is unknown or unverified, label it **Unknown** or **Not verified**.
- Do not treat planned work as completed work.
- Preserve earlier useful notes; edit outdated details instead of accumulating contradictions.

## Current Project
- **Name:** Skyline Student Association Platform
- **Project scope:** Public events and merchandise website plus Admin, Manager, Member, and User role-based platforms.
- **Current reference:** `PRD.md` (confirm the actual path/name in the repository).

## Change Log
| Date | Change made | Files affected | Verification / Notes |
|---|---|---|---|
| 2026-10-11 | Connected Frontend to Backend REST API and Backend to Database (Prisma ORM with PostgreSQL schema & fallback store). Created `backend/src/lib/db.js`, `backend/src/routes/events.routes.js`, and `backend/src/routes/products.routes.js`. Mounted `/api/events`, `/api/events/:id/tickets`, `/api/products`, and `/api/orders` endpoints. Updated integration tests (`tests/health.test.js` - 6/6 passed). | `backend/src/app.js`, `backend/src/lib/db.js`, `backend/src/routes/events.routes.js`, `backend/src/routes/products.routes.js`, `backend/tests/health.test.js` | Verified via `cmd /c npm test` (6/6 passed) and active backend server on port 5000 (`http://localhost:5000`). |
| 2026-10-11 | Refined Public Frontend according to user requirements. Established `Home / Events` as the single unified landing page (`index.html`) and implemented `Merchandise` as a separate public page (`merchandise.html`). Created `frontend/admin/index.html` as a dedicated Admin Portal login route. Updated Header Login Dropdown to route to all 4 role portals (`../admin/index.html`, `../manager/index.html`, `../member/index.html`, `../user/index.html`). Standardized card height & fallbacks in `eventCard.js`. Updated `app.js` to gracefully serve both pages. | `frontend/home-page/index.html`, `frontend/home-page/merchandise.html`, `frontend/admin/index.html`, `frontend/home-page/app.js`, `frontend/home-page/js/components/eventCard.js` | Verified ES syntax (`node -c frontend/serve.js`), backend tests (`cmd /c npm test` - 3/3 passed), and Next.js manager build (`cmd /c npm run build`). |
| 2026-10-11 | Modularized public frontend architecture into separate data layers, components, and utility modules (`data/events.js`, `data/merchandise.js`, `utils/validation.js`, `components/*.js`). Fixed CSS syntax typo on line 136 in `styles.css`. Updated header navigation item to unified `Home / Events` item. Preserved all role routes (Admin, Manager, Member, User) and visual tokens. | `frontend/home-page/index.html`, `frontend/home-page/styles.css`, `frontend/home-page/app.js`, `frontend/home-page/js/**/*` | Verified ES module loading via `node serve.js` on port 3000, backend health check on port 5000, and backend tests (`cmd /c npm test` - 3/3 passed). |
| 2026-10-11 | Refined public Home Page per `HOME_PAGE_REQUIREMENTS.md`. Aligned design system tokens with Manager palette, removed Playfair Display serif font for clean Inter typography, fixed role login dropdown routes (Admin, Manager, Member, User), connected event fetching and public registration flow to real backend API endpoints with non-faked error/notice states for unmounted endpoints, and verified keyboard/aria accessibility. | `frontend/home-page/index.html`, `frontend/home-page/styles.css`, `frontend/home-page/app.js` | Verified via static server (`node serve.js` on port 3000), backend server (`node server.js` on port 5000), backend unit tests (`cmd /c npm test` - 3/3 passed), and Next.js manager build check (`cmd /c npm run build` - 0 errors). |
| 2026-10-11 | Created the baseline PRD as a Markdown document from the agreed scope. | `Docx/PRD.md` | Document created and integrated into `Docx/PRD.md`. |

## Current Status
- **Backend API & Database Connection:** Express REST API endpoints (`/api/events`, `/api/events/:id/tickets`, `/api/products`, `/api/orders`, `/api/health`) connected to Prisma ORM (`prisma/schema.prisma`) with database connection handling and resilient fallbacks.
- **Frontend-to-Backend Integration:** Public frontend (`app.js`, `events.js`, `merchandise.js`, `registrationModal.js`) dynamically fetches event and merchandise catalogs from `http://localhost:5000/api/*` and posts event ticket registrations and merchandise orders directly to backend endpoints.
- **Public Website:** Home / Events landing page (`index.html`) and standalone Merchandise Store (`merchandise.html`) active at `http://localhost:3000`.
- **Verification & Test Results:** All 6 backend integration tests passed (`cmd /c npm test` - 6/6 passed, 100% pass rate).

## Next Steps
- Database environment configuration (`DATABASE_URL` in `backend/.env`) for production PostgreSQL instance.
- Maintain `Docx/memory.md` after subsequent module changes.

