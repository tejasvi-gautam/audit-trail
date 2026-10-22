import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import Event from "../models/event.model.js";
import { env } from "../config/env.js";

const aggregateId = `api-conflict-${Date.now()}`;

before(async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(env.mongoUri);
  await Event.init();
});

after(async () => {
  await mongoose.disconnect();
});

test("duplicate event version returns 409 conflict", async () => {
  const eventData = {
    aggregateId,
    eventType: "CONTAINER_CREATED",
    payload: {
      containerNumber: "CNT-CONFLICT-001",
    },
    version: 1,
  };

  const firstResponse = await request(app)
    .post("/api/events")
    .send(eventData);

  assert.equal(firstResponse.status, 201);

  const duplicateResponse = await request(app)
    .post("/api/events")
    .send(eventData);

  assert.equal(duplicateResponse.status, 409);
  assert.equal(
    duplicateResponse.body.message,
    "This event version already exists for the aggregate"
  );
});