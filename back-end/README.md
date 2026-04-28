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
    data/
      profileStepOrder.js
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
      seedUsers.js
    services/
      mockStore.js
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
3. Create a `.env` file (see `.env.example` if available) — do **not** commit this file.
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

## API Routes

### Static route

- `GET /` — serves `public/index.html`

### Health

- `GET /api/health` — returns `{ status: "ok" }`

### Auth routes (`/api/auth`)

- `POST /api/auth/register` — body: `{ "email": "...", "phone": "...", "password": "..." }` (MongoDB + JWT)
- `POST /api/auth/login` — body: `{ "email": "...", "password": "..." }` (returns JWT)
- `GET /api/auth/me` — requires `Authorization: Bearer <token>`
- `POST /api/auth/signup` — body: `{ "email": "...", "phone": "..." }`
- `POST /api/auth/verify` — body: `{ "userId": "...", "code": "123456" }`
- `GET /api/auth/:userId` — get account by userId

### Profile routes (`/api/profile`)

- `GET /api/profile/:userId` — get profile
- `POST /api/profile/:userId/step` — body: `{ "step": "name", "value": { ... } }`
- `POST /api/profile/:userId/complete` — mark profile complete

### Events routes (`/api/events`)

- `GET /api/events` — list all events
- `GET /api/events/me` — get current user's events (hosting, attending, private, suggested)
- `GET /api/events/:id` — get single event by id
- `POST /api/events` — body: `{ "title": "...", "description": "...", "location": "...", "date": "...", "time": "...", "privacy": "public" }`

### Swipe routes (`/api/swipe`)

- `GET /api/swipe/profiles` — list swipeable profiles
- `POST /api/swipe/like` — body: `{ "profileId": 1 }`
- `POST /api/swipe/pass` — body: `{ "profileId": 1 }`
- `GET /api/swipe/requests` — get sent and received friend requests

### Messages routes (`/api/messages`)

- `GET /api/messages` — list all conversations
- `GET /api/messages/:conversationId` — get conversation with messages
- `POST /api/messages/:conversationId` — body: `{ "text": "..." }`

## Notes

- Current implementation uses in-memory mock data — data resets on server restart.
- Do not commit secrets; store sensitive values in `.env` files.
