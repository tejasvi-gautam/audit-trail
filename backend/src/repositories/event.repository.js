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

export const getEventsByAggregateId = async (
  aggregateId,
  eventType
) => {
  const filter = { aggregateId };

  if (eventType) {
    filter.eventType = eventType;
  }

  return Event.find(filter)
    .sort({ version: 1 })
    .lean();
};