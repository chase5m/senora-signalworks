import type { ChaseTrackProvider } from "./types";
type ChaseYouTubePlayer = {
  playVideo(): void;
  pauseVideo(): void;
  stopVideo(): void;
  mute(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getDuration(): number;
  getVideoData(): {
    title?: string;
    video_id?: string;
  };
  destroy(): void;
};
type ChaseYouTubeEvent<T> = {
  data: T;
  target: ChaseYouTubePlayer;
};
type ChaseYouTubeNamespace = {
  Player: new (
    element: HTMLElement,
    options: {
      width?: string;
      height?: string;
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (event: ChaseYouTubeEvent<unknown>) => void;
        onStateChange?: (event: ChaseYouTubeEvent<number>) => void;
        onError?: (event: ChaseYouTubeEvent<number>) => void;
      };
    },
  ) => ChaseYouTubePlayer;
  PlayerState: {
    ENDED: number;
    PLAYING: number;
  };
};
type ChaseSoundCloudWidget = {
  bind(event: string, listener: (data?: unknown) => void): void;
  unbind(event: string): void;
  play(): void;
  pause(): void;
  seekTo(milliseconds: number): void;
  setVolume(volume: number): void;
  getDuration(callback: (milliseconds: number) => void): void;
  getCurrentSound(
    callback: (
      sound: {
        title?: string;
        duration?: number;
      } | null,
    ) => void,
  ): void;
};
type ChaseSoundCloudNamespace = {
  Widget: ((iframe: HTMLIFrameElement) => ChaseSoundCloudWidget) & {
    Events: {
      READY: string;
      PLAY: string;
      FINISH: string;
      ERROR: string;
    };
  };
};
declare global {
  interface Window {
    YT?: ChaseYouTubeNamespace;
    SC?: ChaseSoundCloudNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}
export type ChasePlayer = {
  setVolume(fraction: number): void;
  seek(seconds: number): void;
  play(): void;
  pause(): void;
  destroy(): void;
};
export type ChasePlayerOptions = {
  provider: ChaseTrackProvider;
  url: string;
  onPlaying?: () => void;
  onEnded?: () => void;
  onError?: (message: string) => void;
};
export type ChaseResolvedTrack = {
  provider: ChaseTrackProvider;
  title: string;
  duration: number;
};
const chaseLoadTimeout = 15000;
const chaseYouTubePatterns = [
  /^https:\/\/(www\.|music\.)?youtube\.com\/watch\?v=([A-Za-z0-9_-]{11})/,
  /^https:\/\/youtu\.be\/([A-Za-z0-9_-]{11})/,
  /^https:\/\/(www\.)?youtube\.com\/shorts\/([A-Za-z0-9_-]{11})/,
];
const chaseSoundCloudPatterns = [
  /^https:\/\/(www\.|m\.)?soundcloud\.com\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+(\?[^\s]*)?$/,
  /^https:\/\/on\.soundcloud\.com\/[A-Za-z0-9]+/,
];
const chaseScripts = new Map<string, Promise<void>>();
let chaseYouTubeReady: Promise<ChaseYouTubeNamespace> | null = null;
let chaseSoundCloudReady: Promise<ChaseSoundCloudNamespace> | null = null;
export function ChaseCleanTitle(value: string | undefined, fallback: string) {
  const chaseStrip = (text: string) =>
    text
      .replace(/[<>\u0000-\u001f\u007f]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  const chaseSource = chaseStrip(value || "") || chaseStrip(fallback);
  return Array.from(chaseSource).slice(0, 120).join("").trim() || "Track";
}
export function ChaseVideoId(url: string) {
  for (const chasePattern of chaseYouTubePatterns) {
    const chaseMatch = chasePattern.exec(url);
    if (chaseMatch) return chaseMatch[chaseMatch.length - 1];
  }
  return null;
}
export function ChaseDetectProvider(url: string): ChaseTrackProvider | null {
  if (ChaseVideoId(url)) return "youtube";
  if (chaseSoundCloudPatterns.some((chasePattern) => chasePattern.test(url)))
    return "soundcloud";
  return null;
}
function ChaseWithTimeout<T>(
  promise: Promise<T>,
  message: string,
  milliseconds = chaseLoadTimeout,
) {
  let chaseTimer: number | undefined;
  return Promise.race([
    promise,
    new Promise<T>((_, chaseReject) => {
      chaseTimer = window.setTimeout(
        () => chaseReject(new Error(message)),
        milliseconds,
      );
    }),
  ]).finally(() => window.clearTimeout(chaseTimer));
}
function ChaseLoadScript(src: string) {
  let chasePending = chaseScripts.get(src);
  if (!chasePending) {
    chasePending = new Promise<void>((chaseResolve, chaseReject) => {
      const chaseScript = document.createElement("script");
      chaseScript.src = src;
      chaseScript.async = true;
      chaseScript.onload = () => chaseResolve();
      chaseScript.onerror = () => {
        chaseScripts.delete(src);
        chaseReject(new Error("The player library could not be loaded."));
      };
      document.head.appendChild(chaseScript);
    });
    chaseScripts.set(src, chasePending);
  }
  return chasePending;
}
function ChaseAwaitGlobal<T>(read: () => T | undefined, message: string) {
  return ChaseWithTimeout(
    new Promise<T>((chaseResolve) => {
      const chaseTimer = window.setInterval(() => {
        const chaseValue = read();
        if (chaseValue) {
          window.clearInterval(chaseTimer);
          chaseResolve(chaseValue);
        }
      }, 100);
    }),
    message,
  );
}
export function ChaseLoadYouTube() {
  chaseYouTubeReady ||= (async () => {
    if (window.YT?.Player) return window.YT;
    const chasePrevious = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => chasePrevious?.();
    await ChaseLoadScript("https://www.youtube.com/iframe_api");
    return ChaseAwaitGlobal(
      () => (window.YT?.Player ? window.YT : undefined),
      "The YouTube player did not respond.",
    );
  })().catch((chaseFailure) => {
    chaseYouTubeReady = null;
    throw chaseFailure;
  });
  return chaseYouTubeReady;
}
export function ChaseLoadSoundCloud() {
  chaseSoundCloudReady ||= (async () => {
    if (window.SC?.Widget) return window.SC;
    await ChaseLoadScript("https://w.soundcloud.com/player/api.js");
    return ChaseAwaitGlobal(
      () => (window.SC?.Widget ? window.SC : undefined),
      "The SoundCloud player did not respond.",
    );
  })().catch((chaseFailure) => {
    chaseSoundCloudReady = null;
    throw chaseFailure;
  });
  return chaseSoundCloudReady;
}
function ChaseHiddenHost() {
  const chaseHost = document.createElement("div");
  chaseHost.className = "chase-hidden-player";
  chaseHost.setAttribute("aria-hidden", "true");
  document.body.appendChild(chaseHost);
  return chaseHost;
}
function ChaseYouTubeMessage(code: number) {
  if (code === 100) return "This video is unavailable.";
  if (code === 101 || code === 150)
    return "This video does not allow embedded playback.";
  return "The YouTube player failed to play this video.";
}
function ChaseYouTubeEmbed(
  host: HTMLElement,
  videoId: string,
  events: {
    onReady: (player: ChaseYouTubePlayer) => void;
    onState?: (state: number, player: ChaseYouTubePlayer) => void;
    onError: (message: string) => void;
  },
) {
  return ChaseLoadYouTube().then((chaseNamespace) => {
    const chaseTarget = document.createElement("div");
    host.appendChild(chaseTarget);
    const chaseVars: Record<string, string | number> = {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      enablejsapi: 1,
      playsinline: 1,
      rel: 0,
    };
    if (window.location.protocol === "https:")
      chaseVars.origin = window.location.origin;
    return new chaseNamespace.Player(chaseTarget, {
      width: "1",
      height: "1",
      videoId,
      playerVars: chaseVars,
      events: {
        onReady: (chaseEvent) => events.onReady(chaseEvent.target),
        onStateChange: (chaseEvent) =>
          events.onState?.(chaseEvent.data, chaseEvent.target),
        onError: (chaseEvent) =>
          events.onError(ChaseYouTubeMessage(chaseEvent.data)),
      },
    });
  });
}
function ChaseSoundCloudEmbed(
  host: HTMLElement,
  url: string,
  events: {
    onReady: (widget: ChaseSoundCloudWidget) => void;
    onPlay?: () => void;
    onFinish?: () => void;
    onError: (message: string) => void;
  },
) {
  return ChaseLoadSoundCloud().then((chaseNamespace) => {
    const chaseFrame = document.createElement("iframe");
    chaseFrame.width = "1";
    chaseFrame.height = "1";
    chaseFrame.allow = "autoplay";
    chaseFrame.src = `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&auto_play=false`;
    host.appendChild(chaseFrame);
    const chaseWidget = chaseNamespace.Widget(chaseFrame);
    chaseWidget.bind(chaseNamespace.Widget.Events.READY, () =>
      events.onReady(chaseWidget),
    );
    chaseWidget.bind(chaseNamespace.Widget.Events.PLAY, () =>
      events.onPlay?.(),
    );
    chaseWidget.bind(chaseNamespace.Widget.Events.FINISH, () =>
      events.onFinish?.(),
    );
    chaseWidget.bind(chaseNamespace.Widget.Events.ERROR, () =>
      events.onError("The SoundCloud player failed to play this track."),
    );
    return chaseWidget;
  });
}
export function ChaseCreatePlayer(options: ChasePlayerOptions): ChasePlayer {
  const chaseHost = ChaseHiddenHost();
  let chaseDestroyed = false;
  let chaseVolume = 1;
  let chaseOffset = 0;
  let chaseWantPlay = false;
  let chaseBackend: ChasePlayer | null = null;
  let chaseTeardown: (() => void) | null = null;
  const chaseReadyTimer = window.setTimeout(() => {
    if (!chaseBackend) ChaseFail("The track player did not respond.");
  }, chaseLoadTimeout);
  function ChaseFail(message: string) {
    if (!chaseDestroyed) options.onError?.(message);
  }
  function ChaseAttach(backend: ChasePlayer, teardown: () => void) {
    window.clearTimeout(chaseReadyTimer);
    if (chaseDestroyed) {
      teardown();
      return;
    }
    chaseBackend = backend;
    chaseTeardown = teardown;
    backend.setVolume(chaseVolume);
    backend.seek(chaseOffset);
    if (chaseWantPlay) backend.play();
  }
  const chaseSetup =
    options.provider === "youtube"
      ? (() => {
          const chaseVideoId = ChaseVideoId(options.url);
          if (!chaseVideoId)
            return Promise.reject(new Error("The YouTube link is invalid."));
          return ChaseYouTubeEmbed(chaseHost, chaseVideoId, {
            onReady: (chasePlayer) =>
              ChaseAttach(
                {
                  setVolume: (chaseFraction) =>
                    chasePlayer.setVolume(Math.round(chaseFraction * 100)),
                  seek: (chaseSeconds) =>
                    chasePlayer.seekTo(chaseSeconds, true),
                  play: () => chasePlayer.playVideo(),
                  pause: () => chasePlayer.pauseVideo(),
                  destroy: () => chasePlayer.destroy(),
                },
                () => chasePlayer.destroy(),
              ),
            onState: (chaseState) => {
              if (chaseDestroyed) return;
              if (chaseState === window.YT?.PlayerState.PLAYING)
                options.onPlaying?.();
              if (chaseState === window.YT?.PlayerState.ENDED)
                options.onEnded?.();
            },
            onError: ChaseFail,
          });
        })()
      : ChaseSoundCloudEmbed(chaseHost, options.url, {
          onReady: (chaseWidget) =>
            ChaseAttach(
              {
                setVolume: (chaseFraction) =>
                  chaseWidget.setVolume(Math.round(chaseFraction * 100)),
                seek: (chaseSeconds) =>
                  chaseWidget.seekTo(Math.round(chaseSeconds * 1000)),
                play: () => chaseWidget.play(),
                pause: () => chaseWidget.pause(),
                destroy: () => chaseWidget.pause(),
              },
              () => chaseWidget.pause(),
            ),
          onPlay: () => {
            if (!chaseDestroyed) options.onPlaying?.();
          },
          onFinish: () => {
            if (!chaseDestroyed) options.onEnded?.();
          },
          onError: ChaseFail,
        });
  ChaseWithTimeout<unknown>(
    chaseSetup,
    "The track player did not load in time.",
  ).catch((chaseFailure) =>
    ChaseFail(
      chaseFailure instanceof Error
        ? chaseFailure.message
        : "The track player could not be started.",
    ),
  );
  return {
    setVolume(fraction) {
      chaseVolume = Math.max(0, Math.min(1, fraction));
      chaseBackend?.setVolume(chaseVolume);
    },
    seek(seconds) {
      chaseOffset = Math.max(0, seconds);
      chaseBackend?.seek(chaseOffset);
    },
    play() {
      chaseWantPlay = true;
      chaseBackend?.play();
    },
    pause() {
      chaseWantPlay = false;
      chaseBackend?.pause();
    },
    destroy() {
      if (chaseDestroyed) return;
      chaseDestroyed = true;
      window.clearTimeout(chaseReadyTimer);
      try {
        chaseTeardown?.();
      } catch {
        chaseTeardown = null;
      }
      chaseBackend = null;
      chaseHost.remove();
    },
  };
}
function ChaseProbeYouTube(
  host: HTMLElement,
  url: string,
  release: (cleanup: () => void) => void,
) {
  const chaseVideoId = ChaseVideoId(url);
  if (!chaseVideoId)
    return Promise.reject(new Error("The YouTube link is invalid."));
  return new Promise<ChaseResolvedTrack>((chaseResolve, chaseReject) => {
    let chasePoll: number | undefined;
    let chaseSettled = false;
    let chaseProbe: ChaseYouTubePlayer | null = null;
    release(() => {
      chaseSettled = true;
      window.clearInterval(chasePoll);
      chaseProbe?.destroy();
      chaseProbe = null;
    });
    function ChaseFinish(player: ChaseYouTubePlayer) {
      const chaseDuration = player.getDuration();
      if (!(chaseDuration > 0)) return false;
      chaseSettled = true;
      window.clearInterval(chasePoll);
      const chaseTitle = player.getVideoData().title?.trim();
      chaseResolve({
        provider: "youtube",
        title: ChaseCleanTitle(chaseTitle, url),
        duration: Math.round(chaseDuration),
      });
      return true;
    }
    ChaseYouTubeEmbed(host, chaseVideoId, {
      onReady: (chasePlayer) => {
        if (chaseSettled) {
          chasePlayer.destroy();
          return;
        }
        chaseProbe = chasePlayer;
        if (ChaseFinish(chasePlayer)) return;
        chasePlayer.mute();
        chasePlayer.playVideo();
        chasePoll = window.setInterval(() => {
          if (!chaseSettled) ChaseFinish(chasePlayer);
        }, 250);
      },
      onError: (chaseMessage) => {
        window.clearInterval(chasePoll);
        if (!chaseSettled) chaseReject(new Error(chaseMessage));
      },
    }).catch(chaseReject);
  });
}
function ChaseProbeSoundCloud(host: HTMLElement, url: string) {
  return new Promise<ChaseResolvedTrack>((chaseResolve, chaseReject) => {
    ChaseSoundCloudEmbed(host, url, {
      onReady: (chaseWidget) =>
        chaseWidget.getCurrentSound((chaseSound) =>
          chaseWidget.getDuration((chaseMilliseconds) => {
            const chaseDuration = Math.round(
              (chaseMilliseconds || chaseSound?.duration || 0) / 1000,
            );
            if (!(chaseDuration > 0)) {
              chaseReject(new Error("This track has no playable duration."));
              return;
            }
            chaseResolve({
              provider: "soundcloud",
              title: ChaseCleanTitle(chaseSound?.title, url),
              duration: chaseDuration,
            });
          }),
        ),
      onError: (chaseMessage) => chaseReject(new Error(chaseMessage)),
    }).catch(chaseReject);
  });
}
export async function ChaseResolveTrack(
  url: string,
): Promise<ChaseResolvedTrack> {
  const chaseProvider = ChaseDetectProvider(url.trim());
  if (!chaseProvider)
    throw new Error("Enter a YouTube or SoundCloud track link.");
  const chaseHost = ChaseHiddenHost();
  const chaseCleanups: (() => void)[] = [];
  try {
    return await ChaseWithTimeout(
      chaseProvider === "youtube"
        ? ChaseProbeYouTube(chaseHost, url.trim(), (chaseCleanup) =>
            chaseCleanups.push(chaseCleanup),
          )
        : ChaseProbeSoundCloud(chaseHost, url.trim()),
      "The link took too long to load. Check it and try again.",
    );
  } finally {
    chaseCleanups.forEach((chaseCleanup) => chaseCleanup());
    chaseHost.remove();
  }
}
