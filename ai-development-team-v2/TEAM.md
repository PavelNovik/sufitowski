# TEAM.md

## Purpose

This file controls which AI specialist roles are active for the current project.

The complete role instructions are stored in `roles/`.

## Current Team

Status must be one of:

- REQUIRED
- OPTIONAL
- INACTIVE

| Role | Status | Reason |
|---|---|---|
| Software Architect | REQUIRED | Audit calculator boundaries and document the source geometry/pricing behavior without changing rules |
| Tech Lead / Senior Developer | REQUIRED | Coordinate the commercial acceptance audit and reconcile documentation with implementation |
| UI/UX Designer | OPTIONAL | Review the owner-facing estimate safeguards; no interface work in this audit |
| Frontend Developer | OPTIONAL | Provide implementation facts only; no frontend changes in this audit |
| Backend Developer | INACTIVE | No backend is justified for the initial client-side application |
| Database Engineer | INACTIVE | No database is justified |
| Security Engineer | INACTIVE | No contact submission, account or data transmission is implemented in this phase |
| QA Engineer | REQUIRED | Define verification for calculator parity and critical user flows |
| DevOps Engineer | OPTIONAL | Set up reproducible package/build configuration; no deploy or CI work required yet |
| SEO Lead / SEO Strategist | OPTIONAL | Align localized metadata with the approved discovery recommendations |
| Technical SEO Specialist | INACTIVE | Visualizer phase does not change route or SEO behavior |
| SEO Content Specialist | OPTIONAL | Keep placeholder page content localized and free of unverified claims |
| Keyword Research Specialist | INACTIVE | Keyword research is outside the foundation phase |
| Local SEO Specialist | INACTIVE | No verified service area, address or Business Profile access |
| SEO Performance Specialist | INACTIVE | No fresh Lighthouse/PageSpeed run in this phase |
| Competitor SEO Analyst | INACTIVE | Not needed for the current source-site migration assessment |
| Analytics & Search Visibility Specialist | INACTIVE | Search Console or analytics access was not provided |
| Structured Data & AI Search Specialist | INACTIVE | Structured data is deferred until company facts and content are verified |
| QA / SEO Validation Specialist | OPTIONAL | Detailed SEO acceptance testing belongs to implementation verification |

## Activation Rules

Do not activate every role by default.

Activate the minimum team required by the current task.

When a new requirement introduces a new area:
1. identify the affected specialist;
2. activate that role;
3. read the corresponding role file;
4. update this file;
5. continue the task.

## Team Change Log

### Initial
Team initialized with no active project-specific roles.

### 2026-10-11 — Sufitowski.pl discovery
Activated roles dynamically for Phase 1. SEO statuses follow `SEO_TEAM_PROMPT.md`; this remains the single role-status table.

### 2026-10-11 — Phase 2 foundation and design system
Updated role statuses for application setup, localized pages, reusable interface components, pricing model boundaries and required build validation.

### 2026-10-11 — Phase 3.1 interactive visualizer
Kept Architect, Tech Lead, UI/UX, Frontend and QA roles required for the layered scene and calculator integration. Technical SEO and backend/database/security roles are inactive for this client-side feature. Role-specific instruction files were not present in the team workspace.

### 2026-10-11 — Phase 3.2 preliminary estimate
Kept Architect, Tech Lead, UI/UX, Frontend and QA required for exact-grosz pricing, provenance, incomplete-estimate safeguards and shared calculator state. Backend, database, security and deployment roles remain inactive; no API, persistence service or release work was introduced.

### 2026-10-12 — Phase 3.2.1 commercial acceptance audit
Required Architect, Tech Lead and QA for a read-only audit of quote logic, source behavior and acceptance scenarios. UI/UX and Frontend are optional; no code, price, fixture, dependency, Git or deployment changes are in scope. The technical-writing deliverable is covered by the existing team workflow; no new role was created because no analyst/technical-writer role file exists.
