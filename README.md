# AuditTrail

AuditTrail is a supply-chain logistics monitoring project.

It tracks containers, shipment events, delays, temperature alerts, locations, and event integrity.

## Project Parts

- Backend: Node.js, Express, MongoDB, Mongoose and Zod
- Frontend: React and Vite

## Run Backend

Open terminal in the backend folder and run:

npm install
npm run dev

Backend runs on http://localhost:5000

## Run Frontend

Open another terminal in the frontend folder and run:

npm install
npm run dev

Frontend runs on http://localhost:5173

## Main Features

- Logistics command center
- Shipment tracking
- Event timeline
- Incident investigation
- Replay studio
- Sensor analytics
- Integrity audit
- Immutable event storage
- Hash-chain verification

## API Endpoints

GET /health

GET /health/ready

POST /api/events

GET /api/events/:aggregateId

GET /api/events/:aggregateId/integrity