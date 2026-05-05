# InternBuddy Back-End

Express.js back-end for the InternBuddy application.

## Folder structure

```text
back-end/
  public/
    index.html
  src/
    app.js
    db.js
    server.js
    controllers/
      authController.js
      connectionsController.js
      eventsController.js
      messagesController.js
      profileController.js
      swipeController.js
      userController.js
    middleware/
      authMiddleware.js
      errorHandlers.js
      validateRequest.js
    models/
      Connection.js
      Conversation.js
      Event.js
      Profile.js
      Swipe.js
      User.js
    routes/
      authRoutes.js
      connectionsRoutes.js
      eventsRoutes.js
      messagesRoutes.js
      profileRoutes.js
      swipeRoutes.js
      userRoutes.js
    scripts/
      randomizeAlphabetAccounts.js
      seedUsers.js
    services/
      usersStore.js
  test/
    authRoutes.test.js
    connectionsRoutes.test.js
    eventsRoutes.test.js
    messagesRoutes.test.js
    profileRoutes.test.js
    setup.js
    swipeRoutes.test.js
  package.json
```

## Setup

1. Open terminal in `back-end/`.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in the values — do **not** commit `.env`.
4. Start the server:
   ```bash
   npm run dev
   ```
   The server runs on `http://localhost:3001` by default.

## Test and coverage

Run tests with coverage:

```bash
npm test
```

Coverage reports:
- Terminal summary printed after tests
- HTML report at `back-end/coverage/index.html`

## Architecture

`User` documents store login/account data (email, passwordHash, verified, connections). `Profile` documents store profile content (name, school, internship, interests, etc.). One `User` has at most one `Profile`, joined by `Profile.userId`.

## API Routes

### Static / health

- `GET /` — serves `public/index.html`
- `GET /api/health` — returns `{ status: "ok", service: "internbuddy-backend" }`

### Auth (`/api/auth`)

- `POST /api/auth/register` — body: `{ email, password }`. Creates a User, returns `{ token, user }`.
- `POST /api/auth/login` — body: `{ email, password }`. Returns `{ token, user }`.
- `GET /api/auth/me` — `Authorization: Bearer <token>`. Returns the authenticated User.

### Profile (`/api/profile`) — all require auth

- `GET /api/profile/me` — returns the authenticated user's Profile (404 if not yet created).
- `POST /api/profile` — upserts the authenticated user's Profile from request body fields and marks onboarding complete.

### Events (`/api/events`)

- `GET /api/events` — list public events (`?limit`, `?skip`).
- `GET /api/events/count` — count of public events.
- `GET /api/events/:id` — single event.
- `GET /api/events/me` — auth — returns `{ hosting, attending, private, suggested }` for the authenticated user.
- `POST /api/events` — auth — body: `{ title, description?, location?, date?, time?, privacy? }`.
- `POST /api/events/:id/join` — auth.
- `DELETE /api/events/:id/leave` — auth.

### Swipe (`/api/swipe`) — all require auth

- `GET /api/swipe/profiles` — candidates for the authenticated user.
- `GET /api/swipe/history` — authenticated user's swipe history.
- `GET /api/swipe/stats` — `{ likes, passes, total }`.
- `POST /api/swipe/like` — body: `{ profileId }`.
- `POST /api/swipe/pass` — body: `{ profileId }`.
- `DELETE /api/swipe/:profileId` — undo a previous swipe.

### Messages (`/api/messages`) — all require auth

- `GET /api/messages` — conversations for the authenticated user.
- `GET /api/messages/unread/count` — `{ count }`.
- `POST /api/messages` — body: `{ otherUserId }`. Creates (or returns) a 1:1 conversation.
- `GET /api/messages/:conversationId` — messages in a conversation (must be a participant).
- `POST /api/messages/:conversationId` — body: `{ text }`.

### Connections (`/api/connections`) — all require auth

- `POST /api/connections/request` — body: `{ toUserId }`.
- `GET /api/connections/pending` — incoming pending requests for the authenticated user.
- `GET /api/connections/sent` — outgoing pending requests.
- `GET /api/connections/accepted` — accepted connections.
- `POST /api/connections/:requestId/accept`
- `POST /api/connections/:requestId/reject`
- `DELETE /api/connections/:requestId` — cancel/remove.

### Users (`/api/users`) — all require auth

- `GET /api/users/search?q=&company=&school=&role=&city=&page=&limit=` — search profiles.
- `GET /api/users/:id` — single user with relationship/degree/mutual data relative to the authenticated user.

## Notes

- Data is persisted to MongoDB Atlas via Mongoose. In development, if `MONGO_URI` is set but unreachable, the server can fall back to an in-memory MongoDB when `ALLOW_IN_MEMORY_DB=true`. In production, a working `MONGO_URI` is required.
- Passwords are hashed with bcrypt; auth uses JSON Web Tokens with a 7-day expiry.
- All write endpoints validate input with `express-validator`.
- Do not commit secrets; store sensitive values in `.env`.
