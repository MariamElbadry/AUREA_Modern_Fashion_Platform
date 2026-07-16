# Cart, Ordering, and Admin Review

## Scope

This is a read-only review of the cart, ordering, and admin-order functionality. It records confirmed bugs and recommended fixes; it does not implement them.

## Previous environment changes

No authentication logic was changed while getting the application running. The earlier runtime work only:

- Removed the forced Google DNS override from `backend/config/db.js`.
- Changed the frontend API proxy from port `5000` to `5001` because port `5000` was occupied.
- Started a local MongoDB container and seeded the repository's sample users and products.

Authentication began working because the API and database became reachable, not because the authentication implementation was rewritten.

## Confirmed cart bugs

### 1. Add to cart fails because the authenticated user ID is inconsistent

The JWT created in `backend/controllers/auth.controller.js` contains `userId`, but `backend/controllers/cart.controller.js` reads `req.user.id`.

The server log confirms the resulting error:

```text
Cart validation failed: user: Path `user` is required.
```

Because `req.user.id` is undefined, MongoDB rejects the new cart because its required `user` field has no value.

Recommended fix:

- Establish one authenticated identity property in the authentication middleware.
- Use it consistently in every controller. For the current token structure, cart operations should use `req.user.userId`, or the middleware should normalize it to `req.user.id`.

### 2. Backend and frontend cart item shapes are incompatible

The backend populates product information under `item.product`, while the cart page expects flat properties such as:

- `item.productId`
- `item.name`
- `item.imageUrl`
- `item.designer`
- `item.isrent`

After the user-ID bug is fixed, cart items may save successfully but render with missing names, images, designers, and IDs.

Recommended fix:

- Define a single cart response DTO.
- Either flatten populated products in the backend response or update the frontend to consume `item.product.*` consistently.
- Add shared TypeScript interfaces instead of using `any`.

### 3. Rental fields use inconsistent names

The frontend and seed data use `isrent`, while the product and cart schemas use `isRent`. The add-to-cart controller also expects `isRent`.

Consequences include:

- Rental products being treated as purchases.
- Rental badges not appearing.
- Cart matching, stock validation, quantity updates, and removal targeting the wrong item variant.

Recommended fix:

- Standardize on `isRent` in schemas, seed data, frontend models, components, templates, requests, and responses.

### 4. Remove-item routes do not match

The frontend calls:

```text
DELETE /api/cart/remove/:productId
```

The backend requires:

```text
DELETE /api/cart/remove/:productId/:isRent
```

The current frontend request therefore returns `404` and cannot remove an item.

Recommended fix:

- Include the rental flag in the request, or redesign the route to accept a cart-item ID or request body.

### 5. Quantity updates omit the rental flag

The frontend sends only `productId` and `quantity`. The backend uses both product identity and `isRent` to find the cart item, defaulting omitted values to `false`.

Recommended fix:

- Pass `productId`, `quantity`, and `isRent` for every update.
- Prefer a stable cart-item ID to avoid composite matching.

### 6. Cart count is not reliably refreshed after login

`CartService` requests the cart when it is first constructed. This often happens before authentication, and the resulting `401` is silently ignored. A successful login does not trigger another refresh.

Recommended fix:

- Refresh the cart immediately after login.
- Reset it after logout.
- Handle failed cart requests instead of silently discarding them.

### 7. Cart error messages hide the actual server problem

The products component always displays `Failed to add to cart`, discarding the backend response. Quantity and removal actions also lack useful error handling.

Recommended fix:

- Display safe server messages such as authentication, stock, or validation failures.
- Add consistent loading and error states for all cart actions.

## Confirmed ordering bugs

### 1. The order controller queries a cart field that does not exist

The cart schema stores ownership as `user`, but order creation queries `{ userId }`.

Recommended fix:

```js
Cart.findOne({ user: req.user.userId })
```

### 2. The order controller populates a cart path that does not exist

The cart schema defines `items.product`, but order creation populates `items.productId`.

Recommended fix:

- Populate `items.product`.

### 3. The order schema and controller use different collection fields

The order model defines `items`, while the controller creates, reads, populates, and iterates over `products`.

This breaks:

- Order creation.
- Order history.
- Single-order reads.
- Cancellation.
- Stock restoration.
- Admin order listing.
- Status updates.

Recommended fix:

- Choose `items` as the canonical field and update every order operation to use it.
- Define a consistent order-item schema containing product ID, snapshot fields, quantity, price, and `isRent`.

### 4. Ordering is not atomic

Order creation, cart clearing, and stock reduction are separate database writes. A failure halfway through can leave inconsistent data.

Recommended fix:

- Use a MongoDB transaction.
- Recheck stock inside the transaction.
- Create the order, adjust stock, and clear the cart as one atomic operation.

### 5. Status transitions and stock restoration are incomplete

An admin can set any allowed status from any current status. Admin cancellation does not restore stock, while customer cancellation attempts to use the wrong order field.

Recommended fix:

- Define legal status transitions.
- Centralize cancellation behavior.
- Restore stock exactly once when an eligible purchase is cancelled.

## Admin-side gaps

The backend exposes `GET /api/orders/all`, but its population paths are broken. The frontend has no admin dashboard, admin route, admin-specific guard, all-orders service call, or status-update controls.

Recommended fix:

- Add a role-protected admin route.
- Add `getAllOrders()` and `updateOrderStatus()` frontend service methods.
- Display customer, items, totals, dates, and status history.
- Enforce authorization on the backend even when the frontend hides admin controls.

There is no admin endpoint or UI for viewing users' live carts. Administrators should normally see submitted orders rather than private unfinished carts unless live-cart access is an explicit business requirement.

## Recommended implementation order

1. Normalize the authenticated user identity.
2. Standardize `isRent` and the cart request/response contract.
3. Repair add, view, update, remove, clear, and cart-count behavior.
4. Align the order controller with the cart and order schemas.
5. Add transactional order creation and stock handling.
6. Build the admin orders UI and role guard.
7. Add backend integration tests for ownership, cart operations, ordering, cancellation, stock, and admin permissions.
