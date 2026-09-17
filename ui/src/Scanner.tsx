import { useEffect, useRef, useState, type FormEvent } from "react";
import { ChaseEmpty, ChaseIcon } from "./components";
import { ChaseMeter, ChaseReceptionLabel } from "./presentation";
import { ChaseError, ChasePost } from "./transport";
import type { ChaseScan, ChaseSnapshot } from "./types";
import "./scanner-redesign.css";

type ChaseScannerEntry = { id: number; receivedAt: number; reading: ChaseScan };

function chaseBearing(value: number) {
  return ((value % 360) + 360) % 360;
}

function chaseBearingText(value: number) {
  return `${(Math.round(chaseBearing(value)) % 360).toString().padStart(3, "0")}°`;
}

function chaseDirection(value: number) {
  return ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][
    Math.round(chaseBearing(value) / 45) % 8
  ];
}

function chaseCompassPoint(degrees: number, radius: number) {
  const radians = (degrees * Math.PI) / 180;
  return {
    x: 200 + radius * Math.sin(radians),
    y: 200 - radius * Math.cos(radians),
  };
}

const chaseCompassTicks = Array.from({ length: 72 }, (_, index) => index * 5);
const chaseCompassLabels = Array.from({ length: 12 }, (_, index) => index * 30);
const chaseCardinalLabels: Record<number, string> = {
  0: "N",
  90: "E",
  180: "S",
  270: "W",
};

function ChaseBearingGauge({ bearing }: { bearing: number | null }) {
  return (
    <svg
      className="chase-scanner-compass"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <circle className="chase-compass-boundary" cx="200" cy="200" r="185" />
      <circle className="chase-compass-reference" cx="200" cy="200" r="91" />
      <line className="chase-compass-axis" x1="200" y1="91" x2="200" y2="309" />
      <line className="chase-compass-axis" x1="91" y1="200" x2="309" y2="200" />
      <g className="chase-compass-graduations">
        {chaseCompassTicks.map((degrees) => {
          const major = degrees % 30 === 0;
          const cardinal = degrees % 90 === 0;
          const outer = chaseCompassPoint(degrees, 177);
          const inner = chaseCompassPoint(
            degrees,
            cardinal ? 157 : major ? 160 : 168,
          );
          return (
            <line
              key={degrees}
              className={
                major ? "chase-compass-tick major" : "chase-compass-tick"
              }
              data-degrees={degrees}
              x1={inner.x}
              y1={inner.y}
              x2={outer.x}
              y2={outer.y}
            />
          );
        })}
      </g>
      <g className="chase-compass-labels">
        {chaseCompassLabels.map((degrees) => {
          const point = chaseCompassPoint(degrees, 137);
          const cardinal = chaseCardinalLabels[degrees];
          return (
            <text
              key={degrees}
              className={
                cardinal ? "chase-compass-cardinal" : "chase-compass-degree"
              }
              x={point.x}
              y={point.y}
              textAnchor="middle"
              dominantBaseline="central"
            >
              {cardinal || degrees}
            </text>
          );
        })}
      </g>
      {bearing === null ? (
        <text
          className="chase-compass-no-reading"
          x="200"
          y="200"
          textAnchor="middle"
          dominantBaseline="central"
        >
          NO BEARING
        </text>
      ) : (
        <>
          <g
            className="chase-compass-bearing"
            transform={`rotate(${chaseBearing(bearing)} 200 200)`}
            data-bearing={chaseBearing(bearing)}
          >
            <line x1="200" y1="200" x2="200" y2="76" />
            <polygon points="200,62 194,81 200,76 206,81" />
          </g>
          <circle className="chase-compass-pivot" cx="200" cy="200" r="11" />
        </>
      )}
    </svg>
  );
}

function chaseReadingAge(receivedAt: number, now: number) {
  const seconds = Math.max(0, Math.floor((now - receivedAt) / 1000));
  if (seconds < 2) return "Just received";
  if (seconds < 60) return `${seconds} seconds ago`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
}

export function ChaseScanner({
  snapshot,
  notify,
}: {
  snapshot: ChaseSnapshot;
  notify: (message: string, tone: "error" | "info" | "success") => void;
}) {
  const chaseMinimum = snapshot.config.frequencyMin;
  const chaseMaximum = snapshot.config.frequencyMax;
  const [chaseFrequency, chaseSetFrequency] = useState(() =>
    (Math.max(chaseMinimum, Math.min(chaseMaximum, 987)) / 10).toFixed(3),
  );
  const [chaseBusy, chaseSetBusy] = useState(false);
  const [chaseReadings, chaseSetReadings] = useState<ChaseScannerEntry[]>([]);
  const [chaseNow, chaseSetNow] = useState(Date.now);
  const chasePending = useRef(false);
  const chaseSequence = useRef(0);
  const chaseTarget = chaseFrequency.trim() ? Number(chaseFrequency) * 10 : NaN;
  const chaseValidTarget =
    Number.isFinite(chaseTarget) &&
    Math.abs(chaseTarget - Math.round(chaseTarget)) < 0.00001 &&
    chaseTarget >= chaseMinimum &&
    chaseTarget <= chaseMaximum;
  const chaseEntry = chaseValidTarget
    ? chaseReadings.find(
        (entry) => entry.reading.frequency === Math.round(chaseTarget),
      )
    : undefined;
  const chaseReading = chaseEntry?.reading;
  const chaseStrength = chaseReading
    ? chaseReading.detected
      ? chaseReading.strength
      : 0
    : null;

  useEffect(() => {
    if (!chaseEntry) return;
    chaseSetNow(Date.now());
    const timer = window.setInterval(() => chaseSetNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [chaseEntry]);

  function chaseStepFrequency(step: number) {
    const current = Number.isFinite(chaseTarget)
      ? Math.round(chaseTarget)
      : chaseMinimum;
    const next = Math.max(chaseMinimum, Math.min(chaseMaximum, current + step));
    chaseSetFrequency((next / 10).toFixed(3));
  }

  async function ChaseTakeReading(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (chasePending.current || !snapshot.viewer.isPolice) return;
    if (!chaseValidTarget) {
      notify("Choose a valid FM frequency in 0.1 MHz steps.", "error");
      return;
    }
    chasePending.current = true;
    chaseSetBusy(true);
    try {
      const chaseResult = await ChasePost<ChaseScan>("scan", {
        frequency: Math.round(chaseTarget),
      });
      if (
        typeof chaseResult?.detected !== "boolean" ||
        chaseResult.frequency !== Math.round(chaseTarget) ||
        !Number.isFinite(chaseResult.strength) ||
        !Number.isFinite(chaseResult.bearing) ||
        !Number.isFinite(chaseResult.uncertainty) ||
        !Number.isFinite(chaseResult.readings)
      ) {
        throw new Error("The scanner returned an incomplete reading.");
      }
      const chaseReceivedAt = Date.now();
      const chaseNext = {
        id: ++chaseSequence.current,
        receivedAt: chaseReceivedAt,
        reading: chaseResult,
      };
      chaseSetReadings((current) => [chaseNext, ...current].slice(0, 8));
      chaseSetNow(chaseReceivedAt);
      notify(chaseResult.message || "Scanner reading received.", "info");
    } catch (chaseError) {
      notify(ChaseError(chaseError), "error");
    } finally {
      chasePending.current = false;
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
    <div className="chase-scanner-console">
      <div className="chase-scanner-panels">
        <section
          className="chase-scanner-direction"
          aria-labelledby="chase-scanner-title"
        >
          <h2 id="chase-scanner-title">Directional receiver</h2>
          <p>Take directional readings and review signal history.</p>
          <div
            className={`chase-scanner-dial ${chaseReading?.detected ? "has-reading" : ""}`}
            role="img"
            aria-label={
              chaseReading?.detected
                ? `Approximate bearing ${chaseBearingText(chaseReading.bearing)}, ${chaseDirection(chaseReading.bearing)}, uncertainty plus or minus ${Math.round(chaseReading.uncertainty)} degrees`
                : "Direction unavailable until a signal is detected"
            }
          >
            <ChaseBearingGauge
              bearing={chaseReading?.detected ? chaseReading.bearing : null}
            />
          </div>
          <div className="chase-scanner-bearing-readout" aria-live="polite">
            <strong>
              {chaseReading?.detected
                ? chaseBearingText(chaseReading.bearing)
                : "— — —"}
            </strong>
            {chaseReading?.detected ? (
              <span>{chaseDirection(chaseReading.bearing)}</span>
            ) : null}
          </div>
          <p className="chase-scanner-last-reading">
            {chaseEntry ? (
              <>
                Last reading ·{" "}
                <time dateTime={new Date(chaseEntry.receivedAt).toISOString()}>
                  {chaseReadingAge(chaseEntry.receivedAt, chaseNow)}
                </time>
              </>
            ) : (
              "Awaiting a reading on this frequency"
            )}
          </p>
          {chaseReading?.detected ? (
            <p className="chase-scanner-uncertainty">
              Approximate bearing · ±{Math.round(chaseReading.uncertainty)}°
            </p>
          ) : null}
        </section>

        <form
          className="chase-scanner-controls"
          onSubmit={ChaseTakeReading}
          aria-busy={chaseBusy}
        >
          <div>
            <label
              className="chase-scanner-label"
              htmlFor="chase-scan-frequency"
            >
              Target frequency <span>(MHz)</span>
            </label>
            <p id="chase-scan-frequency-hint">
              Set the frequency to scan for signals.
            </p>
            <div className="chase-scanner-tuner">
              <div className="chase-scanner-frequency-field">
                <input
                  id="chase-scan-frequency"
                  type="number"
                  inputMode="decimal"
                  min={chaseMinimum / 10}
                  max={chaseMaximum / 10}
                  step="0.1"
                  required
                  value={chaseFrequency}
                  disabled={chaseBusy}
                  aria-describedby="chase-scan-frequency-hint"
                  onChange={(event) => chaseSetFrequency(event.target.value)}
                  onBlur={() => {
                    if (chaseValidTarget)
                      chaseSetFrequency(
                        (Math.round(chaseTarget) / 10).toFixed(3),
                      );
                  }}
                />
                <span aria-hidden="true">MHz</span>
              </div>
              <button
                type="button"
                className="chase-scanner-step"
                aria-label="Decrease frequency by 0.1 MHz"
                disabled={
                  chaseBusy || (chaseValidTarget && chaseTarget <= chaseMinimum)
                }
                onClick={() => chaseStepFrequency(-1)}
              >
                <ChaseIcon name="minus" size={24} />
              </button>
              <button
                type="button"
                className="chase-scanner-step"
                aria-label="Increase frequency by 0.1 MHz"
                disabled={
                  chaseBusy || (chaseValidTarget && chaseTarget >= chaseMaximum)
                }
                onClick={() => chaseStepFrequency(1)}
              >
                <ChaseIcon name="plus" size={24} />
              </button>
            </div>
          </div>
          <section
            className="chase-scanner-signal"
            aria-labelledby="chase-scanner-strength-title"
          >
            <h3 id="chase-scanner-strength-title">Signal strength</h3>
            <div className="chase-scanner-signal-row">
              <ChaseMeter
                value={chaseStrength}
                label={
                  chaseStrength === null
                    ? "Signal strength unavailable; take a reading"
                    : "Captured signal strength"
                }
              />
              <strong>
                {chaseStrength === null
                  ? "No reading"
                  : ChaseReceptionLabel(chaseStrength)}
              </strong>
            </div>
            <p className="chase-scanner-message" role="status">
              {chaseBusy
                ? "Taking a reading from your current position…"
                : chaseReading?.message ||
                  "Take a reading to measure this frequency."}
            </p>
          </section>
          <button
            type="submit"
            className="chase-button chase-primary chase-scanner-submit"
            disabled={chaseBusy || !chaseValidTarget}
          >
            <ChaseIcon name="scan" size={27} />
            {chaseBusy ? "Taking reading…" : "Take reading"}
          </button>
          {chaseReading ? (
            <p className="chase-scanner-count">
              {chaseReading.readings} separated reading
              {chaseReading.readings === 1 ? "" : "s"} recorded
            </p>
          ) : null}
          {chaseReading?.searchArea ? (
            <div className="chase-scanner-search-area">
              <ChaseIcon name="scan" size={24} />
              <div>
                <strong>Approximate search area established</strong>
                <span>
                  {Math.round(chaseReading.searchArea.radius)} m radius · check
                  your map
                </span>
              </div>
            </div>
          ) : null}
        </form>
      </div>

      <section
        className="chase-scanner-history"
        aria-labelledby="chase-scanner-history-title"
      >
        <header>
          <h2 id="chase-scanner-history-title">Reading history</h2>
          <p>
            Your recent readings appear below. Bearings indicate direction, not
            distance.
          </p>
        </header>
        <div
          className="chase-scanner-history-scroll"
          tabIndex={0}
          role="region"
          aria-label="Recent scanner readings"
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Time</th>
                <th scope="col">Frequency</th>
                <th scope="col">Bearing</th>
                <th scope="col">Reception</th>
              </tr>
            </thead>
            <tbody>
              {chaseReadings.length ? (
                chaseReadings.map(({ id, receivedAt, reading }) => (
                  <tr key={id}>
                    <td>
                      <time
                        dateTime={new Date(receivedAt).toISOString()}
                        title="Received at local time"
                      >
                        {new Date(receivedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}
                      </time>
                    </td>
                    <td>{(reading.frequency / 10).toFixed(3)} MHz</td>
                    <td>
                      {reading.detected ? (
                        <span
                          title={`Approximate bearing, ±${Math.round(reading.uncertainty)}°`}
                        >
                          {chaseBearingText(reading.bearing)}{" "}
                          <small>±{Math.round(reading.uncertainty)}°</small>
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td
                      className={
                        reading.detected ? "chase-scanner-detected" : ""
                      }
                    >
                      {reading.detected
                        ? ChaseReceptionLabel(reading.strength)
                        : "No signal"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="chase-scanner-history-empty">
                    No readings yet. Set a frequency and take your first
                    reading.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
      <footer className="chase-scanner-guidance">
        <ChaseIcon name="info" size={22} />
        <p>
          Move between readings to narrow the search area. Bearings indicate
          direction, not distance.
        </p>
        <span>Senora County // Field operations</span>
      </footer>
    </div>
  );
}
