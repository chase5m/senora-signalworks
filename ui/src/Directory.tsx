import { useState } from "react";
import { ChaseEmpty, ChaseIcon } from "./components";
import { ChaseFrequency } from "./transport";
import type { ChaseAction, ChaseSnapshot, ChaseSpeech } from "./types";
export function ChaseDirectory({
  snapshot,
  speech,
  action,
  busy,
  refresh,
}: {
  snapshot: ChaseSnapshot;
  speech: ChaseSpeech | null;
  action: ChaseAction;
  busy: boolean;
  refresh: () => void;
}) {
  const [chaseSearch, chaseSetSearch] = useState("");
  const chaseActive = snapshot.stations.filter(
    (chaseStation) => chaseStation.live === true,
  );
  const chaseStations = chaseActive.filter((chaseStation) =>
    `${chaseStation.name} ${chaseStation.micLive ? chaseStation.hostName || "" : ""} ${ChaseFrequency(chaseStation.frequency)}`
      .toLowerCase()
      .includes(chaseSearch.trim().toLowerCase()),
  );
  const chaseCanTune = !snapshot.devices || snapshot.devices.active !== "none";
  return (
    <section className="chase-active-directory chase-card">
      <div className="chase-section-heading">
        <div>
          <h2>
            On the air{" "}
            <span className="chase-count-pill">{chaseActive.length}</span>
          </h2>
          <p>Current broadcasts in your station directory.</p>
        </div>
        <button
          className="chase-button chase-secondary"
          disabled={busy}
          onClick={refresh}
        >
          <ChaseIcon name="refresh" size={18} />
          Refresh frequencies
        </button>
      </div>
      <label className="chase-search">
        <ChaseIcon name="search" size={19} />
        <input
          aria-label="Search active frequencies"
          placeholder="Search station, host or frequency"
          value={chaseSearch}
          onChange={(chaseEvent) => chaseSetSearch(chaseEvent.target.value)}
        />
      </label>
      {!chaseCanTune ? (
        <p className="chase-directory-hint">
          <ChaseIcon name="headphones" size={18} />
          Equip a receiver in Listen to tune in.
        </p>
      ) : null}
      {chaseStations.length ? (
        <div className="chase-active-list">
          <div className="chase-active-columns" aria-hidden="true">
            <span>Station</span>
            <span>Frequency</span>
            <span>Host</span>
            <span>Microphone</span>
            <span />
          </div>
          {chaseStations.map((chaseStation) => {
            const chaseTalking =
              (speech?.local.talking &&
                speech.local.stationId === chaseStation.id) ||
              (speech?.receiver?.talking &&
                speech.receiver.stationId === chaseStation.id);
            const chaseConnected = snapshot.tunedStationId === chaseStation.id;
            return (
              <article className="chase-active-row" key={chaseStation.id}>
                <div className="chase-active-name">
                  <span className="chase-station-symbol">
                    <ChaseIcon name="broadcast" size={22} />
                  </span>
                  <div>
                    <h3>{chaseStation.name}</h3>
                    <p>{chaseStation.showTitle || "Live broadcast"}</p>
                  </div>
                </div>
                <div className="chase-active-frequency">
                  <span className="chase-mobile-label">Frequency</span>
                  <strong>
                    {ChaseFrequency(chaseStation.frequency)} <small>FM</small>
                  </strong>
                </div>
                <div className="chase-active-host">
                  <span className="chase-mobile-label">Host</span>
                  <span>
                    {chaseStation.micLive && chaseStation.hostName
                      ? chaseStation.hostName
                      : "No host"}
                    {chaseStation.micLive && chaseStation.cohostNames.length ? (
                      <small className="chase-cohost-count">
                        +{chaseStation.cohostNames.length} co-host
                        {chaseStation.cohostNames.length === 1 ? "" : "s"}
                      </small>
                    ) : null}
                  </span>
                </div>
                <span
                  className={`chase-directory-speech ${chaseTalking ? "chase-speech-onair" : ""}`}
                >
                  <ChaseIcon name="mic" size={17} />
                  {chaseTalking
                    ? "On-air speech"
                    : chaseStation.micLive
                      ? "Mic open"
                      : "Mic closed"}
                </span>
                <button
                  className={`chase-button ${chaseConnected ? "chase-secondary" : "chase-primary"}`}
                  disabled={busy || !chaseCanTune || chaseConnected}
                  aria-label={
                    chaseConnected
                      ? `Tuned to ${chaseStation.name}`
                      : `Tune to ${chaseStation.name}`
                  }
                  onClick={() =>
                    void action(
                      "tune",
                      { stationId: chaseStation.id },
                      "Receiver tuned.",
                    )
                  }
                >
                  <ChaseIcon
                    name={chaseConnected ? "check" : "headphones"}
                    size={17}
                  />
                  {chaseConnected ? "Tuned" : "Tune in"}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <ChaseEmpty
          title={
            chaseActive.length
              ? "No matching frequencies"
              : "No active frequencies"
          }
        >
          {chaseActive.length
            ? "Try another station name, host or frequency."
            : "Stations appear here when they start broadcasting. Refresh to check again."}
        </ChaseEmpty>
      )}
    </section>
  );
}
