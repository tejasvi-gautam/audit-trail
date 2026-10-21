import test from "node:test";
import assert from "node:assert/strict";
import {
  appendEventController,
  getAggregateEventsController,
} from "../controllers/event.controller.js";

const createResponse = () => ({
  statusCode: null,
  body: null,

  status(code) {
    this.statusCode = code;
    return this;
  },

  json(body) {
    this.body = body;
    return this;
  },
});

test("append event controller returns 400 for invalid event data", async () => {
  const response = createResponse();
  let nextCalled = false;

  await appendEventController(
    {
      body: {
        aggregateId: "",
        eventType: "",
        payload: "invalid-payload",
        version: 0,
      },
    },
    response,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Invalid event data");
  assert.equal(nextCalled, false);
});

test("get events controller returns 400 for empty aggregate ID", async () => {
  const response = createResponse();
  let nextCalled = false;

  await getAggregateEventsController(
    {
      params: {
        aggregateId: "   ",
      },
    },
    response,
    () => {
      nextCalled = true;
    }
  );

  assert.equal(response.statusCode, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Aggregate ID is required");
  assert.equal(nextCalled, false);
});