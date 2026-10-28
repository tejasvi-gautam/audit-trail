import Event from "../models/event.model.js";

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