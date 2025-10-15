import mongoose from "mongoose";
import { ChangeStreamInsertDocument } from "mongodb";
import { IProjection, ProcessedEvent } from "./types";
import { Event } from "./models/Event";

export class EventProcessor {
  private projections: IProjection[] = [];
  private changeStream: any = null;
  private isRunning = false;

  constructor(projections: IProjection[]) {
    this.projections = projections;
  }

  registerProjection(projection: IProjection): void {
    this.projections.push(projection);
    console.log(`[EventProcessor] Registered projection: ${projection.name}`);
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.warn("[EventProcessor] Already running");
      return;
    }

    console.log("[EventProcessor] Starting event processor...");
    console.log(
      `[EventProcessor] Registered projections: ${this.projections
        .map((p) => p.name)
        .join(", ")}`
    );

    // Watch for inserts on the events collection
    this.changeStream = Event.watch([{ $match: { operationType: "insert" } }], {
      fullDocument: "updateLookup",
    });

    this.isRunning = true;

    this.changeStream.on(
      "change",
      async (change: ChangeStreamInsertDocument) => {
        if (change.operationType === "insert") {
          const event = change.fullDocument as any;

          const processedEvent: ProcessedEvent = {
            _id: event._id.toString(),
            eventType: event.eventType,
            timestamp: event.timestamp,
            payload: event.payload,
          };

          await this.processEvent(processedEvent);
        }
      }
    );

    this.changeStream.on("error", (error: Error) => {
      console.error("[EventProcessor] Change stream error:", error);
      this.isRunning = false;
      // Could implement auto-reconnect logic here
    });

    this.changeStream.on("close", () => {
      console.log("[EventProcessor] Change stream closed");
      this.isRunning = false;
    });

    console.log("[EventProcessor] Now watching for events...");
  }

  private async processEvent(event: ProcessedEvent): Promise<void> {
    console.log(
      `[EventProcessor] Processing event: ${event.eventType} (${event._id})`
    );

    // Find all projections interested in this event type
    const interestedProjections = this.projections.filter(
      (projection) =>
        projection.eventTypes.includes(event.eventType) ||
        projection.eventTypes.includes("*") // Allow wildcard
    );

    if (interestedProjections.length === 0) {
      console.log(
        `[EventProcessor] No projections registered for event type: ${event.eventType}`
      );
      return;
    }

    // Process event with all interested projections in parallel
    const promises = interestedProjections.map(async (projection) => {
      try {
        await projection.process(event);
      } catch (error) {
        console.error(
          `[EventProcessor] Error in projection ${projection.name}:`,
          error
        );
        if (projection.onError) {
          await projection.onError(error as Error, event);
        }
      }
    });

    await Promise.all(promises);
  }

  async stop(): Promise<void> {
    if (this.changeStream) {
      await this.changeStream.close();
      this.changeStream = null;
    }
    this.isRunning = false;
    console.log("[EventProcessor] Stopped");
  }

  getStatus(): { isRunning: boolean; projectionCount: number } {
    return {
      isRunning: this.isRunning,
      projectionCount: this.projections.length,
    };
  }
}
