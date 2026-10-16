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