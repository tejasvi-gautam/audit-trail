import { z } from "zod";
import { getEventsByAggregateId } from "../repositories/event.repository.js";

export const aggregateIdSchema = z.string().trim().min(1);

export const executeGetAggregateEventsQuery = async (aggregateId) => {
  const validatedAggregateId = aggregateIdSchema.parse(aggregateId);

  return getEventsByAggregateId(validatedAggregateId);
};