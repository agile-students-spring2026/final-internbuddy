# InternBuddy Back-End

Express.js back-end scaffold focused on the signup -> profile pipeline.

## Folder structure

```text
back-end/
  public/
    index.html
  src/
    app.js
    server.js
    controllers/
      authController.js
      profileController.js
    data/
      profileStepOrder.js
    middleware/
      errorHandlers.js
    routes/
      authRoutes.js
      profileRoutes.js
    services/
      mockStore.js
  test/
    authRoutes.test.js
    profileRoutes.test.js
  package.json
```

## Setup

1. Open terminal in `back-end`.
2. Install dependencies:
   - `npm install`
3. Start server:
   - `npm run dev`

## Test and coverage

- Run tests with coverage:
  - `npm test`
- Coverage reports:
  - terminal summary
  - `back-end/coverage/index.html`

## Mock API routes

### Static route

- `GET /` -> returns `public/index.html`

### Health route

- `GET /api/health`

### Auth routes

- `POST /api/auth/signup`
  - body: `{ "email": "...", "phone": "..." }`
- `POST /api/auth/verify`
  - body: `{ "userId": "...", "code": "123456" }`
- `GET /api/auth/:userId`

### Profile routes

- `GET /api/profile/:userId`
- `POST /api/profile/:userId/step`
  - body: `{ "step": "name", "value": { ... } }`
- `POST /api/profile/:userId/complete`

## Notes

- Current implementation uses in-memory mock data only.
- Do not commit secrets; store sensitive values in `.env` files.
