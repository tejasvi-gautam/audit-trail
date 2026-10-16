import Event from "../models/event.model.js";

export const appendEvent = async ({
  aggregateId,
  eventType,
  payload,
  version,
}) => {
  return Event.create({
    aggregateId,
    eventType,
    payload,
    version,
  });
};

export const getEventsByAggregateId = async (aggregateId) => {
  return Event.find({ aggregateId })
    .sort({ version: 1 })
    .lean();
};