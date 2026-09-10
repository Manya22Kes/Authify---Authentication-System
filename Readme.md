<div align="center">

# 🔐 Authify

### *A Production-Inspired Full-Stack Authentication & Authorization Engine*

[![Frontend Live](https://img.shields.io/badge/Frontend-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://authify-authentication-system.vercel.app)
[![Backend Live](https://img.shields.io/badge/Backend_API-Live_Service-46E3B7?style=for-the-badge&logo=render&logoColor=white)](https://authify-authentication-system.onrender.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<br/>

[![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=flat-square&logo=JSON%20web%20tokens)](https://jwt.io/)
[![OAuth 2.0](https://img.shields.io/badge/OAuth-2.0-orange?style=flat-square)](https://oauth.net/2/)

<br/>

<p align="center">
  A production-inspired full-stack authentication system built with the <b>MERN stack</b>. Authify provides secure authentication, OAuth integration, email workflows, JWT-based authorization, refresh token rotation, profile management, and role-based access control in a reusable architecture.
</p>

> **Core Philosophy:** Designed as a reusable authentication backend that can be integrated into future applications.

<br/>

[🚀 Live Demo](https://authify-authentication-system.vercel.app) • [🔌 Backend API](https://authify-authentication-system.onrender.com) • [💻 GitHub Profile](https://github.com/Manya22Kes) • [🌐 Developer Portfolio](https://manya-keserwani.netlify.app)

</div>

---

## 📑 Table of Contents

- [🌐 Live Deployment](#-live-deployment)
- [✨ Key Features](#-key-features)
- [🛡️ Core Security Features](#️-core-security-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🔄 Authentication Flow](#-authentication-flow)
- [📁 Project Structure](#-project-structure)
- [🚀 Getting Started](#-getting-started)
- [🎯 Future Improvements](#-future-improvements)
- [👤 Author & Connect](#-author--connect)
- [📄 License](#-license)

---

## 🌐 Live Deployment

| Service | Environment | Link |
| :--- | :--- | :--- |
| **Frontend Application** | Vercel | [authify-authentication-system.vercel.app](https://authify-authentication-system.vercel.app) |
| **Backend API Server** | Render | [authify-authentication-system.onrender.com](https://authify-authentication-system.onrender.com) |

---

## ✨ Key Features

### 🔑 Authentication
- **Email & Password Registration:** Safe signup pipeline with sanitized data.
- **Secure Login & Logout:** Stateless session management with controlled invalidation.
- **JWT Authentication:** Short-lived access tokens for secure API interactions.
- **Refresh Token Rotation:** Automatic rotation preventing reuse attacks and extending valid sessions securely.
- **Protected Routes:** Granular frontend and backend route guards.

### 🌐 OAuth Integrations
- **Google OAuth 2.0:** One-tap and OAuth credential flow via Google Identity Services.
- **GitHub OAuth:** Fast developer-friendly authentication via GitHub App integration.

### 📧 Email Workflows
- **Email Verification:** Account activation links upon signup.
- **Resend Verification Email:** Option to dispatch a new verification email when needed.
- **Forgot Password:** Secure reset requests generated with expiring tokens.
- **Password Reset:** Safe password reconfiguration workflows.
- **Welcome Emails:** Automated onboarding messaging upon successful verification.
- **Login Notification Emails:** Proactive security alerts triggered on sign-in events.

### 👤 User Management
- **Profile Management:** Full user detail updates and settings.
- **Avatar Uploads:** Cloudinary-backed multimedia storage and processing.
- **Verification Status:** Live badge tracking for user account confirmation.
- **Login History:** Audited session history and IP/device tracking.
- **Security Dashboard:** User-facing hub to inspect account protection settings.

### 🛡️ Authorization & System Security
- **Role-Based Access Control (RBAC):** Strict boundaries separating standard users and administrators.
- **Protected Admin Routes:** Exclusive endpoints and dashboards restricted to administrative roles.
- **Helmet Security Headers:** Protection against clickjacking, XSS, and sniff exploits.
- **HTTP-Only Cookies:** Shielding refresh tokens against client-side script inspection (XSS).
- **Password Hashing (bcrypt):** High work-factor cryptographic credential hashing.
- **Rate Limiting:** Protection against brute-force and denial-of-service spam.
- **Input Validation (Joi):** Strict schema-based request payload validation.
- **CORS Protection:** Configured cross-origin whitelisting for safe frontend-backend communications.

---

## 🛡️ Core Security Features

- 🔒 **JWT Authentication**
- 🔄 **Refresh Token Rotation**
- 🍪 **HTTP-only Secure Cookies**
- 🔑 **Password Hashing with bcrypt**
- ✉️ **Email Verification**
- 🔁 **Password Reset**
- 👋 **Welcome Emails**
- 🚨 **Login Notification Emails**
- 🌐 **Google OAuth**
- 🐙 **GitHub OAuth**
- 👥 **Role-Based Authorization**
- 📜 **Login History**
- 📊 **Security Dashboard**

---

## 🛠️ Tech Stack

### Frontend

| Technology | Badge / Ecosystem | Purpose |
| :--- | :--- | :--- |
| **React** | ![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black) | Core UI library |
| **React Router** | ![React Router](https://img.shields.io/badge/-React_Router-CA4245?style=flat-square&logo=reactrouter&logoColor=white) | Client-side routing and protected route management |
| **Axios** | ![Axios](https://img.shields.io/badge/-Axios-5A29E4?style=flat-square&logo=axios&logoColor=white) | HTTP client with automated refresh interceptors |
| **Tailwind CSS** | ![Tailwind CSS](https://img.shields.io/badge/-Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) | Responsive, modern utility-first styling |
| **React Hot Toast** | ![Toast](https://img.shields.io/badge/-React_Hot_Toast-FF4560?style=flat-square) | Real-time notifications and UX feedback |
| **Google Identity Services** | ![Google](https://img.shields.io/badge/-Google_Identity-4285F4?style=flat-square&logo=google&logoColor=white) | Native Google OAuth client integration |

### Backend

| Technology | Badge / Ecosystem | Purpose |
| :--- | :--- | :--- |
| **Node.js** | ![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white) | Runtime environment |
| **Express.js** | ![Express](https://img.shields.io/badge/-Express.js-000000?style=flat-square&logo=express&logoColor=white) | RESTful API framework |
| **MongoDB** | ![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white) | NoSQL document database |
| **Mongoose** | ![Mongoose](https://img.shields.io/badge/-Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white) | Object Data Modeling (ODM) layer |
| **Passport.js** | ![Passport](https://img.shields.io/badge/-Passport.js-34E27A?style=flat-square&logo=passport&logoColor=black) | Authentication middleware |
| **Passport-GitHub2**| ![GitHub](https://img.shields.io/badge/-Passport--GitHub2-181717?style=flat-square&logo=github&logoColor=white) | GitHub OAuth 2.0 strategy |
| **Google Auth Library** | ![Google](https://img.shields.io/badge/-Google_Auth_Library-4285F4?style=flat-square&logo=google&logoColor=white) | Token verification and Google authentication |
| **JWT** | ![JWT](https://img.shields.io/badge/-JSON_Web_Tokens-000000?style=flat-square&logo=jsonwebtokens&logoColor=white) | Stateless session authorization |
| **Joi** | ![Joi](https://img.shields.io/badge/-Joi-222222?style=flat-square) | Schema validation for HTTP requests |
| **Bcrypt** | ![Bcrypt](https://img.shields.io/badge/-Bcrypt-black?style=flat-square) | Salting and password hashing |
| **Resend** | ![Resend](https://img.shields.io/badge/-Resend-000000?style=flat-square&logo=resend&logoColor=white) | Modern transactional email delivery service |
| **Cloudinary** | ![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white) | Cloud-based media and avatar storage |

---

## 🔄 Authentication Flow

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Frontend as Frontend (React)
    participant Backend as Backend (Express)
    participant DB as Database (MongoDB)

    User->>Frontend: Register with Email & Password
    Frontend->>Backend: POST /api/auth/register
    Backend->>DB: Save User (Pending Verification)
    Backend-->>User: Dispatch Verification Email
    User->>Frontend: Click Email Verification Link
    Frontend->>Backend: POST /api/auth/verify-email
    Backend->>DB: Update Account as Verified
    
    User->>Frontend: Submit Login Credentials
    Frontend->>Backend: POST /api/auth/login
    Backend->>Backend: Validate credentials & bcrypt hash
    Backend-->>Frontend: Set HTTP-Only Refresh Cookie & Return JWT Access Token
    
    Frontend->>Backend: Request Protected Endpoint (with Access Token Header)
    Backend-->>Frontend: Return Protected Data
    
    Note over Frontend,Backend: When Access Token expires:
    Frontend->>Backend: POST /api/auth/refresh (Cookie sent automatically)
    Backend-->>Frontend: Issue New Access Token (Refresh Token Rotation)

    User->>Frontend: Logout
    Frontend->>Backend: POST /api/auth/logout
    Backend-->>Frontend: Clear Cookie & Invalidate Refresh Token
```

### Flow Walkthrough
1. **Register with email/password.**
2. **Verify email.**
3. **Login to receive:**
   - JWT Access Token
   - HTTP-only Refresh Token Cookie
4. **Automatically refresh expired access tokens.**
5. **Access protected resources.**
6. **Logout and invalidate refresh token.**

> 💡 **OAuth Flow Note:** OAuth users can authenticate using Google or GitHub without requiring email verification.

---

## 📁 Project Structure

### Frontend Architecture

```text
frontend/
└── src/
    ├── api/
    │   ├── axios.js
    │   └── endpoints.js
    ├── components/
    │   ├── forms/
    │   ├── layout/
    │   ├── loaders/
    │   └── ui/
    ├── context/
    │   └── AuthContext.jsx
    ├── hooks/
    │   ├── useAuth.js
    │   └── useRefreshToken.js
    ├── layouts/
    │   ├── AuthLayout.jsx
    │   └── DashboardLayout.jsx
    ├── pages/
    │   ├── auth/
    │   │   ├── Login.jsx
    │   │   ├── Register.jsx
    │   │   ├── ForgotPassword.jsx
    │   │   ├── ResetPassword.jsx
    │   │   ├── VerifyEmail.jsx
    │   │   └── OAuthCallback.jsx
    │   ├── dashboard/
    │   │   ├── Dashboard.jsx
    │   │   ├── AdminDashboard.jsx
    │   │   ├── Profile.jsx
    │   │   ├── Sessions.jsx
    │   │   ├── Security.jsx
    │   │   ├── AuditLogs.jsx
    │   │   └── Support.jsx
    │   ├── Landing.jsx
    │   ├── Unauthorized.jsx
    │   └── NotFound.jsx
    ├── routes/
    │   ├── ProtectedRoute.jsx
    │   └── RoleRoute.jsx
    ├── services/
    │   ├── authService.js
    │   └── adminService.js
    ├── utils/
    │   ├── constants.js
    │   └── helpers.js
    ├── App.jsx
    ├── main.jsx
    └── index.css
```

### Backend Architecture

```text
backend/
├── package.json
└── server/
    ├── app.js
    ├── index.js
    ├── config/
    │   ├── db.js
    │   ├── env.js
    │   ├── cloudinary.js
    │   └── passport.js
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── user.controller.js
    │   └── admin.controller.js
    ├── middlewares/
    │   ├── auth.middleware.js
    │   ├── upload.middleware.js
    │   ├── rateLimiter.js
    │   └── verified.middleware.js
    ├── models/
    │   └── user.model.js
    ├── routes/
    │   ├── auth.routes.js
    │   ├── user.routes.js
    │   └── admin.routes.js
    ├── services/
    │   ├── auth.service.js
    │   ├── user.service.js
    │   ├── token.service.js
    │   ├── email.service.js
    │   └── admin.service.js
    ├── utils/
    │   ├── uploadAvatar.js
    │   ├── hash.util.js
    │   └── token.js
    └── validators/
        ├── auth.validator.js
        └── user.validator.js
```

---

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/Authify.git
cd Authify
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
npm start
```

### 3. Frontend Setup

```bash
# In a new terminal, navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```

---

## 🎯 Future Improvements

- [ ] **Multi-Factor Authentication (MFA)**
- [ ] **Device Management**
- [ ] **Session Revocation**
- [ ] **Audit Logs**
- [ ] **Account Activity Timeline**
- [ ] **OAuth Account Linking**
- [ ] **WebAuthn / Passkeys**

---

## 👤 Author & Connect

**Manya Keserwani**

[![GitHub](https://img.shields.io/badge/GitHub-Manya22Kes-181717?style=for-the-badge&logo=github)](https://github.com/Manya22Kes)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit_Website-0A66C2?style=for-the-badge&logo=google-chrome&logoColor=white)](https://manya-keserwani.netlify.app)

---

## 📄 License

This project is licensed under the **MIT License**.
