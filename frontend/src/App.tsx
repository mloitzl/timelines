import { RelayEnvironment } from "./relay/environment";
import { EventList } from "./components/EventList";
import { DeviceStateList } from "./components/DeviceStateList";
import { DehumidifierRunList } from "./components/DehumidifierRunList";
import { RelayEnvironmentProvider } from "react-relay";
import { Suspense } from "react";
import "./App.css";

export default function App() {
  return (
    <RelayEnvironmentProvider environment={RelayEnvironment}>
      <div className="App">
        <h1>Timelines</h1>

        {/* Top section: Device States and Dehumidifier Runs side by side */}
        <div className="app-grid-top">
          <Suspense
            fallback={<div className="loading">Loading devices...</div>}
          >
            <DeviceStateList />
          </Suspense>
          <Suspense
            fallback={
              <div className="loading">Loading dehumidifier runs...</div>
            }
          >
            <DehumidifierRunList />
          </Suspense>
        </div>

        {/* Bottom section: Event Timeline full width */}
        <div className="app-grid-bottom">
          <Suspense fallback={<div className="loading">Loading events...</div>}>
            <EventList />
          </Suspense>
        </div>
      </div>
    </RelayEnvironmentProvider>
  );
}
