import test, { after, before } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import Event from "../models/event.model.js";
import { env } from "../config/env.js";

const aggregateId = `immutability-test-${Date.now()}`;
let createdEvent;

before(async () => {
  if (!env.mongoUri) {
    throw new Error("MONGODB_URI is missing");
  }

  await mongoose.connect(env.mongoUri);
  await Event.init();

  createdEvent = await Event.create({
    aggregateId,
    eventType: "CONTAINER_CREATED",
    payload: {
      containerNumber: "IMMUTABILITY-TEST",
    },
    version: 1,
  });
});

after(async () => {
  await mongoose.disconnect();
});

test("events cannot be updated", async () => {
  await assert.rejects(
    () =>
      Event.updateOne(
        { _id: createdEvent._id },
        { $set: { eventType: "UPDATED_EVENT" } }
      ),
    /immutable/i
  );
});

test("events cannot be deleted", async () => {
  await assert.rejects(
    () => Event.deleteOne({ _id: createdEvent._id }),
    /immutable/i
  );
});

test("duplicate aggregate versions are rejected", async () => {
  await assert.rejects(
    () =>
      Event.create({
        aggregateId,
        eventType: "DUPLICATE_VERSION",
        payload: {
          test: true,
        },
        version: 1,
      }),
    /duplicate|E11000/i
  );
});