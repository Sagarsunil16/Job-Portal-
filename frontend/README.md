<div align="center">

# 🎨 JobPilot — Frontend

**A pixel-perfect, production-grade employer dashboard built with Next.js 16 and React 19.**

[![Next.js](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Redux](https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [Pages & Routes](#-pages--routes)
- [Component System](#-component-system)
- [State Management](#-state-management)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Design System](#-design-system)

---

## 🌟 Overview

JobPilot Frontend is the employer-facing dashboard of a Job Portal application. It enables employers to **register, log in, post job listings, manage existing jobs, and view job details** — all through a polished, responsive UI that strictly follows Figma design specifications.

The codebase is built on two complementary architectural principles: **Atomic Design** for the component layer and a **Domain-Driven Layered Architecture** for the overall application structure.

---

## 🏗 Architecture

This project combines **two proven architectural patterns**:

### 1. 🧱 Atomic Design — Component Layer

All UI components are organized into a strict 4-level hierarchy inspired by Brad Frost's Atomic Design methodology:

| Level | Folder | Description |
|---|---|---|
| **Atoms** | `components/atoms/` | Smallest indivisible units — `Button`, `Input`, `Select`, `Textarea`, `Logo` |
| **Molecules** | `components/molecules/` | Atoms combined into functional units — `FormField`, `FileUpload` |
| **Organisms** | `components/organisms/` | Feature-level components — `Navbar`, `Sidebar`, `JobsTableWidget`, `DeleteJobModal` |
| **Templates** | `components/templates/` | Full page layout shells — `AuthTemplate`, `CenteredCardTemplate` |

This ensures components are **reusable, well-scoped, and composable** — each level only depends on levels below it.

### 2. 🗂 Domain-Driven Layered Architecture — Application Layer

The overall application is organized into clearly separated **responsibility layers**, each with a single concern:

| Layer | Folder | Responsibility |
|---|---|---|
| **Domain** | `domain/dtos/` | TypeScript interfaces that model the data contract (`JobDTO`, `AuthDTO`) — no business logic or API calls |
| **Services** | `services/` | Named functions that wrap Axios API calls. Pages never make raw HTTP calls directly |
| **API Client** | `services/api.ts` | Axios instance with JWT auto-injection interceptor and silent 401 token-refresh interceptor |
| **State** | `store/` | Redux Toolkit — global auth state with localStorage persistence and typed hooks |
| **Pages** | `app/` | Next.js App Router pages — orchestrate data fetching, delegate rendering to organisms |
| **Guards** | `components/guards/` | Cross-cutting route protection — `AuthGuard`, `GuestGuard` |

### Data Flow

```
┌──────────────────────────────────────────────────────────┐
│           App Router Pages  (app/)                       │
│   Orchestrate state, call services, render organisms     │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│       Organisms → Molecules → Atoms  (components/)       │
│   Stateless or locally-stateful UI building blocks       │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│              Service Layer  (services/)                  │
│   authService, jobService — typed named functions        │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│          Axios API Client  (services/api.ts)             │
│   Auto-inject Bearer token → on 401 silently refresh     │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│          Redux Toolkit Store  (store/)                   │
│   employerSlice — persisted auth state + typed hooks     │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/                                    # Next.js App Router
│   │   ├── layout.tsx                          # Root layout (StoreProvider, fonts)
│   │   ├── page.tsx                            # Root redirect → /dashboard or /login
│   │   ├── globals.css                         # Global Tailwind base styles
│   │   │
│   │   ├── login/                              # Login page
│   │   │   └── page.tsx
│   │   ├── signup/                             # Multi-step signup page
│   │   │   └── page.tsx
│   │   ├── account-setup/                      # Company profile setup page (step 2)
│   │   │   └── page.tsx
│   │   │
│   │   └── dashboard/                          # Protected employer dashboard
│   │       ├── layout.tsx                      # Dashboard shell: AuthGuard + Navbar + Sidebar
│   │       ├── page.tsx                        # Overview — recently posted jobs (all employers)
│   │       ├── post-job/
│   │       │   ├── page.tsx                    # Post a new job form
│   │       │   └── schema.ts                   # Yup validation schema for job form
│   │       ├── my-jobs/
│   │       │   └── page.tsx                    # My Jobs — filtered to logged-in employer
│   │       └── jobs/
│   │           └── [id]/
│   │               ├── page.tsx                # Job Details view (ownership-gated edit/delete)
│   │               └── edit/
│   │                   └── page.tsx            # Edit Job form — pre-populated, ownership-gated
│   │
│   ├── components/                             # Atomic Design component library
│   │   ├── atoms/                              # Smallest reusable units
│   │   │   ├── Button.tsx                      # Primary / outline / text variants
│   │   │   ├── Input.tsx                       # Controlled input with error state
│   │   │   ├── Select.tsx                      # Styled native select with chevron icon
│   │   │   ├── Textarea.tsx                    # Resizable textarea with error state
│   │   │   ├── Divider.tsx                     # Horizontal rule with optional label
│   │   │   ├── Logo.tsx                        # JobPilot brand logo
│   │   │   └── PhoneInput.tsx                  # International phone input wrapper
│   │   │
│   │   ├── molecules/                          # Composed from atoms
│   │   │   ├── FormField.tsx                   # Label + Input + Error message wrapper
│   │   │   ├── FileUpload.tsx                  # Drag-and-drop logo upload
│   │   │   └── SocialAuthButtons.tsx           # Google / LinkedIn auth buttons
│   │   │
│   │   ├── organisms/                          # Complex, feature-level components
│   │   │   ├── Navbar.tsx                      # Top navigation with Post a Job CTA
│   │   │   ├── Sidebar.tsx                     # Context-aware navigation with active state
│   │   │   ├── JobsTableWidget.tsx             # Reusable paginated job table with search
│   │   │   └── DeleteJobModal.tsx              # Pixel-perfect Figma delete confirmation modal
│   │   │
│   │   ├── guards/                             # Route protection
│   │   │   ├── AuthGuard.tsx                   # Redirects unauthenticated users to /login
│   │   │   └── GuestGuard.tsx                  # Redirects authenticated users to /dashboard
│   │   │
│   │   └── templates/                          # Page-level layout wrappers
│   │       ├── AuthTemplate.tsx                # Centred card layout for auth pages
│   │       └── CenteredCardTemplate.tsx        # Generic card template
│   │
│   ├── domain/
│   │   └── dtos/
│   │       ├── AuthDTO.ts                      # LoginDTO, SignupDTO, AccountSetupDTO
│   │       └── JobDTO.ts                       # JobDTO, CreateJobPayload, PaginatedResponse<T>
│   │
│   ├── services/
│   │   ├── api.ts                              # Axios instance + request/response interceptors
│   │   ├── authService.ts                      # loginEmployer, signupWithSetup
│   │   └── jobService.ts                       # createJob, getAllJobs, getMyJobs, getJobById, updateJob, deleteJob
│   │
│   ├── store/
│   │   ├── index.ts                            # configureStore + RootState + AppDispatch types
│   │   ├── StoreProvider.tsx                   # <Provider> wrapper for client components
│   │   └── slices/
│   │       └── employerSlice.ts                # Auth state + localStorage persistence
│   │
│   ├── hooks/
│   │   └── index.ts                            # useAppSelector, useAppDispatch (typed wrappers)
│   │
│   ├── configs/
│   │   ├── formConfig.ts                       # Centralised form field configuration data
│   │   └── index.ts
│   │
│   ├── utils/                                  # Pure utility functions
│   └── types/                                  # Shared TypeScript type declarations
│
├── .env.example                                # Required environment variable template
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router for file-system routing, layouts, and SSR |
| **React 19** | UI component model |
| **TypeScript 5** | Static typing throughout — DTOs, interfaces, component props |
| **Tailwind CSS v4** | Utility-first styling — all design tokens applied inline |
| **Redux Toolkit** | Global auth state management |
| **React Redux** | `useSelector` / `useDispatch` bindings |
| **Axios** | HTTP client with request/response interceptors for JWT automation |
| **React Hook Form** | Performant form state management with minimal re-renders |
| **Yup** | Schema-based form validation integrated via `@hookform/resolvers` |
| **Lucide React** | Consistent icon library |
| **react-phone-number-input** | Internationalised phone number input for signup flow |

---

## ✨ Features

### 🔐 Authentication
- **Multi-step Registration**: Step 1 collects credentials; Step 2 captures full company profile (name, industry, team size, logo) — submitted as a single `multipart/form-data` request
- **JWT Session Persistence**: `accessToken` + `employerId` stored in `localStorage`, hydrated into Redux on page reload — session survives browser refresh
- **Automatic Token Refresh**: Axios response interceptor catches `401` errors and silently re-issues a new access token using the stored `refreshToken`, then retries the original request
- **Route Guards**: `AuthGuard` redirects unauthenticated users away from `/dashboard/**`; `GuestGuard` redirects authenticated users away from `/login`

### 💼 Job Management
- **Post a Job**: Full form with 12 fields — title, tags, role, salary range, education, experience, job type, level, expiration date, location, remote checkbox, description
- **Overview Dashboard**: "Recently Posted Jobs" — shows ALL jobs from all employers with server-side pagination + debounced search (500ms)
- **My Jobs**: Shows only the logged-in employer's postings with identical pagination + search UX
- **Job Details Page** (`/dashboard/jobs/[id]`): Rich details view with salary card, location card, and job overview grid. **Edit / Delete actions only appear if the viewer is the job's owner**
- **Edit Job**: Pre-populated form that fetches existing job data and submits a `PUT` request. Includes a success confirmation modal on save
- **Delete Job**: Pixel-perfect Figma confirmation modal — `Cancel` (pill outline) + `Delete` (red pill) — wired to both the Job Details page and the 3-dots table dropdown

### 🧭 Navigation
- **Context-Aware Sidebar**: Active state tracks both the current pathname AND the `?source=` URL parameter. Jobs viewed from Overview keep "Overview" highlighted; jobs viewed from My Jobs keep "My Jobs" highlighted
- **Semantic URL Structure**: `/dashboard/jobs/[id]` is a universal public job route; `/dashboard/my-jobs` is the employer's personal listing page

### 🎨 UI/UX
- **Atomic Design Component Library**: Atoms → Molecules → Organisms hierarchy
- **Reusable `JobsTableWidget`**: Accepts `jobs`, `isLoading`, `searchQuery`, `pagination`, and `currentEmployerId` props — shared between Overview and My Jobs pages
- **Debounced Search (500ms)**: Prevents unnecessary API calls on every keystroke
- **Loading States**: Spinner with animated border on all data-fetching operations
- **Responsive Layout**: Mobile sidebar with backdrop overlay, responsive grid layouts

---

## 📡 Pages & Routes

| Route | Guard | Description |
|---|---|---|
| `/` | — | Redirects to `/dashboard` or `/login` |
| `/login` | `GuestGuard` | Login form |
| `/signup` | `GuestGuard` | Step 1: Credential registration |
| `/account-setup` | `GuestGuard` | Step 2: Company profile setup |
| `/dashboard` | `AuthGuard` | Overview — all recently posted jobs |
| `/dashboard/post-job` | `AuthGuard` | Post a new job |
| `/dashboard/my-jobs` | `AuthGuard` | My Jobs listing page |
| `/dashboard/jobs/[id]` | `AuthGuard` | Job Details (ownership-gated edit/delete) |
| `/dashboard/jobs/[id]/edit` | `AuthGuard` | Edit Job form |

---

## 🧩 Component System

Components follow **Atomic Design** methodology — each level builds upon the previous:

### Atoms — Primitives

| Component | Description |
|---|---|
| `Button` | Three variants: `primary` (indigo filled), `outline` (gray border), `text` (ghost). Accepts `fullWidth`, `disabled` |
| `Input` | Controlled input with `error` prop for inline validation messages |
| `Select` | Native `<select>` styled with custom chevron icon. Supports `placeholder` and `options[]` |
| `Textarea` | Resizable `<textarea>` with error state |
| `Logo` | Branded SVG logo for consistent header identity |
| `PhoneInput` | Internationalised phone number input for signup |

### Molecules — Composed Units

| Component | Description |
|---|---|
| `FormField` | `Label + Input/Select + ErrorMessage` in one compound unit |
| `FileUpload` | Drag-and-drop file upload zone for company logo |
| `SocialAuthButtons` | Pre-styled Google / LinkedIn auth trigger buttons |

### Organisms — Feature Components

| Component | Description |
|---|---|
| `Navbar` | Top bar with logo, "Post a Job" CTA button, and employer avatar |
| `Sidebar` | Left navigation with context-aware active highlighting via `usePathname` + `useSearchParams` |
| `JobsTableWidget` | Full-featured paginated table. Accepts `currentEmployerId` to conditionally show edit/delete actions |
| `DeleteJobModal` | Figma pixel-perfect delete confirmation: `432px` wide, `Poppins` font, `#EB4335` red delete pill, `border-top` button row |

### Guards — Route Protection

| Guard | Behavior |
|---|---|
| `AuthGuard` | Checks `localStorage` for `employer_auth`; redirects to `/login` if absent |
| `GuestGuard` | Checks `localStorage` for `employer_auth`; redirects to `/dashboard` if present |

---

## 🗂 State Management

Redux Toolkit manages **authentication state** globally. The slice is designed for SSR-safety with client-side `localStorage` persistence.

### `employerSlice` State Shape

```ts
interface EmployerState {
  employerId: string | null;      // Resolved from JWT payload
  accessToken: string | null;     // Short-lived (15m) — auto-refreshed by Axios interceptor
  logoUrl: string | null;         // Company logo URL from employer profile
  isAuthenticated: boolean;       // Derived from accessToken presence
  pendingRegistrationData: ...;   // Holds step-1 form data during multi-step signup
  isMobileSidebarOpen: boolean;   // Controls mobile sidebar visibility
}
```

### Actions

| Action | Effect |
|---|---|
| `loginSuccess` | Sets tokens, marks `isAuthenticated: true`, persists to `localStorage` |
| `logout` | Clears all auth state and `localStorage` |
| `savePendingRegistration` | Persists step-1 signup data while navigating to step-2 |
| `clearPendingRegistration` | Clears step-1 data after successful full registration |
| `toggleMobileSidebar` | Opens/closes the mobile sidebar overlay |

### Typed Hooks

```ts
// Always use these — never raw useSelector/useDispatch
import { useAppSelector, useAppDispatch } from '../hooks';

const { employerId, isAuthenticated } = useAppSelector((s) => s.employer);
```

### Axios Interceptors

**Request Interceptor:** Automatically reads `accessToken` from Redux store and injects it as `Authorization: Bearer <token>` on every API request.

**Response Interceptor:** Catches `401 Unauthorized`. Reads `refreshToken` from `localStorage`, exchanges it at `/auth/refresh-token`, updates Redux + storage, then retries the original failed request — **completely transparent to the calling component**.

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.x`
- npm `>= 9.x`
- Backend API running (see `../backend/README.md`)

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL
```

### 3. Start Development Server
```bash
npm run dev
# App starts on http://localhost:3000
```

### 4. Build for Production
```bash
npm run build   # TypeScript compile + Next.js optimization
npm run start   # Start the production server
```

---

## 🔧 Environment Variables

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Base URL of the backend REST API. Must use `NEXT_PUBLIC_` prefix for browser-side access. |

---

## 🎨 Design System

All UI is built strictly against the provided **Figma design specifications**.

| Token | Value | Usage |
|---|---|---|
| **Brand** | `#6366f1` | Primary buttons, active sidebar, links |
| **Success** | `#0BA02C` | Salary display, active job status |
| **Danger** | `#EB4335` | Delete button, error states |
| **Text Primary** | `#434348` | Headings and body text |
| **Text Secondary** | `#7E7E86` | Subtitles, placeholders |
| **Border** | `#E5E5E6` | Input borders, card dividers |
| **Background Accent** | `#EBF1FF` | Active sidebar item, info badges |
| **Font** | `Poppins` | Figma-specified modal and key headings |
| **Border Radius** | `8–16px` | Cards: 16px, Inputs: 8px, Buttons: 4–50px |

### Key Figma-Matched Components

- **Delete Modal**: `max-w-[432px]`, `p-[24px]`, `border-top: 1px solid #E5E5E6`, buttons `w-[120px] h-[48px]` pill-shaped, positioned at `top: 40px` with `bg-black/30` non-blurred backdrop
- **Edit Job Form**: 3-column grid layout, Save + Cancel buttons top-right
- **Job Details**: 12-column grid `7/5` split (description / sidebar cards), salary in `#0BA02C` green

---

## 📜 npm Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Build optimised production bundle |
| `npm run start` | Start production server (requires build first) |
| `npm run lint` | Run ESLint static analysis |

---

<div align="center">

Built with following Atomic Design principles and Figma pixel-perfect specifications.

</div>
