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