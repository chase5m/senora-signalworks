import { useEffect, useState } from "react";
import { ChaseClock, chasePreview } from "./transport";
import { ChaseVideoId } from "./players";
import type { ChaseNowPlaying, ChaseStation, ChaseTrack } from "./types";

export function ChaseStationArt({
  station,
  className = "",
}: {
  station?: ChaseStation | null;
  className?: string;
}) {
  return (
    <img
      className={`chase-station-art ${className}`}
      src="images/senora-station.png"
      alt={
        station ? `${station.name} · Senora Signalworks` : "Senora Signalworks"
      }
    />
  );
}

export function ChaseTrackArt({
  track,
  className = "",
}: {
  track?: ChaseTrack | ChaseNowPlaying | null;
  className?: string;
}) {
  const chaseUrl = track && "url" in track ? track.url : "";
  const chaseVideo = chaseUrl && !chasePreview ? ChaseVideoId(chaseUrl) : null;
  const chaseSource = chaseVideo
    ? `https://i.ytimg.com/vi/${chaseVideo}/hqdefault.jpg`
    : "images/senora-track.png";
  const [chaseFailed, chaseSetFailed] = useState(false);
  useEffect(() => chaseSetFailed(false), [chaseSource]);
  return (
    <img
      className={`chase-track-art ${className}`}
      src={chaseFailed ? "images/senora-track.png" : chaseSource}
      alt=""
      onError={() => chaseSetFailed(true)}
    />
  );
}

export function ChaseMeter({
  value,
  max = 1,
  label = "Level",
}: {
  value: number | null;
  max?: number;
  label?: string;
}) {
  const chaseRatio =
    value === null || !Number.isFinite(value)
      ? 0
      : Math.max(0, Math.min(1, value / Math.max(max, 1)));
  return (
    <meter
      className="chase-equipment-meter"
      min={0}
      max={max}
      value={chaseRatio * max}
      aria-label={label}
    />
  );
}

export function ChaseReceptionLabel(value: number | null) {
  return value === null
    ? "Not tuned"
    : value >= 0.66
      ? "Strong"
      : value >= 0.33
        ? "Moderate"
        : value > 0
          ? "Weak"
          : "No signal";
}

export function ChaseProgress({
  playing,
}: {
  playing?: ChaseNowPlaying | null;
}) {
  const [chaseTick, chaseSetTick] = useState(Date.now());
  useEffect(() => {
    const chaseInterval = window.setInterval(
      () => chaseSetTick(Date.now()),
      500,
    );
    return () => window.clearInterval(chaseInterval);
  }, []);
  const chaseElapsed = playing
    ? Math.max(
        0,
        Math.min(
          playing.duration,
          playing.paused
            ? playing.offsetSeconds || 0
            : chaseTick / 1000 - playing.startedAt,
        ),
      )
    : 0;
  return (
    <div className="chase-playback-progress">
      <time>{ChaseClock(chaseElapsed)}</time>
      <progress
        aria-label="Playback progress"
        value={chaseElapsed}
        max={playing?.duration || 1}
      />
      <time>{ChaseClock(playing?.duration || 0)}</time>
    </div>
  );
}
