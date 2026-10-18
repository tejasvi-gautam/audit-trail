import test from "node:test";
import assert from "node:assert/strict";
import { appendEventCommandSchema } from "../commands/append-event.command.js";

test("event type is converted to uppercase", () => {
  const result = appendEventCommandSchema.parse({
    aggregateId: "container-001",
    eventType: "container_created",
    payload: {
      containerNumber: "CNT-1001",
    },
    version: 1,
  });

  assert.equal(result.eventType, "CONTAINER_CREATED");
});

test("empty aggregate ID is rejected", () => {
  assert.throws(() =>
    appendEventCommandSchema.parse({
      aggregateId: "",
      eventType: "CONTAINER_CREATED",
      payload: {},
      version: 1,
    })
  );
});

test("zero version is rejected", () => {
  assert.throws(() =>
    appendEventCommandSchema.parse({
      aggregateId: "container-001",
      eventType: "CONTAINER_CREATED",
      payload: {},
      version: 0,
    })
  );
});

test("payload must be an object", () => {
  assert.throws(() =>
    appendEventCommandSchema.parse({
      aggregateId: "container-001",
      eventType: "CONTAINER_CREATED",
      payload: "invalid-payload",
      version: 1,
    })
  );
});