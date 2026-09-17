import { useEffect, useState } from "react";
import { ChaseEmpty, ChaseIcon, ChaseStatus } from "./components";
import {
  ChaseClock,
  ChaseError,
  ChaseFrequency,
  ChaseMoney,
} from "./transport";
import { ChaseDetectProvider, ChaseResolveTrack } from "./players";
import type {
  ChaseAction,
  ChaseSnapshot,
  ChaseStation,
  ChasePlayback,
} from "./types";
export const chaseStageLabels = {
  stored: "At the depot",
  parked: "Packed & parked",
  deploying: "Deploying rig",
  ready: "Ready to transmit",
  live: "On the air",
  packing: "Packing rig",
};
const chaseProviderLabels = {
  file: "Cartridge",
  youtube: "YouTube",
  soundcloud: "SoundCloud",
};
export function ChaseStudio({
  snapshot,
  action,
  busy,
  playback,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
  playback: ChasePlayback | null;
}) {
  const [chaseTab, chaseSetTab] = useState("console");
  const chaseMine = snapshot.mine;
  const chasePending = snapshot.requests.filter(
    (chaseRequest) => chaseRequest.status === "pending",
  ).length;
  if (!chaseMine)
    return (
      <ChaseCreateStation snapshot={snapshot} action={action} busy={busy} />
    );
  return (
    <div className="chase-studio">
      {snapshot.viewer.canOperate === false ? (
        <div className="chase-operation-note">
          <ChaseIcon name="studio" size={18} />
          <span>
            Broadcast operations require the{" "}
            {snapshot.config.broadcastJob?.name || "signalworks"} job
            {snapshot.config.broadcastJob?.requireDuty ? " while on duty" : ""}.
            You can still safely stop and store your rig.
          </span>
        </div>
      ) : null}
      <section className="chase-studio-banner">
        <div>
          <span className="chase-eyebrow">STATION</span>
          <h2>{chaseMine.name}</h2>
          <p>{chaseMine.tagline || "No station description."}</p>
          <ChaseStudioPeople station={chaseMine} action={action} busy={busy} />
        </div>
        <div className="chase-studio-frequency">
          {ChaseFrequency(chaseMine.frequency)}
          <span>FM</span>
        </div>
        <div className="chase-studio-status">
          <ChaseStatus live={chaseMine.live}>
            {chaseMine.live ? "ON AIR" : "OFF AIR"}
          </ChaseStatus>
          <span>{chaseStageLabels[chaseMine.stage]}</span>
        </div>
      </section>
      {playback?.monitor && playback.stationId === chaseMine.id ? (
        <div
          className={`chase-studio-cue chase-cue-${playback.phase}`}
          role="status"
        >
          <ChaseIcon name="headphones" size={20} />
          <div>
            <strong>
              {playback.phase === "playing"
                ? "Studio cue playing"
                : playback.phase === "loading"
                  ? "Loading studio cue"
                  : playback.phase === "blocked"
                    ? "Click inside the receiver to enable audio"
                    : "Cartridge audio unavailable"}
            </strong>
            <span>
              {playback.name}
              {playback.phase === "error"
                ? " · Play the cartridge again to retry."
                : " · Private local monitoring"}
            </span>
          </div>
        </div>
      ) : null}
      <div className="chase-studio-tabs" aria-label="Studio sections">
        {[
          { id: "console", label: "Console" },
          { id: "requests", label: "Inbox", count: chasePending },
          { id: "library", label: "Cartridges" },
          { id: "music", label: "Music" },
          { id: "crew", label: "Crew" },
          { id: "settings", label: "Station settings" },
        ].map((chaseItem) => (
          <button
            key={chaseItem.id}
            className={chaseTab === chaseItem.id ? "chase-active-tab" : ""}
            aria-pressed={chaseTab === chaseItem.id}
            onClick={() => chaseSetTab(chaseItem.id)}
          >
            {chaseItem.label}
            {chaseItem.count ? <span>{chaseItem.count}</span> : null}
          </button>
        ))}
      </div>
      {chaseTab === "console" ? (
        <ChaseConsole
          snapshot={snapshot}
          station={chaseMine}
          action={action}
          busy={busy}
        />
      ) : null}
      {chaseTab === "requests" ? (
        <ChaseRequests snapshot={snapshot} action={action} busy={busy} />
      ) : null}
      {chaseTab === "library" ? (
        <ChaseCartridges snapshot={snapshot} action={action} busy={busy} />
      ) : null}
      {chaseTab === "music" ? (
        <ChaseMusic
          snapshot={snapshot}
          station={chaseMine}
          action={action}
          busy={busy}
        />
      ) : null}
      {chaseTab === "crew" ? (
        <ChaseCrew snapshot={snapshot} action={action} busy={busy} />
      ) : null}
      {chaseTab === "settings" ? (
        <ChaseSettings
          key={chaseMine.id}
          station={chaseMine}
          snapshot={snapshot}
          action={action}
          busy={busy}
        />
      ) : null}
    </div>
  );
}
export function ChaseStudioPeople({
  station,
  action,
  busy,
}: {
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
}) {
  if (!station.micLive && !station.caller) return null;
  return (
    <div className="chase-studio-people">
      {station.micLive ? (
        <span>
          <ChaseIcon name="mic" size={14} />
          {station.hostName || "Host"}
        </span>
      ) : null}
      {station.cohostNames.map((chaseName, chaseIndex) => (
        <span key={`${chaseIndex}-${chaseName}`}>
          <ChaseIcon name="users" size={14} />
          {chaseName}
          <small>co-host</small>
        </span>
      ))}
      {station.caller ? (
        <span className="chase-studio-caller">
          <ChaseIcon name="phone" size={14} />
          {station.caller.name}
          <small>on the line</small>
        </span>
      ) : null}
      {station.caller ? (
        <button
          className="chase-text-button"
          disabled={busy || !station.canManage}
          onClick={() => void action("endCall", {}, "Caller disconnected.")}
        >
          Hang up caller
        </button>
      ) : null}
    </div>
  );
}
export function ChaseTransmitter({
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
  const chaseReady = station.stage === "ready" || station.stage === "live";
  const chaseVoiceReady = snapshot.voiceReady && snapshot.viewer.voiceReady;
  const chaseCanOperate = snapshot.viewer.canOperate !== false;
  const chaseIsCoHost = snapshot.viewer.isCoHost === true;
  const chaseCanJoin =
    station.micLive && snapshot.viewer.isHost !== true && !chaseIsCoHost;
  return (
    <section className="chase-card chase-transmitter">
      <div className="chase-panel-heading">
        <span className="chase-eyebrow">TRANSMISSION CONTROL</span>
        <ChaseIcon name="signal" />
      </div>

      <h2>{station.live ? "Broadcast active" : "Transmission offline"}</h2>
      <p>
        {station.live
          ? station.showTitle || "No show title set."
          : "Deploy the rig to start broadcasting."}
      </p>
      <button
        className={`chase-button ${station.live ? "chase-danger" : "chase-primary"}`}
        disabled={
          busy ||
          !station.canManage ||
          (!station.live && (!chaseReady || !chaseCanOperate))
        }
        onClick={() =>
          void action(
            "broadcast",
            { enabled: !station.live },
            station.live ? "Transmission stopped." : "Transmission started.",
          )
        }
      >
        <ChaseIcon name={station.live ? "stop" : "play"} size={17} />
        {station.live ? "End broadcast" : "Start broadcast"}
      </button>
      <div className="chase-mic-control">
        <div>
          <span
            className={`chase-mic-icon ${station.micLive ? "chase-mic-on" : ""}`}
          >
            <ChaseIcon name="mic" />
          </span>
          <span>
            <strong>Studio microphone</strong>
            <small>
              {station.micLive
                ? `${station.hostName || "Host"} is on the mic${
                    station.cohostNames.length
                      ? ` with ${station.cohostNames.join(", ")}`
                      : ""
                  }`
                : chaseVoiceReady
                  ? "Closed · open when you’re ready"
                  : "Voice integration unavailable"}
            </small>
          </span>
        </div>
        {chaseCanJoin ? (
          <div className="chase-mic-actions">
            <button
              className="chase-button chase-secondary"
              disabled={
                busy ||
                !station.canManage ||
                !chaseVoiceReady ||
                !chaseCanOperate
              }
              onClick={() =>
                void action(
                  "microphone",
                  { enabled: true },
                  "You joined as co-host.",
                )
              }
            >
              <ChaseIcon name="users" size={16} />
              Join as co-host
            </button>
            <button
              className="chase-text-button"
              disabled={busy || !station.canManage}
              onClick={() =>
                void action(
                  "microphone",
                  { enabled: false },
                  "Microphone closed.",
                )
              }
            >
              Close all
            </button>
          </div>
        ) : (
          <button
            className={`chase-toggle ${station.micLive ? "chase-toggle-on" : ""}`}
            aria-label={
              station.micLive
                ? chaseIsCoHost
                  ? "Leave co-host seat"
                  : "Close microphone"
                : "Open microphone"
            }
            aria-pressed={station.micLive}
            disabled={
              busy ||
              !station.canManage ||
              (!station.micLive &&
                (!station.live || !chaseVoiceReady || !chaseCanOperate))
            }
            onClick={() =>
              void action(
                "microphone",
                { enabled: !station.micLive },
                station.micLive
                  ? chaseIsCoHost
                    ? "You left the co-host seat."
                    : "Microphone closed."
                  : "Microphone open.",
              )
            }
          >
            <span />
          </button>
        )}
      </div>
    </section>
  );
}
function ChaseConsole({
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
  const [chaseAmount, chaseSetAmount] = useState("");
  const chaseTransition =
    station.stage === "deploying" || station.stage === "packing";
  const chaseReady = station.stage === "ready" || station.stage === "live";
  const chaseCanOperate = snapshot.viewer.canOperate !== false;
  return (
    <div className="chase-console-grid">
      <ChaseTransmitter
        snapshot={snapshot}
        station={station}
        action={action}
        busy={busy}
      />
      <section className="chase-card chase-rig-card">
        <div className="chase-panel-heading">
          <span className="chase-eyebrow">MOBILE STUDIO</span>
          <ChaseIcon name="van" />
        </div>

        <div className="chase-rig-state">
          <strong>{chaseStageLabels[station.stage]}</strong>
          <span>{station.vehicleNetId ? "Van assigned" : "Van stored"}</span>
        </div>
        <div className="chase-battery-line">
          <span>
            <ChaseIcon name="bolt" size={15} />
            Battery
          </span>
          <strong>{Math.round(station.battery)}%</strong>
        </div>
        <div className="chase-progress-track">
          <span
            style={{ width: `${Math.max(0, Math.min(100, station.battery))}%` }}
          />
        </div>
        <div className="chase-rig-buttons">
          {station.stage === "stored" ? (
            <button
              className="chase-button chase-secondary"
              disabled={busy || !station.canManage || !chaseCanOperate}
              onClick={() =>
                void action("spawnVan", {}, "Your studio van is ready.")
              }
            >
              <ChaseIcon name="van" size={17} />
              Collect van
            </button>
          ) : (
            <>
              <button
                className="chase-button chase-secondary"
                disabled={
                  busy ||
                  !station.canManage ||
                  chaseTransition ||
                  (!chaseReady && !chaseCanOperate)
                }
                onClick={() =>
                  void action(
                    chaseReady ? "pack" : "deploy",
                    {},
                    chaseReady
                      ? "Rig packing started."
                      : "Rig deployment started.",
                  )
                }
              >
                {chaseTransition
                  ? chaseStageLabels[station.stage]
                  : chaseReady
                    ? "Pack rig"
                    : "Deploy rig"}
              </button>
              <button
                className="chase-button chase-subtle"
                disabled={
                  busy || !station.canManage || station.stage !== "parked"
                }
                onClick={() =>
                  void action("storeVan", {}, "Van returned to the depot.")
                }
              >
                Store van
              </button>
            </>
          )}
        </div>
        <button
          className="chase-text-button chase-recharge"
          disabled={
            busy ||
            !station.canManage ||
            station.stage !== "parked" ||
            station.battery >= 100 ||
            !chaseCanOperate
          }
          onClick={() => void action("recharge", {}, "Battery recharged.")}
        >
          <ChaseIcon name="bolt" size={15} />
          Recharge at depot
        </button>
        <p className="chase-caption">
          Rig controls require you to be beside the van. Collection, storage and
          charging require the depot.
        </p>
      </section>
      <section className="chase-card chase-studio-stats">
        <div>
          <span className="chase-stat-icon">
            <ChaseIcon name="headphones" />
          </span>
          <span className="chase-eyebrow">TUNED IN NOW</span>
          <strong>{station.listeners.toString().padStart(2, "0")}</strong>
          <span>On your frequency</span>
        </div>
        <div>
          <span className="chase-stat-icon">
            <ChaseIcon name="signal" />
          </span>
          <span className="chase-eyebrow">TRANSMITTER POWER</span>
          <strong>
            {snapshot.config.powerModes.find(
              (chaseMode) => chaseMode.id === station.power,
            )?.label || station.power}
          </strong>
          <span>
            {station.isPublic
              ? "Listed in station directory"
              : "Unlisted frequency"}
          </span>
        </div>
      </section>
      <section className="chase-card chase-balance-card">
        <div className="chase-panel-heading">
          <span className="chase-eyebrow">STATION BALANCE</span>
          <ChaseIcon name="money" />
        </div>
        {station.canWithdraw && typeof station.balance === "number" ? (
          <>
            <strong>
              {ChaseMoney(station.balance, snapshot.config.currency)}
            </strong>
            <p>
              Listener tips fund this balance. Only the owner can withdraw to
              their account.
            </p>
            <form
              className="chase-input-action"
              onSubmit={async (chaseEvent) => {
                chaseEvent.preventDefault();
                if (
                  await action(
                    "withdraw",
                    { amount: Number(chaseAmount) },
                    "Withdrawal completed.",
                  )
                )
                  chaseSetAmount("");
              }}
            >
              <span>{snapshot.config.currency}</span>
              <input
                aria-label="Withdrawal amount"
                type="number"
                min="1"
                max={station.balance}
                step="1"
                required
                placeholder="Amount"
                value={chaseAmount}
                onChange={(chaseEvent) =>
                  chaseSetAmount(chaseEvent.target.value)
                }
              />
              <button
                className="chase-button chase-secondary"
                disabled={busy || station.balance <= 0}
              >
                Withdraw
              </button>
            </form>
          </>
        ) : (
          <p>Station funds are managed by the owner.</p>
        )}
        <p className="chase-caption">
          Requests and ads are free. Broadcasting does not generate money
          automatically.
        </p>
      </section>
    </div>
  );
}
export function ChaseRequests({
  snapshot,
  action,
  busy,
  heading = true,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
  heading?: boolean;
}) {
  const [chaseFilter, chaseSetFilter] = useState("pending");
  const chaseRequests = snapshot.requests.filter(
    (chaseRequest) =>
      chaseFilter === "all" || chaseRequest.status === "pending",
  );
  return (
    <section className="chase-card chase-content-card">
      <div className="chase-section-heading">
        {heading ? (
          <div>
            <h2>Studio inbox</h2>
            <p>Review listener requests and advertisements.</p>
          </div>
        ) : null}
        <div className="chase-segmented">
          <button
            className={chaseFilter === "pending" ? "chase-selected" : ""}
            onClick={() => chaseSetFilter("pending")}
          >
            Pending
          </button>
          <button
            className={chaseFilter === "all" ? "chase-selected" : ""}
            onClick={() => chaseSetFilter("all")}
          >
            All messages
          </button>
        </div>
      </div>
      {chaseRequests.length ? (
        <div className="chase-inbox">
          {chaseRequests.map((chaseRequest) => (
            <article key={chaseRequest.id} className="chase-request-card">
              <span className="chase-avatar">
                {chaseRequest.senderName.slice(0, 1)}
              </span>
              <div>
                <div className="chase-request-meta">
                  <strong>{chaseRequest.senderName}</strong>
                  <span>
                    {chaseRequest.kind === "advertisement"
                      ? "ADVERTISEMENT"
                      : "REQUEST"}
                  </span>
                  <span>{chaseRequest.status}</span>
                </div>
                <p>{chaseRequest.message}</p>
                {chaseRequest.status === "pending" ? (
                  <div className="chase-inline-actions">
                    <button
                      className="chase-button chase-secondary"
                      disabled={busy || !snapshot.mine?.canManage}
                      onClick={() =>
                        void action(
                          "moderateRequest",
                          { requestId: chaseRequest.id, status: "accepted" },
                          "Message accepted.",
                        )
                      }
                    >
                      <ChaseIcon name="check" size={16} />
                      Accept
                    </button>
                    <button
                      className="chase-text-button"
                      disabled={busy || !snapshot.mine?.canManage}
                      onClick={() =>
                        void action(
                          "moderateRequest",
                          { requestId: chaseRequest.id, status: "dismissed" },
                          "Message dismissed.",
                        )
                      }
                    >
                      Dismiss
                    </button>
                  </div>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <ChaseEmpty title="You’re all caught up">
          Incoming messages will appear here when listeners send a line to your
          studio.
        </ChaseEmpty>
      )}
    </section>
  );
}
function ChaseCartridges({
  snapshot,
  action,
  busy,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
}) {
  return (
    <section className="chase-card chase-content-card">
      <div className="chase-section-heading">
        <div>
          <h2>Cartridge library</h2>
          <p>Station idents, intermissions, and sign-offs.</p>
        </div>
        <button
          className="chase-button chase-secondary"
          disabled={busy || !snapshot.mine?.canManage}
          onClick={() => void action("stopCartridge", {}, "Cartridge stopped.")}
        >
          <ChaseIcon name="stop" size={16} />
          Stop playback
        </button>
      </div>
      <div className="chase-cartridge-grid">
        {snapshot.cartridges.map((chaseCartridge) => (
          <article className="chase-cartridge-card" key={chaseCartridge.id}>
            <span className="chase-cartridge-icon">
              <ChaseIcon name="cassette" size={28} />
            </span>
            <div className="chase-cartridge-details">
              <div>
                <h3>{chaseCartridge.name}</h3>
                <p>{chaseCartridge.description}</p>
                <span>
                  {Math.floor(chaseCartridge.duration / 60)}:
                  {Math.round(chaseCartridge.duration % 60)
                    .toString()
                    .padStart(2, "0")}
                </span>
              </div>
              <button
                className="chase-icon-button"
                aria-label={`Play ${chaseCartridge.name}`}
                disabled={
                  busy ||
                  !snapshot.mine?.live ||
                  !snapshot.mine?.canManage ||
                  snapshot.viewer.canOperate === false
                }
                onClick={() =>
                  void action(
                    "playCartridge",
                    { cartridgeId: chaseCartridge.id },
                    "Cartridge playback requested.",
                  )
                }
              >
                <ChaseIcon name="play" size={18} />
              </button>
            </div>
          </article>
        ))}
      </div>
      {!snapshot.cartridges.length ? (
        <ChaseEmpty icon="cassette" title="Your shelf is empty">
          Configured station cartridges will appear here.
        </ChaseEmpty>
      ) : null}
      <p className="chase-caption">
        Your transmitter must be live and you must be beside the console to play
        a cartridge. Tuned listeners hear the broadcast, and you hear a private
        studio cue. The receiver volume slider controls your cue level.
      </p>
    </section>
  );
}
function ChaseNowPlaying({
  station,
  action,
  busy,
  canEdit,
}: {
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
  canEdit: boolean;
}) {
  const chaseNow = station.nowPlaying;
  const [chaseTick, chaseSetTick] = useState(Date.now());
  useEffect(() => {
    if (!chaseNow) return;
    chaseSetTick(Date.now());
    const chaseTimer = window.setInterval(() => chaseSetTick(Date.now()), 1000);
    return () => window.clearInterval(chaseTimer);
  }, [chaseNow]);
  if (!chaseNow)
    return (
      <div className="chase-now-track chase-now-idle">
        <span className="chase-cartridge-icon">
          <ChaseIcon name="cassette" size={24} />
        </span>
        <div>
          <strong>Nothing playing</strong>
          <span>
            {station.live
              ? "Play a queued track to start the music."
              : "Start the broadcast to play music."}
          </span>
        </div>
      </div>
    );
  const chaseElapsed = Math.max(
    0,
    Math.min(chaseNow.duration, chaseTick / 1000 - chaseNow.startedAt),
  );
  return (
    <div className="chase-now-track">
      <span className="chase-cartridge-icon">
        <ChaseIcon
          name={chaseNow.provider === "file" ? "cassette" : "play"}
          size={24}
        />
      </span>
      <div>
        <span className="chase-eyebrow">NOW PLAYING</span>
        <strong>{chaseNow.title}</strong>
        <span>
          {chaseProviderLabels[chaseNow.provider] || chaseNow.provider} ·{" "}
          {ChaseClock(chaseElapsed)} / {ChaseClock(chaseNow.duration)}
        </span>
        <div className="chase-progress-track">
          <span
            style={{
              width: `${chaseNow.duration > 0 ? Math.min(100, (chaseElapsed / chaseNow.duration) * 100) : 0}%`,
            }}
          />
        </div>
      </div>
      <div className="chase-now-actions">
        <button
          className="chase-button chase-secondary"
          disabled={busy || !canEdit || !station.live}
          onClick={() => void action("skipTrack", {}, "Skipped ahead.")}
        >
          <ChaseIcon name="arrow" size={16} />
          Skip
        </button>
        <button
          className="chase-button chase-subtle"
          disabled={busy || !station.canManage}
          onClick={() => void action("stopCartridge", {}, "Playback stopped.")}
        >
          <ChaseIcon name="stop" size={16} />
          Stop
        </button>
      </div>
    </div>
  );
}
export function ChaseMusic({
  snapshot,
  station,
  action,
  busy,
  heading = true,
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
  heading?: boolean;
}) {
  const [chaseLink, chaseSetLink] = useState("");
  const [chaseResolving, chaseSetResolving] = useState(false);
  const [chaseIssue, chaseSetIssue] = useState("");
  const chaseMusic = snapshot.config.music;
  const chaseQueue = station.queue || [];
  const chaseMode = station.mode || "dj";
  const chaseCanEdit =
    station.canManage && snapshot.viewer.canOperate !== false;
  const chaseFull = chaseMusic
    ? chaseQueue.length >= chaseMusic.maxQueue
    : false;
  if (chaseMusic?.enabled === false)
    return (
      <section className="chase-card chase-content-card">
        <ChaseEmpty icon="cassette" title="Music is switched off">
          Online track playback is disabled on this server.
        </ChaseEmpty>
      </section>
    );
  async function ChaseAddTrack(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const chaseUrl = chaseLink.trim();
    if (!chaseUrl || chaseResolving) return;
    chaseSetIssue("");
    const chaseProvider = ChaseDetectProvider(chaseUrl);
    if (!chaseProvider) {
      chaseSetIssue("Enter a YouTube or SoundCloud track link.");
      return;
    }
    if (chaseMusic?.providers?.[chaseProvider] === false) {
      chaseSetIssue(
        `${chaseProviderLabels[chaseProvider]} links are disabled on this server.`,
      );
      return;
    }
    chaseSetResolving(true);
    try {
      const chaseTrack = await ChaseResolveTrack(chaseUrl);
      if (
        await action(
          "queueAdd",
          {
            url: chaseUrl,
            title: chaseTrack.title,
            duration: chaseTrack.duration,
          },
          "Track added to the queue.",
        )
      )
        chaseSetLink("");
    } catch (chaseFailure) {
      chaseSetIssue(ChaseError(chaseFailure));
    } finally {
      chaseSetResolving(false);
    }
  }
  return (
    <section className="chase-card chase-content-card">
      {heading ? (
        <div className="chase-section-heading">
          <div>
            <h2>Music queue</h2>
            <p>Line up YouTube and SoundCloud tracks for your broadcast.</p>
          </div>
          <span className="chase-count-pill">
            {chaseQueue.length}
            {chaseMusic ? ` / ${chaseMusic.maxQueue}` : ""} queued
          </span>
        </div>
      ) : null}
      <ChaseNowPlaying
        station={station}
        action={action}
        busy={busy}
        canEdit={chaseCanEdit}
      />
      <form className="chase-music-add" onSubmit={ChaseAddTrack}>
        <label htmlFor="chase-track-link">Add a track link</label>
        <div className="chase-input-action">
          <input
            id="chase-track-link"
            type="url"
            placeholder="https://www.youtube.com/watch?v=… or https://soundcloud.com/…"
            value={chaseLink}
            maxLength={300}
            required
            disabled={chaseResolving}
            onChange={(chaseEvent) => chaseSetLink(chaseEvent.target.value)}
          />
          <button
            className="chase-button chase-primary"
            disabled={busy || chaseResolving || !chaseCanEdit || chaseFull}
          >
            <ChaseIcon name="plus" size={16} />
            {chaseResolving ? "Checking link…" : "Add"}
          </button>
        </div>
        {chaseIssue ? (
          <span className="chase-field-hint chase-field-error" role="alert">
            {chaseIssue}
          </span>
        ) : (
          <span className="chase-field-hint">
            {chaseFull
              ? "The queue is full. Remove a track to add another."
              : chaseMusic
                ? `Tracks between ${ChaseClock(chaseMusic.minDurationSeconds)} and ${ChaseClock(chaseMusic.maxDurationSeconds)} long. The title and length are read from the link before it is added.`
                : "The title and length are read from the link before it is added."}
          </span>
        )}
      </form>
      <div className="chase-queue-list">
        {chaseQueue.map((chaseTrack, chaseIndex) => (
          <article key={chaseTrack.id}>
            <span className="chase-queue-index">{chaseIndex + 1}</span>
            <div>
              <strong>{chaseTrack.title}</strong>
              <span>
                {chaseProviderLabels[chaseTrack.provider] ||
                  chaseTrack.provider}{" "}
                · {ChaseClock(chaseTrack.duration)}
              </span>
            </div>
            <button
              className="chase-icon-button"
              aria-label={`Play ${chaseTrack.title} now`}
              disabled={busy || !station.live || !chaseCanEdit}
              onClick={() =>
                void action(
                  "playTrack",
                  { trackId: chaseTrack.id },
                  "Track playback requested.",
                )
              }
            >
              <ChaseIcon name="play" size={18} />
            </button>
            <button
              className="chase-text-button"
              disabled={busy || !chaseCanEdit}
              onClick={() =>
                void action(
                  "queueRemove",
                  { trackId: chaseTrack.id },
                  "Track removed.",
                )
              }
            >
              Remove
            </button>
          </article>
        ))}
      </div>
      {!chaseQueue.length ? (
        <ChaseEmpty icon="cassette" title="The queue is empty">
          Paste a YouTube or SoundCloud link above to line up your first track.
        </ChaseEmpty>
      ) : null}
      <p className="chase-caption">
        {chaseMode === "autonomous"
          ? "Autonomous mode: while the transmitter is live the queue plays on its own and loops back to the start. Starting a broadcast with queued tracks begins playback automatically."
          : `DJ-managed mode: play a track to start, the queue continues in order and stops after the last track. Autoplay is ${station.autoplay ? "on" : "off"}.`}{" "}
        You must be beside the live console to play or skip a track. Listeners
        hear the track and you hear a private studio cue.
      </p>
    </section>
  );
}
function ChaseCrew({
  snapshot,
  action,
  busy,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
}) {
  const [chaseSource, chaseSetSource] = useState("");
  return (
    <section className="chase-card chase-content-card">
      <div className="chase-section-heading">
        <div>
          <h2>Studio crew</h2>
          <p>Manage who can operate this station.</p>
        </div>
        <span className="chase-count-pill">
          {snapshot.crew.length} crew members
        </span>
      </div>
      {snapshot.mine?.canWithdraw ? (
        <form
          className="chase-crew-invite"
          onSubmit={async (chaseEvent) => {
            chaseEvent.preventDefault();
            if (
              await action(
                "crewAdd",
                { source: Number(chaseSource) },
                "Crew member added.",
              )
            )
              chaseSetSource("");
          }}
        >
          <label htmlFor="chase-crew-id">Add a connected player</label>
          <div className="chase-input-action">
            <input
              id="chase-crew-id"
              type="number"
              min="1"
              step="1"
              placeholder="Player server ID"
              required
              value={chaseSource}
              onChange={(chaseEvent) => chaseSetSource(chaseEvent.target.value)}
            />
            <button className="chase-button chase-primary" disabled={busy}>
              <ChaseIcon name="plus" size={16} />
              Add to crew
            </button>
          </div>
        </form>
      ) : null}
      <div className="chase-crew-list">
        {snapshot.crew.map((chaseMember) => (
          <article key={chaseMember.memberId ?? chaseMember.source}>
            <span className="chase-avatar">{chaseMember.name.slice(0, 1)}</span>
            <div>
              <strong>{chaseMember.name}</strong>
              <span>
                Studio crew ·{" "}
                {chaseMember.source > 0
                  ? `ID ${chaseMember.source}`
                  : "Offline"}
              </span>
            </div>
            {snapshot.mine?.canWithdraw ? (
              <button
                className="chase-text-button"
                disabled={busy}
                onClick={() =>
                  void action(
                    "crewRemove",
                    chaseMember.memberId
                      ? { memberId: chaseMember.memberId }
                      : { source: chaseMember.source },
                    "Crew member removed.",
                  )
                }
              >
                Remove
              </button>
            ) : null}
          </article>
        ))}
      </div>
      {!snapshot.crew.length ? (
        <ChaseEmpty icon="users" title="An open seat at the desk">
          Add a connected player to help run your station.
        </ChaseEmpty>
      ) : null}
    </section>
  );
}
export function ChaseStationSettings(station: ChaseStation) {
  return {
    name: station.name,
    tagline: station.tagline,
    frequency: station.frequency,
    power: station.power,
    isPublic: station.isPublic,
    showTitle: station.showTitle,
  };
}
export function ChaseModeControl({
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
  const chaseMode = station.mode || "dj";
  const chaseCanEdit =
    station.canManage && snapshot.viewer.canOperate !== false;
  return (
    <div className="chase-mode-control">
      <div>
        <strong>Station mode</strong>
        <small>
          {chaseMode === "autonomous"
            ? "The music queue loops on its own while the transmitter is live."
            : "A DJ starts tracks. The queue plays in order and stops when it ends."}
        </small>
      </div>
      <div className="chase-segmented" aria-label="Station mode">
        {[
          { id: "dj", label: "DJ-managed" },
          { id: "autonomous", label: "Autonomous" },
        ].map((chaseOption) => (
          <button
            key={chaseOption.id}
            type="button"
            className={chaseMode === chaseOption.id ? "chase-selected" : ""}
            aria-pressed={chaseMode === chaseOption.id}
            disabled={busy || !chaseCanEdit || chaseMode === chaseOption.id}
            onClick={() =>
              void action(
                "setMode",
                { mode: chaseOption.id },
                "Station mode updated.",
              )
            }
          >
            {chaseOption.label}
          </button>
        ))}
      </div>
    </div>
  );
}
function ChaseSettings({
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
  const [chaseForm, chaseSetForm] = useState(ChaseStationSettings(station));
  return (
    <section className="chase-card chase-content-card">
      <div className="chase-section-heading">
        <div>
          <h2>Station settings</h2>
          <p>Configure your station identity and transmission.</p>
        </div>
      </div>
      <ChaseModeControl
        snapshot={snapshot}
        station={station}
        action={action}
        busy={busy}
      />
      <form
        className="chase-settings-form"
        onSubmit={async (chaseEvent) => {
          chaseEvent.preventDefault();
          await action("updateStation", chaseForm, "Station settings saved.");
        }}
      >
        <label>
          Station name
          <input
            value={chaseForm.name}
            maxLength={40}
            required
            onChange={(chaseEvent) =>
              chaseSetForm({ ...chaseForm, name: chaseEvent.target.value })
            }
          />
        </label>
        <label>
          Frequency (MHz)
          <input
            type="number"
            min={snapshot.config.frequencyMin / 10}
            max={snapshot.config.frequencyMax / 10}
            step="0.1"
            required
            value={chaseForm.frequency / 10}
            onChange={(chaseEvent) =>
              chaseSetForm({
                ...chaseForm,
                frequency: Math.round(Number(chaseEvent.target.value) * 10),
              })
            }
          />
        </label>
        <label className="chase-span-full">
          Tagline
          <input
            value={chaseForm.tagline}
            maxLength={100}
            onChange={(chaseEvent) =>
              chaseSetForm({ ...chaseForm, tagline: chaseEvent.target.value })
            }
          />
        </label>
        <label className="chase-span-full">
          Show title
          <input
            value={chaseForm.showTitle}
            maxLength={80}
            onChange={(chaseEvent) =>
              chaseSetForm({ ...chaseForm, showTitle: chaseEvent.target.value })
            }
          />
        </label>
        <label>
          Transmitter power
          <select
            value={chaseForm.power}
            onChange={(chaseEvent) =>
              chaseSetForm({ ...chaseForm, power: chaseEvent.target.value })
            }
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
            checked={chaseForm.isPublic}
            onChange={(chaseEvent) =>
              chaseSetForm({
                ...chaseForm,
                isPublic: chaseEvent.target.checked,
              })
            }
          />
          <span>
            List in station directory
            <small>Unlisted stations can still be tuned by frequency.</small>
          </span>
        </label>
        <div className="chase-settings-footer chase-span-full">
          <p>Your changes apply when the station is saved.</p>
          <button
            className="chase-button chase-primary"
            disabled={
              busy || !station.canManage || snapshot.viewer.canOperate === false
            }
          >
            Save station <ChaseIcon name="check" size={17} />
          </button>
        </div>
      </form>
    </section>
  );
}
export function ChaseCreateStation({
  snapshot,
  action,
  busy,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
}) {
  const [chaseName, chaseSetName] = useState("");
  const [chaseTagline, chaseSetTagline] = useState("");
  const [chaseFrequency, chaseSetFrequency] = useState(987);
  return (
    <section className="chase-card chase-create-station">
      <div className="chase-create-intro">
        <span className="chase-modal-icon">
          <ChaseIcon name="radio" size={24} />
        </span>
        <div>
          <h2>Create your station</h2>
          <p>Reserve a frequency and access your mobile studio.</p>
        </div>
        <span className="chase-create-price">
          {ChaseMoney(snapshot.config.stationPrice, snapshot.config.currency)}
          <small>Acquisition price</small>
        </span>
      </div>
      <form
        onSubmit={async (chaseEvent) => {
          chaseEvent.preventDefault();
          await action(
            "createStation",
            {
              name: chaseName,
              tagline: chaseTagline,
              frequency: chaseFrequency,
            },
            "Your station is ready.",
          );
        }}
      >
        <label>
          Station name
          <input
            value={chaseName}
            onChange={(chaseEvent) => chaseSetName(chaseEvent.target.value)}
            maxLength={40}
            required
            placeholder="Station name"
          />
        </label>
        <label>
          Tagline
          <input
            value={chaseTagline}
            onChange={(chaseEvent) => chaseSetTagline(chaseEvent.target.value)}
            maxLength={100}
            placeholder="Station description"
          />
        </label>
        <label>
          Frequency (MHz)
          <input
            type="number"
            step="0.1"
            min={snapshot.config.frequencyMin / 10}
            max={snapshot.config.frequencyMax / 10}
            value={chaseFrequency / 10}
            onChange={(chaseEvent) =>
              chaseSetFrequency(
                Math.round(Number(chaseEvent.target.value) * 10),
              )
            }
            required
          />
        </label>
        <p className="chase-caption">
          Visit the acquisition point to purchase your station and reserve an
          available frequency.
        </p>
        <button
          className="chase-button chase-primary chase-full"
          disabled={busy || !snapshot.viewer.canCreate}
        >
          Acquire station <ChaseIcon name="arrow" size={17} />
        </button>
        {!snapshot.viewer.canCreate ? (
          <p className="chase-caption">
            Station acquisition requires authorized Signalworks employment.
          </p>
        ) : null}
      </form>
    </section>
  );
}
