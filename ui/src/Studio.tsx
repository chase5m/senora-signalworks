import {
  useEffect,
  useId,
  useRef,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { ChaseEmpty, ChaseIcon, ChaseStatus } from "./components";
import {
  ChaseClock,
  ChaseError,
  ChaseFrequency,
  ChaseMoney,
} from "./transport";
import { ChaseDetectProvider, ChaseResolveTrack } from "./players";
import {
  ChaseMeter,
  ChaseProgress,
  ChaseStationArt,
  ChaseTrackArt,
} from "./presentation";
import type {
  ChaseAction,
  ChaseSnapshot,
  ChaseStation,
  ChasePlayback,
  ChaseSpeech,
  ChaseTalk,
  ChasePreviewPlayback,
} from "./types";
import "./studio-redesign.css";

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
type ChaseStudioProps = {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
};
type ChaseStationProps = ChaseStudioProps & { station: ChaseStation };
type ChaseVoiceProps = {
  speech?: ChaseSpeech;
  talk?: ChaseTalk;
  talkKey?: string;
};
type ChaseStudioTab =
  | "console"
  | "requests"
  | "library"
  | "music"
  | "crew"
  | "settings"
  | "equipment";

function ChaseInitials(name: string) {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "—"
  );
}
function ChaseSectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="chase-studio-section-title">{children}</h3>;
}

function ChaseBroadcastSwitch({
  snapshot,
  station,
  action,
  busy,
}: ChaseStationProps) {
  const ready = station.stage === "ready" || station.stage === "live";
  return (
    <button
      className={`chase-button ${station.live ? "chase-secondary" : "chase-primary"}`}
      disabled={
        busy ||
        !station.canManage ||
        (!station.live && (!ready || snapshot.viewer.canOperate === false))
      }
      onClick={() =>
        void action(
          "broadcast",
          { enabled: !station.live },
          station.live ? "Transmission stopped." : "Transmission started.",
        )
      }
    >
      <ChaseIcon name={station.live ? "stop" : "play"} size={19} />
      {station.live ? "End broadcast" : "Start broadcast"}
    </button>
  );
}

export function ChaseStudio({
  snapshot,
  action,
  busy,
  playback,
  previewPlayback,
  volume,
  changeVolume,
  saveVolume,
  speech,
  talk,
  talkKey,
}: ChaseStudioProps &
  ChaseVoiceProps & {
    playback: ChasePlayback | null;
    previewPlayback?: ChasePreviewPlayback | null;
    volume?: number;
    changeVolume?: (volume: number) => void;
    saveVolume?: () => void;
  }) {
  const [tab, setTab] = useState<ChaseStudioTab>("console");
  const station = snapshot.mine;
  const pending = snapshot.requests.filter(
    (request) => request.status === "pending",
  ).length;
  if (!station)
    return (
      <ChaseCreateStation snapshot={snapshot} action={action} busy={busy} />
    );
  const props = { snapshot, station, action, busy };
  return (
    <div className={`chase-studio chase-studio-${tab}-view`}>
      {snapshot.viewer.canOperate === false ? (
        <div className="chase-operation-note">
          <ChaseIcon name="info" />
          <span>
            Operations require the{" "}
            {snapshot.config.broadcastJob?.name || "signalworks"} job
            {snapshot.config.broadcastJob?.requireDuty ? " while on duty" : ""}.
            You can still stop and store the rig.
          </span>
        </div>
      ) : null}
      <header className="chase-studio-banner">
        <ChaseStationArt
          station={station}
          className="chase-studio-station-art"
        />
        <div className="chase-studio-identity">
          <div>
            <h2>{station.name}</h2>
            <span className="chase-studio-frequency">
              {ChaseFrequency(station.frequency)} <small>FM</small>
            </span>
            <ChaseStatus live={station.live}>
              {station.live ? "LIVE" : "OFF AIR"}
            </ChaseStatus>
          </div>
          <p>{station.tagline || "Your frequency. Your world."}</p>
        </div>
        <span className="chase-studio-audience">
          <ChaseIcon name="users" size={19} />
          {station.listeners}{" "}
          {station.listeners === 1 ? "listener" : "listeners"}
        </span>
        <ChaseBroadcastSwitch {...props} />
      </header>
      <nav className="chase-studio-tabs" aria-label="Studio sections">
        {(
          [
            { id: "console", label: "Console", icon: "studio" },
            { id: "requests", label: "Requests", icon: "message" },
            { id: "library", label: "Cartridges", icon: "cassette" },
            { id: "music", label: "Music", icon: "music" },
            { id: "crew", label: "Crew", icon: "users" },
            { id: "settings", label: "Settings", icon: "settings" },
          ] as const
        ).map((item) => (
          <button
            key={item.id}
            className={
              tab === item.id || (tab === "equipment" && item.id === "console")
                ? "chase-active-tab"
                : ""
            }
            aria-pressed={
              tab === item.id || (tab === "equipment" && item.id === "console")
            }
            onClick={() => setTab(item.id)}
          >
            <ChaseIcon name={item.icon} size={19} />
            {item.label}
            {item.id === "requests" && pending > 0 ? (
              <span>{pending}</span>
            ) : null}
          </button>
        ))}
      </nav>
      {playback?.monitor &&
      playback.stationId === station.id &&
      playback.phase !== "playing" &&
      playback.phase !== "paused" ? (
        <div className="chase-studio-playback-notice" role="status">
          <ChaseIcon name="headphones" />
          <span>
            {playback.phase === "loading"
              ? `Loading private monitor: ${playback.name}`
              : playback.phase === "blocked"
                ? "Audio needs a click inside the receiver to start."
                : `Unable to play ${playback.name}. Try the source again.`}
          </span>
        </div>
      ) : null}
      {tab === "console" ? (
        <ChaseConsole
          {...props}
          speech={speech}
          talk={talk}
          talkKey={talkKey}
          equipment={() => setTab("equipment")}
          music={() => setTab("music")}
        />
      ) : null}
      {tab === "equipment" ? (
        <ChaseEquipment {...props} back={() => setTab("console")} />
      ) : null}
      {tab === "requests" ? (
        <ChaseRequests snapshot={snapshot} action={action} busy={busy} />
      ) : null}
      {tab === "library" ? (
        <ChaseCartridges {...props} previewPlayback={previewPlayback} />
      ) : null}
      {tab === "music" ? <ChaseMusic {...props} /> : null}
      {tab === "crew" ? (
        <ChaseCrew snapshot={snapshot} action={action} busy={busy} />
      ) : null}
      {tab === "settings" ? (
        <ChaseSettings key={station.id} {...props} />
      ) : null}
      {tab !== "console" ? (
        <footer className="chase-studio-footer">
          <span>
            <ChaseIcon name="headphones" size={18} />
            {playback?.monitor &&
            playback.stationId === station.id &&
            playback.phase === "playing"
              ? `Private monitor · ${playback.name}`
              : "Studio controls · changes affect your station"}
          </span>
          {typeof volume === "number" && changeVolume ? (
            <label className="chase-studio-monitor">
              <span>Private monitor</span>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                aria-label="Private monitor volume"
                value={volume}
                onChange={(event) => changeVolume(Number(event.target.value))}
                onPointerUp={() => saveVolume?.()}
                onKeyUp={() => saveVolume?.()}
                onBlur={() => saveVolume?.()}
              />
              <output>{Math.round(volume)}%</output>
            </label>
          ) : (
            <span className="chase-studio-footer-frequency">
              {ChaseFrequency(station.frequency)} FM
            </span>
          )}
        </footer>
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
          <ChaseIcon name="mic" size={15} />
          {station.hostName || "Host"}
        </span>
      ) : null}
      {station.cohostNames.map((name, index) => (
        <span key={`${index}-${name}`}>
          <ChaseIcon name="users" size={15} />
          {name}
          <small>co-host</small>
        </span>
      ))}
      {station.caller ? (
        <>
          <span className="chase-studio-caller">
            <ChaseIcon name="phone" size={15} />
            {station.caller.name}
            <small>on the line</small>
          </span>
          <button
            className="chase-text-button"
            disabled={busy || !station.canManage}
            onClick={() => void action("endCall", {}, "Caller disconnected.")}
          >
            Hang up caller
          </button>
        </>
      ) : null}
    </div>
  );
}

export function ChaseTransmitter({
  snapshot,
  station,
  action,
  busy,
  speech,
  talk,
  talkKey,
  showBroadcast = true,
}: ChaseStationProps & ChaseVoiceProps & { showBroadcast?: boolean }) {
  const voiceReady = snapshot.voiceReady && snapshot.viewer.voiceReady;
  const canOperate = snapshot.viewer.canOperate !== false;
  const cohost = snapshot.viewer.isCoHost === true;
  const canJoin = station.micLive && snapshot.viewer.isHost !== true && !cohost;
  const localSpeech = speech?.local || snapshot.speech?.local;
  const talking =
    (localSpeech?.stationId === station.id && localSpeech.transmitting) ||
    station.talking === true;
  const canTalk =
    localSpeech?.stationId === station.id && localSpeech.micOpen === true;
  const talkRef = useRef(talk);
  useEffect(() => {
    talkRef.current = talk;
  }, [talk]);
  useEffect(() => () => talkRef.current?.(false), []);
  return (
    <section className="chase-card chase-transmitter chase-studio-microphone">
      <ChaseSectionTitle>Studio microphone</ChaseSectionTitle>
      {showBroadcast ? (
        <div className="chase-studio-transmitter-switch">
          <div>
            <h2>
              {station.live ? "Broadcast active" : "Transmission offline"}
            </h2>
            <p>{station.showTitle || chaseStageLabels[station.stage]}</p>
          </div>
          <ChaseBroadcastSwitch
            snapshot={snapshot}
            station={station}
            action={action}
            busy={busy}
          />
        </div>
      ) : null}
      <div
        className={`chase-studio-mic-state ${station.micLive ? "chase-studio-mic-open" : ""}`}
      >
        <span className="chase-studio-mic-emblem">
          <ChaseIcon name="mic" size={36} />
        </span>
        <div>
          <strong>
            {!voiceReady
              ? "UNAVAILABLE"
              : talking
                ? "TRANSMITTING"
                : station.micLive
                  ? "MIC OPEN"
                  : "MIC CLOSED"}
          </strong>
          <p>
            {station.micLive
              ? `${station.hostName || "Host"} · ${ChaseFrequency(station.frequency)} FM`
              : "Open the microphone when you’re ready."}
          </p>
        </div>
      </div>
      <div className="chase-studio-voice-state">
        <ChaseStatus live={talking}>
          {talking
            ? "VOICE ACTIVE"
            : station.micLive
              ? "WAITING FOR SPEECH"
              : "NOT TRANSMITTING"}
        </ChaseStatus>
        <span>
          {voiceReady ? "Voice connected" : "Voice integration unavailable"}
        </span>
      </div>
      {showBroadcast || station.cohostNames.length > 0 || station.caller ? (
        <ChaseStudioPeople station={station} action={action} busy={busy} />
      ) : null}
      <div className="chase-studio-mic-buttons">
        {canJoin ? (
          <>
            <button
              className="chase-button chase-primary"
              disabled={
                busy || !station.canManage || !voiceReady || !canOperate
              }
              onClick={() =>
                void action(
                  "microphone",
                  { enabled: true },
                  "You joined as co-host.",
                )
              }
            >
              <ChaseIcon name="users" size={18} />
              Join as co-host
            </button>
            <button
              className="chase-button chase-secondary"
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
          </>
        ) : (
          <button
            className={`chase-button ${station.micLive ? "chase-secondary" : "chase-primary"}`}
            disabled={
              busy ||
              !station.canManage ||
              (!station.micLive &&
                (!station.live || !voiceReady || !canOperate))
            }
            aria-pressed={station.micLive}
            onClick={() =>
              void action(
                "microphone",
                { enabled: !station.micLive },
                station.micLive
                  ? cohost
                    ? "You left the co-host seat."
                    : "Microphone closed."
                  : "Microphone open.",
              )
            }
          >
            <ChaseIcon name="mic" size={18} />
            {station.micLive
              ? cohost
                ? "Leave co-host seat"
                : "Close microphone"
              : "Open microphone"}
          </button>
        )}
        {talk ? (
          <button
            className={`chase-button chase-secondary ${localSpeech?.transmitting ? "chase-studio-talking" : ""}`}
            disabled={!canTalk || busy}
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              talk(true);
            }}
            onPointerUp={() => talk(false)}
            onPointerCancel={() => talk(false)}
            onLostPointerCapture={() => talk(false)}
            onKeyDown={(event) => {
              if (
                (event.key === " " || event.key === "Enter") &&
                !event.repeat
              ) {
                event.preventDefault();
                talk(true);
              }
            }}
            onKeyUp={(event) => {
              if (event.key === " " || event.key === "Enter") {
                event.preventDefault();
                talk(false);
              }
            }}
            onBlur={() => talk(false)}
          >
            Hold to talk{talkKey ? <kbd>{talkKey}</kbd> : null}
          </button>
        ) : null}
      </div>
    </section>
  );
}

function ChaseNowPlaying({
  station,
  action,
  busy,
  canEdit,
  compact = false,
}: {
  station: ChaseStation;
  action: ChaseAction;
  busy: boolean;
  canEdit: boolean;
  compact?: boolean;
}) {
  const playing = station.nowPlaying;
  const artwork =
    station.queue?.find((track) => track.id === playing?.trackId) || playing;
  return (
    <div
      className={`chase-now-track chase-studio-now ${compact ? "chase-studio-now-compact" : ""}`}
    >
      <ChaseTrackArt
        track={artwork ?? undefined}
        className="chase-studio-track-art"
      />
      <div className="chase-studio-now-info">
        <span className="chase-eyebrow">
          {playing
            ? playing.paused
              ? "PAUSED"
              : "NOW PLAYING"
            : "READY WHEN YOU ARE"}
        </span>
        <strong>{playing?.title || "Nothing playing"}</strong>
        <span>
          {playing
            ? chaseProviderLabels[playing.provider]
            : station.live
              ? "Choose a track or cartridge to begin."
              : "Start the broadcast to play music."}
        </span>
        <ChaseProgress playing={playing} />
      </div>
      <div className="chase-now-actions chase-studio-transport">
        <button
          className="chase-icon-button"
          title="Previous track"
          aria-label="Previous track"
          disabled={busy || !canEdit || !station.live || !station.queue?.length}
          onClick={() =>
            void action("previousTrack", {}, "Previous track requested.")
          }
        >
          <ChaseIcon name="previous" size={23} />
        </button>
        <button
          className="chase-button chase-primary chase-studio-play-button"
          aria-label={
            playing?.provider === "file"
              ? "Stop cartridge"
              : playing?.paused
                ? "Resume playback"
                : playing
                  ? "Pause playback"
                  : "Play first queued track"
          }
          disabled={
            busy ||
            !canEdit ||
            !station.live ||
            (!playing && !station.queue?.length)
          }
          onClick={() =>
            playing?.provider === "file"
              ? void action("stopCartridge", {}, "Cartridge stopped.")
              : playing
                ? void action(
                    "pauseTrack",
                    { paused: !playing.paused },
                    playing.paused ? "Playback resumed." : "Playback paused.",
                  )
                : void action(
                    "playTrack",
                    { trackId: station.queue?.[0]?.id },
                    "Track playback requested.",
                  )
          }
        >
          <ChaseIcon
            name={
              playing?.provider === "file"
                ? "stop"
                : playing && !playing.paused
                  ? "pause"
                  : "play"
            }
            size={29}
          />
        </button>
        <button
          className="chase-icon-button"
          title="Next track"
          aria-label="Next track"
          disabled={busy || !canEdit || !station.live || !station.queue?.length}
          onClick={() => void action("skipTrack", {}, "Next track requested.")}
        >
          <ChaseIcon name="next" size={23} />
        </button>
        {playing ? (
          <button
            className="chase-icon-button"
            title="Stop playback"
            aria-label="Stop playback"
            disabled={busy || !station.canManage}
            onClick={() =>
              void action("stopCartridge", {}, "Playback stopped.")
            }
          >
            <ChaseIcon name="stop" size={20} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

function ChaseConsole({
  snapshot,
  station,
  action,
  busy,
  equipment,
  music,
  speech,
  talk,
  talkKey,
}: ChaseStationProps &
  ChaseVoiceProps & { equipment: () => void; music: () => void }) {
  const canEdit = station.canManage && snapshot.viewer.canOperate !== false;
  const queue = station.queue || [];
  const playingIndex = queue.findIndex(
    (track) => track.id === station.nowPlaying?.trackId,
  );
  const upcoming =
    playingIndex >= 0
      ? station.mode === "autonomous"
        ? queue.length === 1
          ? queue
          : [...queue.slice(playingIndex + 1), ...queue.slice(0, playingIndex)]
        : queue.slice(playingIndex + 1)
      : queue;
  const queueLabel =
    station.nowPlaying && playingIndex < 0 ? "Playlist" : "Up next";
  return (
    <div className="chase-studio-console">
      <div className="chase-studio-console-main">
        <ChaseSectionTitle>Now playing</ChaseSectionTitle>
        <ChaseNowPlaying
          station={station}
          action={action}
          busy={busy}
          canEdit={canEdit}
        />
        <div className="chase-studio-subheading">
          <ChaseSectionTitle>{queueLabel}</ChaseSectionTitle>
          <button className="chase-text-button" onClick={music}>
            View queue <ChaseIcon name="arrow" size={15} />
          </button>
        </div>
        <div className="chase-studio-up-next">
          {upcoming.slice(0, 3).map((track, index) => (
            <div key={track.id}>
              <span>{index + 1}</span>
              <strong>{track.title}</strong>
              <span>{ChaseClock(track.duration)}</span>
              <button
                className="chase-icon-button"
                aria-label={`Play ${track.title}`}
                disabled={busy || !canEdit || !station.live}
                onClick={() =>
                  void action(
                    "playTrack",
                    { trackId: track.id },
                    "Track playback requested.",
                  )
                }
              >
                <ChaseIcon name="play" size={16} />
              </button>
            </div>
          ))}
          {!upcoming.length ? (
            <p>
              {queue.length
                ? "No further tracks queued."
                : "Your queue is empty. Add a track in Music."}
            </p>
          ) : null}
        </div>
      </div>
      <div className="chase-studio-console-side">
        <ChaseTransmitter
          snapshot={snapshot}
          station={station}
          action={action}
          busy={busy}
          speech={speech}
          talk={talk}
          talkKey={talkKey}
          showBroadcast={false}
        />
        <section className="chase-studio-mobile-rig">
          <ChaseSectionTitle>Mobile studio</ChaseSectionTitle>
          <div>
            <ChaseIcon name="van" size={35} />
            <span>
              <strong>{chaseStageLabels[station.stage]}</strong>
              <small>
                {station.vehicleNetId
                  ? "Studio van assigned"
                  : "Van stored at the depot"}
              </small>
            </span>
            <span className="chase-studio-battery">
              <small>BATTERY</small>
              <strong>{Math.round(station.battery)}%</strong>
            </span>
          </div>
          <button
            className="chase-button chase-secondary chase-full"
            onClick={equipment}
          >
            <ChaseIcon name="settings" size={18} />
            Manage equipment
            <ChaseIcon name="arrow" size={16} />
          </button>
        </section>
      </div>
      <section className="chase-studio-quick-carts">
        <ChaseSectionTitle>Cartridge triggers</ChaseSectionTitle>
        <div>
          {snapshot.cartridges.slice(0, 3).map((cartridge) => (
            <button
              key={cartridge.id}
              className="chase-button chase-secondary"
              disabled={busy || !canEdit || !station.live}
              onClick={() =>
                void action(
                  "playCartridge",
                  { cartridgeId: cartridge.id },
                  "Cartridge playback requested.",
                )
              }
            >
              <ChaseIcon name="play" size={22} />
              <strong>{cartridge.name}</strong>
              <span>{ChaseClock(cartridge.duration)}</span>
            </button>
          ))}
          {!snapshot.cartridges.length ? (
            <p>No cartridges are configured for this station.</p>
          ) : null}
        </div>
      </section>
      <ChaseMusicVolume
        station={station}
        action={action}
        busy={busy}
        canEdit={canEdit}
      />
    </div>
  );
}

function ChaseEquipment({
  snapshot,
  station,
  action,
  busy,
  back,
}: ChaseStationProps & { back: () => void }) {
  const ready = station.stage === "ready" || station.stage === "live";
  const transition =
    station.stage === "deploying" || station.stage === "packing";
  const canOperate = snapshot.viewer.canOperate !== false;
  const collected = station.stage !== "stored";
  const positionChosen = ready || station.stage === "deploying";
  const steps = [
    {
      title: "Collect studio van",
      description: "Take your broadcast van from the depot.",
      done: collected,
      current: !collected,
    },
    {
      title: "Park at broadcast location",
      description: "Choose your location and stand beside the console.",
      done: positionChosen,
      current: collected && !positionChosen,
    },
    {
      title: "Deploy equipment",
      description: transition
        ? chaseStageLabels[station.stage]
        : "Set up the antenna and broadcast equipment.",
      done: ready,
      current: positionChosen && !ready,
    },
    {
      title: "Start broadcast",
      description: "Go on air and reach your listeners.",
      done: station.live,
      current: ready && !station.live,
    },
  ];
  return (
    <section className="chase-studio-equipment">
      <button className="chase-text-button chase-studio-back" onClick={back}>
        <ChaseIcon name="previous" size={17} />
        Studio / Console / Equipment
      </button>
      <div className="chase-studio-equipment-grid">
        <div>
          <div className="chase-section-heading">
            <div>
              <h2>Mobile studio</h2>
              <p>Manage your rig and prepare for deployment.</p>
            </div>
            <ChaseStatus live={station.live}>
              {station.live ? "LIVE" : "OFF AIR"}
            </ChaseStatus>
          </div>
          <figure className="chase-studio-van">
            <img
              src="images/senora-van.jpg"
              alt="Senora mobile studio captured in FiveM"
            />
            <figcaption>
              <ChaseIcon name="van" size={27} />
              <div>
                <strong>{chaseStageLabels[station.stage]}</strong>
                <span>
                  {station.vehicleNetId
                    ? "Van assigned to your station"
                    : "Van stored"}
                </span>
              </div>
            </figcaption>
          </figure>
          <div className="chase-studio-equipment-actions">
            {station.stage === "stored" ? (
              <button
                className="chase-button chase-primary"
                disabled={busy || !station.canManage || !canOperate}
                onClick={() =>
                  void action("spawnVan", {}, "Your studio van is ready.")
                }
              >
                <ChaseIcon name="van" />
                Collect van
              </button>
            ) : (
              <button
                className="chase-button chase-primary"
                disabled={
                  busy ||
                  !station.canManage ||
                  transition ||
                  (!ready && !canOperate)
                }
                onClick={() =>
                  void action(
                    ready ? "pack" : "deploy",
                    {},
                    ready ? "Rig packing started." : "Rig deployment started.",
                  )
                }
              >
                <ChaseIcon name="studio" />
                {transition
                  ? chaseStageLabels[station.stage]
                  : ready
                    ? "Pack rig"
                    : "Deploy equipment"}
              </button>
            )}
            <button
              className="chase-button chase-secondary"
              disabled={
                busy ||
                !station.canManage ||
                station.stage !== "parked" ||
                station.battery >= 100 ||
                !canOperate
              }
              onClick={() => void action("recharge", {}, "Battery recharged.")}
            >
              <ChaseIcon name="bolt" />
              Recharge at depot
            </button>
            {collected ? (
              <button
                className="chase-button chase-secondary"
                disabled={
                  busy || !station.canManage || station.stage !== "parked"
                }
                onClick={() =>
                  void action("storeVan", {}, "Van returned to the depot.")
                }
              >
                Store van
              </button>
            ) : null}
          </div>
          <p className="chase-caption">
            Collect, store and recharge at the depot. Deploy and pack beside
            your van. The server checks your location before changing the rig.
          </p>
        </div>
        <div className="chase-studio-checklist">
          <h3>Setup checklist</h3>
          <p>Prepare the mobile studio before going on air.</p>
          <ol>
            {steps.map((step, index) => (
              <li
                key={step.title}
                className={
                  step.done
                    ? "chase-step-done"
                    : step.current
                      ? "chase-step-current"
                      : ""
                }
              >
                <span>
                  {step.done ? <ChaseIcon name="check" size={22} /> : index + 1}
                </span>
                <div>
                  <strong>{step.title}</strong>
                  <p>{step.description}</p>
                </div>
                <small>
                  {step.done ? "Ready" : step.current ? "Current" : "Pending"}
                </small>
              </li>
            ))}
          </ol>
          <ChaseSectionTitle>Van battery</ChaseSectionTitle>
          <div className="chase-studio-battery-meter">
            <ChaseMeter value={station.battery} max={100} label="Van battery" />
            <strong>{Math.round(station.battery)}%</strong>
          </div>
          {station.battery < 25 ? (
            <p className="chase-studio-warning">
              <ChaseIcon name="info" size={18} />
              Low battery — recharge before broadcasting.
            </p>
          ) : null}
        </div>
      </div>
      <div className="chase-studio-readiness">
        <div>
          <strong>Studio readiness</strong>
          <span>
            {ready
              ? "Rig deployed and ready"
              : "Deploy your equipment before going live"}
          </span>
        </div>
        <div>
          <ChaseIcon name="broadcast" />
          <span>
            Transmitter<strong>{station.live ? "On air" : "Offline"}</strong>
          </span>
        </div>
        <div>
          <ChaseIcon name="mic" />
          <span>
            Microphone<strong>{station.micLive ? "Open" : "Closed"}</strong>
          </span>
        </div>
        <div>
          <ChaseIcon name="signal" />
          <span>
            Coverage
            <strong>
              {snapshot.config.powerModes.find(
                (mode) => mode.id === station.power,
              )?.label || station.power}
            </strong>
          </span>
        </div>
        <ChaseBroadcastSwitch
          snapshot={snapshot}
          station={station}
          action={action}
          busy={busy}
        />
      </div>
    </section>
  );
}

export function ChaseRequests({
  snapshot,
  action,
  busy,
  heading = true,
}: ChaseStudioProps & { heading?: boolean }) {
  const [filter, setFilter] = useState("pending");
  const [kind, setKind] = useState("all");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [resolving, setResolving] = useState(false);
  const [issue, setIssue] = useState("");
  const requests = snapshot.requests.filter(
    (request) =>
      (filter === "all" || request.status === "pending") &&
      (kind === "all" ||
        (kind === "song"
          ? Boolean(request.url)
          : kind === "message"
            ? !request.url && request.kind !== "advertisement"
            : request.kind === kind)),
  );
  const selected =
    requests.find((request) => request.id === selectedId) || requests[0];
  const canManage = snapshot.mine?.canManage === true;
  async function queueRequest() {
    if (!selected?.url || resolving) return;
    setResolving(true);
    setIssue("");
    try {
      const track = await ChaseResolveTrack(selected.url);
      await action(
        "queueRequest",
        {
          requestId: selected.id,
          title: track.title,
          duration: track.duration,
        },
        "Song added to the queue and request accepted.",
      );
    } catch (failure) {
      setIssue(ChaseError(failure));
    } finally {
      setResolving(false);
    }
  }
  return (
    <section className="chase-card chase-content-card chase-studio-requests">
      {heading ? (
        <div className="chase-section-heading">
          <div>
            <h2>Listener requests</h2>
            <p>Your listeners have something to say.</p>
          </div>
        </div>
      ) : null}
      <div className="chase-studio-request-filters">
        <div className="chase-segmented" aria-label="Request status">
          <button
            aria-pressed={filter === "pending"}
            className={filter === "pending" ? "chase-selected" : ""}
            onClick={() => setFilter("pending")}
          >
            Pending{" "}
            <span>
              {
                snapshot.requests.filter(
                  (request) => request.status === "pending",
                ).length
              }
            </span>
          </button>
          <button
            aria-pressed={filter === "all"}
            className={filter === "all" ? "chase-selected" : ""}
            onClick={() => setFilter("all")}
          >
            All messages
          </button>
        </div>
        <label>
          <span className="chase-sr-only">Request type</span>
          <select
            value={kind}
            onChange={(event) => setKind(event.target.value)}
          >
            <option value="all">All types</option>
            <option value="song">Song requests</option>
            <option value="message">Messages</option>
            <option value="advertisement">Advertisements</option>
          </select>
        </label>
      </div>
      {selected ? (
        <div className="chase-studio-request-grid">
          <div
            className="chase-studio-request-list"
            aria-label="Listener messages"
          >
            {requests.map((request) => (
              <button
                key={request.id}
                className={`chase-studio-request-row ${selected.id === request.id ? "chase-request-selected" : ""}`}
                aria-pressed={selected.id === request.id}
                onClick={() => {
                  setSelectedId(request.id);
                  setIssue("");
                }}
              >
                <span className="chase-avatar">
                  {ChaseInitials(request.senderName)}
                </span>
                <span>
                  <strong>{request.senderName}</strong>
                  <span>
                    <ChaseIcon
                      name={
                        request.url
                          ? "music"
                          : request.kind === "advertisement"
                            ? "broadcast"
                            : "message"
                      }
                      size={15}
                    />
                    {request.url
                      ? "Song request"
                      : request.kind === "advertisement"
                        ? "Advertisement"
                        : "Message"}
                  </span>
                  <small>{request.message}</small>
                </span>
                <span className="chase-studio-request-state">
                  {request.status}
                </span>
              </button>
            ))}
          </div>
          <article className="chase-studio-request-detail">
            <header>
              <span className="chase-studio-request-emblem">
                <ChaseIcon
                  name={
                    selected.url
                      ? "music"
                      : selected.kind === "advertisement"
                        ? "broadcast"
                        : "message"
                  }
                  size={34}
                />
              </span>
              <div>
                <span className="chase-eyebrow">
                  {selected.url
                    ? "SONG REQUEST"
                    : selected.kind === "advertisement"
                      ? "ADVERTISEMENT"
                      : "LISTENER MESSAGE"}
                </span>
                <h3>{selected.senderName}</h3>
                <small>
                  Received{" "}
                  {new Date(selected.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </small>
              </div>
            </header>
            <blockquote>{selected.message}</blockquote>
            {selected.url ? (
              <div className="chase-studio-request-link">
                <ChaseIcon name="link" size={23} />
                <div>
                  <strong>
                    {ChaseDetectProvider(selected.url) === "youtube"
                      ? "YouTube song link"
                      : "SoundCloud song link"}
                  </strong>
                  <span>{selected.url}</span>
                </div>
              </div>
            ) : null}
            <div className="chase-inline-actions">
              {selected.status === "pending" ? (
                <>
                  <button
                    className="chase-button chase-primary"
                    disabled={
                      busy ||
                      !canManage ||
                      resolving ||
                      (!!selected.url &&
                        (snapshot.viewer.canOperate === false ||
                          snapshot.config.music?.enabled === false))
                    }
                    onClick={() =>
                      selected.url
                        ? void queueRequest()
                        : void action(
                            "moderateRequest",
                            { requestId: selected.id, status: "accepted" },
                            "Message accepted.",
                          )
                    }
                  >
                    <ChaseIcon
                      name={selected.url ? "plus" : "check"}
                      size={20}
                    />
                    {resolving
                      ? "Checking song…"
                      : selected.url
                        ? "Add to queue"
                        : "Accept message"}
                  </button>
                  <button
                    className="chase-button chase-secondary"
                    disabled={busy || !canManage || resolving}
                    onClick={() =>
                      void action(
                        "moderateRequest",
                        { requestId: selected.id, status: "dismissed" },
                        "Message dismissed.",
                      )
                    }
                  >
                    <ChaseIcon name="trash" size={19} />
                    Dismiss
                  </button>
                </>
              ) : (
                <span className="chase-studio-request-handled">
                  <ChaseIcon
                    name={selected.status === "accepted" ? "check" : "close"}
                  />
                  This message was {selected.status}.
                </span>
              )}
            </div>
            {issue ? (
              <p className="chase-field-error" role="alert">
                {issue}
              </p>
            ) : (
              <p className="chase-caption">
                {selected.url
                  ? "Adding the linked song also marks the request as handled."
                  : "Accept a message to mark it as handled by your studio."}
              </p>
            )}
          </article>
        </div>
      ) : (
        <ChaseEmpty
          icon="message"
          title={
            filter === "pending" ? "You’re all caught up" : "No messages here"
          }
        >
          Listener requests and advertisements appear here when they arrive.
        </ChaseEmpty>
      )}
    </section>
  );
}

function ChaseCartridges({
  snapshot,
  station,
  action,
  busy,
  previewPlayback,
}: ChaseStationProps & { previewPlayback?: ChasePreviewPlayback | null }) {
  const canPlay = station.canManage && snapshot.viewer.canOperate !== false;
  const playing =
    station.nowPlaying?.provider === "file" ? station.nowPlaying : null;
  return (
    <section className="chase-card chase-content-card chase-studio-cartridges">
      <div className="chase-section-heading">
        <div>
          <h2>Cartridge library</h2>
          <p>Station idents, intermissions and sign-offs.</p>
        </div>
      </div>
      <div className="chase-cartridge-grid">
        {snapshot.cartridges.map((cartridge) => {
          const active = playing?.cartridgeId === cartridge.id;
          const matchingPreview = previewPlayback?.cartridgeId === cartridge.id;
          const preview = matchingPreview && previewPlayback.phase !== "error";
          const failedPreview =
            matchingPreview && previewPlayback.phase === "error";
          return (
            <article
              key={cartridge.id}
              className={`chase-cartridge-card ${active ? "chase-cartridge-active" : ""}`}
            >
              <div className="chase-studio-cartridge-heading">
                <ChaseIcon name="cassette" size={48} />
                <div>
                  <h3>{cartridge.name}</h3>
                  <p>{cartridge.description}</p>
                  <span className="chase-studio-duration">
                    {ChaseClock(cartridge.duration)}
                  </span>
                </div>
              </div>
              <div className="chase-studio-cartridge-state">
                {active ? (
                  <>
                    <ChaseProgress playing={playing} />
                    <strong>{playing?.paused ? "Paused" : "On air"}</strong>
                  </>
                ) : (
                  <span>
                    {matchingPreview
                      ? previewPlayback.phase === "playing"
                        ? "Private preview playing"
                        : previewPlayback.phase === "loading"
                          ? "Loading preview…"
                          : "Preview unavailable"
                      : "Ready"}
                  </span>
                )}
              </div>
              <div className="chase-studio-cartridge-actions">
                <button
                  className="chase-button chase-secondary"
                  disabled={busy || (preview ? !station.canManage : !canPlay)}
                  onClick={() =>
                    void action(
                      preview ? "stopPreview" : "previewCartridge",
                      preview ? {} : { cartridgeId: cartridge.id },
                      preview
                        ? "Preview stopped."
                        : "Private preview requested.",
                    )
                  }
                >
                  <ChaseIcon name={preview ? "stop" : "headphones"} size={19} />
                  {preview
                    ? "Stop preview"
                    : failedPreview
                      ? "Retry preview"
                      : "Preview"}
                </button>
                <button
                  className="chase-button chase-primary"
                  disabled={
                    busy ||
                    (active ? !station.canManage : !canPlay || !station.live)
                  }
                  onClick={() =>
                    void action(
                      active ? "stopCartridge" : "playCartridge",
                      active ? {} : { cartridgeId: cartridge.id },
                      active
                        ? "Cartridge stopped."
                        : "Cartridge playback requested.",
                    )
                  }
                >
                  <ChaseIcon name={active ? "stop" : "play"} size={20} />
                  {active ? "Stop" : "Play on air"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      {!snapshot.cartridges.length ? (
        <ChaseEmpty icon="cassette" title="Your shelf is empty">
          Configured station cartridges will appear here.
        </ChaseEmpty>
      ) : null}
      {playing ? (
        <div className="chase-studio-cartridge-current">
          <ChaseSectionTitle>On-air playback</ChaseSectionTitle>
          <div>
            <ChaseIcon name="cassette" size={32} />
            <strong>{playing.title}</strong>
            <ChaseProgress playing={playing} />
            <button
              className="chase-button chase-primary"
              disabled={busy || !station.canManage}
              onClick={() =>
                void action("stopCartridge", {}, "Playback stopped.")
              }
            >
              <ChaseIcon name="stop" />
              Stop playback
            </button>
          </div>
        </div>
      ) : null}
      <p className="chase-caption">
        <ChaseIcon name="info" size={17} />
        Preview is private. On-air playback requires a live transmitter and
        proximity to the studio console.
      </p>
    </section>
  );
}

function ChaseMusicVolume({
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
  const [volume, setVolume] = useState(
    Math.round((station.musicVolume ?? 1) * 100),
  );
  useEffect(
    () => setVolume(Math.round((station.musicVolume ?? 1) * 100)),
    [station.musicVolume],
  );
  const changed = volume !== Math.round((station.musicVolume ?? 1) * 100);
  return (
    <div className="chase-studio-music-volume">
      <ChaseIcon name="volume" size={19} />
      <label>
        <span>Broadcast music volume</span>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          aria-label="Broadcast music volume"
          value={volume}
          disabled={busy || !canEdit}
          onChange={(event) => setVolume(Number(event.target.value))}
        />
      </label>
      <output>{volume}%</output>
      <button
        className="chase-button chase-secondary"
        disabled={busy || !canEdit || !changed}
        onClick={() =>
          void action(
            "musicVolume",
            { volume: volume / 100 },
            "Broadcast music volume updated.",
          )
        }
      >
        Apply
      </button>
    </div>
  );
}

export function ChaseMusic({
  snapshot,
  station,
  action,
  busy,
  heading = true,
}: ChaseStationProps & { heading?: boolean }) {
  const [link, setLink] = useState("");
  const [resolving, setResolving] = useState(false);
  const [issue, setIssue] = useState("");
  const inputId = useId();
  const music = snapshot.config.music;
  const queue = station.queue || [];
  const canEdit = station.canManage && snapshot.viewer.canOperate !== false;
  const full = music ? queue.length >= music.maxQueue : false;
  if (music?.enabled === false)
    return (
      <section className="chase-card chase-content-card">
        <ChaseEmpty icon="music" title="Music is switched off">
          Online track playback is disabled on this server.
        </ChaseEmpty>
      </section>
    );
  async function addTrack(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const url = link.trim();
    if (!url || resolving) return;
    setIssue("");
    const provider = ChaseDetectProvider(url);
    if (!provider) {
      setIssue("Enter a YouTube or SoundCloud track link.");
      return;
    }
    if (music?.providers?.[provider] === false) {
      setIssue(
        `${chaseProviderLabels[provider]} links are disabled on this server.`,
      );
      return;
    }
    setResolving(true);
    try {
      const track = await ChaseResolveTrack(url);
      if (
        await action(
          "queueAdd",
          { url, title: track.title, duration: track.duration },
          "Track added to the queue.",
        )
      )
        setLink("");
    } catch (failure) {
      setIssue(ChaseError(failure));
    } finally {
      setResolving(false);
    }
  }
  return (
    <section className="chase-card chase-content-card chase-studio-music">
      {heading ? (
        <div className="chase-section-heading">
          <h2>Music queue</h2>
          <span className="chase-count-pill">
            {queue.length}
            {music ? ` / ${music.maxQueue}` : ""} tracks
          </span>
        </div>
      ) : null}
      <ChaseNowPlaying
        station={station}
        action={action}
        busy={busy}
        canEdit={canEdit}
        compact
      />
      <form className="chase-music-add" onSubmit={addTrack}>
        <label htmlFor={inputId} className="chase-sr-only">
          Add a YouTube or SoundCloud track
        </label>
        <div className="chase-input-action">
          <ChaseIcon name="link" size={23} />
          <input
            id={inputId}
            type="url"
            placeholder="Paste a YouTube or SoundCloud link to add a track…"
            value={link}
            maxLength={300}
            required
            disabled={resolving || !canEdit}
            onChange={(event) => setLink(event.target.value)}
          />
          <button
            className="chase-button chase-primary"
            disabled={busy || resolving || !canEdit || full}
          >
            <ChaseIcon name="plus" size={22} />
            {resolving ? "Checking link…" : "Add track"}
          </button>
        </div>
        {issue ? (
          <p className="chase-field-error" role="alert">
            {issue}
          </p>
        ) : (
          <span className="chase-track-link-hint">
            {full
              ? "The queue is full. Remove a track to add another."
              : music
                ? `Tracks must be between ${ChaseClock(music.minDurationSeconds)} and ${ChaseClock(music.maxDurationSeconds)}.`
                : "The title and duration are read from your link."}
          </span>
        )}
      </form>
      <div className="chase-studio-queue-table">
        <div className="chase-studio-queue-head">
          <span>#</span>
          <span>Track</span>
          <span>Source</span>
          <span>Duration</span>
          <span>Actions</span>
        </div>
        <div className="chase-queue-list">
          {queue.map((track, index) => (
            <article key={track.id}>
              <span className="chase-queue-index">{index + 1}</span>
              <div className="chase-studio-queue-track">
                <ChaseTrackArt
                  track={track}
                  className="chase-studio-queue-art"
                />
                <strong>{track.title}</strong>
              </div>
              <span className="chase-studio-queue-source">
                {chaseProviderLabels[track.provider]}
              </span>
              <span className="chase-studio-queue-duration">
                {ChaseClock(track.duration)}
              </span>
              <div className="chase-studio-queue-actions">
                <button
                  className="chase-icon-button"
                  aria-label={`Move ${track.title} up`}
                  disabled={busy || !canEdit || index === 0}
                  onClick={() =>
                    void action(
                      "queueMove",
                      { trackId: track.id, position: index },
                      "Queue order updated.",
                    )
                  }
                >
                  <ChaseIcon name="up" size={17} />
                </button>
                <button
                  className="chase-icon-button"
                  aria-label={`Move ${track.title} down`}
                  disabled={busy || !canEdit || index === queue.length - 1}
                  onClick={() =>
                    void action(
                      "queueMove",
                      { trackId: track.id, position: index + 2 },
                      "Queue order updated.",
                    )
                  }
                >
                  <ChaseIcon name="down" size={17} />
                </button>
                <button
                  className="chase-icon-button"
                  aria-label={`Play ${track.title} now`}
                  disabled={busy || !station.live || !canEdit}
                  onClick={() =>
                    void action(
                      "playTrack",
                      { trackId: track.id },
                      "Track playback requested.",
                    )
                  }
                >
                  <ChaseIcon name="play" size={18} />
                </button>
                <button
                  className="chase-icon-button chase-studio-delete"
                  aria-label={`Remove ${track.title}`}
                  disabled={busy || !canEdit}
                  onClick={() =>
                    void action(
                      "queueRemove",
                      { trackId: track.id },
                      "Track removed from the queue.",
                    )
                  }
                >
                  <ChaseIcon name="trash" size={18} />
                </button>
              </div>
            </article>
          ))}
        </div>
        {!queue.length ? (
          <ChaseEmpty icon="music" title="Your next track starts here">
            Paste a supported track link to build your queue.
          </ChaseEmpty>
        ) : null}
      </div>
      <div className="chase-studio-music-summary">
        <p>
          <ChaseIcon name="info" size={18} />
          {station.mode === "autonomous"
            ? "Autonomous · the queue loops while the transmitter is live."
            : "DJ-managed · the queue stops after the last track."}
        </p>
        <ChaseMusicVolume
          station={station}
          action={action}
          busy={busy}
          canEdit={canEdit}
        />
      </div>
    </section>
  );
}

function ChaseCrew({ snapshot, action, busy }: ChaseStudioProps) {
  const [source, setSource] = useState("");
  const owner = snapshot.mine?.canWithdraw === true;
  const inputId = useId();
  return (
    <section className="chase-card chase-content-card chase-studio-crew">
      <div className="chase-studio-crew-roster">
        <div className="chase-section-heading">
          <div>
            <h2>Studio crew</h2>
            <p>Manage who can operate this station.</p>
          </div>
          <span className="chase-count-pill">
            {snapshot.crew.length} members
          </span>
        </div>
        <div className="chase-studio-crew-table">
          <div className="chase-studio-crew-head">
            <span>Name</span>
            <span>Status</span>
            <span>Access</span>
            <span>Action</span>
          </div>
          {owner ? (
            <div className="chase-studio-crew-row">
              <div>
                <span className="chase-avatar">
                  {ChaseInitials(snapshot.viewer.name)}
                </span>
                <strong>
                  {snapshot.viewer.name} <small>(You)</small>
                </strong>
              </div>
              <span>
                <ChaseStatus live>Connected</ChaseStatus>
              </span>
              <span>Owner</span>
              <span>—</span>
            </div>
          ) : null}
          {snapshot.crew.map((member) => (
            <div
              key={member.memberId ?? member.source}
              className="chase-studio-crew-row"
            >
              <div>
                <span className="chase-avatar">
                  {ChaseInitials(member.name)}
                </span>
                <strong>{member.name}</strong>
              </div>
              <span>
                <ChaseStatus live={member.online === true}>
                  {member.online === true
                    ? "Online"
                    : member.online === false
                      ? "Offline"
                      : "Unknown"}
                </ChaseStatus>
                {member.online && member.source > 0 ? (
                  <small>ID {member.source}</small>
                ) : null}
              </span>
              <span>Operator</span>
              {owner ? (
                <button
                  className="chase-icon-button chase-studio-delete"
                  aria-label={`Remove ${member.name} from crew`}
                  disabled={busy}
                  onClick={() =>
                    void action(
                      "crewRemove",
                      member.memberId
                        ? { memberId: member.memberId }
                        : { source: member.source },
                      "Crew member removed.",
                    )
                  }
                >
                  <ChaseIcon name="trash" size={19} />
                </button>
              ) : (
                <span>—</span>
              )}
            </div>
          ))}
          {!snapshot.crew.length && !owner ? (
            <ChaseEmpty icon="users" title="No crew members">
              The station owner can add connected players.
            </ChaseEmpty>
          ) : null}
        </div>
        <p className="chase-caption">
          <ChaseIcon name="info" size={18} />
          {owner
            ? "You own this station. Crew access and station funds are yours to manage."
            : "Crew members can operate the station. The owner manages membership and funds."}
        </p>
      </div>
      <aside className="chase-studio-crew-add">
        <h3>Add crew member</h3>
        <p>Enter a player’s server ID to add them to your crew.</p>
        {owner ? (
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await action(
                  "crewAdd",
                  { source: Number(source) },
                  "Crew member added.",
                )
              )
                setSource("");
            }}
          >
            <label htmlFor={inputId}>Player server ID</label>
            <input
              id={inputId}
              type="number"
              min="1"
              step="1"
              required
              placeholder="Enter server ID"
              value={source}
              onChange={(event) => setSource(event.target.value)}
            />
            <button
              className="chase-button chase-primary chase-full"
              disabled={busy}
            >
              <ChaseIcon name="plus" size={21} />
              Add to crew
            </button>
            <small>The server checks that the player is connected.</small>
          </form>
        ) : (
          <p className="chase-studio-access-note">
            Only the station owner can add or remove crew.
          </p>
        )}
        <div className="chase-studio-crew-permissions">
          <h3>Crew access</h3>
          <p>
            Crew members can operate the console, manage music and handle
            requests. Only the owner can withdraw station funds.
          </p>
        </div>
      </aside>
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
}: ChaseStationProps) {
  const mode = station.mode || "dj";
  const canEdit = station.canManage && snapshot.viewer.canOperate !== false;
  return (
    <div className="chase-mode-control">
      <div>
        <strong>Station mode</strong>
        <small>
          {mode === "autonomous"
            ? "The music queue loops while the transmitter is live."
            : "A DJ starts tracks. The queue plays in order and stops when it ends."}
        </small>
      </div>
      <div className="chase-segmented" aria-label="Station mode">
        {[
          { id: "dj", label: "DJ-managed" },
          { id: "autonomous", label: "Autonomous" },
        ].map((option) => (
          <button
            key={option.id}
            type="button"
            className={mode === option.id ? "chase-selected" : ""}
            aria-pressed={mode === option.id}
            disabled={busy || !canEdit || mode === option.id}
            onClick={() =>
              void action(
                "setMode",
                { mode: option.id },
                "Station mode updated.",
              )
            }
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChaseBalance({ snapshot, station, action, busy }: ChaseStationProps) {
  const [amount, setAmount] = useState("");
  const inputId = useId();
  return (
    <section className="chase-studio-balance">
      <ChaseSectionTitle>Station balance</ChaseSectionTitle>
      {station.canWithdraw && typeof station.balance === "number" ? (
        <>
          <strong className="chase-studio-balance-value">
            {ChaseMoney(station.balance, snapshot.config.currency)}
          </strong>
          <p>Funded by listener tips.</p>
          <form
            onSubmit={async (event) => {
              event.preventDefault();
              if (
                await action(
                  "withdraw",
                  { amount: Number(amount) },
                  "Withdrawal completed.",
                )
              )
                setAmount("");
            }}
          >
            <label htmlFor={inputId}>Withdraw amount</label>
            <div className="chase-input-action">
              <input
                id={inputId}
                type="number"
                min="1"
                max={station.balance}
                step="1"
                required
                placeholder="Amount"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
              <button
                className="chase-button chase-secondary"
                disabled={busy || station.balance <= 0}
              >
                Withdraw
              </button>
            </div>
          </form>
          <small>Owner access only.</small>
        </>
      ) : (
        <p>Station funds are managed by the owner.</p>
      )}
    </section>
  );
}

function ChaseSettings({ snapshot, station, action, busy }: ChaseStationProps) {
  const current = {
    ...ChaseStationSettings(station),
    mode: station.mode || "dj",
  };
  const [form, setForm] = useState(current);
  const serialized = JSON.stringify(current);
  const previous = useRef(serialized);
  useEffect(() => {
    if (previous.current !== serialized) {
      const old = previous.current;
      previous.current = serialized;
      setForm((draft) =>
        JSON.stringify(draft) === old ? JSON.parse(serialized) : draft,
      );
    }
  }, [serialized]);
  const dirty = JSON.stringify(form) !== serialized;
  const canEdit = station.canManage && snapshot.viewer.canOperate !== false;
  const transmissionLocked =
    station.live ||
    station.stage === "deploying" ||
    station.stage === "packing";
  const locked = busy || !canEdit || transmissionLocked;
  const formId = useId();
  return (
    <section className="chase-card chase-content-card chase-studio-settings">
      <div className="chase-section-heading">
        <div>
          <h2>Station settings</h2>
          <p>Configure your identity and transmission settings.</p>
        </div>
      </div>
      {transmissionLocked ? (
        <p className="chase-studio-settings-lock" role="status">
          <ChaseIcon name="info" size={18} />
          Stop the broadcast and wait for the rig to finish moving before
          editing station settings.
        </p>
      ) : null}
      <div className="chase-studio-settings-grid">
        <form
          id={formId}
          onSubmit={async (event) => {
            event.preventDefault();
            if (locked) return;
            const saved = {
              ...form,
              name: form.name.trim(),
              tagline: form.tagline.trim(),
              showTitle: form.showTitle.trim(),
            };
            if (await action("updateStation", saved, "Station settings saved."))
              setForm(saved);
          }}
        >
          <fieldset disabled={locked}>
            <legend>Identity</legend>
            <label>
              <span>Station name</span>
              <input
                value={form.name}
                required
                minLength={3}
                maxLength={48}
                onChange={(event) =>
                  setForm({ ...form, name: event.target.value })
                }
              />
            </label>
            <label>
              <span>Tagline</span>
              <input
                value={form.tagline}
                maxLength={100}
                onChange={(event) =>
                  setForm({ ...form, tagline: event.target.value })
                }
              />
            </label>
            <label>
              <span>Show title</span>
              <input
                value={form.showTitle}
                maxLength={64}
                onChange={(event) =>
                  setForm({ ...form, showTitle: event.target.value })
                }
              />
            </label>
          </fieldset>
          <fieldset disabled={locked}>
            <legend>Transmission</legend>
            <label>
              <span>Frequency (MHz)</span>
              <input
                type="number"
                min={snapshot.config.frequencyMin / 10}
                max={snapshot.config.frequencyMax / 10}
                step="0.1"
                required
                value={form.frequency / 10}
                onChange={(event) =>
                  setForm({
                    ...form,
                    frequency: Math.round(Number(event.target.value) * 10),
                  })
                }
              />
            </label>
            <label>
              <span>Transmitter power</span>
              <select
                value={form.power}
                onChange={(event) =>
                  setForm({ ...form, power: event.target.value })
                }
              >
                {snapshot.config.powerModes.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="chase-checkbox-label">
              <input
                type="checkbox"
                checked={form.isPublic}
                onChange={(event) =>
                  setForm({ ...form, isPublic: event.target.checked })
                }
              />
              <span>
                List in station directory
                <small>
                  Unlisted stations can still be tuned by frequency.
                </small>
              </span>
            </label>
          </fieldset>
        </form>
        <div>
          <fieldset className="chase-studio-mode-options" disabled={locked}>
            <legend>Playback mode</legend>
            {(
              [
                {
                  id: "dj",
                  name: "DJ-managed",
                  description:
                    "A DJ starts tracks, takes requests and manages the station in real time.",
                },
                {
                  id: "autonomous",
                  name: "Autonomous",
                  description:
                    "The music queue loops automatically while the transmitter is live.",
                },
              ] as const
            ).map((mode) => (
              <label key={mode.id}>
                <input
                  type="radio"
                  name={`${formId}-mode`}
                  checked={form.mode === mode.id}
                  onChange={() => setForm({ ...form, mode: mode.id })}
                />
                <span>
                  <strong>{mode.name}</strong>
                  <small>{mode.description}</small>
                </span>
              </label>
            ))}
          </fieldset>
          <ChaseBalance
            snapshot={snapshot}
            station={station}
            action={action}
            busy={busy}
          />
        </div>
      </div>
      <footer className="chase-studio-settings-footer">
        <div>
          <ChaseIcon name={dirty ? "info" : "check"} size={27} />
          <span>
            <strong>{dirty ? "Unsaved changes" : "All changes saved"}</strong>
            <small>
              {dirty
                ? "Save to apply your station settings."
                : "Your station is up to date."}
            </small>
          </span>
        </div>
        <button
          type="button"
          className="chase-button chase-secondary"
          disabled={busy || !dirty}
          onClick={() => setForm(current)}
        >
          Discard
        </button>
        <button
          form={formId}
          className="chase-button chase-primary"
          disabled={locked || !dirty}
        >
          <ChaseIcon name="check" size={20} />
          Save station
        </button>
      </footer>
    </section>
  );
}

export function ChaseCreateStation({
  snapshot,
  action,
  busy,
}: ChaseStudioProps) {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [frequency, setFrequency] = useState(
    Math.max(
      snapshot.config.frequencyMin,
      Math.min(snapshot.config.frequencyMax, 987),
    ),
  );
  return (
    <section className="chase-card chase-create-station">
      <div className="chase-create-intro">
        <span className="chase-modal-icon">
          <ChaseIcon name="broadcast" size={28} />
        </span>
        <div>
          <h2>Create your station</h2>
          <p>Reserve a frequency. Bring the airwaves to life.</p>
        </div>
        <span className="chase-create-price">
          {ChaseMoney(snapshot.config.stationPrice, snapshot.config.currency)}
          <small>Acquisition price</small>
        </span>
      </div>
      <form
        onSubmit={async (event) => {
          event.preventDefault();
          await action(
            "createStation",
            { name, tagline, frequency },
            "Your station is ready.",
          );
        }}
      >
        <label>
          Station name
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            minLength={3}
            maxLength={48}
            required
            placeholder="Station name"
          />
        </label>
        <label>
          Tagline
          <input
            value={tagline}
            onChange={(event) => setTagline(event.target.value)}
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
            value={frequency / 10}
            onChange={(event) =>
              setFrequency(Math.round(Number(event.target.value) * 10))
            }
            required
          />
        </label>
        <p className="chase-caption">
          Visit the acquisition point to purchase a station and reserve an
          available frequency.
        </p>
        <button
          className="chase-button chase-primary chase-full"
          disabled={busy || !snapshot.viewer.canCreate}
        >
          Acquire station
          <ChaseIcon name="arrow" size={18} />
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
