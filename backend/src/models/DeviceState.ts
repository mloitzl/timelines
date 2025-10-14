import mongoose from "mongoose";

const deviceStateSchema = new mongoose.Schema(
  {
    entityId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    currentState: {
      type: String,
      required: true,
    },
    friendlyName: {
      type: String,
      required: false,
    },
    lastChanged: {
      type: String,
      required: true,
    },
    lastEventId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    attributes: {
      type: mongoose.Schema.Types.Mixed,
      required: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

export const DeviceState = mongoose.model("DeviceState", deviceStateSchema);
