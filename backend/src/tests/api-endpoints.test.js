import test from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import app from "../app.js";

test("health endpoint returns backend status", async () => {
  const response = await request(app).get("/health");

  assert.equal(response.status, 200);
  assert.equal(response.body.success, true);
  assert.equal(response.body.service, "audit-trail-backend");
});

test("POST events returns 400 for invalid data", async () => {
  const response = await request(app)
    .post("/api/events")
    .send({
      aggregateId: "",
      eventType: "",
      payload: "invalid-payload",
      version: 0,
    });

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Invalid event data");
});

test("GET events returns 400 for empty aggregate ID", async () => {
  const response = await request(app).get("/api/events/%20%20");

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Aggregate ID is required");
});

test("invalid JSON payload returns 400", async () => {
  const response = await request(app)
    .post("/api/events")
    .set("Content-Type", "application/json")
    .send('{"aggregateId":');

  assert.equal(response.status, 400);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Invalid JSON payload");
});

test("unknown route returns 404 JSON response", async () => {
  const response = await request(app).get("/unknown-route");

  assert.equal(response.status, 404);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Route not found");
});

test("oversized request payload returns 413", async () => {
  const largeValue = "x".repeat(1_100_000);

  const response = await request(app)
    .post("/api/events")
    .set("Content-Type", "application/json")
    .send(
      JSON.stringify({
        aggregateId: "large-payload-test",
        eventType: "CONTAINER_CREATED",
        payload: {
          data: largeValue,
        },
        version: 1,
      })
    );

  assert.equal(response.status, 413);
  assert.equal(response.body.success, false);
  assert.equal(response.body.message, "Request payload is too large");
});