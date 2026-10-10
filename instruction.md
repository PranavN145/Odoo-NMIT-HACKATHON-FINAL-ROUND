# AI Coding Assistant Instructions

## 1. Project Context
- Read `memory.md` before making changes. Treat it as the current project context.
- Distinguish verified implementation details from proposed designs and pending decisions.
- If `memory.md` conflicts with the existing code, inspect the code and report the discrepancy before changing behavior.
- Do not invent requirements or mark work complete without verification.

## 2. Agreed Technology Stack
Use the existing project implementation of:
- **Frontend:** Next.js / React
- **Styling:** Tailwind CSS
- **Backend:** Node.js and Express.js
- **API:** REST APIs
- **Database:** A relational SQL database

Do not introduce a different framework, database type, or technology stack. Do not add libraries or dependencies without a clear, documented need and prior confirmation where appropriate. Use the versions and tools already configured in the repository.

## 3. Inspect Before Editing
Before changing anything:
1. Inspect the repository tree and relevant files.
2. Read `memory.md`, existing project documentation, package manifests, environment examples, and related implementation.
3. Identify existing conventions, reusable components, routes, services, validation, error handling, and database access patterns.
4. Check the current behavior and tests, where available.
5. Explain the intended change and its scope before making broad or risky changes.

Do not assume the project structure shown in documentation exactly matches the current repository. Reuse the established structure. Do not modify unrelated files.

## 4. Build Incrementally
- Implement one small, coherent feature or fix at a time.
- Prefer focused changes over large rewrites.
- Preserve working behavior and backward compatibility unless a change is required by an agreed requirement.
- Do not overwrite working code merely to match a preferred style or architecture.
- If a change could break existing behavior, identify the risk and choose the smallest safe approach.
- Keep documentation in sync with verified changes.

## 5. Frontend, Backend, and Database Consistency
For every feature, check all affected layers:
- **Frontend:** UI states, forms, loading indicators, success messages, and useful error messages.
- **Backend:** REST route, controller/service logic, authorization, validation, and response format.
- **Database:** schema, constraints, relationships, migrations, and query behavior when applicable.

Keep field names, types, status values, and API request/response shapes consistent across layers. Do not add UI controls that imply unsupported backend functionality. Do not rely on frontend-only checks for security or data integrity.

## 6. Input Validation and Error Handling
- Validate all untrusted input on the server, including path parameters, query parameters, request bodies, and uploaded data if uploads exist.
- Follow existing validation patterns; do not add a validation library without an approved reason.
- Return appropriate HTTP status codes and consistent, actionable error responses.
- Handle expected failures, missing records, invalid state transitions, and database errors safely.
- Never expose stack traces, secrets, credentials, or sensitive internal details to end users.
- Validate important business rules such as permissions, membership eligibility, ticket capacity, duplicate check-ins, and stock availability wherever those features are implemented.

## 7. Authentication and Role-Based Authorization
- Follow the authentication approach already implemented in the repository and the project decisions recorded in `memory.md`.
- Protect private routes and backend endpoints.
- Enforce authorization on the server for every protected operation. Hiding a button in the UI is not authorization.
- Apply least-privilege access for **Admin**, **Member**, and **Volunteer** roles.
- Users must not be able to access or change other users' private records unless explicitly authorized.
- Do not weaken authentication, role checks, password handling, or token/session protections to make a feature easier to implement.
- If role behavior or authentication details are undecided, mark them as pending and ask before making a consequential choice.

## 8. Secrets and Environment Configuration
- Keep secrets and credentials in local `.env` files or the approved secret configuration mechanism.
- Never hard-code, print, or commit API keys, database passwords, JWT secrets, session secrets, or other credentials.
- Ensure `.env` is ignored by Git. If needed, add or update a safe `.env.example` containing placeholder values only; never copy real secrets into it.
- Do not expose server-only environment variables to browser code.
- If a required environment variable is missing, provide a clear, non-sensitive error message.

## 9. Database and Data Integrity
- Inspect the existing schema and database access code before making schema changes.
- Prefer additive, targeted schema changes.
- Preserve existing data and working queries.
- Do not reset, drop, or destructively alter a database without explicit approval and a verified backup/recovery plan.
- Use the repository's existing migration workflow, if present.
- Maintain relational constraints and transactional consistency for operations that update related records.
- Never claim a migration or database operation succeeded unless its result has been verified.

## 10. Local Development Only
- The application must run locally.
- Do not add deployment instructions, deployment configuration, or hosting steps as part of ordinary feature work.
- Follow the existing local development scripts and configuration.
- If local setup is incomplete, document the missing requirement and ask before making substantial infrastructure changes.
- Do not claim the application runs unless it has actually been started or the relevant checks have been performed.

## 11. Testing and Definition of Done
Test each feature before marking it complete:
1. Run relevant existing tests and checks.
2. Add or update tests using the test tools already present, where practical.
3. Verify successful behavior and important failure cases.
4. Test access control for the affected roles.
5. Check frontend-backend integration and database consistency where applicable.
6. Report the exact checks performed and any checks that could not be run.

A feature is **complete** only when its implementation and relevant tests have been verified. If testing is blocked by missing configuration or dependencies, state that clearly and mark the feature as unverified rather than complete.

## 12. Dependencies and Code Quality
- Do not introduce new libraries without a clear reason and approval where appropriate.
- Prefer existing utilities, components, and patterns.
- Avoid duplicated business logic across frontend and backend.
- Keep functions focused and code readable.
- Do not make unrelated formatting or refactoring changes.
- Do not remove existing functionality without explaining why and obtaining approval when the change is consequential.

## 13. Documentation and Progress Tracking
- Update `memory.md` when verified project details, implementation progress, important decisions, or known issues change.
- Record undecided items as **Pending**; do not present assumptions as facts.
- Keep instructions and documentation concise and consistent with the code.
- Do not claim to have inspected files, run tests, or changed code unless that action actually occurred.

## 14. Expected Workflow for Each Task
1. Read `memory.md` and inspect the relevant code.
2. Summarize the goal and identify affected layers.
3. Check for existing implementations and reusable patterns.
4. Make the smallest safe change that meets the requirement.
5. Validate inputs, errors, and role permissions.
6. Test the change locally using the available project tools.
7. Review the diff for unrelated changes or exposed secrets.
8. Report what changed, what was tested, and what remains pending.

**Core rule:** Preserve working code, follow the established project structure, make changes incrementally, and verify before declaring success.
