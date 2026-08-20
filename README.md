# BookSlot API

A REST API for booking time slots against a resource (a room, a class, a service) — built with role-based access control and capacity-safe booking under concurrent load.

## Why this project

Most booking-app tutorials stop at basic CRUD and skip the part that actually makes booking systems hard: what happens when two people try to book the last open spot on a slot at the same time? This project handles that deliberately, using a Postgres transaction with a row-level lock, rather than a naive "check count, then insert" pattern that races under concurrent requests.

## Stack

- Node.js / Express
- PostgreSQL + Sequelize
- JWT auth (bcrypt for password hashing)
- Jest + Supertest (planned)

## Data model

- A **Resource** (e.g. "Meeting Room A") has many **Slots** — bookable time windows
- A **Slot** has a `capacity` and many **Bookings**
- A **Booking** belongs to a **User** and a **Slot**
- A unique constraint on `(UserId, SlotId)` prevents the same user double-booking the same slot, enforced at the database level

## Architecture
src/
config/ Database connection
models/ User, Resource, Slot, Booking + associations
controllers/ Business logic
routes/ Route definitions
middleware/ JWT auth + role gating
tests/ Test suite
## Running locally

```bash
npm install
cp .env.example .env   # fill in your local Postgres credentials + a JWT secret
createdb bookslot_dev
npm run dev
```
## API Endpoints

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | — | Create account |
| POST | `/api/auth/login` | — | Get JWT |
| GET | `/api/resources` | — | List resources |
| GET | `/api/resources/:resourceId/slots` | — | List open/full slots for a resource |
| POST | `/api/resources` | Admin | Create a resource |
| POST | `/api/resources/:resourceId/slots` | Admin | Create a slot |
| POST | `/api/bookings` | User | Book a slot (capacity-safe, transaction-locked) |
| GET | `/api/bookings/me` | User | List my bookings |
| PATCH | `/api/bookings/:id/cancel` | User | Cancel a booking |

## Status

Actively in development.

- [x] Database schema, models, and associations
- [x] Auth (register/login, JWT, role-based middleware)
- [x] Resource and slot endpoints (public reads, admin-only writes)
- [x] Booking endpoints (create, cancel, list mine)
- [x] Capacity-safe booking logic (transaction + row lock) — manually verified: booking to capacity, rejecting overbooking, and cancellation reopening the slot all confirmed working
- [ ] Automated test suite (including a concurrent-request test proving the row lock)
- [ ] Deployment