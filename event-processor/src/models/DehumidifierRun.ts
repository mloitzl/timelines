import mongoose from "mongoose";

const dehumidifierRunSchema = new mongoose.Schema(
  {
    entityId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["running", "finished", "error"],
      required: true,
    },
    startTime: {
      type: String,
      required: true,
    },
    endTime: {
      type: String,
      required: false,
    },
    duration: {
      type: Number, // Duration in milliseconds
      required: false,
    },
    startEnergyReading: {
      type: Number,
      required: true,
    },
    endEnergyReading: {
      type: Number,
      required: false,
    },
    energyConsumed: {
      type: Number, // Energy consumed in kWh
      required: false,
    },
    energyUnit: {
      type: String,
      required: true,
      default: "kWh",
    },
    startedBy: {
      type: String,
      enum: ["automation", "manual"],
      required: true,
    },
    humidityThreshold: {
      type: Number,
      required: false,
    },
    startHumidityReading: {
      type: Number,
      required: false,
    },
    endHumidityReading: {
      type: Number,
      required: false,
    },
    humidityUnit: {
      type: String,
      required: false,
      default: "%",
    },
    startTemperatureReading: {
      type: Number,
      required: false,
    },
    endTemperatureReading: {
      type: Number,
      required: false,
    },
    temperatureUnit: {
      type: String,
      required: false,
      default: "°C",
    },
    startEventId: {
      type: String,
      required: true,
    },
    endEventId: {
      type: String,
      required: false,
    },
    errorMessage: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

// Index for efficient queries
dehumidifierRunSchema.index({ entityId: 1, startTime: -1 });
dehumidifierRunSchema.index({ status: 1 });

export const DehumidifierRun = mongoose.model(
  "DehumidifierRun",
  dehumidifierRunSchema
);
