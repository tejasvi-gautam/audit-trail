import assert from "node:assert/strict";
import test from "node:test";
import Event from "../models/event.model.js";

test("event hash is generated", async () => {
  const event = new Event({
    aggregateId: "hash-test-001",
    eventType: "CREATED",
    payload: { status: "created" },
    version: 1,
  });

  await event.validate();

  assert.match(event.eventHash, /^[a-f0-9]{64}$/);
  assert.equal(event.previousHash, "GENESIS");
});

test("next event links to previous hash", async () => {
  const firstEvent = new Event({
    aggregateId: "hash-test-002",
    eventType: "CREATED",
    payload: { status: "created" },
    version: 1,
  });

  await firstEvent.validate();

  const secondEvent = new Event({
    aggregateId: "hash-test-002",
    eventType: "UPDATED",
    payload: { status: "updated" },
    version: 2,
    previousHash: firstEvent.eventHash,
  });

  await secondEvent.validate();

  assert.equal(secondEvent.previousHash, firstEvent.eventHash);
  assert.notEqual(secondEvent.eventHash, firstEvent.eventHash);
});