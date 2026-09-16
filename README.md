# Customer Auth API

Express.js REST API with session-based authentication, MongoDB (Mongoose), and bcrypt password hashing.

## Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `POST` | `/api/login` | — | Log in, start a session |
| `POST` | `/api/add_customer` | — | Register a new customer |
| `GET` | `/api/logout` | ✅ Session | Destroy session and clear cookies |
| `GET` | `/` | — | Serve home page |

## Request Examples

**Login**
```http
POST /api/login
Content-Type: application/json
{ "user_name": "ivan", "password": "secret" }
```

**Add customer**
```http
POST /api/add_customer
Content-Type: application/json
{ "user_name": "ivan", "password": "secret", "email": "ivan@mail.com", "age": 25 }
```

**Logout**
```http
GET /api/logout
```

## Authentication Flow

1. Register via `POST /api/add_customer` — password is hashed with bcrypt
2. Log in via `POST /api/login` — session is created, `username` cookie is set
3. Session expires after **2 minutes** of inactivity
4. Log out via `GET /api/logout` — session destroyed, cookies cleared

## Stack

- [Express.js](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/) — MongoDB ODM
- [bcrypt](https://github.com/kelektiv/node.bcrypt.js) — password hashing
- [express-session](https://github.com/expressjs/session) + [uuid](https://github.com/uuidjs/uuid) — session management
- Custom error classes: `ValidationError`, `InvalidUserError`, `AuthenticationFailed`

## Getting Started

```bash
npm install
docker-compose up       # starts MongoDB on port 27017
node index.js           # starts server on http://localhost:3000
```

MongoDB URI: `mongodb://mongodb:27017/customerDB`

## Known Issues

- `POST /api/add_customer` references `age` before it is read from `req.body` — causes a `ReferenceError`
- User duplicate check in `/api/add_customer` is missing an early `return`, so execution continues after `res.send("User already exists")`
