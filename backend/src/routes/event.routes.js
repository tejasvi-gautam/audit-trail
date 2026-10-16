import { Router } from "express";
import {
  appendEventController,
  getAggregateEventsController,
} from "../controllers/event.controller.js";

const router = Router();

router.post("/", appendEventController);

router.get("/:aggregateId", getAggregateEventsController);

export default router;