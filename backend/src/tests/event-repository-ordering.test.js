import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import Event from "../models/event.model.js";
import { env } from "../config/env.js";
import {
  appendEvent,
  getEventsByAggregateId,
} from "../repositories/event.repository.js";

const aggregateId = `ordering-test-${Date.now()}`;

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

test("events are returned in ascending version order", async () => {
  await appendEvent({
    aggregateId,
    eventType: "LOADED_ON_SHIP",
    payload: {
      shipName: "MV-Atlas",
    },
    version: 2,
  });

  await appendEvent({
    aggregateId,
    eventType: "CONTAINER_CREATED",
    payload: {
      containerNumber: "CNT-ORDER-001",
    },
    version: 1,
  });

  const events = await getEventsByAggregateId(aggregateId);

  assert.deepEqual(
    events.map((event) => event.version),
    [1, 2]
  );
});