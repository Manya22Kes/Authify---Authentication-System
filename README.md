# Authify - Production Auth Frontend

A production-grade React authentication frontend built with Vite, React Router v6, Axios, Context API, and Tailwind CSS.

## Quick Start

```bash
cd auth-frontend
cp .env.example .env
npm install
npm run dev
```

Open `http://localhost:5173`

## Architecture

```text
src/
|-- api/
|   |-- axios.js
|   `-- endpoints.js
|-- components/
|   |-- forms/
|   |-- layout/
|   |-- loaders/
|   `-- ui/
|-- context/
|   `-- AuthContext.jsx
|-- hooks/
|   |-- useAuth.js
|   `-- useRefreshToken.js
|-- layouts/
|   |-- AuthLayout.jsx
|   `-- DashboardLayout.jsx
|-- pages/
|   |-- auth/
|   |-- dashboard/
|   |-- Landing.jsx
|   |-- NotFound.jsx
|   `-- Unauthorized.jsx
|-- routes/
|   |-- ProtectedRoute.jsx
|   `-- RoleRoute.jsx
|-- services/
|   |-- adminService.js
|   `-- authService.js
`-- utils/
    |-- constants.js
    `-- helpers.js
```

## Security Model

| Concern | Implementation |
| --- | --- |
| Refresh token | httpOnly cookie managed by the backend |
| Access token | In-memory only inside `AuthContext` |
| localStorage | Not used for auth tokens |
| 401 handling | Silent refresh, then retry original request |
| Refresh race condition | One refresh at a time with request queueing |
| Session restore | Silent refresh on app startup |
| Role protection | `RoleRoute` redirects to `/unauthorized` |

## Environment Variables

| Variable | Description |
| --- | --- |
| `VITE_API_BASE_URL` | Base URL of the backend API, for example `http://localhost:5000/api` |

## Backend Contract

`POST /auth/login`

```json
{
  "success": true,
  "accessToken": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

`POST /auth/register`

```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

The frontend logs the user in immediately after successful registration so the cookie-backed session is created by the normal login flow.

`POST /auth/refresh`

```json
{
  "success": true,
  "accessToken": "...",
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

`GET /auth/me`

```json
{
  "success": true,
  "user": {
    "id": "...",
    "name": "...",
    "email": "...",
    "role": "user"
  }
}
```

`POST /auth/logout`, `POST /auth/forgot-password`, and `POST /auth/reset-password/:token` return standard success/error JSON responses.

## Extending

- OAuth can be added by introducing provider redirect methods in `authService.js`.
- MFA can be layered on after login by checking an additional backend flag.
- Email verification can gate routes in `AuthContext` without changing the routing structure.
- Session management and audit logs can be added as new service calls and pages without reworking the auth core.
