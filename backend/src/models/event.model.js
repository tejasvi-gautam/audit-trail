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

eventSchema.index(
  { aggregateId: 1, version: 1 },
  { unique: true }
);

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
  eventSchema.pre(operation, function (next) {
    next(new Error("Events are immutable and cannot be changed or deleted."));
  });
});

const Event = mongoose.model("Event", eventSchema);

export default Event;