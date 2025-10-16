import { IProjection, ProcessedEvent } from "../types";
import { DehumidifierRun } from "../models/DehumidifierRun";

export class DehumidifierRunSaga implements IProjection {
  name = "DehumidifierRunSaga";
  eventTypes = ["DEHUMIDIFIER"];

  async process(event: ProcessedEvent): Promise<void> {
    const { payload } = event;

    const entityId = payload.entity_id;
    const toState = payload.to_state;
    const fromState = payload.from_state;
    const energyReading = payload.energy_reading;
    const energyUnit = payload.energy_unit || "kWh";

    if (!entityId || !toState) {
      console.warn(
        `[${this.name}] Event ${event._id} missing required fields (entity_id or to_state)`
      );
      return;
    }

    // Only process state changes for the dehumidifier entity
    if (entityId !== "switch.shellyplus1pm_fce8c0fdc4e0_switch_0") {
      return;
    }

    if (toState === "on" && fromState === "off") {
      await this.startSaga(event, payload, energyReading, energyUnit);
    } else if (toState === "off" && fromState === "on") {
      await this.endSaga(event, payload, energyReading, energyUnit);
    }
  }

  private async startSaga(
    event: ProcessedEvent,
    payload: any,
    energyReading: number,
    energyUnit: string
  ): Promise<void> {
    // Check if there's already a running saga for this entity
    const existingRun = await DehumidifierRun.findOne({
      entityId: payload.entity_id,
      status: "running",
    });

    if (existingRun) {
      console.warn(
        `[${this.name}] Found existing running saga for ${payload.entity_id}, marking as error`
      );
      // Mark existing run as error
      await DehumidifierRun.findByIdAndUpdate(existingRun._id, {
        status: "error",
        endTime: event.timestamp,
        endEventId: event._id,
        errorMessage: "New run started while previous run was still active",
      });
    }

    // Determine if started by automation or manual
    const startedBy = this.determineStartMethod(payload);

    // Extract humidity threshold if available
    const humidityThreshold = this.extractHumidityThreshold(payload);

    // Create new saga
    const newRun = new DehumidifierRun({
      entityId: payload.entity_id,
      status: "running",
      startTime: event.timestamp,
      startEnergyReading: energyReading,
      energyUnit: energyUnit,
      startedBy: startedBy,
      humidityThreshold: humidityThreshold,
      startEventId: event._id,
    });

    await newRun.save();

    console.log(
      `[${this.name}] Started new dehumidifier run: ${payload.entity_id} (${startedBy})`
    );
  }

  private async endSaga(
    event: ProcessedEvent,
    payload: any,
    energyReading: number,
    energyUnit: string
  ): Promise<void> {
    // Find the running saga for this entity
    const runningSaga = await DehumidifierRun.findOne({
      entityId: payload.entity_id,
      status: "running",
    });

    if (!runningSaga) {
      console.warn(
        `[${this.name}] No running saga found for ${payload.entity_id} when trying to end`
      );
      return;
    }

    // Calculate duration
    const startTime = new Date(runningSaga.startTime);
    const endTime = new Date(event.timestamp);
    const duration = endTime.getTime() - startTime.getTime();

    // Calculate energy consumed
    const energyConsumed = energyReading - runningSaga.startEnergyReading;

    // Update the saga
    await DehumidifierRun.findByIdAndUpdate(runningSaga._id, {
      status: "finished",
      endTime: event.timestamp,
      duration: duration,
      endEnergyReading: energyReading,
      energyConsumed: energyConsumed,
      endEventId: event._id,
    });

    console.log(
      `[${this.name}] Finished dehumidifier run: ${
        payload.entity_id
      }, duration: ${Math.round(
        duration / 1000
      )}s, energy: ${energyConsumed.toFixed(6)} ${energyUnit}`
    );
  }

  private determineStartMethod(payload: any): "automation" | "manual" {
    // Check if this was triggered by automation
    // We can determine this by looking at the context or by checking
    // if there was a recent DEHUMIDIFIER_AUTOMATION event

    // For now, we'll use a simple heuristic:
    // If the friendly_name suggests it's automated, or if we have automation context
    const friendlyName = payload.to_attributes?.friendly_name || "";

    // You can enhance this logic based on your specific needs
    // For example, check if there was a recent automation event
    return "manual"; // Default to manual, can be enhanced later
  }

  private extractHumidityThreshold(payload: any): number | undefined {
    // Extract humidity threshold from the payload if available
    // This would come from the automation context
    // For now, return undefined - you can enhance this when you add the threshold to Home Assistant
    return undefined;
  }

  async onError(error: Error, event: ProcessedEvent): Promise<void> {
    console.error(`[${this.name}] Error processing event ${event._id}:`, error);

    // If there's a running saga, mark it as error
    const runningSaga = await DehumidifierRun.findOne({
      entityId: event.payload.entity_id,
      status: "running",
    });

    if (runningSaga) {
      await DehumidifierRun.findByIdAndUpdate(runningSaga._id, {
        status: "error",
        endTime: event.timestamp,
        endEventId: event._id,
        errorMessage: error.message,
      });
    }
  }
}
