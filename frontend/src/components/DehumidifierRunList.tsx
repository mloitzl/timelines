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
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every 10 seconds for running durations
  useEffect(() => {
    const interval = setInterval(() => {
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
          runs[existingIndex] = changedRun;
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
        <div className="dehumidifier-runs-container">
          {runs.map((run) => {
            if (!run) return null;

            const isRunning = run.status === "running";
            const duration = isRunning
              ? new Date().getTime() - new Date(run.startTime).getTime()
              : run.duration;

            return (
              <div
                key={run.id}
                className={`dehumidifier-run-card status-${run.status}`}
              >
                <div className="run-header">
                  <div className="run-status-section">
                    <span className="run-icon">
                      {getStartedByIcon(run.startedBy)}
                    </span>
                    <span className={`run-status-badge ${run.status}`}>
                      {run.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="run-time">
                    {formatRelativeTime(run.startTime)}
                  </div>
                </div>

                <div className="run-details">
                  <div className="run-detail-item">
                    <div className="run-detail-label">Duration</div>
                    <div className="run-detail-value duration">
                      {formatDuration(duration)}
                    </div>
                  </div>

                  {run.status === "finished" && run.energyConsumed !== null ? (
                    <div className="run-detail-item">
                      <div className="run-detail-label">Energy Consumed</div>
                      <div className="run-detail-value energy">
                        {run.energyConsumed.toFixed(6)} {run.energyUnit}
                      </div>
                    </div>
                  ) : (
                    <div className="run-detail-item">
                      <div className="run-detail-label">Energy Reading</div>
                      <div className="run-detail-value energy">
                        {run.startEnergyReading.toFixed(6)} {run.energyUnit}
                      </div>
                    </div>
                  )}
                </div>

                {run.humidityThreshold && (
                  <div className="run-threshold">
                    <div className="run-threshold-label">
                      Humidity Threshold
                    </div>
                    <div className="run-threshold-value">
                      {run.humidityThreshold}%
                    </div>
                  </div>
                )}

                {run.errorMessage && (
                  <div className="run-error">
                    <strong>Error:</strong> {run.errorMessage}
                  </div>
                )}

                <div className="run-footer">
                  <div className="run-footer-item">
                    <span>Started:</span>
                    <span>{new Date(run.startTime).toLocaleString()}</span>
                  </div>
                  {run.endTime && (
                    <>
                      <span className="run-footer-separator">•</span>
                      <div className="run-footer-item">
                        <span>Ended:</span>
                        <span>{new Date(run.endTime).toLocaleString()}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
