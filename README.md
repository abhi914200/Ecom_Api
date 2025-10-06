# Ecom-API

APIs for a simple e-commerce application (products, users, cart, orders, likes) built with Express and MongoDB/Mongoose.

This repository implements server-side APIs and a Swagger UI at `/api-docs`. The project is written as ES modules.

## Contents (key files)
- `server.js` — application entrypoint and Express setup
- `package.json` — project metadata and dependencies
- `swagger.json` — Swagger/OpenAPI specification served at `/api-docs`
- `src/features/` — feature folders (product, user, cartItems, order, like)
- `src/config/` — DB connection helpers (`mongodb.js`, `mongooseConfig.js`)
- `src/middlewares/` — middlewares (JWT, logger, file upload)
- `uploads/` — runtime uploaded files (images)

## Requirements / prerequisites
- Node.js (LTS) — recommended v16+ or v18+
- npm (bundled with Node)
- MongoDB instance (local or cloud)

## Dependencies
(From `package.json`):
- express, mongoose, mongodb, dotenv, multer, jsonwebtoken, bcrypt, express-basic-auth, swagger-ui-express

## Environment variables
The application reads environment variables. Required/used vars discovered in the codebase:

- `DB_URL` — MongoDB connection string (used in `src/config/mongodb.js` and `src/config/mongooseConfig.js`)
- `JWT_SECRET` — secret used to sign/verify JWTs (recommended; code currently has a hardcoded secret — see Security notes)
- `PORT` — optional; server listens on `PORT` (default 3200). NOTE: ensure `dotenv.config()` runs before reading `process.env.PORT` (see suggested fix).

A ready template is provided in `.env.example`.

## Setup (local)
1. Clone repository (if not already local):
   ```powershell
   git clone https://github.com/abhi914200/Ecom_Api
   cd 'C:\Users\abhim\Desktop\Ecom-API'
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Create `.env` from `.env.example` and update values:
   ```powershell
   # copy example to .env on Windows PowerShell
   Copy-Item .env.example .env
   notepad .env   # edit values (DB_URL and JWT_SECRET)
   ```

4. Start server:
   ```powershell
   # direct run
   node server.js

   # Recommended: add scripts to package.json (see below) and run:
   npm run start
   # or for development with nodemon:
   npm run dev
   ```

5. Visit:
   - Root: ecom-api-urw9.onrender.com
   - Swagger UI / API docs: ecom-api-urw9.onrender.com/api-docs

## API overview
High level endpoints (see Swagger for full details):
- `GET /` — welcome message
- `GET /api-docs` — Swagger UI
- `/api/products` — product endpoints (protected by JWT)
- `/api/users` — user endpoints (register/login/etc.)
- `/api/cartItems` — cart endpoints (protected)
- `/api/orders` — order endpoints (protected)
- `/api/likes` — like endpoints (protected)

Authentication: JWT bearer tokens are used for protected routes. (Middleware is in `src/middlewares/jwt.middleware.js`).

## Development recommendations
- Add Node scripts in `package.json`:
  ```json
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
  ```
- Use `nodemon` for development: `npm i -D nodemon`
- Add ESLint and Prettier for consistent code-style (optional).

## Security notes / required fixes
- The project currently contains a hardcoded secret string in `src/middlewares/jwt.middleware.js`. Replace it with `process.env.JWT_SECRET` and keep the secret in `.env` only.
- `server.js` currently assigns `PORT = process.env.PORT || 3200` before `dotenv.config()` is called. Move `dotenv.config()` earlier so `.env` values are read correctly.
- Keep `.env` in `.gitignore` (it is currently ignored).

## Uploads / assets
- Uploaded files are stored in the local `uploads/` directory (see `src/middlewares/fileupload.middleware.js`). For production, use cloud storage (S3, Azure Blob, etc.) instead of keeping user uploads in the repo.

## Removing sensitive or large files from git
If `node_modules`, `uploads/` or `.env` were accidentally committed:
```powershell
git rm -r --cached node_modules uploads
git rm --cached .env
git commit -m "chore: remove tracked node_modules uploads and .env"
git push
```
To purge committed secrets from history, use BFG Repo-Cleaner or git filter-repo (this rewrites history and requires force-push and coordination).

## Helper: generate a test JWT (example)
Create `scripts/generateToken.js` (ESM) and run with `JWT_SECRET` set:
```js
// scripts/generateToken.js
import jwt from 'jsonwebtoken';
const payload = { userID: 'example-user-id' };
const secret = process.env.JWT_SECRET || 'temporary-secret';
console.log(jwt.sign(payload, secret, { expiresIn: '7d' }));
```
PowerShell:
```powershell
$env:JWT_SECRET='your_secret'; node .\scripts\generateToken.js
```

## Tests
No tests are included in the repo currently. Add unit/integration tests (Jest, Mocha) as a next step.

## Contribution
- Fork, create a feature branch, add tests, open a PR with description and changes.

## License
Add your preferred license by adding a `LICENSE` file.
