import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventType: {
    type: String,
    required: true,
  },
  timestamp: {
    type: String,
    required: true,
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: false,
  },
});

export const Event = mongoose.model("Event", eventSchema);
