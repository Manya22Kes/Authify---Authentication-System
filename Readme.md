# 🔐 Authify

A production-inspired full-stack authentication system built with the MERN stack. Authify provides secure authentication, OAuth integration, email workflows, JWT-based authorization, refresh token rotation, profile management, and role-based access control in a reusable architecture.
Designed as a reusable authentication backend that can be integrated into future applications.

---

## ✨ Features

### Authentication

- Email & Password Registration
- Secure Login & Logout
- JWT Authentication
- Refresh Token Rotation
- Protected Routes

### OAuth

- Google OAuth 2.0
- GitHub OAuth

### Email Features

- Email Verification
- Resend Verification Email
- Forgot Password
- Password Reset
- Welcome Emails
- Login Notification Emails

### User Management

- Profile Management
- Avatar Uploads
- Verification Status
- Login History
- Security Dashboard

### Authorization & Security

- Role-Based Access Control
- Protected Admin Routes
- Helmet Security Headers
- HTTP-only Cookies
- Password Hashing (bcrypt)
- Rate Limiting
- Input Validation (Joi)
- CORS Protection

---

## 🛠 Tech Stack

### Frontend

- React
- React Router
- Axios
- Tailwind CSS
- React Hot Toast
- Google Identity Services

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Passport.js
- Passport-GitHub2
- Google Auth Library
- JWT
- Joi
- Bcrypt
- Resend
- Cloudinary

---

## 📁 Project Structure

### Frontend

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

### Backend

```text
backend/
├── package.json
└── server/
    ├── app.js
    ├── index.js
    ├── config/
    │   ├── db.js
    │   └── env.js
    |   └── cloudinary.js
    |   └── passport.js
    ├── controllers/
    │   ├── auth.controller.js
    │   └── user.controller.js
    |   └── admin.controller.js
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
    │   └── email.service.js
    |   └── admin.service.js
    ├── utils/
    │   ├── uploadAvatar.js
    │   ├── hash.util.js
    │   └── token.js
    └── validators/
        ├── auth.validator.js
        └── user.validator.js
```

---

## 🚀 Core Security Features

- JWT Authentication
- Refresh Token Rotation
- HTTP-only Secure Cookies
- Password Hashing with bcrypt
- Email Verification
- Password Reset
- Welcome Emails
- Login Notification Emails
- Google OAuth
- GitHub OAuth
- Role-Based Authorization
- Login History
- Security Dashboard

---

## 🚀 Getting Started

Clone the repository
git clone https://github.com/YOUR_USERNAME/Authify.git
cd Authify

## Backend

cd backend
npm install
npm start

## Frontend

cd frontend
npm install
npm run dev

---

## 🔄 Authentication Flow

- Register with email/password.
- Verify email.
- Login to receive:
- JWT Access Token
- HTTP-only Refresh Token Cookie
- Automatically refresh expired access tokens.
- Access protected resources.
- Logout and invalidate refresh token.

OAuth users can authenticate using Google or GitHub without requiring email verification.

---

## 🎯 Future Improvements

- Multi-Factor Authentication (MFA)
- Device Management
- Session Revocation
- Audit Logs
- Account Activity Timeline
- OAuth Account Linking
- WebAuthn / Passkeys

---

**Manya Keserwani**

GitHub: https://github.com/Manya22Kes

Portfolio: https://manya-keserwani.netlify.app

---

## 📄 License

This project is licensed under the MIT License.

---

## Live Demo

Frontend: https://authify-authentication-system.vercel.app

Backend API: https://authify-authentication-system.onrender.com
