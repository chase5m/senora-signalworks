import { ChaseEmpty, ChaseIcon, ChaseStatus } from "./components";
import { ChaseRequestForm, ChaseTipForm } from "./Listen";
import { ChaseCallControls } from "./Call";
import { ChaseFrequency } from "./transport";
import {
  ChaseMeter,
  ChaseReceptionLabel,
  ChaseStationArt,
} from "./presentation";
import type { ChaseAction, ChaseSnapshot, ChaseSpeech } from "./types";

export function ChaseDirectory({
  snapshot,
  speech,
  action,
  busy,
  quality = null,
  onListen,
}: {
  snapshot: ChaseSnapshot;
  speech: ChaseSpeech | null;
  action: ChaseAction;
  busy: boolean;
  refresh: () => void;
  quality?: number | null;
  onListen?: () => void;
  onMinimize?: () => void;
}) {
  const chaseStation = snapshot.stations.find(
    (chaseItem) => chaseItem.id === snapshot.tunedStationId,
  );
  if (!chaseStation)
    return (
      <section className="chase-onair-empty">
        <ChaseEmpty icon="headphones" title="Find your station first">
          Tune to a station in Listen, then come here to send requests and
          support the crew.
        </ChaseEmpty>
        <button className="chase-button chase-primary" onClick={onListen}>
          <ChaseIcon name="broadcast" />
          Browse stations
        </button>
      </section>
    );
  const chaseTalking =
    speech?.receiver?.stationId === chaseStation.id && speech.receiver.talking;
  return (
    <div className="chase-onair">
      <section className="chase-tuned-panel">
        <div className="chase-section-intro">
          <h2>CURRENTLY TUNED</h2>
          <p>Live radio from across Senora County.</p>
        </div>
        <div className="chase-tuned-identity">
          <ChaseStationArt station={chaseStation} />
          <div className="chase-tuned-details">
            <h2>{chaseStation.name}</h2>
            <span className="chase-eyebrow">SENORA COUNTY</span>
            <div className="chase-dial-frequency">
              {ChaseFrequency(chaseStation.frequency)}
              <small>FM</small>
            </div>
            <ChaseStatus live={chaseStation.live}>
              {chaseStation.live ? "LIVE" : "OFF AIR"}
            </ChaseStatus>
            <div className="chase-tuned-show">
              <span className="chase-eyebrow">SHOW</span>
              <h3>{chaseStation.showTitle || "No show scheduled"}</h3>
              <p>
                {chaseStation.hostName
                  ? `with ${chaseStation.hostName}`
                  : "Independent broadcast"}
              </p>
            </div>
            <div className="chase-tuned-show">
              <span className="chase-eyebrow">NOW PLAYING</span>
              <h3>
                {chaseTalking
                  ? "Live microphone"
                  : chaseStation.nowPlaying?.title || "Nothing playing"}
              </h3>
              <p>
                {chaseStation.nowPlaying?.provider === "file"
                  ? "Station cartridge"
                  : chaseStation.nowPlaying?.provider === "youtube"
                    ? "YouTube"
                    : chaseStation.nowPlaying?.provider === "soundcloud"
                      ? "SoundCloud"
                      : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="chase-tuned-reception">
          <span className="chase-eyebrow">RECEPTION</span>
          <div>
            <ChaseMeter value={quality} label="Signal strength" />
            <strong>{ChaseReceptionLabel(quality)}</strong>
          </div>
          <p>
            {quality === null
              ? "Waiting for receiver information."
              : quality > 0.66
                ? "Clear signal. Great reception in your area."
                : quality > 0
                  ? "Reception changes with your distance and surroundings."
                  : "Move within range of the transmitter."}
          </p>
        </div>
        <ChaseCallControls
          snapshot={snapshot}
          station={chaseStation}
          action={action}
          busy={busy}
        />
      </section>
      <section className="chase-send-panel">
        <div className="chase-section-intro">
          <h2>SEND TO THE STUDIO</h2>
          <p>Get your music heard on Senora County.</p>
        </div>
        <ChaseRequestForm
          key={chaseStation.id}
          snapshot={snapshot}
          station={chaseStation}
          action={action}
          busy={busy}
        />
        <ChaseTipForm
          snapshot={snapshot}
          station={chaseStation}
          action={action}
          busy={busy}
        />
      </section>
    </div>
  );
}
