import test from "node:test";
import assert from "node:assert/strict";
import { aggregateIdSchema } from "../queries/get-aggregate-events.query.js";

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
