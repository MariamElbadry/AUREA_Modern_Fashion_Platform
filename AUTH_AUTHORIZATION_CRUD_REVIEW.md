# Authentication, Authorization, and CRUD Review

## Scope

This is a read-only security and correctness review of authentication, authorization, and CRUD operations. It records confirmed risks and recommended fixes; it does not implement them.

## Critical findings

### 1. Secrets are committed to the repository

`backend/.env` is tracked and contains embedded MongoDB credentials and a weak placeholder JWT secret.

Impact:

- The database account may be accessed by anyone who obtains the repository or chat history.
- Anyone knowing the JWT secret can forge a valid token containing an `admin` role and bypass every `adminOnly` route.

Immediate response:

1. Rotate the MongoDB database user's password.
2. Replace the JWT secret with a long, cryptographically random value.
3. Remove `.env` from Git and repository history.
4. Add `.env` to `.gitignore` and provide a safe `.env.example` containing keys only.
5. Invalidate existing tokens after rotating the secret.
6. Use a deployment secret manager for production.

### 2. Authenticated user identity is inconsistent

Authentication signs a JWT containing `userId`, but the cart controller reads `req.user.id`. This breaks cart CRUD and demonstrates that controllers do not share a single authentication contract.

Recommended fix:

- Normalize decoded token data in `auth.middleware.js`, for example to `req.user.id` and `req.user.role`.
- Use that normalized contract in every controller.
- Prefer a conventional JWT subject (`sub`) for the user ID in future token versions.

### 3. Cart and order persistence contracts are incompatible

The cart schema, order schema, and order controller use different property names:

- `user` versus `userId`
- `items.product` versus `items.productId`
- `items` versus `products`
- `isRent` versus `isrent`

These mismatches make key CRUD operations fail and may cause incomplete or inconsistent orders.

Recommended fix:

- Define explicit cart and order DTOs.
- Align controllers with the actual schemas.
- Add integration tests covering the complete customer-to-order flow.

## High-severity authentication and authorization findings

### 1. Password hashes may be exposed by populated users

The user schema selects `password` by default. The admin all-orders controller populates the complete `userId` document, which could return password hashes once its current population-path bug is repaired.

Recommended fix:

- Set the password field to `select: false` in the user schema.
- Explicitly select the password only inside the login query.
- Populate only safe fields such as first name, last name, email, and role.

### 2. Password policy is enforced only in the browser

The frontend requires six characters, but the backend accepts any non-empty password. Direct API callers can bypass the frontend validation.

Recommended fix:

- Enforce password length and quality on the backend.
- Validate email format and normalize it to lowercase.
- Apply the same validation schema to frontend and backend where practical.

### 3. Login and registration lack abuse protection

There is no rate limiting, progressive delay, temporary lockout, or monitoring for repeated failures.

Recommended fix:

- Add rate limiting to authentication endpoints.
- Add safe audit logging and alerting.
- Consider temporary account lockout or progressive backoff.

### 4. Designer privilege is self-assigned

Public registration allows callers to choose `designer`. This may be acceptable only if designer accounts require no special trust. The code already contains designer-specific UI and authorization helpers, so public assignment could become a privilege escalation as features grow.

Recommended fix:

- Register all public users as customers.
- Use an admin approval workflow to grant designer status.

### 5. Client-side sessions are not validated properly

The frontend stores the token and user object in `localStorage`. Its route guard checks only whether cached user data exists; it does not verify token expiry or server validity.

Consequences:

- Expired or invalid tokens can appear logged in.
- An XSS vulnerability could steal the token.
- API `401` responses do not automatically clear the session.

Recommended fix:

- Prefer secure `HttpOnly`, `Secure`, `SameSite` cookies with appropriate CSRF protection, or harden the existing bearer-token design.
- Add a current-session endpoint and validate the token when the application starts.
- Add global `401` handling that clears the session and redirects to sign-in.
- Remove authentication tokens and complete login responses from console logs.

### 6. CORS allows every origin

The API uses unrestricted `cors()` configuration.

Recommended fix:

- Allow only known frontend origins in production.
- Configure allowed methods and headers explicitly.

### 7. Role claims can remain stale

The token contains the user's role for 24 hours. Changing a user's role does not invalidate existing tokens.

Recommended fix:

- Use shorter token lifetimes and refresh-token rotation, or reload authorization-critical account state from the database.
- Revoke sessions after security-sensitive role changes.

## CRUD correctness findings

### 1. Product and category writes accept raw request bodies

Create operations pass `req.body` directly into Mongoose, and update operations pass it directly to `findOneAndUpdate`.

Recommended fix:

- Use explicit allowlists/DTOs for writable fields.
- Reject unknown fields.
- Prevent clients from changing immutable identifiers accidentally.

### 2. Update validators are disabled

Mongoose update validators are not enabled for product and category updates.

Recommended fix:

```js
{ new: true, runValidators: true }
```

Also enable context-specific validation where required.

### 3. Product constraints are incomplete

The product schema does not prevent negative prices or quantities. Input types and numeric route parameters are not explicitly validated.

Recommended fix:

- Add schema minimums.
- Validate IDs, prices, quantities, booleans, and category references before database operations.
- Return `400` for invalid input rather than raw database errors or `500`.

### 4. Manual numeric IDs create collision and update risks

Products and categories use client-supplied numeric IDs. Concurrent creates can race, and updates can alter these IDs.

Recommended fix:

- Prefer MongoDB `_id` as the public identifier, or generate immutable IDs on the server.
- Convert duplicate-key errors into a clear `409 Conflict` response.

### 5. Deletes do not enforce referential integrity

Deleting products or categories can leave stale cart items, order references, or products pointing to nonexistent categories.

Recommended fix:

- Define deletion rules.
- Prevent deletion when active references exist, use soft deletion, or perform safe transactional cleanup.
- Preserve order-item snapshots even if a product is later deleted.

### 6. Ordering operations are not transactional

Creating the order, clearing the cart, and adjusting stock happen as separate writes. Partial failure can corrupt business state.

Recommended fix:

- Use a MongoDB transaction.
- Validate stock within the transaction.
- Make order creation idempotent to protect against repeated client submissions.

### 7. Order status transitions are too permissive

The admin endpoint accepts any listed status regardless of the current status. Admin cancellation does not share the customer cancellation stock-restoration logic.

Recommended fix:

- Implement an explicit state machine.
- Centralize status changes and their side effects.
- Prevent impossible transitions such as `delivered` back to `pending`.

### 8. User and admin CRUD are incomplete

There is no complete user-management API, no admin user-management frontend, and no functional admin order-management screen. The designer listing is duplicated under public and protected endpoints with different access rules.

Recommended fix:

- Define the intended user-management permissions.
- Build role-protected admin endpoints and UI.
- Remove or reconcile duplicated designer endpoints.

### 9. Backend CRUD and authorization tests are absent

There are no backend automated tests covering:

- Registration and login validation.
- Token expiry and invalid tokens.
- Role enforcement.
- Ownership isolation.
- Product and category validation.
- Cart CRUD.
- Transactional ordering and stock changes.
- Cancellation and admin status updates.

## Existing strengths

- Passwords are hashed with bcrypt before creation.
- Login uses a generic invalid-credentials response.
- Product and category write routes apply both authentication and `adminOnly` authorization.
- Admin order listing and status routes are protected at the routing layer.
- User-order reads are intended to be ownership-scoped.

These strengths are currently undermined by the exposed JWT secret and the controller/schema inconsistencies.

## Recommended remediation order

1. Rotate and remove all committed secrets.
2. Normalize authenticated identity and session handling.
3. Prevent password-hash exposure and harden registration/login.
4. Repair cart and order contracts.
5. Add backend request validation and update validators.
6. Add transactions, stock guarantees, and legal order status transitions.
7. Add admin CRUD/UI with server-side role enforcement.
8. Add automated authentication, authorization, ownership, and CRUD integration tests.
