import { z } from "zod";
import { getEventsByAggregateId } from "../repositories/event.repository.js";

export const aggregateIdSchema = z
  .string()
  .trim()
  .min(1);

export const eventTypeSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => value.toUpperCase());

export const executeGetAggregateEventsQuery = async (
  aggregateId,
  eventType
) => {
  const validatedAggregateId =
    aggregateIdSchema.parse(aggregateId);

  const validatedEventType =
    eventType === undefined
      ? undefined
      : eventTypeSchema.parse(eventType);

  return getEventsByAggregateId(
    validatedAggregateId,
    validatedEventType
  );
};