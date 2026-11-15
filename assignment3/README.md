# Assignment 3 - Event Registration API

Express + TypeScript API with Joi request validation and Firebase Firestore storage.

**Student:** Samson Fakiye (0391204)

## Setup

```bash
cd assignment3
npm install
```

### Firebase

1. Create a Firebase project and enable Firestore.
2. Project Settings > Service accounts > Generate new private key.
3. Rename the file to `serviceAccountKey.json` and place it in `assignment3/` (next to `package.json`). It is in `.gitignore` and is never committed.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start the API on http://localhost:3000 |
| `npm run dev` | Start with auto-restart on file changes |
| `npm test` | Run Jest tests (Firestore is mocked, no key needed) |
| `npm run lint` | Run ESLint |

## Endpoints

| Method | URL | Success | Errors |
| --- | --- | --- | --- |
| GET | `/api/v1/health` | 200 | |
| GET | `/api/v1/events` | 200 | |
| GET | `/api/v1/events/:id` | 200 | 400, 404 |
| POST | `/api/v1/events` | 201 | 400 |
| PUT | `/api/v1/events/:id` | 200 | 400, 404 |
| DELETE | `/api/v1/events/:id` | 200 | 400, 404 |

## Create validation rules

| Field | Rule | Default |
| --- | --- | --- |
| `name` | string, required, at least 3 characters | |
| `date` | ISO 8601 date, required | |
| `capacity` | integer, required, at least 5 | |
| `registrationCount` | integer, at least 0, cannot exceed `capacity` | `0` |
| `status` | `active`, `cancelled` or `completed` | `active` |
| `category` | `conference`, `workshop`, `meetup`, `seminar` or `general` | `general` |

Validation errors return 400:

```json
{ "message": "Validation error: \"capacity\" must be greater than or equal to 5" }
```

## Project structure
assignment3/
config/firebaseConfig.ts
src/
app.ts, server.ts
constants/httpConstants.ts
api/v1/
routes/ eventRoutes, healthRoutes
controllers/ eventController, healthController
services/ eventService
repositories/ firestoreRepository
models/ eventModel, responseModel
validation/ eventSchemas
middleware/ validate, errorHandler
errors/ appError
types/
test/
jest.setup.ts
eventValidation.test.ts
validateMiddleware.test.ts
eventService.test.ts
testing-evidence/

