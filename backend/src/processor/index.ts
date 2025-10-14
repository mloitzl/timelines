import mongoose from "mongoose";
import { EventProcessor } from "./EventProcessor";
import { DeviceStateProjection } from "./projections/DeviceStateProjection";

async function startProcessor() {
  // Connect to MongoDB
  try {
    const mongoUri =
      process.env.MONGODB_URI ||
      "mongodb://localhost:27017/timelines?authSource=admin";
    const mongoUser = process.env.MONGODB_USER;
    const mongoPass = process.env.MONGODB_PASS;
    const mongooseOptions: any = {};
    if (mongoUser && mongoPass) {
      mongooseOptions.user = mongoUser;
      mongooseOptions.pass = mongoPass;
    }
    await mongoose.connect(mongoUri, mongooseOptions);
    console.log("[Processor] Connected to MongoDB at", mongoUri);
  } catch (error) {
    console.error("[Processor] Error connecting to MongoDB:", error);
    process.exit(1);
  }

  // Create projections
  const deviceStateProjection = new DeviceStateProjection();

  // Create and start event processor
  const processor = new EventProcessor([deviceStateProjection]);

  await processor.start();

  // Handle graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\n[Processor] Received SIGINT, shutting down gracefully...");
    await processor.stop();
    await mongoose.disconnect();
    process.exit(0);
  });

  process.on("SIGTERM", async () => {
    console.log("\n[Processor] Received SIGTERM, shutting down gracefully...");
    await processor.stop();
    await mongoose.disconnect();
    process.exit(0);
  });
}

startProcessor();
