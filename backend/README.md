<div align="center">

# 🚀 JobPilot — Backend API

**A production-grade, employer-facing Job Portal REST API built with Clean Architecture principles.**

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Tech Stack](#-tech-stack)
- [Features](#-features)
- [API Reference](#-api-reference)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Security Design](#-security-design)
- [Data Models](#-data-models)

---

## 🌟 Overview

JobPilot Backend is a RESTful API that powers an **employer-side job management dashboard**. Employers can register their company, post job listings, manage and edit them, and control access securely through a JWT-based authentication system. The backend is purpose-built for **production readiness**, emphasizing clean separation of concerns, security-first authorization, and scalable pagination.

---

## 🏗 Architecture

This project follows the **Clean Architecture** / **Layered Architecture** pattern — the exact same pattern as `brocamp-tool-v2`. Each layer has a single, well-defined responsibility and communicates through interfaces, ensuring the codebase is testable, maintainable, and decoupled.

```
┌──────────────────────────────────────────────────────────┐
│                    HTTP Request                          │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│              Infrastructure Layer                        │
│   Routes  →  Auth Middleware  →  Validation (Yup)       │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                  Controller Layer                        │
│   Parses request, checks auth/ownership, delegates      │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                   Engine Layer                           │
│   Orchestrates business logic, calls repositories       │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│                 Repository Layer                         │
│   Database queries via Mongoose, maps to DTOs           │
└──────────────────────────┬───────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────┐
│              Infrastructure / Database                   │
│   MongoDB via Mongoose Schemas (JobSchema, EmplyerModel) │
└──────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
backend/
├── src/
│   ├── index.ts                          # App entry point (Express server + DB bootstrap)
│   │
│   ├── controllers/
│   │   ├── AuthController.ts             # Handles auth HTTP layer (signup, login, refresh, logout)
│   │   └── JobController.ts              # Handles job CRUD HTTP layer with ownership guards
│   │
│   ├── domain/
│   │   ├── dtos/
│   │   │   ├── auth/                     # Auth-specific DTOs (SignupDto, LoginDto, AuthResponseDto, TokenPayloadDto)
│   │   │   ├── JobDTO.ts                 # CreateJobDTO, UpdateJobDTO, JobDTO interfaces
│   │   │   └── EmployerDTO.ts            # Employer data transfer object
│   │   └── enums/
│   │       └── JobType.ts                # Enum: Full time | Part time | Contract | Internship | Freelance
│   │
│   ├── engines/
│   │   ├── JobManagementEngine.ts        # Business logic for all job operations
│   │   └── tokenEngine/
│   │       ├── ITokenEngine.ts           # Interface: generate/verify access + refresh tokens
│   │       └── TokenEngine.ts            # JWT implementation of ITokenEngine
│   │
│   ├── useCases/
│   │   └── authUseCase/
│   │       ├── IAuthUseCase.ts           # Interface: signupWithSetup, login, refreshToken, logout
│   │       └── AuthUseCase.ts            # Auth business logic (bcrypt hashing, token issuance)
│   │
│   ├── repositories/
│   │   ├── employerRepository/
│   │   │   ├── IEmployerRepository.ts   # Contract interface for employer data operations
│   │   │   └── EmployerRepository.ts    # Mongoose implementation
│   │   └── jobRepository/
│   │       └── JobRepository.ts         # CRUD + paginated search with DTO mapping
│   │
│   └── infrastructure/
│       ├── database/
│       │   ├── connection.ts            # MongoDB connection via Mongoose
│       │   └── schemas/
│       │       └── JobSchema.ts         # Mongoose schema for Job collection
│       ├── middleware/
│       │   └── Auth/
│       │       └── AuthMiddleware.ts    # JWT Bearer token verification middleware
│       ├── models/
│       │   └── EmployerModel.ts        # Mongoose model for Employer collection
│       ├── routes/
│       │   ├── authRoutes.ts           # /api/auth/** routes with DI wiring
│       │   └── jobRoutes.ts            # /api/jobs/** routes with auth protection
│       └── validation/
│           └── auth/
│               ├── LoginSchema.ts          # Yup schema for login validation
│               ├── SignupSchema.ts         # Yup schema for basic signup
│               └── SignupWithSetupSchema.ts # Yup schema for full employer registration
│
├── uploads/                            # Multer destination for company logo uploads
├── .env.example                        # Template for required environment variables
├── package.json
└── tsconfig.json
```

---

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | HTTP server and routing framework |
| **TypeScript 5** | Static typing and interface-driven development |
| **MongoDB + Mongoose 9** | NoSQL database with schema validation |
| **JSON Web Tokens (JWT)** | Stateless authentication — access + refresh token pattern |
| **bcryptjs** | Password hashing with salt rounds |
| **Yup** | Schema-based request validation |
| **Multer** | Multipart form handling for company logo uploads |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing — restricted to frontend origin |

---

## ✨ Features

### 🔐 Authentication & Authorization
- **Single-step Employer Registration** — Signup and complete company profile setup in one API call
- **JWT Access + Refresh Token** lifecycle — short-lived access tokens (15m) with long-lived refresh tokens (7d)
- **Refresh Token Rotation** — stored per-employer in MongoDB, validated on every refresh request
- **Secure Logout** — invalidates the stored refresh token on the server side
- **Ownership Authorization** — `UPDATE` and `DELETE` job endpoints verify the requesting employer owns the job before allowing the operation (returns `403 Forbidden` otherwise)

### 💼 Job Management
- **Create Job** — employer ID and company name are resolved server-side from the JWT payload, never trusted from the request body
- **List All Jobs** — server-side pagination + full-text title search with MongoDB `$regex`
- **My Jobs** — filters job listings to only the authenticated employer's postings
- **Get Job by ID** — public endpoint for viewing any single job's details
- **Update Job** — partial update (all fields optional in `UpdateJobDTO`), ownership-guarded
- **Delete Job** — permanently removes a job, ownership-guarded
- **Paginated Responses** — all list endpoints return `{ data, total, page, totalPages }`

### 🏗 Engineering Quality
- **Clean Architecture** — strict layer separation identical to `brocamp-tool-v2`
- **Interface-driven Design** — `IAuthUseCase`, `IEmployerRepository`, `ITokenEngine` for testability
- **Dependency Injection** — all dependencies passed via constructor params (no global singletons)
- **DTO Pattern** — `mapToDTO()` in every repository ensures Mongoose internals never leak to upper layers
- **Enum Safety** — `JobType` enum prevents invalid job type strings from reaching the database
- **ObjectId Reference** — `employerId` in `JobSchema` is a proper `Schema.Types.ObjectId` with `ref: 'Employer'` for relational integrity

---

## 📡 API Reference

### Base URL
```
http://localhost:5000/api
```

### 🔐 Auth Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/signup-with-setup` | ❌ Public | Register employer + company profile in one step |
| `POST` | `/auth/login` | ❌ Public | Login with username/email + password |
| `POST` | `/auth/refresh-token` | ❌ Public | Exchange refresh token for a new access token |
| `POST` | `/auth/logout` | ✅ Bearer | Invalidate refresh token and end session |

#### `POST /auth/signup-with-setup`
```json
// Request Body (multipart/form-data — supports optional 'logo' file)
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@company.com",
  "password": "securePass123",
  "companyName": "Acme Corp",
  "organizationType": "Private",
  "industryType": "Technology",
  "teamSize": "11-50",
  "yearEstablished": "2015",
  "aboutUs": "We build great products.",
  "location": "Bangalore, India",
  "contactNumber": "+91 9000000000"
}

// Response 201
{
  "status": true,
  "message": "Signup successful",
  "data": {
    "employerId": "...",
    "accessToken": "eyJ...",
    "refreshToken": "eyJ...",
    "logoUrl": null
  }
}
```

#### `POST /auth/login`
```json
// Request Body
{ "username": "johndoe", "password": "securePass123" }

// Response 200
{
  "status": true,
  "message": "Login successful",
  "data": { "employerId": "...", "accessToken": "...", "refreshToken": "..." }
}
```

---

### 💼 Job Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/jobs` | ✅ Bearer | Create a new job posting |
| `GET` | `/jobs` | ❌ Public | Get all jobs (paginated + searchable) |
| `GET` | `/jobs/my-jobs` | ✅ Bearer | Get only the authenticated employer's jobs |
| `GET` | `/jobs/:id` | ❌ Public | Get a single job by ID |
| `PUT` | `/jobs/:id` | ✅ Bearer | Update a job (ownership required) |
| `DELETE` | `/jobs/:id` | ✅ Bearer | Delete a job (ownership required) |

#### `GET /jobs?page=1&limit=7&search=designer`
```json
// Response 200
{
  "success": true,
  "data": [ { "id": "...", "title": "UX Designer", ... } ],
  "pagination": { "total": 42, "page": 1, "totalPages": 6 }
}
```

#### `POST /jobs` _(Bearer Token Required)_
```json
// Request Body
{
  "title": "Senior Frontend Developer",
  "tags": ["React", "TypeScript"],
  "role": "Frontend Developer",
  "minSalary": 60000,
  "maxSalary": 100000,
  "salaryType": "Yearly",
  "educationLevel": "Bachelor's Degree",
  "experienceLevel": "3 - 5 Years",
  "type": "Full time",
  "jobLevel": "Senior Level",
  "expirationDate": "2026-12-31",
  "country": "India",
  "city": "Bangalore",
  "fullyRemote": false,
  "description": "We are looking for..."
}
// Note: employerId and companyName are resolved from JWT — never sent by client
```

#### Authorization Error Response _(403)_
```json
{
  "success": false,
  "message": "Forbidden: You do not own this job"
}
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18.x`
- npm `>= 9.x`
- MongoDB running locally **or** a MongoDB Atlas connection string

### 1. Clone & Install
```bash
git clone <repository-url>
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB URI and secret keys
```

### 3. Run Development Server
```bash
npm run dev
# Server starts on http://localhost:5000
```

### 4. Health Check
```bash
curl http://localhost:5000/api/health
# {"status":"OK","message":"Backend is running"}
```

### 5. Build for Production
```bash
npm run build   # Compiles TypeScript to dist/
npm run start   # Runs the compiled output
```

---

## 🔧 Environment Variables

Copy `.env.example` to `.env` and provide the following values:

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Port the Express server listens on |
| `MONGO_URI` | `mongodb://localhost:27017/jobportal` | MongoDB connection string |
| `JWT_ACCESS_SECRET` | _(required)_ | Secret key for signing access tokens |
| `JWT_REFRESH_SECRET` | _(required)_ | Secret key for signing refresh tokens |
| `JWT_ACCESS_EXPIRY` | `15m` | Access token expiry duration |
| `JWT_REFRESH_EXPIRY` | `7d` | Refresh token expiry duration |
| `FRONTEND_URL` | `http://localhost:3000` | Allowed CORS origin |

> **⚠️ Important:** Never commit your real `.env` file. It is listed in `.gitignore`.

---

## 🛡 Security Design

### Authentication Flow
```
Client                        Server
  │                              │
  │── POST /auth/login ─────────▶│
  │                              │  1. Lookup employer by username/email
  │                              │  2. bcrypt.compare(password, hash)
  │                              │  3. Generate accessToken (15m) + refreshToken (7d)
  │                              │  4. Store refreshToken in MongoDB
  │◀── { accessToken, refreshToken } ──│
  │                              │
  │── GET /api/jobs (Bearer) ───▶│
  │                              │  1. Extract token from Authorization header
  │                              │  2. jwt.verify() with ACCESS_SECRET
  │                              │  3. Attach payload to req.user
  │◀── { data } ────────────────│
  │                              │
  │── POST /auth/refresh-token ─▶│
  │                              │  1. Verify refreshToken signature
  │                              │  2. Compare against stored token in DB
  │                              │  3. Issue new accessToken
  │◀── { accessToken } ─────────│
```

### Ownership Authorization (UPDATE / DELETE)
```
Request arrives with Bearer token
         │
         ▼
AuthMiddleware: verifies JWT → attaches req.user.employerId
         │
         ▼
Controller: fetches job from DB by req.params.id
         │
         ├── Job not found? → 404 Not Found
         │
         ├── job.employerId !== req.user.employerId? → 403 Forbidden
         │
         └── Match ✅ → proceed with update/delete
```

---

## 🗄 Data Models

### Employer
| Field | Type | Required | Notes |
|---|---|---|---|
| `fullName` | String | ✅ | Trimmed |
| `username` | String | ✅ | Unique, lowercase |
| `email` | String | ✅ | Unique, lowercase |
| `passwordHash` | String | ✅ | bcrypt hash — never stored as plain text |
| `refreshToken` | String | ❌ | Stored for server-side token invalidation |
| `companyName` | String | ✅ | |
| `organizationType` | String | ✅ | e.g. Private, Public, NGO |
| `industryType` | String | ✅ | e.g. Technology, Finance |
| `teamSize` | String | ✅ | e.g. 11-50, 51-200 |
| `yearEstablished` | String | ✅ | |
| `aboutUs` | String | ✅ | |
| `location` | String | ✅ | |
| `contactNumber` | String | ✅ | |
| `logoUrl` | String | ❌ | Path to uploaded file via Multer |

### Job
| Field | Type | Required | Notes |
|---|---|---|---|
| `title` | String | ✅ | |
| `tags` | [String] | ❌ | Array of keywords |
| `role` | String | ✅ | e.g. Frontend Developer |
| `minSalary` | Number | ✅ | |
| `maxSalary` | Number | ✅ | |
| `salaryType` | String | ✅ | Yearly / Monthly / Weekly / Hourly |
| `educationLevel` | String | ✅ | |
| `experienceLevel` | String | ✅ | |
| `type` | `JobType` enum | ✅ | Full time / Part time / Contract / Internship / Freelance |
| `jobLevel` | String | ✅ | Entry / Mid / Senior / Director / Executive |
| `expirationDate` | Date | ✅ | |
| `country` | String | ✅ | |
| `city` | String | ✅ | |
| `fullyRemote` | Boolean | ❌ | Default: false |
| `description` | String | ✅ | |
| `employerId` | ObjectId | ✅ | `ref: 'Employer'` — relational FK |
| `companyName` | String | ✅ | Denormalized from employer profile for fast reads |

---

## 📜 npm Scripts

| Script | Command | Description |
|---|---|---|
| `dev` | `ts-node src/index.ts` | Start development server with hot TypeScript execution |
| `build` | `tsc` | Compile TypeScript to `dist/` |
| `start` | `node dist/index.js` | Run production build |

---

<div align="center">

Built with ❤️ following Clean Architecture principles — *maintainable, testable, and production-ready.*

</div>
