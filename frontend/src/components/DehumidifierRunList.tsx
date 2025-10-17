import { graphql } from "react-relay";
import { useLazyLoadQuery, useSubscription } from "react-relay";
import type { DehumidifierRunListQuery } from "../__generated__/DehumidifierRunListQuery.graphql";
import type { GraphQLSubscriptionConfig } from "relay-runtime";
import { useEffect, useState } from "react";

export const DehumidifierRunListQueryTag = graphql`
  query DehumidifierRunListQuery {
    dehumidifierRuns {
      id
      entityId
      status
      startTime
      endTime
      duration
      startEnergyReading
      endEnergyReading
      energyConsumed
      energyUnit
      startHumidityReading
      endHumidityReading
      humidityUnit
      startTemperatureReading
      endTemperatureReading
      temperatureUnit
      startedBy
      humidityThreshold
      startEventId
      endEventId
      errorMessage
      createdAt
      updatedAt
    }
  }
`;

const DehumidifierRunChangedSubscription = graphql`
  subscription DehumidifierRunListSubscription {
    dehumidifierRunChanged {
      id
      entityId
      status
      startTime
      endTime
      duration
      startEnergyReading
      endEnergyReading
      energyConsumed
      energyUnit
      startHumidityReading
      endHumidityReading
      humidityUnit
      startTemperatureReading
      endTemperatureReading
      temperatureUnit
      startedBy
      humidityThreshold
      startEventId
      endEventId
      errorMessage
      createdAt
      updatedAt
    }
  }
`;

function formatDuration(milliseconds: number | null | undefined): string {
  if (!milliseconds) return "Running...";

  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    return `${hours}h ${minutes % 60}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds % 60}s`;
  } else {
    return `${seconds}s`;
  }
}

function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now.getTime() - time.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
  } else {
    return `${diffSeconds} second${diffSeconds > 1 ? "s" : ""} ago`;
  }
}

function getStartedByIcon(startedBy: string): string {
  return startedBy === "automation" ? "🤖" : "👤";
}

export function DehumidifierRunList() {
  const [, setCurrentTime] = useState(new Date());

  // Update current time every 10 seconds for running durations
  useEffect(() => {
    const interval = setInterval(() => {
      // Force re-render to update running durations
      setCurrentTime(new Date());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const data = useLazyLoadQuery<DehumidifierRunListQuery>(
    DehumidifierRunListQueryTag,
    {}
  );

  // Subscribe to dehumidifier run changes
  const subscriptionConfig: GraphQLSubscriptionConfig<any> = {
    subscription: DehumidifierRunChangedSubscription,
    variables: {},
    onNext: (response) => {
      console.log(
        "[DehumidifierRunList] Received subscription update:",
        response
      );
    },
    onError: (error) => {
      console.error("[DehumidifierRunList] Subscription error:", error);
    },
    updater: (store) => {
      console.log("[DehumidifierRunList] Subscription updater called");
      const changedRun = store.getRootField("dehumidifierRunChanged");
      if (changedRun) {
        const runId = changedRun.getValue("id");
        console.log("[DehumidifierRunList] Run changed:", runId);
        const root = store.getRoot();
        const runs = root.getLinkedRecords("dehumidifierRuns") || [];

        // Find and update existing run, or add new one
        const existingIndex = runs.findIndex(
          (r) => r?.getValue("id") === runId
        );

        if (existingIndex >= 0) {
          // Merge the updated fields into the existing record instead of replacing it
          const existingRun = runs[existingIndex];
          if (existingRun) {
            // Copy all fields from the changed run to the existing run
            const fieldsToUpdate = [
              "status",
              "endTime",
              "duration",
              "endEnergyReading",
              "energyConsumed",
              "endHumidityReading",
              "endTemperatureReading",
              "endEventId",
              "errorMessage",
              "updatedAt",
            ];

            fieldsToUpdate.forEach((field) => {
              const value = changedRun.getValue(field);
              if (value !== undefined) {
                existingRun.setValue(value, field);
              }
            });
          }
        } else {
          // Add new run at the beginning (newest first)
          runs.unshift(changedRun);
        }

        root.setLinkedRecords(runs, "dehumidifierRuns");
      }
    },
  };

  useSubscription(subscriptionConfig);

  if (!data) {
    return (
      <div className="dehumidifier-run-list">
        <h2>Dehumidifier Runs</h2>
        <div className="text-white/70">Loading...</div>
      </div>
    );
  }

  const runs = data.dehumidifierRuns || [];

  return (
    <div className="dehumidifier-run-list">
      <h2>Dehumidifier Runs</h2>

      {runs.length === 0 ? (
        <div className="empty-state">
          <p>No dehumidifier runs yet.</p>
        </div>
      ) : (
        <div className="timeline-container">
          {runs.map((run, index) => {
            if (!run) return null;

            const isRunning = run.status === "running";
            const duration = isRunning
              ? new Date().getTime() - new Date(run.startTime).getTime()
              : run.duration;
            const isLast = index === runs.length - 1;

            return (
              <div key={run.id} className="timeline-item">
                <div className="timeline-marker">
                  <div className={`timeline-avatar status-${run.status}`}>
                    {getStartedByIcon(run.startedBy)}
                  </div>
                  {!isLast && <div className="timeline-line"></div>}
                </div>

                <div className="timeline-content">
                  <div className="timeline-header">
                    <div className="timeline-title">
                      <span className="timeline-action">
                        {run.status === "running" ? "Started" : "Finished"}{" "}
                        dehumidifier run
                      </span>
                      <span className={`timeline-status status-${run.status}`}>
                        {run.status === "running" ? "RUNNING" : "FINISHED"}
                      </span>
                    </div>
                    <div className="timeline-time">
                      {formatRelativeTime(run.startTime)}
                    </div>
                  </div>

                  <div className="timeline-body">
                    <div className="run-metrics">
                      <div className="metric">
                        <span className="metric-label">Duration</span>
                        <span className="metric-value duration">
                          {formatDuration(duration)}
                        </span>
                      </div>

                      {run.status === "finished" &&
                      run.energyConsumed !== null &&
                      run.energyConsumed !== undefined ? (
                        <>
                          <div className="metric">
                            <span className="metric-label">
                              Energy Consumed
                            </span>
                            <span className="metric-value energy">
                              {run.energyConsumed.toFixed(6)} {run.energyUnit}
                            </span>
                          </div>

                          {/* Show humidity and temperature deltas for completed runs */}
                          {run.startHumidityReading !== null &&
                            run.startHumidityReading !== undefined &&
                            run.endHumidityReading !== null &&
                            run.endHumidityReading !== undefined && (
                              <div className="metric">
                                <span className="metric-label">
                                  Humidity Change
                                </span>
                                <span className="metric-value humidity">
                                  {run.startHumidityReading.toFixed(1)} →{" "}
                                  {run.endHumidityReading.toFixed(1)}{" "}
                                  {run.humidityUnit || "%"}
                                  <span className="delta">
                                    (
                                    {run.endHumidityReading -
                                      run.startHumidityReading >
                                    0
                                      ? "+"
                                      : ""}
                                    {(
                                      run.endHumidityReading -
                                      run.startHumidityReading
                                    ).toFixed(1)}
                                    )
                                  </span>
                                </span>
                              </div>
                            )}

                          {run.startTemperatureReading !== null &&
                            run.startTemperatureReading !== undefined &&
                            run.endTemperatureReading !== null &&
                            run.endTemperatureReading !== undefined && (
                              <div className="metric">
                                <span className="metric-label">
                                  Temperature Change
                                </span>
                                <span className="metric-value temperature">
                                  {run.startTemperatureReading.toFixed(1)} →{" "}
                                  {run.endTemperatureReading.toFixed(1)}{" "}
                                  {run.temperatureUnit || "°C"}
                                  <span className="delta">
                                    (
                                    {run.endTemperatureReading -
                                      run.startTemperatureReading >
                                    0
                                      ? "+"
                                      : ""}
                                    {(
                                      run.endTemperatureReading -
                                      run.startTemperatureReading
                                    ).toFixed(1)}
                                    )
                                  </span>
                                </span>
                              </div>
                            )}
                        </>
                      ) : (
                        <div className="metric">
                          <span className="metric-label">Energy Reading</span>
                          <span className="metric-value energy">
                            {run.startEnergyReading.toFixed(6)} {run.energyUnit}
                          </span>
                        </div>
                      )}

                      {/* Show starting humidity and temperature for running dehumidifiers */}
                      {run.status === "running" &&
                        run.startHumidityReading !== null &&
                        run.startHumidityReading !== undefined && (
                          <div className="metric">
                            <span className="metric-label">
                              Starting Humidity
                            </span>
                            <span className="metric-value humidity">
                              {run.startHumidityReading.toFixed(1)}{" "}
                              {run.humidityUnit || "%"}
                            </span>
                          </div>
                        )}

                      {run.status === "running" &&
                        run.startTemperatureReading !== null &&
                        run.startTemperatureReading !== undefined && (
                          <div className="metric">
                            <span className="metric-label">
                              Starting Temperature
                            </span>
                            <span className="metric-value temperature">
                              {run.startTemperatureReading.toFixed(1)}{" "}
                              {run.temperatureUnit || "°C"}
                            </span>
                          </div>
                        )}
                    </div>

                    {run.humidityThreshold && (
                      <div className="run-details">
                        <div className="detail-item">
                          <span className="detail-label">
                            Humidity Threshold
                          </span>
                          <span className="detail-value">
                            {run.humidityThreshold}%
                          </span>
                        </div>
                      </div>
                    )}

                    {run.errorMessage && (
                      <div className="error-message">
                        <strong>Error:</strong> {run.errorMessage}
                      </div>
                    )}

                    <div className="timeline-footer">
                      <div className="footer-item">
                        <span>Started:</span>
                        <span>{new Date(run.startTime).toLocaleString()}</span>
                      </div>
                      {run.endTime && (
                        <>
                          <span className="footer-separator">•</span>
                          <div className="footer-item">
                            <span>Ended:</span>
                            <span>
                              {new Date(run.endTime).toLocaleString()}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
