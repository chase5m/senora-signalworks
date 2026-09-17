import { useEffect, useRef, useState } from "react";
import {
  ChaseDialog,
  ChaseEmpty,
  ChaseIcon,
  ChaseSignal,
  ChaseStatus,
} from "./components";
import { ChaseDeviceControls } from "./Devices";
import { ChaseCallControls } from "./Call";
import { ChaseFrequency, ChaseMoney } from "./transport";
import type { ChaseAction, ChaseSnapshot, ChaseStation } from "./types";
export function ChaseTuneForm({
  snapshot,
  frequency,
  setFrequency,
  action,
  busy,
  label = "Tune frequency",
}: {
  snapshot: ChaseSnapshot;
  frequency: number;
  setFrequency: React.Dispatch<React.SetStateAction<number>>;
  action: ChaseAction;
  busy: boolean;
  label?: string;
}) {
  return (
    <form
      className="chase-tune-controls"
      onSubmit={(chaseEvent) => {
        chaseEvent.preventDefault();
        void action("tune", { frequency }, "Receiver tuned.");
      }}
    >
      <label className="chase-visually-hidden" htmlFor="chase-frequency">
        Frequency in MHz
      </label>
      <div className="chase-frequency-stepper">
        <button
          type="button"
          className="chase-icon-button"
          aria-label="Decrease frequency"
          disabled={busy || frequency <= snapshot.config.frequencyMin}
          onClick={() => setFrequency((chaseValue) => chaseValue - 1)}
        >
          <ChaseIcon name="minus" size={17} />
        </button>
        <input
          id="chase-frequency"
          className="chase-frequency-input"
          type="number"
          min={snapshot.config.frequencyMin / 10}
          max={snapshot.config.frequencyMax / 10}
          step="0.1"
          value={frequency / 10}
          onChange={(chaseEvent) =>
            setFrequency(Math.round(Number(chaseEvent.target.value) * 10))
          }
          required
        />
        <button
          type="button"
          className="chase-icon-button"
          aria-label="Increase frequency"
          disabled={busy || frequency >= snapshot.config.frequencyMax}
          onClick={() => setFrequency((chaseValue) => chaseValue + 1)}
        >
          <ChaseIcon name="plus" size={17} />
        </button>
      </div>
      <button
        type="submit"
        className="chase-button chase-primary"
        disabled={busy}
      >
        <ChaseIcon name="headphones" size={18} />
        {label}
      </button>
    </form>
  );
}
export function ChaseRequestDialog({
  snapshot,
  station,
  action,
  busy,
  close,
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
  close: () => void;
}) {
  const [chaseMessage, chaseSetMessage] = useState("");
  const [chaseKind, chaseSetKind] = useState("request");
  async function ChaseSendRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      await action(
        "request",
        {
          stationId: station.id,
          kind: chaseKind,
          message: chaseMessage.trim(),
        },
        "Your message has been sent to the studio.",
      )
    ) {
      chaseSetMessage("");
      close();
    }
  }
  return (
    <ChaseDialog
      title="Message studio"
      description={station.name}
      icon="message"
      close={close}
    >
      <form onSubmit={ChaseSendRequest}>
        <div className="chase-modal-body">
          <label>
            Message type
            <select
              aria-label="Message type"
              value={chaseKind}
              onChange={(chaseEvent) => chaseSetKind(chaseEvent.target.value)}
            >
              <option value="request">Request</option>
              <option value="advertisement">Advertisement</option>
            </select>
          </label>
          <label htmlFor="chase-request-message">
            Message to the studio
            <textarea
              id="chase-request-message"
              value={chaseMessage}
              onChange={(chaseEvent) =>
                chaseSetMessage(chaseEvent.target.value)
              }
              placeholder="Write a request or advertisement…"
              maxLength={snapshot.config.requestMaxLength}
              rows={4}
              required
            />
          </label>
          <span className="chase-field-hint">
            {chaseMessage.length}/{snapshot.config.requestMaxLength} characters
          </span>
        </div>
        <footer className="chase-modal-footer">
          <button
            type="button"
            className="chase-button chase-secondary"
            onClick={close}
          >
            Cancel
          </button>
          <button
            className="chase-button chase-primary"
            disabled={busy || !chaseMessage.trim()}
          >
            <ChaseIcon name="arrow" size={18} />
            Send message
          </button>
        </footer>
      </form>
    </ChaseDialog>
  );
}
export function ChaseTipDialog({
  snapshot,
  station,
  action,
  busy,
  close,
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
  close: () => void;
}) {
  const [chaseTip, chaseSetTip] = useState("100");
  async function ChaseSendTip(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (
      await action(
        "tip",
        { stationId: station.id, amount: Number(chaseTip) },
        "Your tip has been delivered.",
      )
    )
      close();
  }
  return (
    <ChaseDialog
      title="Support station"
      description={station.name}
      icon="money"
      close={close}
    >
      <form onSubmit={ChaseSendTip}>
        <div className="chase-modal-body">
          <label htmlFor="chase-tip">
            Support this station
            <div className="chase-input-action">
              <span>{snapshot.config.currency}</span>
              <input
                id="chase-tip"
                type="number"
                min="1"
                max={snapshot.config.maxTip}
                step="1"
                required
                value={chaseTip}
                onChange={(chaseEvent) => chaseSetTip(chaseEvent.target.value)}
              />
            </div>
          </label>
          <p className="chase-field-hint">
            Maximum{" "}
            {ChaseMoney(snapshot.config.maxTip, snapshot.config.currency)} per
            tip.
          </p>
        </div>
        <footer className="chase-modal-footer">
          <button
            type="button"
            className="chase-button chase-secondary"
            onClick={close}
          >
            Cancel
          </button>
          <button className="chase-button chase-primary" disabled={busy}>
            <ChaseIcon name="check" size={18} />
            Send tip
          </button>
        </footer>
      </form>
    </ChaseDialog>
  );
}
export function ChaseListen({
  snapshot,
  action,
  busy,
  quality,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
  quality: number | null;
}) {
  const [chaseFrequency, chaseSetFrequency] = useState(
    snapshot.stations.find(
      (chaseStation) => chaseStation.id === snapshot.tunedStationId,
    )?.frequency ?? snapshot.config.frequencyMin,
  );
  const chaseTunedIdRef = useRef(snapshot.tunedStationId);
  const [chaseSelectedId, chaseSetSelectedId] = useState<number | null>(
    snapshot.tunedStationId ?? snapshot.stations[0]?.id ?? null,
  );
  const [chaseFilter, chaseSetFilter] = useState("all");
  const [chaseSearch, chaseSetSearch] = useState("");
  const [chaseDialog, chaseSetDialog] = useState<"message" | "tip" | null>(
    null,
  );
  const chaseSelected = snapshot.stations.find(
    (chaseStation) => chaseStation.id === chaseSelectedId,
  );
  const chaseStations = snapshot.stations.filter(
    (chaseStation) =>
      (chaseFilter === "all" || chaseStation.live) &&
      `${chaseStation.name} ${ChaseFrequency(chaseStation.frequency)}`
        .toLowerCase()
        .includes(chaseSearch.toLowerCase()),
  );
  const chaseTuned = Boolean(
    chaseSelected && snapshot.tunedStationId === chaseSelected.id,
  );
  useEffect(() => {
    if (chaseTunedIdRef.current === snapshot.tunedStationId) return;
    chaseTunedIdRef.current = snapshot.tunedStationId;
    const chaseStation = snapshot.stations.find(
      (chaseItem) => chaseItem.id === snapshot.tunedStationId,
    );
    if (chaseStation) {
      chaseSetSelectedId(chaseStation.id);
      chaseSetFrequency(chaseStation.frequency);
    }
  }, [snapshot.tunedStationId, snapshot.stations]);
  return (
    <div className="chase-listen-layout">
      <section className="chase-tuner chase-card">
        <div className="chase-panel-heading">
          <div>
            <ChaseIcon name="radio" />
            <h2>Manual tuning</h2>
          </div>
          <ChaseSignal quality={quality} />
        </div>
        <div className="chase-tuner-body">
          <div className="chase-frequency-display">
            <span className="chase-eyebrow">FREQUENCY</span>
            <div>
              <strong>{ChaseFrequency(chaseFrequency)}</strong>
              <span>MHz</span>
            </div>
          </div>
          <ChaseTuneForm
            snapshot={snapshot}
            frequency={chaseFrequency}
            setFrequency={chaseSetFrequency}
            action={action}
            busy={busy}
          />
        </div>
        <ChaseDeviceControls snapshot={snapshot} action={action} busy={busy} />
        <div className="chase-tuner-footer">
          <span>
            {ChaseFrequency(snapshot.config.frequencyMin)} –{" "}
            {ChaseFrequency(snapshot.config.frequencyMax)} MHz
          </span>
          <span>Public and unlisted stations</span>
        </div>
      </section>
      <section className="chase-directory chase-card">
        <div className="chase-section-heading">
          <div>
            <h2>
              Station directory{" "}
              <span className="chase-count-pill">
                {snapshot.stations.length}
              </span>
            </h2>
            <p>Public broadcasts available in the city.</p>
          </div>
          <div className="chase-segmented" aria-label="Filter stations">
            <button
              className={chaseFilter === "all" ? "chase-selected" : ""}
              aria-pressed={chaseFilter === "all"}
              onClick={() => chaseSetFilter("all")}
            >
              All stations
            </button>
            <button
              className={chaseFilter === "live" ? "chase-selected" : ""}
              aria-pressed={chaseFilter === "live"}
              onClick={() => chaseSetFilter("live")}
            >
              On air
            </button>
          </div>
        </div>
        <label className="chase-search">
          <ChaseIcon name="search" size={19} />
          <input
            aria-label="Search stations"
            placeholder="Search name or frequency"
            value={chaseSearch}
            onChange={(chaseEvent) => chaseSetSearch(chaseEvent.target.value)}
          />
        </label>
        <div className="chase-table-heading">
          <span>Station</span>
          <span>Frequency</span>
          <span>Status</span>
        </div>
        <div className="chase-station-list">
          {chaseStations.length ? (
            chaseStations.map((chaseStation) => (
              <button
                key={chaseStation.id}
                className={`chase-station-row ${chaseSelected?.id === chaseStation.id ? "chase-station-selected" : ""}`}
                onClick={() => {
                  chaseSetSelectedId(chaseStation.id);
                  chaseSetFrequency(chaseStation.frequency);
                }}
                aria-pressed={chaseSelected?.id === chaseStation.id}
              >
                <span className="chase-station-symbol">
                  <ChaseIcon
                    name={chaseStation.live ? "broadcast" : "radio"}
                    size={22}
                  />
                </span>
                <span className="chase-station-text">
                  <strong>{chaseStation.name}</strong>
                  <span>
                    {chaseStation.showTitle ||
                      chaseStation.tagline ||
                      "No show scheduled"}
                  </span>
                </span>
                <span className="chase-row-frequency">
                  {ChaseFrequency(chaseStation.frequency)}
                  <small>FM</small>
                </span>
                <ChaseStatus live={chaseStation.live}>
                  {chaseStation.live ? "ON AIR" : "OFF AIR"}
                </ChaseStatus>
                <ChaseIcon name="arrow" size={17} />
              </button>
            ))
          ) : (
            <ChaseEmpty title="No stations found">
              Try another search or tune to a frequency directly.
            </ChaseEmpty>
          )}
        </div>
      </section>
      <aside className="chase-now-playing chase-card">
        {chaseSelected ? (
          <>
            <div className="chase-panel-heading">
              <div>
                <ChaseIcon name="headphones" />
                <h2>Station details</h2>
              </div>
              <ChaseStatus live={chaseSelected.live}>
                {chaseSelected.live ? "ON AIR" : "OFF AIR"}
              </ChaseStatus>
            </div>
            <div className="chase-selected-frequency">
              <strong>{ChaseFrequency(chaseSelected.frequency)}</strong>
              <span>FM</span>
              <span className="chase-count-pill">
                {chaseTuned ? "CONNECTED" : "SELECTED"}
              </span>
            </div>
            <div className="chase-selected-show">
              <span className="chase-eyebrow">CURRENT SHOW</span>
              <h2>{chaseSelected.showTitle || chaseSelected.name}</h2>
              <p>{chaseSelected.tagline || "No station description."}</p>
            </div>
            <dl className="chase-detail-list">
              <div>
                <dt>Station</dt>
                <dd>{chaseSelected.name}</dd>
              </div>
              <div>
                <dt>Host</dt>
                <dd>
                  {chaseSelected.hostName || "No host"}
                  {chaseSelected.cohostNames.length
                    ? ` +${chaseSelected.cohostNames.length} co-host${chaseSelected.cohostNames.length === 1 ? "" : "s"}`
                    : ""}
                </dd>
              </div>
              <div>
                <dt>Listeners</dt>
                <dd>{chaseSelected.listeners} tuned in</dd>
              </div>
            </dl>
            <button
              className={`chase-button ${chaseTuned ? "chase-secondary" : "chase-primary"} chase-full`}
              disabled={busy || (!chaseSelected.live && !chaseTuned)}
              onClick={() =>
                void action(
                  chaseTuned ? "untune" : "tune",
                  chaseTuned ? {} : { stationId: chaseSelected.id },
                  chaseTuned ? "Receiver disconnected." : "Receiver tuned.",
                )
              }
            >
              <ChaseIcon name={chaseTuned ? "stop" : "play"} size={17} />
              {chaseTuned ? "Disconnect receiver" : "Listen in"}
            </button>
            {chaseSelected.id !== snapshot.mine?.id ? (
              <ChaseCallControls
                snapshot={snapshot}
                station={chaseSelected}
                action={action}
                busy={busy}
              />
            ) : null}
            <div className="chase-station-actions">
              <button
                className="chase-button chase-secondary"
                onClick={() => chaseSetDialog("message")}
              >
                <ChaseIcon name="message" size={18} />
                Message studio
              </button>
              {chaseSelected.id !== snapshot.mine?.id ? (
                <button
                  className="chase-button chase-secondary"
                  onClick={() => chaseSetDialog("tip")}
                >
                  <ChaseIcon name="money" size={18} />
                  Tip station
                </button>
              ) : null}
            </div>
            <p className="chase-caption">
              Your receiver stays connected when this panel is closed.
            </p>
          </>
        ) : (
          <ChaseEmpty title="Select a station">
            Choose a station from the directory to view its broadcast.
          </ChaseEmpty>
        )}
      </aside>
      {chaseDialog === "message" && chaseSelected ? (
        <ChaseRequestDialog
          snapshot={snapshot}
          station={chaseSelected}
          action={action}
          busy={busy}
          close={() => chaseSetDialog(null)}
        />
      ) : null}
      {chaseDialog === "tip" && chaseSelected ? (
        <ChaseTipDialog
          snapshot={snapshot}
          station={chaseSelected}
          action={action}
          busy={busy}
          close={() => chaseSetDialog(null)}
        />
      ) : null}
    </div>
  );
}
