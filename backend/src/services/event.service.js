import { z } from "zod";
import {
  appendEvent,
  getEventsByAggregateId,
} from "../repositories/event.repository.js";

const appendEventInputSchema = z.object({
  aggregateId: z.string().trim().min(1),
  eventType: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.toUpperCase()),
  payload: z.record(z.unknown()),
  version: z.number().int().positive(),
});

export const createEvent = async (input) => {
  const validatedInput = appendEventInputSchema.parse(input);

  return appendEvent(validatedInput);
};

export const listAggregateEvents = async (aggregateId) => {
  const validatedAggregateId = z
    .string()
    .trim()
    .min(1)
    .parse(aggregateId);

  return getEventsByAggregateId(validatedAggregateId);
};