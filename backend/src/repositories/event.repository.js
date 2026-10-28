import crypto from "node:crypto";
import Event from "../models/event.model.js";

const calculateEventHash = (event) => {
  const content = [
    event.aggregateId,
    event.eventType,
    event.version,
    event.actor,
    event.source,
    event.previousHash,
    event.timestamp?.toISOString(),
    JSON.stringify(event.payload),
  ].join("|");

  return crypto.createHash("sha256").update(content).digest("hex");
};

export const appendEvent = async ({
  aggregateId,
  eventType,
  actor,
  source,
  payload,
  version,
}) => {
  const previousEvent = await Event.findOne({
    aggregateId,
    version: { $lt: version },
  })
    .sort({ version: -1 })
    .select("eventHash")
    .lean();

  return Event.create({
    aggregateId,
    eventType,
    actor,
    source,
    payload,
    version,
    previousHash: previousEvent?.eventHash ?? "GENESIS",
  });
};

export const getEventsByAggregateId = async (aggregateId, eventType) => {
  const filter = { aggregateId };

  if (eventType) {
    filter.eventType = eventType;
  }

  return Event.find(filter)
    .sort({ version: 1 })
    .lean();
};

export const verifyAggregateIntegrity = async (aggregateId) => {
  const events = await Event.find({ aggregateId })
    .sort({ version: 1 })
    .lean();

  let previousHash = "GENESIS";

  for (const event of events) {
    const expectedHash = calculateEventHash(event);

    if (
      event.previousHash !== previousHash ||
      event.eventHash !== expectedHash
    ) {
      return {
        valid: false,
        checkedEvents: events.indexOf(event) + 1,
        failedVersion: event.version,
      };
    }

    previousHash = event.eventHash;
  }

  return {
    valid: true,
    checkedEvents: events.length,
  };
};