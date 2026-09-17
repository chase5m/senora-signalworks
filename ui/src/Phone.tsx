import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChaseEmpty, ChaseIcon, ChaseStatus, ChaseToast } from "./components";
import { ChaseRequestDialog, ChaseTipDialog, ChaseTuneForm } from "./Listen";
import {
  chaseDeviceImages,
  chaseDeviceLabels,
  ChasePlaceButton,
} from "./Devices";
import { ChaseCallControls } from "./Call";
import { ChaseSpeechIndicator } from "./Speech";
import {
  ChaseCreateStation,
  ChaseModeControl,
  ChaseMusic,
  ChaseRequests,
  ChaseStationSettings,
  ChaseStudioPeople,
  ChaseTransmitter,
  chaseStageLabels,
} from "./Studio";
import { ChaseFrequency } from "./transport";
import type {
  ChaseAction,
  ChaseDevice,
  ChasePhoneTab,
  ChaseSnapshot,
  ChaseSpeech,
  ChaseStation,
  ChaseTalk,
  ChaseTone,
} from "./types";
import "./phone.css";
const chasePhoneTabs: {
  id: ChasePhoneTab;
  label: string;
  icon: string;
}[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "listen", label: "Listen", icon: "radio" },
  { id: "stations", label: "Stations", icon: "broadcast" },
  { id: "devices", label: "Devices", icon: "headphones" },
  { id: "studio", label: "Studio", icon: "studio" },
];
export function ChasePhoneApp({
  snapshot,
  loading,
  busy,
  error,
  speech,
  talkKey,
  talk,
  quality,
  volume,
  toast,
  action,
  bootstrap,
  changeVolume,
  saveVolume,
  dismissToast,
  callPopup,
}: {
  snapshot: ChaseSnapshot | null;
  loading: boolean;
  busy: boolean;
  error: string;
  speech: ChaseSpeech | null;
  talkKey?: string;
  talk: ChaseTalk;
  quality: number | null;
  volume: number;
  toast: {
    message: string;
    tone: ChaseTone;
  } | null;
  action: ChaseAction;
  bootstrap: () => void;
  changeVolume: (value: number) => void;
  saveVolume: () => void;
  dismissToast: () => void;
  callPopup: ReactNode;
}) {
  const [chaseTab, chaseSetTab] = useState<ChasePhoneTab>("home");
  const [chaseSelectedId, chaseSetSelectedId] = useState<number | null>(null);
  const chaseContentRef = useRef<HTMLDivElement | null>(null);
  const chaseTunedId = snapshot?.tunedStationId ?? null;
  const chaseTunedRef = useRef<number | null>(chaseTunedId);
  const chaseCanOperate = snapshot?.viewer.canOperate === true;
  const chaseTabs = chasePhoneTabs.filter(
    (chaseItem) => chaseItem.id !== "studio" || chaseCanOperate,
  );
  const chaseCurrentTab =
    chaseTab === "studio" && !chaseCanOperate ? "home" : chaseTab;
  useEffect(() => {
    chaseContentRef.current?.scrollTo(0, 0);
  }, [chaseCurrentTab]);
  useEffect(() => {
    if (chaseTunedRef.current === chaseTunedId) return;
    chaseTunedRef.current = chaseTunedId;
    if (chaseTunedId !== null) chaseSetSelectedId(chaseTunedId);
  }, [chaseTunedId]);
  const chaseTuned = snapshot?.stations.find(
    (chaseStation) => chaseStation.id === chaseTunedId,
  );
  const chaseSelected =
    snapshot?.stations.find(
      (chaseStation) => chaseStation.id === chaseSelectedId,
    ) ??
    chaseTuned ??
    snapshot?.stations[0];
  const chaseOnAir =
    speech?.local.micOpen === true || snapshot?.viewer.call.state === "onair";
  const chasePillLabel = chaseOnAir
    ? "On air"
    : chaseTuned
      ? `${ChaseFrequency(chaseTuned.frequency)} FM`
      : chaseTunedId !== null
        ? "Tuned"
        : "Off air";
  const chaseNowPlaying = chaseTuned?.nowPlaying?.title || "";
  const chaseActiveDevice: ChaseDevice | null =
    snapshot?.devices && snapshot.devices.active !== "none"
      ? snapshot.devices.active
      : null;
  return (
    <div className="chase-phone">
      {callPopup}
      <header className="chase-phone-header">
        <div className="chase-phone-header-row">
          <h1 className="chase-phone-title">
            {chasePhoneTabs.find(
              (chaseItem) => chaseItem.id === chaseCurrentTab,
            )?.label ?? "Home"}
          </h1>
          <span
            className={`chase-phone-pill ${chaseOnAir ? "chase-phone-pill-onair" : chaseTunedId !== null ? "chase-phone-pill-tuned" : ""}`}
            role="status"
          >
            <i />
            {chasePillLabel}
          </span>
        </div>
        <ChaseSpeechIndicator speech={speech} talkKey={talkKey} talk={talk} />
      </header>
      <main className="chase-phone-content" ref={chaseContentRef}>
        {error ? (
          <div className="chase-connection-error" role="alert">
            <strong>Connection interrupted</strong>
            <p>{error}</p>
            <button
              className="chase-button chase-secondary"
              onClick={bootstrap}
            >
              Reconnect
            </button>
          </div>
        ) : null}
        {snapshot ? (
          <fieldset
            className="chase-view-fieldset"
            disabled={busy}
            aria-busy={busy}
          >
            <div className="chase-phone-panel" key={chaseCurrentTab}>
              {chaseCurrentTab === "home" ? (
                <ChasePhoneHome
                  snapshot={snapshot}
                  tuned={chaseTuned}
                  tunedId={chaseTunedId}
                  onAir={chaseOnAir}
                  quality={quality}
                  go={chaseSetTab}
                />
              ) : chaseCurrentTab === "listen" ? (
                <ChasePhoneListen
                  snapshot={snapshot}
                  station={chaseSelected}
                  action={action}
                  busy={busy}
                  quality={quality}
                />
              ) : chaseCurrentTab === "stations" ? (
                <ChasePhoneStations
                  snapshot={snapshot}
                  selectedId={chaseSelected?.id ?? null}
                  action={action}
                  busy={busy || loading}
                  refresh={bootstrap}
                  select={(chaseId) => {
                    chaseSetSelectedId(chaseId);
                    chaseSetTab("listen");
                  }}
                />
              ) : chaseCurrentTab === "devices" ? (
                <ChasePhoneDevices
                  snapshot={snapshot}
                  action={action}
                  busy={busy}
                />
              ) : (
                <ChasePhoneStudio
                  snapshot={snapshot}
                  action={action}
                  busy={busy}
                />
              )}
            </div>
          </fieldset>
        ) : loading ? (
          <div className="chase-loading" role="status">
            <ChaseIcon name="radio" size={36} />
            <h2>Connecting…</h2>
            <p>Loading your station directory.</p>
          </div>
        ) : !error ? (
          <ChaseEmpty title="The receiver is waiting">
            Reconnect to load your station directory.
          </ChaseEmpty>
        ) : null}
      </main>
      <ChaseToast toast={toast} dismiss={dismissToast} />
      <div className="chase-phone-mini" aria-label="Tuned station">
        <div className="chase-phone-mini-row">
          <span className="chase-phone-mini-device">
            {chaseActiveDevice ? (
              <img
                src={chaseDeviceImages[chaseActiveDevice]}
                alt={chaseDeviceLabels[chaseActiveDevice]}
              />
            ) : (
              <ChaseIcon name="radio" size={20} />
            )}
          </span>
          {chaseTunedId !== null ? (
            <>
              <div className="chase-phone-mini-text">
                <strong>{chaseTuned?.name || "Unlisted frequency"}</strong>
                <span>
                  {chaseTuned
                    ? `${ChaseFrequency(chaseTuned.frequency)} FM`
                    : "Direct tune"}
                  {chaseNowPlaying ? ` · ${chaseNowPlaying}` : ""}
                </span>
              </div>
              <ChasePhoneSignal quality={quality} />
              <button
                className="chase-phone-mini-stop"
                aria-label="Disconnect receiver"
                disabled={busy}
                onClick={() =>
                  void action("untune", {}, "Receiver disconnected.")
                }
              >
                <ChaseIcon name="stop" size={18} />
              </button>
            </>
          ) : (
            <div className="chase-phone-mini-text">
              <strong>Nothing tuned in</strong>
              <span>
                {chaseActiveDevice
                  ? `${chaseDeviceLabels[chaseActiveDevice]} ready`
                  : "Pick a station to connect."}
              </span>
            </div>
          )}
        </div>
        {chaseTunedId !== null ? (
          <div className="chase-phone-mini-volume">
            <ChaseIcon name="volume" size={16} />
            <label
              className="chase-visually-hidden"
              htmlFor="chase-phone-volume"
            >
              Listening volume
            </label>
            <input
              id="chase-phone-volume"
              type="range"
              min="0"
              max="100"
              step="1"
              value={volume}
              onChange={(chaseEvent) =>
                changeVolume(Number(chaseEvent.target.value))
              }
              onPointerUp={saveVolume}
              onKeyUp={(chaseEvent) => {
                if (
                  [
                    "ArrowLeft",
                    "ArrowRight",
                    "ArrowUp",
                    "ArrowDown",
                    "Home",
                    "End",
                  ].includes(chaseEvent.key)
                )
                  saveVolume();
              }}
            />
            <span>{volume}%</span>
          </div>
        ) : null}
      </div>
      <nav className="chase-phone-nav" aria-label="Radio sections">
        {chaseTabs.map((chaseItem) => (
          <button
            key={chaseItem.id}
            className={
              chaseCurrentTab === chaseItem.id ? "chase-phone-nav-active" : ""
            }
            aria-current={chaseCurrentTab === chaseItem.id ? "page" : undefined}
            onClick={() => chaseSetTab(chaseItem.id)}
          >
            <ChaseIcon name={chaseItem.icon} size={22} />
            <span>{chaseItem.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
function ChasePhoneSignal({ quality }: { quality: number | null }) {
  const chaseLevel =
    quality === null
      ? 0
      : Math.max(1, Math.round(Math.max(0, Math.min(1, quality)) * 4));
  return (
    <span
      className="chase-phone-signal"
      role="img"
      aria-label={
        quality === null
          ? "Reception unavailable"
          : `${Math.round(quality * 100)} percent reception`
      }
    >
      {[1, 2, 3, 4].map((chaseBar) => (
        <i
          key={chaseBar}
          className={chaseBar <= chaseLevel ? "chase-phone-signal-on" : ""}
        />
      ))}
    </span>
  );
}
function ChasePhoneHome({
  snapshot,
  tuned,
  tunedId,
  onAir,
  quality,
  go,
}: {
  snapshot: ChaseSnapshot;
  tuned: ChaseStation | undefined;
  tunedId: number | null;
  onAir: boolean;
  quality: number | null;
  go: (tab: ChasePhoneTab) => void;
}) {
  const chaseLive = snapshot.stations.filter(
    (chaseStation) => chaseStation.live,
  ).length;
  const chaseDevices = snapshot.devices;
  const chaseActive =
    chaseDevices && chaseDevices.active !== "none"
      ? chaseDeviceLabels[chaseDevices.active]
      : "Nothing equipped";
  const chasePercent =
    quality === null
      ? null
      : Math.round(Math.max(0, Math.min(1, quality)) * 100);
  return (
    <>
      <section className="chase-phone-hero">
        <div className="chase-phone-brand" aria-label="Senora Signalworks">
          <span className="chase-phone-brand-mark">
            <ChaseIcon name="broadcast" size={18} />
          </span>
          <span className="chase-phone-eyebrow">Senora Signalworks</span>
        </div>
        <h2 className="chase-phone-welcome">
          Welcome back, {snapshot.viewer.name || "listener"}
        </h2>
      </section>
      <button
        type="button"
        className="chase-phone-card chase-phone-status"
        onClick={() => go("listen")}
      >
        <span className="chase-phone-card-head">
          <span className="chase-phone-eyebrow">Receiver</span>
          <ChaseStatus live={tunedId !== null}>
            {onAir ? "ON AIR" : tunedId !== null ? "CONNECTED" : "STANDBY"}
          </ChaseStatus>
        </span>
        <strong className="chase-phone-status-name">
          {tuned?.name || (tunedId !== null ? "Unlisted frequency" : "Off air")}
        </strong>
        <span className="chase-phone-status-line">
          {tuned
            ? `${ChaseFrequency(tuned.frequency)} FM · ${
                tuned.micLive && tuned.hostName
                  ? `${tuned.hostName} on the mic`
                  : tuned.showTitle || "Independent radio"
              }`
            : tunedId !== null
              ? "Direct tune"
              : "Pick a station to connect."}
        </span>
        {tunedId !== null ? (
          <span className="chase-phone-status-signal">
            <ChasePhoneSignal quality={quality} />
            <span>
              {chasePercent === null
                ? "No reception data"
                : `${chasePercent}% signal`}
            </span>
          </span>
        ) : null}
      </button>
      <div className="chase-phone-tiles">
        <button
          type="button"
          className="chase-phone-tile"
          onClick={() => go("listen")}
        >
          <img src={chaseDeviceImages.buds} alt="" />
          <strong>Listen</strong>
          <span>{tunedId !== null ? "Now connected" : "Tune a frequency"}</span>
        </button>
        <button
          type="button"
          className="chase-phone-tile"
          onClick={() => go("stations")}
        >
          <img src={chaseDeviceImages.vehicle} alt="" />
          <strong>Stations</strong>
          <span>
            {chaseLive} live · {snapshot.stations.length} listed
          </span>
        </button>
        <button
          type="button"
          className="chase-phone-tile"
          onClick={() => go("devices")}
        >
          <img src={chaseDeviceImages.portable} alt="" />
          <strong>Devices</strong>
          <span>{chaseActive}</span>
        </button>
        {snapshot.viewer.canOperate ? (
          <button
            type="button"
            className="chase-phone-tile"
            onClick={() => go("studio")}
          >
            <span className="chase-phone-tile-icon">
              <ChaseIcon name="studio" size={26} />
            </span>
            <strong>Studio</strong>
            <span>
              {snapshot.mine
                ? snapshot.mine.live
                  ? "Broadcast active"
                  : chaseStageLabels[snapshot.mine.stage]
                : "Create a station"}
            </span>
          </button>
        ) : null}
      </div>
    </>
  );
}
function ChasePhoneListen({
  snapshot,
  station,
  action,
  busy,
  quality,
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation | undefined;
  action: ChaseAction;
  busy: boolean;
  quality: number | null;
}) {
  const [chaseFrequency, chaseSetFrequency] = useState(
    station?.frequency ?? snapshot.config.frequencyMin,
  );
  const [chaseDialog, chaseSetDialog] = useState<"message" | "tip" | null>(
    null,
  );
  const chaseTuned = Boolean(station && snapshot.tunedStationId === station.id);
  const chaseOwn = Boolean(station && station.id === snapshot.mine?.id);
  const chasePercent =
    quality === null
      ? null
      : Math.round(Math.max(0, Math.min(1, quality)) * 100);
  return (
    <>
      <section className="chase-phone-card">
        <div className="chase-phone-card-head">
          <span className="chase-phone-eyebrow">Manual tuning</span>
          <span className="chase-phone-status-signal">
            <ChasePhoneSignal quality={quality} />
            <span>
              {chasePercent === null ? "No signal data" : `${chasePercent}%`}
            </span>
          </span>
        </div>
        <div className="chase-phone-frequency">
          <strong>{ChaseFrequency(chaseFrequency)}</strong>
          <span>MHz</span>
        </div>
        <ChaseTuneForm
          snapshot={snapshot}
          frequency={chaseFrequency}
          setFrequency={chaseSetFrequency}
          action={action}
          busy={busy}
          label="Tune"
        />
        <span className="chase-phone-hint">
          {ChaseFrequency(snapshot.config.frequencyMin)} –{" "}
          {ChaseFrequency(snapshot.config.frequencyMax)} MHz · public and
          unlisted stations
        </span>
      </section>
      {station ? (
        <section className="chase-phone-card">
          <div className="chase-phone-card-head">
            <span className="chase-phone-eyebrow">
              {chaseTuned ? "Tuned in" : "Selected station"}
            </span>
            <ChaseStatus live={station.live}>
              {station.live ? "ON AIR" : "OFF AIR"}
            </ChaseStatus>
          </div>
          <div className="chase-phone-station-title">
            <h2>{station.name}</h2>
            <span className="chase-phone-station-frequency">
              {ChaseFrequency(station.frequency)}
              <small>FM</small>
            </span>
          </div>
          <p>{station.tagline || "No station description."}</p>
          <dl className="chase-phone-details">
            <div>
              <dt>Show</dt>
              <dd>{station.showTitle || "No show scheduled"}</dd>
            </div>
            <div>
              <dt>Host</dt>
              <dd>{station.hostName || "No host"}</dd>
            </div>
            <div>
              <dt>Co-hosts</dt>
              <dd>
                {station.cohostNames.length
                  ? station.cohostNames.join(", ")
                  : "None"}
              </dd>
            </div>
            <div>
              <dt>Listeners</dt>
              <dd>{station.listeners} tuned in</dd>
            </div>
          </dl>
          <button
            className={`chase-button ${chaseTuned ? "chase-secondary" : "chase-primary"} chase-full`}
            disabled={busy || (!station.live && !chaseTuned)}
            onClick={() =>
              void action(
                chaseTuned ? "untune" : "tune",
                chaseTuned ? {} : { stationId: station.id },
                chaseTuned ? "Receiver disconnected." : "Receiver tuned.",
              )
            }
          >
            <ChaseIcon name={chaseTuned ? "stop" : "play"} size={17} />
            {chaseTuned ? "Disconnect receiver" : "Listen in"}
          </button>
          {!chaseOwn ? (
            <ChaseCallControls
              snapshot={snapshot}
              station={station}
              action={action}
              busy={busy}
            />
          ) : null}
          <div className="chase-phone-actions">
            <button
              className="chase-button chase-secondary"
              onClick={() => chaseSetDialog("message")}
            >
              <ChaseIcon name="message" size={18} />
              Message studio
            </button>
            {!chaseOwn ? (
              <button
                className="chase-button chase-secondary"
                onClick={() => chaseSetDialog("tip")}
              >
                <ChaseIcon name="money" size={18} />
                Tip station
              </button>
            ) : null}
          </div>
        </section>
      ) : (
        <section className="chase-phone-card">
          <ChaseEmpty title="No stations listed">
            Tune a frequency directly or check back when a station goes live.
          </ChaseEmpty>
        </section>
      )}
      {chaseDialog === "message" && station ? (
        <ChaseRequestDialog
          snapshot={snapshot}
          station={station}
          action={action}
          busy={busy}
          close={() => chaseSetDialog(null)}
        />
      ) : null}
      {chaseDialog === "tip" && station ? (
        <ChaseTipDialog
          snapshot={snapshot}
          station={station}
          action={action}
          busy={busy}
          close={() => chaseSetDialog(null)}
        />
      ) : null}
    </>
  );
}
function ChasePhoneStations({
  snapshot,
  selectedId,
  action,
  busy,
  refresh,
  select,
}: {
  snapshot: ChaseSnapshot;
  selectedId: number | null;
  action: ChaseAction;
  busy: boolean;
  refresh: () => void;
  select: (stationId: number) => void;
}) {
  const [chaseSearch, chaseSetSearch] = useState("");
  const chaseCanTune = !snapshot.devices || snapshot.devices.active !== "none";
  const chaseLive = snapshot.stations.filter(
    (chaseStation) => chaseStation.live,
  ).length;
  const chaseStations = snapshot.stations.filter((chaseStation) =>
    `${chaseStation.name} ${chaseStation.hostName || ""} ${ChaseFrequency(chaseStation.frequency)}`
      .toLowerCase()
      .includes(chaseSearch.trim().toLowerCase()),
  );
  return (
    <>
      <label className="chase-search chase-phone-search">
        <ChaseIcon name="search" size={19} />
        <input
          aria-label="Search stations"
          placeholder="Search station, host or frequency"
          value={chaseSearch}
          onChange={(chaseEvent) => chaseSetSearch(chaseEvent.target.value)}
        />
      </label>
      <div className="chase-phone-list-head">
        <div>
          <span className="chase-phone-eyebrow">Stations</span>
          <span className="chase-phone-hint">
            {chaseLive} live · {snapshot.stations.length} listed
          </span>
        </div>
        <button
          className="chase-icon-button"
          aria-label="Refresh station data"
          disabled={busy}
          onClick={refresh}
        >
          <ChaseIcon name="refresh" size={18} />
        </button>
      </div>
      {!chaseCanTune ? (
        <p className="chase-phone-note">
          <ChaseIcon name="headphones" size={18} />
          Equip a receiver in Devices to tune in.
        </p>
      ) : null}
      {chaseStations.length ? (
        <div className="chase-phone-station-list">
          {chaseStations.map((chaseStation) => {
            const chaseConnected = snapshot.tunedStationId === chaseStation.id;
            return (
              <article
                key={chaseStation.id}
                className={`chase-phone-station-row ${selectedId === chaseStation.id ? "chase-phone-station-selected" : ""}`}
              >
                <button
                  type="button"
                  className="chase-phone-station-main"
                  aria-pressed={selectedId === chaseStation.id}
                  onClick={() => select(chaseStation.id)}
                >
                  <span className="chase-phone-station-text">
                    <strong>{chaseStation.name}</strong>
                    <span>
                      {chaseStation.micLive && chaseStation.hostName
                        ? `${chaseStation.hostName} on the mic`
                        : chaseStation.hostName
                          ? `Host ${chaseStation.hostName}`
                          : "No host"}
                    </span>
                  </span>
                  <span className="chase-phone-station-meta">
                    <span className="chase-phone-station-frequency">
                      {ChaseFrequency(chaseStation.frequency)}
                      <small>FM</small>
                    </span>
                    <ChaseStatus live={chaseStation.live}>
                      {chaseStation.live ? "LIVE" : "OFF AIR"}
                    </ChaseStatus>
                  </span>
                </button>
                <button
                  type="button"
                  className={`chase-button ${chaseConnected ? "chase-secondary" : "chase-primary"} chase-phone-station-tune`}
                  disabled={
                    busy ||
                    !chaseStation.live ||
                    !chaseCanTune ||
                    chaseConnected
                  }
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
                  {chaseConnected ? "Tuned" : "Tune in"}
                </button>
              </article>
            );
          })}
        </div>
      ) : (
        <ChaseEmpty
          title={
            snapshot.stations.length
              ? "No matching stations"
              : "No stations listed"
          }
        >
          {snapshot.stations.length
            ? "Try another station name, host or frequency."
            : "Stations appear here when they start broadcasting."}
        </ChaseEmpty>
      )}
    </>
  );
}
function ChasePhoneDevices({
  snapshot,
  action,
  busy,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
}) {
  const chaseDevices = snapshot.devices;
  if (!chaseDevices)
    return (
      <section className="chase-phone-card">
        <ChaseEmpty icon="headphones" title="No receivers to manage">
          This server tunes stations without receiver items.
        </ChaseEmpty>
      </section>
    );
  const chasePlaced = chaseDevices.placedNearby || [];
  function ChaseStatusLine(device: ChaseDevice) {
    const chaseOwned = chaseDevices!.owned[device];
    if (device === "vehicle")
      return chaseDevices!.vehicle.installed
        ? chaseDevices!.vehicle.canControl
          ? "Installed in this vehicle"
          : "Installed · take a seat to control"
        : chaseOwned > 0
          ? chaseDevices!.vehicle.canInstall
            ? "Ready to install in this vehicle"
            : "Sit in the driver’s seat to install"
          : "Not owned";
    if (chaseDevices!.active === device)
      return device === "portable"
        ? `Equipped · carried in ${chaseDevices!.carry}`
        : "Equipped";
    return chaseOwned > 0 ? "In your inventory" : "Not owned";
  }
  return (
    <>
      <div className="chase-phone-list-head">
        <div>
          <span className="chase-phone-eyebrow">Listening device</span>
          <span className="chase-phone-hint">
            {chaseDevices.active === "none"
              ? "Nothing equipped"
              : `${chaseDeviceLabels[chaseDevices.active]} equipped`}
          </span>
        </div>
      </div>
      {(["portable", "buds", "vehicle"] as const).map((chaseDevice) => {
        const chaseActive = chaseDevices.active === chaseDevice;
        const chaseOwned = chaseDevices.owned[chaseDevice];
        const chaseSelectable =
          chaseDevice === "vehicle"
            ? chaseDevices.vehicle.installed && chaseDevices.vehicle.canControl
            : chaseOwned > 0;
        return (
          <article
            key={chaseDevice}
            className={`chase-phone-card chase-phone-device ${chaseActive ? "chase-phone-device-active" : ""}`}
          >
            <div className="chase-phone-device-row">
              <img
                className="chase-phone-device-art"
                src={chaseDeviceImages[chaseDevice]}
                alt=""
              />
              <div className="chase-phone-device-text">
                <strong>{chaseDeviceLabels[chaseDevice]}</strong>
                <span>{ChaseStatusLine(chaseDevice)}</span>
              </div>
              <span className="chase-phone-chip">
                {chaseDevice === "vehicle" && chaseDevices.vehicle.installed
                  ? "Installed"
                  : `${chaseOwned} owned`}
              </span>
            </div>
            <div className="chase-phone-device-actions">
              {chaseActive ? (
                <button
                  type="button"
                  className="chase-button chase-secondary"
                  disabled={busy}
                  onClick={() =>
                    void action(
                      "equipDevice",
                      { device: "none" },
                      "Receiver put away.",
                    )
                  }
                >
                  Put away
                </button>
              ) : (
                <button
                  type="button"
                  className="chase-button chase-primary"
                  disabled={busy || !chaseSelectable}
                  onClick={() =>
                    void action(
                      "equipDevice",
                      { device: chaseDevice, carry: chaseDevices.carry },
                      "Receiver selected.",
                    )
                  }
                >
                  Select
                </button>
              )}
              {chaseDevice === "vehicle" &&
              !chaseDevices.vehicle.installed &&
              chaseOwned > 0 ? (
                <button
                  type="button"
                  className="chase-button chase-secondary"
                  disabled={
                    busy ||
                    !chaseDevices.vehicle.canInstall ||
                    !chaseDevices.vehicle.netId
                  }
                  onClick={() =>
                    void action(
                      "installReceiver",
                      { netId: chaseDevices.vehicle.netId },
                      "Dash Receiver installed.",
                    )
                  }
                >
                  <ChaseIcon name="van" size={18} />
                  Install
                </button>
              ) : null}
              {chaseDevice === "portable" ? (
                <ChasePlaceButton
                  snapshot={snapshot}
                  action={action}
                  busy={busy}
                />
              ) : null}
            </div>
            {chaseDevice === "portable" && chaseActive ? (
              <div className="chase-phone-carry">
                <span className="chase-phone-eyebrow">Carry position</span>
                <div className="chase-segmented">
                  {(["hand", "shoulder"] as const).map((chaseCarry) => (
                    <button
                      key={chaseCarry}
                      type="button"
                      aria-pressed={chaseDevices.carry === chaseCarry}
                      className={
                        chaseDevices.carry === chaseCarry
                          ? "chase-selected"
                          : ""
                      }
                      disabled={busy}
                      onClick={() =>
                        void action(
                          "equipDevice",
                          { device: "portable", carry: chaseCarry },
                          "Carry position updated.",
                        )
                      }
                    >
                      {chaseCarry === "hand" ? "Hand" : "Shoulder"}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
      {chasePlaced.length ? (
        <section className="chase-phone-card">
          <div className="chase-phone-card-head">
            <span className="chase-phone-eyebrow">Radios nearby</span>
            <span className="chase-phone-chip">{chasePlaced.length}</span>
          </div>
          {chasePlaced.map((chaseRadio) => (
            <div className="chase-phone-placed-row" key={chaseRadio.netId}>
              <img src={chaseDeviceImages.portable} alt="" />
              <div className="chase-phone-device-text">
                <strong>{chaseRadio.label}</strong>
                <span>
                  {chaseRadio.frequency
                    ? `${ChaseFrequency(chaseRadio.frequency)} FM · `
                    : ""}
                  placed by {chaseRadio.ownerName || "someone"}
                </span>
              </div>
              <button
                type="button"
                className="chase-button chase-secondary"
                disabled={busy}
                onClick={() =>
                  void action(
                    "pickupRadio",
                    { netId: chaseRadio.netId },
                    "Field Radio picked up.",
                  )
                }
              >
                <ChaseIcon name="hand" size={18} />
                Pick up
              </button>
            </div>
          ))}
        </section>
      ) : null}
      {chaseDevices.active === "none" ? (
        <p className="chase-phone-hint">
          Equip a receiver to listen. Buy one from the Senora kiosk vendor in
          Legion Square.
        </p>
      ) : null}
    </>
  );
}
function ChasePhoneStudio({
  snapshot,
  action,
  busy,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
}) {
  const [chaseOpen, chaseSetOpen] = useState<Record<string, boolean>>({
    music: true,
  });
  const chaseMine = snapshot.mine;
  if (!chaseMine)
    return (
      <ChaseCreateStation snapshot={snapshot} action={action} busy={busy} />
    );
  const chasePending = snapshot.requests.filter(
    (chaseRequest) => chaseRequest.status === "pending",
  ).length;
  const chaseQueued = chaseMine.queue?.length ?? 0;
  function ChaseToggle(id: string) {
    chaseSetOpen((chaseCurrent) => ({
      ...chaseCurrent,
      [id]: !chaseCurrent[id],
    }));
  }
  return (
    <>
      <section className="chase-phone-card">
        <div className="chase-phone-card-head">
          <span className="chase-phone-eyebrow">Your station</span>
          <ChaseStatus live={chaseMine.live}>
            {chaseMine.live ? "ON AIR" : "OFF AIR"}
          </ChaseStatus>
        </div>
        <div className="chase-phone-station-title">
          <h2>{chaseMine.name}</h2>
          <span className="chase-phone-station-frequency">
            {ChaseFrequency(chaseMine.frequency)}
            <small>FM</small>
          </span>
        </div>
        <p>
          {chaseStageLabels[chaseMine.stage]} · {chaseMine.listeners} listening
        </p>
        <ChaseStudioPeople station={chaseMine} action={action} busy={busy} />
      </section>
      <ChaseTransmitter
        snapshot={snapshot}
        station={chaseMine}
        action={action}
        busy={busy}
      />
      <ChasePhoneSection
        eyebrow="Playlist"
        title="Music queue"
        count={chaseQueued}
        open={chaseOpen.music === true}
        toggle={() => ChaseToggle("music")}
      >
        <ChaseMusic
          snapshot={snapshot}
          station={chaseMine}
          action={action}
          busy={busy}
          heading={false}
        />
      </ChasePhoneSection>
      <ChasePhoneSection
        eyebrow="Listener mail"
        title="Inbox"
        count={chasePending}
        open={chaseOpen.inbox === true}
        toggle={() => ChaseToggle("inbox")}
      >
        <ChaseRequests
          snapshot={snapshot}
          action={action}
          busy={busy}
          heading={false}
        />
      </ChasePhoneSection>
      <ChasePhoneSection
        eyebrow="Station"
        title="Settings"
        open={chaseOpen.settings === true}
        toggle={() => ChaseToggle("settings")}
      >
        <ChasePhoneSettings
          key={chaseMine.id}
          snapshot={snapshot}
          station={chaseMine}
          action={action}
          busy={busy}
        />
      </ChasePhoneSection>
    </>
  );
}
function ChasePhoneSection({
  eyebrow,
  title,
  count,
  open,
  toggle,
  children,
}: {
  eyebrow: string;
  title: string;
  count?: number;
  open: boolean;
  toggle: () => void;
  children: ReactNode;
}) {
  return (
    <section
      className={`chase-phone-section ${open ? "chase-phone-section-open" : ""}`}
    >
      <button
        type="button"
        className="chase-phone-section-toggle"
        aria-expanded={open}
        onClick={toggle}
      >
        <span className="chase-phone-section-title">
          <span className="chase-phone-eyebrow">{eyebrow}</span>
          <strong>{title}</strong>
        </span>
        {count ? <span className="chase-phone-chip">{count}</span> : null}
        <span className="chase-phone-section-caret">
          <ChaseIcon name="caret" size={18} />
        </span>
      </button>
      <div className="chase-phone-section-inner" hidden={!open}>
        {children}
      </div>
    </section>
  );
}
function ChasePhoneSettings({
  snapshot,
  station,
  action,
  busy,
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
}) {
  const [chasePower, chaseSetPower] = useState(station.power);
  const [chasePublic, chaseSetPublic] = useState(station.isPublic);
  const chaseCanEdit =
    station.canManage && snapshot.viewer.canOperate !== false;
  return (
    <div className="chase-phone-settings">
      <ChaseModeControl
        snapshot={snapshot}
        station={station}
        action={action}
        busy={busy}
      />
      <form
        onSubmit={async (chaseEvent) => {
          chaseEvent.preventDefault();
          await action(
            "updateStation",
            {
              ...ChaseStationSettings(station),
              power: chasePower,
              isPublic: chasePublic,
            },
            "Station settings saved.",
          );
        }}
      >
        <label>
          Transmitter power
          <select
            value={chasePower}
            onChange={(chaseEvent) => chaseSetPower(chaseEvent.target.value)}
          >
            {snapshot.config.powerModes.map((chaseMode) => (
              <option key={chaseMode.id} value={chaseMode.id}>
                {chaseMode.label}
              </option>
            ))}
          </select>
        </label>
        <label className="chase-checkbox-label">
          <input
            type="checkbox"
            checked={chasePublic}
            onChange={(chaseEvent) => chaseSetPublic(chaseEvent.target.checked)}
          />
          <span>
            List in station directory
            <small>Unlisted stations can still be tuned by frequency.</small>
          </span>
        </label>
        <p className="chase-caption">
          Name, tagline and show title are edited at the studio console.
        </p>
        <button
          className="chase-button chase-primary chase-full"
          disabled={busy || !chaseCanEdit}
        >
          Save station <ChaseIcon name="check" size={17} />
        </button>
      </form>
    </div>
  );
}
