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

