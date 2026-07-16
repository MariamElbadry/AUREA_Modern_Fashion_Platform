# AUREA Modern Fashion Platform

## Run the complete website on one URL

1. Create `backend/.env` with `MONGODB_URI`, `JWT_SECRET`, and optionally `PORT`.
2. Build and launch the complete application:

   ```bash
   npm run launch
   ```

The launch command automatically installs missing frontend and backend dependencies, then uses a compatible Node.js 24 runtime to build Angular. Open `http://localhost:5000`. The Node server serves both the Angular website and the `/api` backend from that single origin.

For hosting platforms, use `npm run build` as the build command and `npm start` as the start command. Set `MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, and the platform-provided `PORT`. `FRONTEND_URL` is optional when the frontend is served by this backend; use a comma-separated list only if an external frontend also calls the API.

For Angular development mode, run the backend and frontend separately. The dev proxy defaults to port `5000`; set `API_TARGET` when the backend uses a different local port.

### MongoDB Atlas DNS errors

If startup reports `querySrv ECONNREFUSED`, the local DNS server is rejecting Atlas SRV lookups. The backend now retries automatically with Cloudflare and Google DNS. If the network still blocks the lookup, add `DNS_SERVERS=1.1.1.1,8.8.8.8` to `backend/.env`, flush the computer's DNS cache, and restart the application.

## Deploy to Vercel

The repository includes `vercel.json` and a serverless Express entry point. Link the project, add `MONGODB_URI` and `JWT_SECRET` as sensitive production environment variables, then deploy with `vercel --prod`. Vercel serves Angular and the `/api` functions on the same HTTPS domain.
