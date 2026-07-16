# AUREA Modern Fashion Platform

## Run the complete website on one URL

1. Create `backend/.env` with `MONGODB_URI`, `JWT_SECRET`, and optionally `PORT`.
2. Install both applications once:

   ```bash
   npm run install:all
   ```

3. Build and launch the complete application (the script automatically uses a compatible Node.js 24 runtime for Angular):

   ```bash
   npm run launch
   ```

Open `http://localhost:5000`. The Node server serves both the Angular website and the `/api` backend from that single origin.

For hosting platforms, use `npm run build` as the build command and `npm start` as the start command. Set `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, and the platform-provided `PORT`. `FRONTEND_URL` is optional when the frontend is served by this backend; use a comma-separated list only if an external frontend also calls the API.

For Angular development mode, run the backend and frontend separately. The dev proxy defaults to port `5000`; set `API_TARGET` when the backend uses a different local port.
