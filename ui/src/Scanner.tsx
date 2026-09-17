import { useState } from "react";
import { ChaseEmpty, ChaseIcon, ChaseSignal } from "./components";
import { ChaseError, ChaseFrequency, ChasePost } from "./transport";
import type { ChaseScan, ChaseSnapshot } from "./types";
export function ChaseScanner({
  snapshot,
  notify,
}: {
  snapshot: ChaseSnapshot;
  notify: (message: string, tone: "error" | "info" | "success") => void;
}) {
  const [chaseFrequency, chaseSetFrequency] = useState(987);
  const [chaseBusy, chaseSetBusy] = useState(false);
  const [chaseReadings, chaseSetReadings] = useState<ChaseScan[]>([]);
  const chaseReading = chaseReadings[0];
  async function ChaseTakeReading(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (chaseBusy) return;
    chaseSetBusy(true);
    try {
      const chaseResult = await ChasePost<ChaseScan>("scan", {
        frequency: chaseFrequency,
      });
      if (
        typeof chaseResult?.detected !== "boolean" ||
        !Number.isFinite(chaseResult.frequency)
      )
        throw new Error("The scanner returned an incomplete reading.");
      chaseSetReadings((chaseCurrent) =>
        [chaseResult, ...chaseCurrent].slice(0, 8),
      );
      notify(chaseResult.message || "Scanner reading received.", "info");
    } catch (chaseError) {
      notify(ChaseError(chaseError), "error");
    } finally {
      chaseSetBusy(false);
    }
  }
  if (!snapshot.viewer.isPolice)
    return (
      <section className="chase-card">
        <ChaseEmpty icon="scan" title="Scanner access restricted">
          A scanner is available to authorized on-duty officers.
        </ChaseEmpty>
      </section>
    );
  return (
    <div className="chase-scanner-grid">
      <section className="chase-card chase-scanner-main">
        <div className="chase-panel-heading">
          <span className="chase-eyebrow">DIRECTIONAL RECEIVER</span>
          <span className="chase-count-pill">PASSIVE SCAN</span>
        </div>
        <div className="chase-compass">
          <div className="chase-compass-cross" />
          <div className="chase-compass-ring" />
          <div className="chase-compass-inner" />
          <span className="chase-compass-n">N</span>
          <span className="chase-compass-e">E</span>
          <span className="chase-compass-s">S</span>
          <span className="chase-compass-w">W</span>
          {chaseReading?.detected ? (
            <div
              className="chase-compass-needle"
              style={{ transform: `rotate(${chaseReading.bearing}deg)` }}
            >
              <ChaseIcon name="direction" size={100} />
            </div>
          ) : (
            <div className="chase-compass-idle">
              <ChaseIcon name="scan" size={44} />
            </div>
          )}
          <div className="chase-compass-center" />
        </div>
        <div className="chase-scanner-bearing">
          <strong>
            {chaseReading?.detected
              ? `${Math.round(chaseReading.bearing)}°`
              : "— —"}
          </strong>
          <span>
            {chaseReading?.detected
              ? `Approximate bearing · ±${Math.round(chaseReading.uncertainty)}°`
              : "Awaiting your first reading"}
          </span>
        </div>
        <form onSubmit={ChaseTakeReading} className="chase-scanner-form">
          <label htmlFor="chase-scan-frequency">Target frequency (MHz)</label>
          <div className="chase-input-action">
            <input
              id="chase-scan-frequency"
              type="number"
              min={snapshot.config.frequencyMin / 10}
              max={snapshot.config.frequencyMax / 10}
              step="0.1"
              required
              value={chaseFrequency / 10}
              onChange={(chaseEvent) =>
                chaseSetFrequency(
                  Math.round(Number(chaseEvent.target.value) * 10),
                )
              }
            />
            <button className="chase-button chase-primary" disabled={chaseBusy}>
              <ChaseIcon name="scan" size={18} />
              {chaseBusy ? "Reading…" : "Take reading"}
            </button>
          </div>
        </form>
      </section>
      <div className="chase-scanner-side">
        <section className="chase-card chase-content-card">
          <div className="chase-panel-heading">
            <span className="chase-eyebrow">SIGNAL INTELLIGENCE</span>
            <ChaseIcon name="signal" />
          </div>
          <h2>
            {chaseReading
              ? chaseReading.detected
                ? "Signal detected"
                : "No signal detected"
              : "Signal information"}
          </h2>
          <p>
            {chaseReading?.message ||
              "Take a reading from your current position. A bearing gives a direction, not a destination."}
          </p>
          <div className="chase-scanner-quality">
            <ChaseSignal
              quality={
                chaseReading
                  ? chaseReading.detected
                    ? chaseReading.strength
                    : 0
                  : null
              }
            />
            <span>
              {chaseReading
                ? `${chaseReading.readings} separated reading${chaseReading.readings === 1 ? "" : "s"}`
                : "No readings yet"}
            </span>
          </div>
          {chaseReading?.searchArea ? (
            <div className="chase-search-area">
              <ChaseIcon name="scan" size={28} />
              <div>
                <strong>Approximate search area</strong>
                <span>
                  {Math.round(chaseReading.searchArea.radius)} m radius · check
                  your map
                </span>
              </div>
            </div>
          ) : (
            <div className="chase-scanner-tip">
              <span>SCAN GUIDANCE</span>
              <p>
                Move between scans. Geographically separated readings help
                narrow the search area.
              </p>
            </div>
          )}
        </section>
        <section className="chase-card chase-content-card">
          <div className="chase-section-heading">
            <h3>Reading history</h3>
            <span className="chase-eyebrow">THIS SESSION</span>
          </div>
          {chaseReadings.length ? (
            <ol className="chase-scan-history">
              {chaseReadings.map((chaseItem, chaseIndex) => (
                <li key={`${chaseItem.frequency}-${chaseIndex}`}>
                  <span>
                    {(chaseReadings.length - chaseIndex)
                      .toString()
                      .padStart(2, "0")}
                  </span>
                  <div>
                    <strong>{ChaseFrequency(chaseItem.frequency)} FM</strong>
                    <small>
                      {chaseItem.detected
                        ? `${Math.round(chaseItem.bearing)}° bearing · ${Math.round(chaseItem.strength * 100)}% signal`
                        : "No signal detected"}
                    </small>
                  </div>
                  <ChaseIcon
                    name={chaseItem.detected ? "signal" : "scan"}
                    size={17}
                  />
                </li>
              ))}
            </ol>
          ) : (
            <p className="chase-caption">
              Your recent readings will appear here. No exact transmitter
              location is displayed.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
