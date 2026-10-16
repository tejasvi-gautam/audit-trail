import { ZodError } from "zod";
import { executeAppendEventCommand } from "../commands/append-event.command.js";
import { executeGetAggregateEventsQuery } from "../queries/get-aggregate-events.query.js";

export const appendEventController = async (req, res, next) => {
  try {
    const event = await executeAppendEventCommand(req.body);

    return res.status(201).json({
      success: true,
      data: event,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Invalid event data",
        errors: error.issues.map((issue) => ({
          field: issue.path.join("."),
          message: issue.message,
        })),
      });
    }

    if (error?.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "This event version already exists for the aggregate",
      });
    }

    return next(error);
  }
};

export const getAggregateEventsController = async (req, res, next) => {
  try {
    const events = await executeGetAggregateEventsQuery(
      req.params.aggregateId
    );

    return res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Aggregate ID is required",
      });
    }

    return next(error);
  }
};