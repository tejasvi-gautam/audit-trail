\# Audit Trail Backend



Backend service for the Internship Audit Trail project.



This backend stores supply-chain events as an append-only event log using Node.js, Express, MongoDB Atlas, and Mongoose.



\## Features



\- Express.js backend server

\- MongoDB Atlas connection

\- Immutable event storage

\- Event model with version control

\- Repository layer for storing and reading events

\- Health-check endpoint

\- Environment variable support

\- CORS, Helmet, and JSON middleware



\## Technologies



\- Node.js

\- Express.js

\- MongoDB Atlas

\- Mongoose

\- dotenv

\- Helmet

\- CORS

\- Zod

\- Nodemon



\## Project Structure



```text

backend/

├── src/

│   ├── config/

│   │   └── env.js

│   ├── db/

│   │   └── connect.js

│   ├── models/

│   │   └── event.model.js

│   ├── repositories/

│   │   └── event.repository.js

│   ├── app.js

│   └── server.js

├── .env

├── .env.example

├── package.json

└── README.md

## Current CQRS Implementation

The backend follows a Command Query Responsibility Segregation structure.

### Commands

Commands handle write operations:

```text
backend/src/commands/
└── append-event.command.js
```

### Queries

Queries handle read operations:

```text
backend/src/queries/
└── get-aggregate-events.query.js
```

The aggregate events query validates the aggregate ID and retrieves events in ascending version order.

### CQRS API Flow

```text
POST /api/events
      ↓
Append Event Command
      ↓
Event Repository
      ↓
MongoDB events collection
```

```text
GET /api/events/:aggregateId
      ↓
Get Aggregate Events Query
      ↓
Event Repository
      ↓
MongoDB events collection
```

The command side and query side are kept separate so write and read responsibilities remain independent.

## Testing

Run these commands from the `backend` folder.

### Run all tests

```bash
npm test

## API Reference

### Health Check

GET /health

GET /health/ready

### Append Event

POST /api/events

Example body:

{
  "aggregateId": "container-001",
  "eventType": "CONTAINER_CREATED",
  "actor": "operations-team",
  "source": "api",
  "payload": {
    "containerNumber": "CNT-1001",
    "origin": "Mumbai",
    "destination": "Dubai"
  },
  "version": 1
}

### Read Aggregate Events

GET /api/events/container-001

Optional filters:

GET /api/events/container-001?eventType=LOADED_ON_SHIP&limit=10

Events are returned in ascending version order. The limit can be between 1 and 100.

### Verify Event Integrity

GET /api/events/container-001/integrity

This verifies the event hash chain and reports whether the aggregate history is valid.

### Request IDs

Every response contains an x-request-id header. This ID helps trace a request during debugging and error investigation.

### Error Responses

- Invalid event data: 400
- Duplicate event version: 409
- Invalid JSON: 400
- Unknown route: 404
- Oversized request body: 413
- Database not ready: 503