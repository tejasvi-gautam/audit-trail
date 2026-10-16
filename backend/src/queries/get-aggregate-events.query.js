import { z } from "zod";
import { getEventsByAggregateId } from "../repositories/event.repository.js";

export const executeGetAggregateEventsQuery = async (aggregateId) => {
  const validatedAggregateId = z
    .string()
    .trim()
    .min(1)
    .parse(aggregateId);

  return getEventsByAggregateId(validatedAggregateId);
};