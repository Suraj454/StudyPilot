# Authentication Flow

## 1. Overview

StudyPilot uses email and password accounts. Passwords are hashed with bcrypt. After login, the server returns a signed JWT, and the client sends it back in the Authorization header as a Bearer token. A middleware checks the token on private routes.

Endpoints (all under /api/auth):

| Method    | Path      | Auth needed   | Purpose                               |
| --------- | --------- | ------------- | --------------------------------------|
| POST      | /register | No            | Create an account                     |
| POST      | /login    | No            | Check credentials and return a JWT    |
| GET       | /me       | Yes           | Return the logged-in user             |

## 2. Where the code lives

All paths are inside backend/src.

| File                              | Job                                                       |
| ----------------------------------|-----------------------------------------------------------|
| modules/auth/auth.schema.ts       | Zod validation for request bodies                         |
| modules/auth/auth.service.ts      | Business logic and database calls                         |
| modules/auth/auth.routes.ts       | HTTP only: read request, call service, send response      |
| middleware/requireAuth.ts         | Verifies the Bearer token on private routes               |
| lib/env.ts                        | requireEnv: returns an env variable or fails at startup   |
| lib/prisma.ts                     | Shared database client                                    |

Rule: routes know HTTP, the service knows the database, the schema knows what input is valid.

## 3. Register: POST /api/auth/register

Body: name (optional), email, password.

Flow:
1. Zod validates the body: email is trimmed, lowercased and valid; password is 8 to 72 characters (bcrypt only uses the first 72 bytes); name is optional.
2. The password is hashed with bcrypt (cost 12). The plain password is never stored.
3. The user is saved with Prisma. The database unique constraint on email is the real duplicate check, so there is no race between "check" and "insert".
4. A duplicate email becomes EmailAlreadyUsedError, returned as 409.
5. The response contains id, name, email and createdAt only. It never contains passwordHash.

Status codes: 201 created, 400 validation failed, 409 email already registered, 500 unexpected error.

## 4. Login: POST /api/auth/login

Body: email, password.

Flow:
1. Zod validates the body.
2. The user is looked up by lowercase email.
3. bcrypt compares the password with the stored hash. If no user was found, it compares against a dummy hash, so the response time does not reveal whether the email exists.
4. A wrong password and an unknown email both throw InvalidCredentialsError, returned as the same 401 with the same message. This stops attackers from discovering which emails have accounts.
5. On success the server signs a JWT and returns it with the safe user fields.

Status codes: 200 success, 400 validation failed, 401 invalid email or password, 500 unexpected error.

## 5. JWT and Bearer tokens

A JWT has three parts: header, payload and signature. It is signed, not encrypted, so anyone can read the payload. Never put secrets in it.

Our token:
- Payload: sub (the user id as a string), plus iat and exp added by the library.
- Signed with JWT_SECRET using HS256 (the default algorithm).
- Expires after JWT_EXPIRES_IN (1d in V1). There are no refresh tokens in V1.

The client sends the token on private requests:

```
Authorization: Bearer <token>
```

Decision: V1 uses the Authorization header, not an httpOnly cookie. It is simpler and less likely to break when frontend and backend are on different free hosts. Trade-off: a token kept in browser storage can be stolen if the site has an XSS bug. Revisit if hosting changes.

## 6. The middleware: requireAuth

Runs before a private route handler.

1. Reads the Authorization header. If it is missing or does not start with "Bearer ", it returns 401 "Authentication required".
2. Verifies the token with jwt.verify, pinned to HS256, which checks the signature and expiry.
3. If the token is invalid or expired, it returns 401 "Invalid or expired token".
4. If valid, it sets req.userId from the sub claim and calls next().

## 7. Protected route: GET /api/auth/me

Uses requireAuth, then loads the user by req.userId and returns the safe fields. If the token is valid but the user no longer exists, it returns 401.

## 8. Environment variables

| Variable            | Purpose                                                      |
| --------------------|--------------------------------------------------------------|
| JWT_SECRET          | Signing key for tokens. Long and random. Never committed.    |
| JWT_EXPIRES_IN      | Token lifetime, for example 1d.                              |

backend/.env holds the real values. backend/.env.example holds placeholders only. requireEnv makes the server refuse to start if JWT_SECRET is missing.

## 9. Security notes

- Passwords are hashed with bcrypt, never stored in plain text.
- Responses use select, so passwordHash can never leak.
- Login returns one generic error for all credential failures.
- The JWT algorithm is pinned to HS256 when verifying.
- The secret lives only in .env.

## 10. How it was tested

Postman cases:
- Register: success, duplicate email, invalid body.
- Login: correct credentials (200), wrong password (401), unknown email (401, same message), invalid body (400).
- /me: no token (401), fake token (401), real token (200).

## 11. Known gaps

- No login rate limiting yet (planned for Week 11).
- No automated tests yet (Supertest, Week 11).
- No central error handler: each route has its own try/catch.
- No refresh tokens or logout on the server: logging out means the client deletes the token.
- Token storage on the frontend is decided in Week 3.