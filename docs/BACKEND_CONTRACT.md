
# Backend API Contract - ReservaPro

Base URL: `https://api.reservapro.com/v1`

## Authentication
- `POST /auth/login`: `{email, password}` -> `token, user`
- `POST /auth/register`: `{name, email, password, role}` -> `token, user`

## User Profile
- `GET /me`: Get current user info.

## Professionals (Tenants)
- `GET /professionals`: List visible & active professionals.
- `GET /professionals/:id`: Detailed profile.
- `GET /professionals/:id/services`: List services.
- `GET /professionals/:id/slots`: List available working windows.

## Appointments
- `GET /appointments`: Filter by `professionalId` or `clientId`.
- `POST /appointments`: Create new booking.
  - Returns `409` if slot is busy.
- `PATCH /appointments/:id/status`: Update status (Confirmed/No-Show/etc).

## Errors
- `401`: Unauthorized (Invalid token/pass).
- `403`: Forbidden (Role check failed).
- `409`: Conflict (Slot occupied).
