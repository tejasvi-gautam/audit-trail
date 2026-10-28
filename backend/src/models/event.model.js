import crypto from "node:crypto";
import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    aggregateId: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },

    eventType: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },

    actor: {
      type: String,
      trim: true,
      default: "unknown",
      immutable: true,
    },

    source: {
      type: String,
      trim: true,
      default: "api",
      immutable: true,
    },

    previousHash: {
      type: String,
      default: "GENESIS",
      immutable: true,
    },

    eventHash: {
      type: String,
      immutable: true,
    },

    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },

    timestamp: {
      type: Date,
      default: Date.now,
      immutable: true,
    },

    version: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  {
    collection: "events",
    versionKey: false,
  }
);

eventSchema.index({ aggregateId: 1, version: 1 }, { unique: true });

eventSchema.pre("validate", function () {
  if (this.isNew && !this.eventHash) {
    const content = [
      this.aggregateId,
      this.eventType,
      this.version,
      this.actor,
      this.source,
      this.previousHash,
      this.timestamp?.toISOString(),
      JSON.stringify(this.payload),
    ].join("|");

    this.eventHash = crypto
      .createHash("sha256")
      .update(content)
      .digest("hex");
  }
});

const immutableOperations = [
  "updateOne",
  "updateMany",
  "findOneAndUpdate",
  "replaceOne",
  "findOneAndReplace",
  "deleteOne",
  "deleteMany",
  "findOneAndDelete",
];

immutableOperations.forEach((operation) => {
  eventSchema.pre(operation, function () {
    throw new Error("Events are immutable and cannot be changed or deleted.");
  });
});

const Event = mongoose.model("Event", eventSchema);

export default Event;