# Job Portal Employer Module Implementation Plan

This document outlines the architecture, tech stack, and step-by-step implementation plan for the employer side of the Job Portal. It strictly follows the requested `data-driven model` from **brocamp-portal-react** for the frontend and `clean architecture` from **brocamp-tool-v2** for the backend.

## User Review Required

> [!IMPORTANT]
> The exact UI implementation and component structure will depend on the Figma designs you provide. Please provide the Figma designs one by one, as mentioned, so I can adapt the frontend implementation plan to match them pixel-perfectly.

## Proposed Architecture

### 1. Backend (Clean Architecture based on `brocamp-tool-v2`)
Tech Stack: Node.js, Express.js, MongoDB (Mongoose), strict **TypeScript**.

Following the established `brocamp` pattern, we will ensure strict type safety (no `any` types!), validation, and distinct separation of responsibilities:
- **Routes Layer**: Express route definitions.
- **Controller/Adapter Layer**: Handle HTTP requests/responses, extract DTOs.
- **Engine/Use-Case Layer**: Core business logic (e.g., `JobManagementEngine`, `EmployerManagementEngine`).
- **Repository Layer**: Data access logic (`JobRepository` using Mongoose).
- **Domain Layer**: DTOs, Enums, and Interfaces ensuring end-to-end type safety.

*Directory Structure Outline:*
```text
/backend
 ├── src
 │   ├── domain/
 │   │   ├── dtos/
 │   │   ├── enums/
 │   │   └── models/
 │   ├── engine/ (Use Cases)
 │   │   └── JobManagementEngine.ts
 │   ├── interfaces/
 │   │   └── controllers/
 │   ├── infrastructure/
 │   │   ├── database/ (Mongoose schemas)
 │   │   └── repositories/
 │   └── routes/
```

### 2. Frontend (Data-driven Model based on `brocamp-portal-react`)
Tech Stack: React / Next.js (App Router), **TypeScript**, **Redux**, **Tailwind CSS**.

Following the `brocamp-portal-react` pattern, the frontend will emphasize separation of UI and logic via a configuration-driven approach:
- **State Management**: **Redux** for global state management (e.g., Employer session, current view states).
- **Data-Driven UI**: View/Form configurations to generate UI programmatically rather than hardcoding.
- **Smart/Dumb Components**: Page components connect to Redux/Hooks, while nested UI components remain pure and stateless.
- **Styling**: Pixel-perfect **Tailwind CSS**, organized efficiently using utility classes.

*Directory Structure Outline:*
```text
/frontend
 ├── src
 │   ├── app/ (Next.js App Router setup)
 │   ├── components/ (Stateless UI components e.g., config-driven tables/forms)
 │   ├── configs/ (JSON/TS configs for data-driven UI)
 │   ├── hooks/
 │   ├── store/ (Redux setup, slices)
 │   ├── services/ (API integration)
 │   └── types/ (TypeScript interfaces)
```

## Implementation Steps

### Phase 1: Setup & Scaffolding
- Initialize the Next.js frontend application with TypeScript, Redux, and Tailwind CSS.
- Initialize the Node.js backend application with TypeScript and the `brocamp` folder structure.
- Set up MongoDB connection in the backend.

### Phase 2: Backend CRUD Implementation
- Define Job schema, DTOs, and interfaces.
- Create the `JobRepository` for Data Access.
- Implement the `JobManagementEngine` for business logic (Create, Read, Update, Delete jobs).
- Hook up controllers and routes.
- Implement basic authentication (bonus) to secure routes, returning standard DTOs.

### Phase 3: Frontend Integration & State Management Setup
- Setup Redux store (e.g., `jobSlice`, `employerSlice`).
- Setup API service functions.
- Create base config-driven UI components (Buttons, Inputs, Modals, Cards) utilizing Tailwind CSS.

### Phase 4: Page-Specific UI Implementation (Pending Figma)
- **Job Listing Page**: Fetch API via Redux, display in a data-driven list/table, handle loading and empty states.
- **Job Creation/Edit Page**: Config-driven form UI connected to Redux and saving to the backend.
- **Job Details View**: Individual job viewer.

## Open Questions

> [!WARNING]
> 1. We are ready to begin Phase 1 setup. Please provide the first Figma design or link so we can plan the component architecture for Phase 4.

## Verification Plan

### Automated Verification
- Run backend linting and build checks to ensure TypeScript strictness (`noImplicitAny`).
- Run Next.js build to verify frontend dependencies.
- API testing via HTTP requests to verify REST outputs matching the Engine layer requirements.

### Manual Verification
- Share the local server screenshots demonstrating pixel-perfect alignment with Tailwind CSS.
- Demonstrate job creation, listing, editing, and deletion via UI.
