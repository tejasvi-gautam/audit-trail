import { z } from "zod";
import { appendEvent } from "../repositories/event.repository.js";

export const appendEventCommandSchema = z.object({
  aggregateId: z.string().trim().min(1),
  eventType: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.toUpperCase()),
  payload: z.record(z.unknown()),
  version: z.number().int().positive(),
});

export const executeAppendEventCommand = async (input) => {
  const validatedCommand = appendEventCommandSchema.parse(input);

  return appendEvent(validatedCommand);
};