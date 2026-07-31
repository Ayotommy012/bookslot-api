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

## Status

Actively in development.

- [x] Database schema, models, and associations
- [ ] Auth (register/login, JWT)
- [ ] Resource and booking routes
- [ ] Capacity-safe booking logic (transaction + row lock)
- [ ] Test suite
- [ ] Deployment
