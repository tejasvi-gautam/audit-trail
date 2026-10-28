import { Router } from "express";
import {
  appendEventController,
  getAggregateEventsController,
  verifyAggregateIntegrityController,
} from "../controllers/event.controller.js";

const router = Router();

router.post("/", appendEventController);

router.get(
  "/:aggregateId/integrity",
  verifyAggregateIntegrityController
);

router.get("/:aggregateId", getAggregateEventsController);

export default router;