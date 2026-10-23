import Event from "../models/event.model.js";

export const appendEvent = async ({
  aggregateId,
  eventType,
  actor,
  source,
  payload,
  version,
}) => {
  return Event.create({
    aggregateId,
    eventType,
    actor,
    source,
    payload,
    version,
  });
};

export const getEventsByAggregateId = async (aggregateId) => {
  return Event.find({ aggregateId })
    .sort({ version: 1 })
    .lean();
};