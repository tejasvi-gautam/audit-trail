import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import Event from "../models/event.model.js";
import { env } from "../config/env.js";

const aggregateId = `api-flow-${Date.now()}`;

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

test("API appends and retrieves aggregate events in order", async () => {
  const firstEvent = await request(app)
    .post("/api/events")
    .send({
      aggregateId,
      eventType: "container_created",
      payload: {
        containerNumber: "CNT-API-001",
      },
      version: 1,
    });

  assert.equal(firstEvent.status, 201);

  const secondEvent = await request(app)
    .post("/api/events")
    .send({
      aggregateId,
      eventType: "loaded_on_ship",
      payload: {
        shipName: "MV-Atlas",
      },
      version: 2,
    });

  assert.equal(secondEvent.status, 201);

  const response = await request(app).get(`/api/events/${aggregateId}`);

  assert.equal(response.status, 200);
  assert.deepEqual(
    response.body.data.map((event) => event.version),
    [1, 2]
  );
  assert.equal(response.body.data[0].eventType, "CONTAINER_CREATED");
  assert.equal(response.body.data[1].eventType, "LOADED_ON_SHIP");
});

test("API stores actor and source metadata", async () => {
  const response = await request(app)
    .post("/api/events")
    .send({
      aggregateId: `metadata-api-${Date.now()}`,
      eventType: "CONTAINER_CREATED",
      actor: "umika",
      source: "integration-test",
      payload: {
        containerNumber: "CNT-METADATA-001",
      },
      version: 1,
    });

  assert.equal(response.status, 201);
  assert.equal(response.body.success, true);
  assert.equal(response.body.data.actor, "umika");
  assert.equal(response.body.data.source, "integration-test");
});