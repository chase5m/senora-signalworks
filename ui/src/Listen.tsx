import { ChaseStationArt, ChaseReceptionLabel } from "./presentation";
import { ChaseDetectProvider } from "./players";
import { useEffect, useState } from "react";
import { ChaseDialog, ChaseEmpty, ChaseIcon, ChaseStatus } from "./components";
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
export function ChaseRequestForm({
  snapshot,
  station,
  action,
  busy,
  onSent,
  initialKind = "song",
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
  onSent?: () => void;
  initialKind?: "song" | "message" | "advertisement";
}) {
  const [chaseKind, chaseSetKind] = useState(
    snapshot.config.music?.enabled === false ? "message" : initialKind,
  );
  const [chaseMessage, chaseSetMessage] = useState("");
  const [chaseUrl, chaseSetUrl] = useState("");
  const [chaseError, chaseSetError] = useState("");
  const chaseLimit = Math.min(snapshot.config.requestMaxLength, 240);
  const chaseRemaining = Math.max(
    0,
    chaseLimit -
      (chaseKind === "song" ? Array.from(chaseUrl.trim()).length + 1 : 0),
  );
  async function ChaseSendRequest(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    chaseSetError("");
    const chaseProvider = ChaseDetectProvider(chaseUrl.trim());
    if (
      chaseKind === "song" &&
      (!chaseProvider ||
        snapshot.config.music?.enabled === false ||
        snapshot.config.music?.providers?.[chaseProvider] === false)
    ) {
      chaseSetError("Enter a supported YouTube or SoundCloud track link.");
      return;
    }
    if (Array.from(chaseMessage.trim()).length > chaseRemaining) {
      chaseSetError("Shorten your message to fit the station's request limit.");
      return;
    }
    const chaseSent = await action(
      "request",
      {
        stationId: station.id,
        kind: chaseKind,
        url: chaseKind === "song" ? chaseUrl.trim() : undefined,
        message: chaseMessage.trim(),
      },
      "Your message has been sent to the studio.",
    );
    if (chaseSent) {
      chaseSetMessage("");
      chaseSetUrl("");
      onSent?.();
    }
  }
  return (
    <form className="chase-request-form" onSubmit={ChaseSendRequest}>
      <div className="chase-request-kinds" aria-label="Message type">
        {(
          [
            { id: "song", label: "Song request", icon: "music" },
            { id: "message", label: "Message", icon: "message" },
            { id: "advertisement", label: "Advertisement", icon: "advert" },
          ] as const
        ).map((chaseItem) => (
          <button
            key={chaseItem.id}
            type="button"
            disabled={
              chaseItem.id === "song" &&
              snapshot.config.music?.enabled === false
            }
            aria-pressed={chaseKind === chaseItem.id}
            className={`chase-button ${chaseKind === chaseItem.id ? "chase-primary" : "chase-secondary"}`}
            onClick={() => chaseSetKind(chaseItem.id)}
          >
            <ChaseIcon name={chaseItem.icon} />
            {chaseItem.label}
          </button>
        ))}
      </div>
      {chaseKind === "song" && (
        <label>
          Track link
          <div className="chase-track-link">
            <ChaseIcon name="link" />
            <input
              type="url"
              placeholder="YouTube or SoundCloud link"
              value={chaseUrl}
              onChange={(chaseEvent) => chaseSetUrl(chaseEvent.target.value)}
              maxLength={chaseLimit - 1}
              required
            />
          </div>
        </label>
      )}
      <label>
        Message{chaseKind === "song" ? " (optional)" : ""}
        <textarea
          value={chaseMessage}
          onChange={(chaseEvent) =>
            chaseSetMessage(
              Array.from(chaseEvent.target.value)
                .slice(0, chaseRemaining)
                .join(""),
            )
          }
          placeholder={
            chaseKind === "advertisement"
              ? "Tell the station about your business or event…"
              : "Send a message to the crew…"
          }
          rows={4}
          minLength={chaseKind === "song" ? undefined : 3}
          required={chaseKind !== "song"}
        />
      </label>
      <span className="chase-form-count">
        {Array.from(chaseMessage).length} / {chaseRemaining}
      </span>
      {chaseError && (
        <p className="chase-form-error" role="alert">
          {chaseError}
        </p>
      )}
      <button
        className="chase-button chase-primary chase-full"
        disabled={
          busy ||
          (chaseKind === "song"
            ? !chaseUrl.trim()
            : chaseMessage.trim().length < 3)
        }
      >
        <ChaseIcon name={chaseKind === "song" ? "music" : "message"} />
        {chaseKind === "song" ? "Send request" : "Send message"}
      </button>
      <p className="chase-form-note">
        <ChaseIcon name="info" size={18} />
        Requests are reviewed by the station crew.
      </p>
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
  return (
    <ChaseDialog
      title="Message studio"
      description={station.name}
      icon="message"
      close={close}
    >
      <div className="chase-modal-body">
        <ChaseRequestForm
          snapshot={snapshot}
          station={station}
          action={action}
          busy={busy}
          onSent={close}
        />
      </div>
    </ChaseDialog>
  );
}

export function ChaseTipForm({
  snapshot,
  station,
  action,
  busy,
  onSent,
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
  onSent?: () => void;
}) {
  const [chaseAmount, chaseSetAmount] = useState(
    String(Math.min(100, snapshot.config.maxTip)),
  );
  const chaseOwn = station.canManage || station.id === snapshot.mine?.id;
  async function ChaseSendTip(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (chaseOwn) return;
    if (
      await action(
        "tip",
        { stationId: station.id, amount: Number(chaseAmount) },
        "Your tip has been delivered.",
      )
    )
      onSent?.();
  }
  return (
    <form className="chase-tip-form" onSubmit={ChaseSendTip}>
      <h3>Support this station</h3>
      <p>
        {chaseOwn
          ? "You cannot tip a station you own or operate."
          : `Help keep ${station.name} on the air.`}
      </p>
      <div className="chase-tip-actions">
        {[50, 100]
          .filter((chaseValue) => chaseValue <= snapshot.config.maxTip)
          .map((chaseValue) => (
            <button
              type="button"
              key={chaseValue}
              className={`chase-button chase-secondary ${Number(chaseAmount) === chaseValue ? "chase-selected" : ""}`}
              onClick={() => chaseSetAmount(String(chaseValue))}
              disabled={busy || chaseOwn}
            >
              {ChaseMoney(chaseValue, snapshot.config.currency)}
            </button>
          ))}
        <input
          aria-label="Tip amount"
          type="number"
          placeholder="Custom amount"
          min={1}
          max={snapshot.config.maxTip}
          step={1}
          value={chaseAmount}
          onChange={(chaseEvent) => chaseSetAmount(chaseEvent.target.value)}
          disabled={chaseOwn}
          required
        />
        <button
          className="chase-button chase-primary"
          disabled={busy || chaseOwn || !chaseAmount}
        >
          <ChaseIcon name="heart" />
          Send tip
        </button>
      </div>
      <span className="chase-caption">
        Up to {ChaseMoney(snapshot.config.maxTip, snapshot.config.currency)} per
        tip.
      </span>
    </form>
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
  return (
    <ChaseDialog
      title="Support station"
      description={station.name}
      icon="heart"
      close={close}
    >
      <div className="chase-modal-body">
        <ChaseTipForm
          snapshot={snapshot}
          station={station}
          action={action}
          busy={busy}
          onSent={close}
        />
      </div>
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
    )?.frequency || 987,
  );
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
  const chaseTuned = chaseSelected?.id === snapshot.tunedStationId;
  const chaseOwn =
    chaseSelected?.canManage || chaseSelected?.id === snapshot.mine?.id;
  const chaseStations = snapshot.stations.filter(
    (chaseStation) =>
      (chaseFilter === "all" || chaseStation.live) &&
      `${chaseStation.name} ${ChaseFrequency(chaseStation.frequency)}`
        .toLowerCase()
        .includes(chaseSearch.toLowerCase()),
  );
  useEffect(() => {
    const chaseStation = snapshot.stations.find(
      (chaseItem) => chaseItem.id === snapshot.tunedStationId,
    );
    if (chaseStation) {
      chaseSetSelectedId(chaseStation.id);
      chaseSetFrequency(chaseStation.frequency);
    }
  }, [snapshot.tunedStationId]);
  return (
    <div className="chase-discover">
      <div className="chase-discover-columns">
        <section className="chase-discover-directory">
          <div className="chase-section-intro">
            <h1>Find your frequency</h1>
            <p>Live stations across San Andreas.</p>
          </div>
          <div className="chase-discover-search">
            <label className="chase-search">
              <ChaseIcon name="search" />
              <input
                aria-label="Search stations"
                placeholder="Search station name or frequency…"
                value={chaseSearch}
                onChange={(chaseEvent) =>
                  chaseSetSearch(chaseEvent.target.value)
                }
              />
            </label>
            <button
              className={`chase-button ${chaseFilter === "live" ? "chase-primary" : "chase-secondary"}`}
              aria-pressed={chaseFilter === "live"}
              onClick={() => chaseSetFilter("live")}
            >
              Live now
            </button>
            <button
              className={`chase-button ${chaseFilter === "all" ? "chase-primary" : "chase-secondary"}`}
              aria-pressed={chaseFilter === "all"}
              onClick={() => chaseSetFilter("all")}
            >
              All stations
            </button>
          </div>
          <div className="chase-broadcast-list">
            {chaseStations.length ? (
              chaseStations.map((chaseStation) => (
                <button
                  key={chaseStation.id}
                  className={`chase-broadcast-card ${chaseSelectedId === chaseStation.id ? "chase-broadcast-selected" : ""}`}
                  aria-pressed={chaseSelectedId === chaseStation.id}
                  onClick={() => {
                    chaseSetSelectedId(chaseStation.id);
                    chaseSetFrequency(chaseStation.frequency);
                  }}
                >
                  <ChaseStationArt station={chaseStation} />
                  <div className="chase-broadcast-name">
                    <h2>{chaseStation.name}</h2>
                    <p>
                      {chaseStation.tagline ||
                        "Independent radio. San Andreas."}
                    </p>
                  </div>
                  <div className="chase-broadcast-frequency">
                    <strong>{ChaseFrequency(chaseStation.frequency)} FM</strong>
                    <ChaseStatus live={chaseStation.live}>
                      {chaseStation.live ? "Live now" : "Off air"}
                    </ChaseStatus>
                  </div>
                  <span className="chase-list-strength">
                    {snapshot.tunedStationId === chaseStation.id
                      ? ChaseReceptionLabel(quality)
                      : "—"}
                  </span>
                </button>
              ))
            ) : (
              <ChaseEmpty title="No stations found">
                Try another name or frequency, or switch to all stations.
              </ChaseEmpty>
            )}
          </div>
        </section>
        <aside className="chase-discover-detail">
          {chaseSelected ? (
            <>
              <ChaseStationArt
                station={chaseSelected}
                className="chase-station-cover"
              />
              <h2>{chaseSelected.name}</h2>
              <p>{chaseSelected.tagline || "Independent sound. Open roads."}</p>
              <div className="chase-station-program">
                <strong>
                  {chaseSelected.showTitle || "No show scheduled"}
                </strong>
                <span>
                  {chaseSelected.hostName
                    ? `with ${chaseSelected.hostName}`
                    : chaseSelected.live
                      ? "Station broadcast"
                      : "Currently off air"}
                </span>
              </div>
              <div className="chase-list-now">
                <span className="chase-eyebrow">NOW PLAYING</span>
                <strong>
                  {chaseSelected.nowPlaying?.title ||
                    (chaseSelected.micLive
                      ? "Live microphone"
                      : "Nothing playing")}
                </strong>
              </div>
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
                <ChaseIcon name="broadcast" />
                {chaseTuned ? "Disconnect receiver" : "Tune in"}
              </button>
              <div className="chase-station-actions">
                <button
                  className="chase-button chase-secondary"
                  onClick={() => chaseSetDialog("message")}
                >
                  <ChaseIcon name="music" />
                  Request a song
                </button>
                <button
                  className="chase-button chase-secondary"
                  disabled={chaseOwn}
                  title={
                    chaseOwn ? "You cannot tip your own station" : undefined
                  }
                  onClick={() => chaseSetDialog("tip")}
                >
                  <ChaseIcon name="heart" />
                  Send a tip
                </button>
              </div>
              {chaseOwn && (
                <p className="chase-caption">
                  You own or operate this station. Tips are for other listeners.
                </p>
              )}
              <ChaseCallControls
                snapshot={snapshot}
                station={chaseSelected}
                action={action}
                busy={busy}
              />
            </>
          ) : (
            <ChaseEmpty title="Select a station">
              Choose a station to see its show and tune in.
            </ChaseEmpty>
          )}
        </aside>
      </div>
      <section className="chase-discover-tuner">
        <div>
          <h3>Manual tuning</h3>
          <p>Enter a frequency to tune directly.</p>
        </div>
        <ChaseTuneForm
          snapshot={snapshot}
          frequency={chaseFrequency}
          setFrequency={chaseSetFrequency}
          action={action}
          busy={busy}
          label="Tune"
        />
        <details className="chase-receiver-options">
          <summary>
            <ChaseIcon name="radio" />
            <span>
              {snapshot.devices?.active === "portable"
                ? "Field Radio"
                : snapshot.devices?.active === "vehicle"
                  ? "Dash Receiver"
                  : snapshot.devices?.active === "buds"
                    ? "Signalbuds"
                    : "No receiver equipped"}
              <small>Manage receiver</small>
            </span>
            <ChaseIcon name="settings" size={18} />
          </summary>
          <ChaseDeviceControls
            snapshot={snapshot}
            action={action}
            busy={busy}
          />
        </details>
      </section>
      {chaseDialog === "message" && chaseSelected && (
        <ChaseRequestDialog
          snapshot={snapshot}
          station={chaseSelected}
          action={action}
          busy={busy}
          close={() => chaseSetDialog(null)}
        />
      )}
      {chaseDialog === "tip" && chaseSelected && (
        <ChaseTipDialog
          snapshot={snapshot}
          station={chaseSelected}
          action={action}
          busy={busy}
          close={() => chaseSetDialog(null)}
        />
      )}
    </div>
  );
}
