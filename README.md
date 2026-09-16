# Customer Auth API

Two Express.js servers covering different authentication strategies: **JWT-based** and **session-based** with MongoDB.

---

## Server 1 — JWT Auth (`jwt-server.js`)

In-memory user store, stateless authentication via JSON Web Tokens.

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | — | Register a new user |
| `POST` | `/login` | — | Log in, receive a JWT token |
| `GET` | `/dashboard` | ✅ Bearer token | Access protected route |

### Request Examples

**Register**
```http
POST /register
Content-Type: application/json
{ "username": "name", "password": "secret" }
```

**Login**
```http
POST /login
Content-Type: application/json
{ "username": "name", "password": "secret" }
```
Response:
```json
{ "token": "<jwt_token>" }
```

**Dashboard**
```http
GET /dashboard
Authorization: Bearer <jwt_token>
```

### Environment Variables

| Variable | Default | Description |
|---|---|---|
| `JWT_SECRET` | `default_secret_key` | Secret key for signing tokens |

> ⚠️ Always set `JWT_SECRET` via environment variable in production.

---

## Server 2 — Session Auth (`session-server.js`)

MongoDB-backed user store, stateful authentication via express-session.

### Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/login` | — | Log in, start a session |
| `POST` | `/api/add_customer` | — | Register a new customer |
| `GET` | `/api/logout` | ✅ Session | Destroy session and clear cookies |
| `GET` | `/` | — | Serve home page |

### Request Examples

**Add customer**
```http
POST /api/add_customer
Content-Type: application/json
{ "user_name": "name", "password": "secret", "email": "email@mail.com", "age": 25 }
```

**Login**
```http
POST /api/login
Content-Type: application/json
{ "user_name": "name", "password": "secret" }
```

**Logout**
```http
GET /api/logout
```

### Authentication Flow

1. Register via `POST /api/add_customer` — password hashed with bcrypt
2. Log in via `POST /api/login` — session created, `username` cookie set
3. Session expires after **2 minutes** of inactivity
4. Log out via `GET /api/logout` — session destroyed, cookies cleared

---

## Stack

- [Express.js](https://expressjs.com/)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — JWT signing & verification
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — password hashing
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM
- [express-session](https://github.com/expressjs/session) + [uuid](https://github.com/uuidjs/uuid) — session management
- Custom error classes: `ValidationError`, `InvalidUserError`, `AuthenticationFailed`

## Getting Started

```bash
npm install
docker-compose up        # starts MongoDB on port 27017
JWT_SECRET=your_secret node jwt-server.js      # port 3000
node session-server.js                         # port 3000
```

## Known Issues

- `POST /api/add_customer` references `age` before reading it from `req.body` → `ReferenceError`
- Missing `return` after `res.send("User already exists")` in `/api/add_customer` — execution continues after response is sent
