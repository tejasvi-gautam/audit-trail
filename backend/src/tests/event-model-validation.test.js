import test from "node:test";
import assert from "node:assert/strict";
import Event from "../models/event.model.js";

test("valid event passes model validation", async () => {
  const event = new Event({
    aggregateId: "container-001",
    eventType: "container_created",
    payload: {
      containerNumber: "CNT-1001",
    },
    version: 1,
  });

  await assert.doesNotReject(() => event.validate());
});

test("aggregate ID is trimmed", () => {
  const event = new Event({
    aggregateId: "  container-001  ",
    eventType: "container_created",
    payload: {},
    version: 1,
  });

  assert.equal(event.aggregateId, "container-001");
});

test("event type is converted to uppercase", () => {
  const event = new Event({
    aggregateId: "container-001",
    eventType: "container_created",
    payload: {},
    version: 1,
  });

  assert.equal(event.eventType, "CONTAINER_CREATED");
});

test("version below 1 is rejected", async () => {
  const event = new Event({
    aggregateId: "container-001",
    eventType: "container_created",
    payload: {},
    version: 0,
  });

  await assert.rejects(
    () => event.validate(),
    (error) => Boolean(error?.errors?.version)
  );
});

test("timestamp is immutable", () => {
  const timestampPath = Event.schema.path("timestamp");

  assert.equal(timestampPath.options.immutable, true);
});

test("audit metadata defaults are applied", () => {
  const event = new Event({
    aggregateId: "metadata-test",
    eventType: "CONTAINER_CREATED",
    payload: {
      containerNumber: "CNT-2001",
    },
    version: 1,
  });

  assert.equal(event.actor, "unknown");
  assert.equal(event.source, "api");
});

test("audit metadata is trimmed", () => {
  const event = new Event({
    aggregateId: "metadata-test",
    eventType: "CONTAINER_CREATED",
    actor: "  umika  ",
    source: "  logistics-service  ",
    payload: {
      containerNumber: "CNT-2002",
    },
    version: 1,
  });

  assert.equal(event.actor, "umika");
  assert.equal(event.source, "logistics-service");
});