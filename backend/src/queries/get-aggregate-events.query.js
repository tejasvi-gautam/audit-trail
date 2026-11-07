import { z } from "zod";
import {
  getEventsByAggregateId,
  verifyAggregateIntegrity,
} from "../repositories/event.repository.js";

export const aggregateIdSchema = z
  .string()
  .trim()
  .min(1);

export const eventTypeSchema = z
  .string()
  .trim()
  .min(1)
  .transform((value) => value.toUpperCase());

export const eventLimitSchema = z.coerce
  .number()
  .int()
  .min(1)
  .max(100)
  .default(50);

export const executeGetAggregateEventsQuery = async (
  aggregateId,
  eventType,
  limit
) => {
  const validatedAggregateId =
    aggregateIdSchema.parse(aggregateId);

  const validatedEventType =
    eventType === undefined
      ? undefined
      : eventTypeSchema.parse(eventType);

  const validatedLimit = eventLimitSchema.parse(limit);

  return getEventsByAggregateId(
    validatedAggregateId,
    validatedEventType,
    validatedLimit
  );
};

export const executeVerifyAggregateIntegrityQuery = async (
  aggregateId
) => {
  const validatedAggregateId =
    aggregateIdSchema.parse(aggregateId);

  return verifyAggregateIntegrity(validatedAggregateId);
};