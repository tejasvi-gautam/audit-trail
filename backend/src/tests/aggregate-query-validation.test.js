import test from "node:test";
import assert from "node:assert/strict";
import {
  aggregateIdSchema,
  eventLimitSchema,
  eventTypeSchema,
} from "../queries/get-aggregate-events.query.js";

test("aggregate ID whitespace is trimmed", () => {
  const result = aggregateIdSchema.parse("  container-001  ");

  assert.equal(result, "container-001");
});

test("empty aggregate ID is rejected", () => {
  assert.throws(() => aggregateIdSchema.parse(" "));
});

test("non-string aggregate ID is rejected", () => {
  assert.throws(() => aggregateIdSchema.parse(123));
});

test("event limit defaults to 50", () => {
  assert.equal(eventLimitSchema.parse(undefined), 50);
});

test("event limit accepts valid numbers", () => {
  assert.equal(eventLimitSchema.parse("10"), 10);
});

test("event limit rejects values above 100", () => {
  assert.throws(() => eventLimitSchema.parse("101"));
});

test("event limit rejects zero", () => {
  assert.throws(() => eventLimitSchema.parse("0"));
});

test("event type is trimmed and converted to uppercase", () => {
  assert.equal(
    eventTypeSchema.parse(" loaded_on_ship "),
    "LOADED_ON_SHIP"
  );
});

test("empty event type is rejected", () => {
  assert.throws(() => eventTypeSchema.parse(" "));
});