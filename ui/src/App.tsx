import { useCallback, useEffect, useRef, useState } from "react";
import { ChaseEmpty, ChaseIcon, ChaseStatus, ChaseToast } from "./components";
import { ChaseListen } from "./Listen";
import { ChaseStudio } from "./Studio";
import { ChaseScanner } from "./Scanner";
import { ChaseReceiver } from "./Devices";
import { ChaseDirectory } from "./Directory";
import { ChaseNormalizeSpeech, ChaseSpeechIndicator } from "./Speech";
import { ChaseFieldHint } from "./FieldHint";
import { ChaseCallPopup, ChaseNormalizeIncomingCall } from "./Call";
import { ChasePhoneApp } from "./Phone";
import { ChaseCreatePlayer, type ChasePlayer } from "./players";
import {
  ChaseNormalizeProfile,
  ChaseApplyProfile,
  ChaseConnectAudio,
  ChaseDisconnectAudio,
  ChasePlaybackVolume,
  ChaseCreateVolumeFader,
  type ChaseAudioGraph,
} from "./audio";
import {
  ChaseError,
  ChaseFrequency,
  ChaseNormalizePlaced,
  ChaseNormalizeSnapshot,
  ChasePost,
  chasePreview,
  chasePhone,
} from "./transport";
import type {
  ChaseSnapshot,
  ChaseTone,
  ChaseView,
  ChaseReceiverKind,
  ChasePlacedRadio,
  ChaseSpeech,
  ChasePlayback,
  ChasePreviewPlayback,
  ChaseCallState,
  ChaseIncomingCall,
} from "./types";
const chaseReceiverKinds = ["vehicle", "portable", "buds", "placed"];
const chasePreviewPlaced: ChasePlacedRadio = {
  netId: 1201,
  stationId: 2,
  frequency: 921,
  label: "SOFT SPOT",
  ownerName: "Cleo",
  quality: 0.86,
};
export function ChaseApp() {
  const [chaseVisible, chaseSetVisible] = useState(chasePreview || chasePhone);
  const [chaseReceiver, chaseSetReceiver] = useState<ChaseReceiverKind | null>(
    chasePreview &&
      chaseReceiverKinds.includes(
        new URLSearchParams(location.search).get("compact") || "",
      )
      ? (new URLSearchParams(location.search).get(
          "compact",
        ) as ChaseReceiverKind)
      : null,
  );
  const [chasePlaced, chaseSetPlaced] = useState<ChasePlacedRadio | null>(
    chasePreview &&
      new URLSearchParams(location.search).get("compact") === "placed"
      ? chasePreviewPlaced
      : null,
  );
  const [chaseView, chaseSetView] = useState<ChaseView>("listen");
  const [chaseSpeech, chaseSetSpeech] = useState<ChaseSpeech | null>(null);
  const [chaseSpeechEnabled, chaseSetSpeechEnabled] = useState(true);
  const [chaseSpeechHud, chaseSetSpeechHud] = useState(true);
  const [chaseSpeechTalkKey, chaseSetSpeechTalkKey] = useState<
    string | undefined
  >(undefined);
  const [chasePhoneOpen, chaseSetPhoneOpen] = useState(false);
  const [chasePlayback, chaseSetPlayback] = useState<ChasePlayback | null>(
    null,
  );
  const [chasePreviewPlayback, chaseSetPreviewPlayback] =
    useState<ChasePreviewPlayback | null>(null);
  const [chaseSnapshot, chaseSetSnapshot] = useState<ChaseSnapshot | null>(
    null,
  );
  const [chaseLoading, chaseSetLoading] = useState(false);
  const [chaseBusy, chaseSetBusy] = useState(false);
  const [chaseError, chaseSetError] = useState("");
  const [chaseToast, chaseSetToast] = useState<{
    message: string;
    tone: ChaseTone;
  } | null>(null);
  const [chaseVolume, chaseSetVolume] = useState(65);
  const [chaseQuality, chaseSetQuality] = useState<number | null>(
    chasePreview ? 0.86 : null,
  );
  const [chaseIncomingCall, chaseSetIncomingCall] =
    useState<ChaseIncomingCall | null>(null);
  const [chaseCallOverride, chaseSetCallOverride] =
    useState<ChaseCallState | null>(null);
  const chaseBusyRef = useRef(false);
  const chaseVolumeRef = useRef(65);
  const chaseQualityRef = useRef(1);
  const chaseGainRef = useRef(1);
  const chaseContextRef = useRef<AudioContext | null>(null);
  const chaseGraphRef = useRef<ChaseAudioGraph | null>(null);
  const chaseProfileRef = useRef(ChaseNormalizeProfile(null));
  const chaseAudioRef = useRef<HTMLAudioElement | null>(null);
  const chasePlayerRef = useRef<ChasePlayer | null>(null);
  const chaseAudioIdentityRef = useRef<string | null>(null);
  const chaseMonitorRef = useRef(false);
  const chasePausedRef = useRef(false);
  const chaseMusicVolumeRef = useRef(1);
  const chasePreviewAudioRef = useRef<HTMLAudioElement | null>(null);
  const chasePreviewTimerRef = useRef<number | undefined>(undefined);
  const chaseViewRef = useRef<ChaseView>("listen");
  const chaseGenerationRef = useRef(0);
  const chasePanelRef = useRef<HTMLDivElement | null>(null);
  const chaseMainRef = useRef<HTMLElement | null>(null);
  const chaseTalkQueueRef = useRef<Promise<unknown>>(Promise.resolve());
  const chaseVolumeFaderRef = useRef<ReturnType<
    typeof ChaseCreateVolumeFader
  > | null>(null);
  useEffect(() => {
    chaseViewRef.current = chaseView;
    if (chaseMainRef.current) chaseMainRef.current.scrollTop = 0;
  }, [chaseView]);
  const ChaseApplyOutputVolume = useCallback((value: number) => {
    chaseVolumeFaderRef.current ||= ChaseCreateVolumeFader((chaseLevel) => {
      if (chaseAudioRef.current) chaseAudioRef.current.volume = chaseLevel;
      chasePlayerRef.current?.setVolume(chaseLevel);
    });
    chaseVolumeFaderRef.current.set(value * chaseMusicVolumeRef.current);
  }, []);
  const ChaseChangeVolume = useCallback(
    (value: number) => {
      chaseSetVolume(value);
      chaseVolumeRef.current = value;
      if (chasePreviewAudioRef.current)
        chasePreviewAudioRef.current.volume = value / 100;
      ChaseApplyOutputVolume(
        ChasePlaybackVolume(
          value,
          chaseQualityRef.current,
          chaseGainRef.current,
          chaseMonitorRef.current,
        ),
      );
    },
    [ChaseApplyOutputVolume],
  );
  const ChaseStopAudio = useCallback(() => {
    chaseVolumeFaderRef.current?.cancel();
    chaseAudioRef.current?.pause();
    chaseAudioRef.current = null;
    chasePlayerRef.current?.destroy();
    chasePlayerRef.current = null;
    chaseAudioIdentityRef.current = null;
    chaseMonitorRef.current = false;
    chaseSetPlayback(null);
    ChaseDisconnectAudio(chaseGraphRef.current);
    chaseGraphRef.current = null;
  }, []);
  const ChaseNotify = useCallback((message: string, tone: ChaseTone) => {
    chaseSetToast({ message, tone });
  }, []);
  const ChaseStopPreviewAudio = useCallback(() => {
    window.clearTimeout(chasePreviewTimerRef.current);
    chasePreviewTimerRef.current = undefined;
    chasePreviewAudioRef.current?.pause();
    chasePreviewAudioRef.current = null;
    chaseSetPreviewPlayback(null);
  }, []);
  useEffect(() => {
    if (chaseView !== "studio") ChaseStopPreviewAudio();
  }, [chaseView, ChaseStopPreviewAudio]);
  const ChaseStartPlayback = useCallback(
    async (audio: HTMLAudioElement) => {
      if (chasePausedRef.current) return;
      try {
        if (
          chaseGraphRef.current &&
          chaseContextRef.current?.state !== "running"
        ) {
          let chaseResumeTimeout: number | undefined;
          try {
            await Promise.race([
              chaseContextRef.current?.resume(),
              new Promise((_, chaseReject) => {
                chaseResumeTimeout = window.setTimeout(
                  () =>
                    chaseReject(new Error("Audio context needs a gesture.")),
                  1500,
                );
              }),
            ]);
          } finally {
            window.clearTimeout(chaseResumeTimeout);
          }
        }
        if (chaseAudioRef.current !== audio || chasePausedRef.current) return;
        if (
          chaseGraphRef.current &&
          chaseContextRef.current?.state !== "running"
        )
          throw new Error(
            "Audio is paused. Click inside the receiver to enable sound.",
          );
        await audio.play();
        if (chaseAudioRef.current !== audio || chasePausedRef.current) {
          audio.pause();
          return;
        }
        if (chaseAudioRef.current === audio)
          chaseSetPlayback((chaseCurrent) =>
            chaseCurrent ? { ...chaseCurrent, phase: "playing" } : null,
          );
        if (chaseAudioRef.current === audio)
          chaseSetToast((chaseCurrent) =>
            chaseCurrent?.message ===
            "Audio is paused. Click inside the receiver to enable sound."
              ? null
              : chaseCurrent,
          );
      } catch (chaseFailure) {
        if (chaseAudioRef.current !== audio || chasePausedRef.current) return;
        const chaseLoadFailed =
          Boolean(audio.error) ||
          (chaseFailure instanceof DOMException &&
            chaseFailure.name === "NotSupportedError");
        chaseSetPlayback((chaseCurrent) =>
          chaseCurrent
            ? { ...chaseCurrent, phase: chaseLoadFailed ? "error" : "blocked" }
            : null,
        );
        ChaseNotify(
          chaseLoadFailed
            ? "This cartridge could not be loaded."
            : "Audio is paused. Click inside the receiver to enable sound.",
          "error",
        );
      }
    },
    [ChaseNotify],
  );
  const ChaseApplySnapshot = useCallback(
    (data: unknown) => {
      const chaseData = ChaseNormalizeSnapshot(data);
      chaseSetSnapshot(chaseData);
      if (!chaseData.mine || chaseData.viewer.canOperate === false)
        ChaseStopPreviewAudio();
      if (chaseData.speech !== undefined)
        chaseSetSpeech(ChaseNormalizeSpeech(chaseData.speech));
      if (chaseData.config.speech) {
        chaseSetSpeechEnabled(chaseData.config.speech.enabled !== false);
        chaseSetSpeechHud(chaseData.config.speech.hud !== false);
      }
      chaseSetError("");
      chaseSetCallOverride(null);
      if (typeof chaseData.volume === "number") {
        const chaseValue = Math.max(0, Math.min(100, chaseData.volume));
        chaseSetVolume(chaseValue);
        chaseVolumeRef.current = chaseValue;
        if (chasePreviewAudioRef.current)
          chasePreviewAudioRef.current.volume = chaseValue / 100;
        ChaseApplyOutputVolume(
          ChasePlaybackVolume(
            chaseValue,
            chaseQualityRef.current,
            chaseGainRef.current,
            chaseMonitorRef.current,
          ),
        );
      }
    },
    [ChaseApplyOutputVolume, ChaseStopPreviewAudio],
  );
  const ChaseBootstrap = useCallback(async () => {
    const chaseGeneration = ++chaseGenerationRef.current;
    chaseSetLoading(true);
    chaseSetError("");
    try {
      const chaseData = await ChasePost<ChaseSnapshot>("bootstrap", {
        view: chasePhone ? "listen" : chaseViewRef.current,
      });
      if (chaseGeneration === chaseGenerationRef.current)
        ChaseApplySnapshot(chaseData);
    } catch (chaseFailure) {
      if (chaseGeneration === chaseGenerationRef.current)
        chaseSetError(ChaseError(chaseFailure));
    } finally {
      if (chaseGeneration === chaseGenerationRef.current)
        chaseSetLoading(false);
    }
  }, [ChaseApplySnapshot]);
  const ChaseClose = useCallback(async () => {
    ChaseStopPreviewAudio();
    try {
      await ChasePost("close");
      chaseSetVisible(false);
      chaseSetToast(null);
    } catch (chaseFailure) {
      ChaseNotify(ChaseError(chaseFailure), "error");
    }
  }, [ChaseNotify, ChaseStopPreviewAudio]);
  const ChaseAction = useCallback(
    async (
      action: string,
      data: Record<string, unknown> = {},
      message?: string,
    ) => {
      if (chaseBusyRef.current) return false;
      const chaseGeneration = ++chaseGenerationRef.current;
      chaseBusyRef.current = true;
      chaseSetLoading(false);
      chaseSetBusy(true);
      chaseSetToast(null);
      try {
        const chaseData = await ChasePost<ChaseSnapshot>("action", {
          action,
          data,
        });
        if (chaseGeneration === chaseGenerationRef.current)
          ChaseApplySnapshot(chaseData);
        if (action === "answerCall") chaseSetIncomingCall(null);
        if (message) ChaseNotify(message, "success");
        if (action === "pickupRadio" && chaseReceiver === "placed")
          void ChaseClose();
        return true;
      } catch (chaseFailure) {
        ChaseNotify(ChaseError(chaseFailure), "error");
        return false;
      } finally {
        chaseBusyRef.current = false;
        chaseSetBusy(false);
      }
    },
    [ChaseApplySnapshot, ChaseNotify, ChaseClose, chaseReceiver],
  );
  const ChaseTalk = useCallback(
    (pressed: boolean) => {
      chaseTalkQueueRef.current = chaseTalkQueueRef.current
        .then(() => ChasePost("talk", { pressed }))
        .catch((chaseFailure) => {
          if (pressed) ChaseNotify(ChaseError(chaseFailure), "error");
        });
    },
    [ChaseNotify],
  );
  async function ChaseSaveVolume() {
    try {
      await ChasePost("volume", { volume: chaseVolumeRef.current });
    } catch (chaseFailure) {
      ChaseNotify(ChaseError(chaseFailure), "error");
    }
  }
  useEffect(() => {
    if (chaseVisible) {
      void ChaseBootstrap();
      chasePanelRef.current?.focus();
    }
  }, [chaseVisible, ChaseBootstrap]);
  useEffect(() => {
    function ChaseReceiveMessage(chaseEvent: MessageEvent) {
      const chaseData = chaseEvent.data;
      if (
        !chaseData ||
        typeof chaseData !== "object" ||
        typeof chaseData.type !== "string"
      )
        return;
      if (chaseData.type === "chase_bootleg:visibility") {
        if (chaseData.visible !== true) ChaseStopPreviewAudio();
        chaseSetVisible(chaseData.visible === true);
        const chasePlacedTarget =
          chaseData.receiver === "placed"
            ? ChaseNormalizePlaced(chaseData.placed)
            : null;
        chaseSetPlaced(chasePlacedTarget);
        chaseSetReceiver(
          (!chaseData.view || chaseData.view === "listen") &&
            chaseReceiverKinds.includes(chaseData.receiver) &&
            (chaseData.receiver !== "placed" || chasePlacedTarget)
            ? chaseData.receiver
            : null,
        );
        if (
          ["listen", "studio", "scanner", "directory"].includes(chaseData.view)
        )
          chaseSetView(chaseData.view);
        else if (chaseData.view === "devices") chaseSetView("listen");
      } else if (chaseData.type === "chase_bootleg:speech") {
        chaseSetSpeech(ChaseNormalizeSpeech(chaseData.data));
        if (typeof chaseData.enabled === "boolean")
          chaseSetSpeechEnabled(chaseData.enabled);
        if (typeof chaseData.hud === "boolean")
          chaseSetSpeechHud(chaseData.hud);
        if (typeof chaseData.talkKey === "string")
          chaseSetSpeechTalkKey(chaseData.talkKey);
      } else if (chaseData.type === "chase_bootleg:phoneVisibility") {
        chaseSetPhoneOpen(chaseData.visible === true);
      } else if (chaseData.type === "chase_bootleg:snapshot") {
        try {
          ChaseApplySnapshot(chaseData.data);
          chaseGenerationRef.current += 1;
          chaseSetLoading(false);
        } catch (chaseFailure) {
          ChaseNotify(ChaseError(chaseFailure), "error");
        }
      } else if (chaseData.type === "chase_bootleg:toast") {
        if (typeof chaseData.message === "string")
          ChaseNotify(
            chaseData.message,
            ["success", "error", "info"].includes(chaseData.tone)
              ? chaseData.tone
              : "info",
          );
      } else if (
        chaseData.type === "chase_bootleg:signal" &&
        Number.isFinite(chaseData.quality)
      ) {
        const chaseSignal = Math.max(0, Math.min(1, chaseData.quality));
        chaseSetQuality(chaseSignal);
        chaseQualityRef.current = chaseSignal;
        if (!chaseMonitorRef.current) {
          chaseProfileRef.current = ChaseNormalizeProfile(chaseData.profile);
          if (chaseGraphRef.current)
            ChaseApplyProfile(chaseGraphRef.current, chaseProfileRef.current);
        }
        chaseGainRef.current = Number.isFinite(chaseData.gain)
          ? Math.max(0, Math.min(1, chaseData.gain))
          : 1;
        ChaseApplyOutputVolume(
          ChasePlaybackVolume(
            chaseVolumeRef.current,
            chaseSignal,
            chaseGainRef.current,
            chaseMonitorRef.current,
          ),
        );
      } else if (
        chaseData.type === "chase_bootleg:volume" &&
        Number.isFinite(chaseData.volume)
      ) {
        const chaseValue = Math.max(0, Math.min(100, chaseData.volume));
        chaseSetVolume(chaseValue);
        chaseVolumeRef.current = chaseValue;
        if (chasePreviewAudioRef.current)
          chasePreviewAudioRef.current.volume = chaseValue / 100;
        ChaseApplyOutputVolume(
          ChasePlaybackVolume(
            chaseValue,
            chaseQualityRef.current,
            chaseGainRef.current,
            chaseMonitorRef.current,
          ),
        );
      } else if (chaseData.type === "chase_bootleg:previewStop") {
        ChaseStopPreviewAudio();
      } else if (
        chaseData.type === "chase_bootleg:previewAudio" &&
        !chasePhone
      ) {
        ChaseStopPreviewAudio();
        try {
          if (
            typeof chaseData.url !== "string" ||
            typeof chaseData.cartridgeId !== "string"
          )
            return;
          const chaseUrl = new URL(chaseData.url, window.location.href);
          const chaseDuration = Number(chaseData.duration);
          if (
            !["https:", "http:"].includes(chaseUrl.protocol) ||
            !Number.isFinite(chaseDuration) ||
            chaseDuration <= 0 ||
            chaseDuration > 600
          )
            return;
          const chaseAudio = new Audio(chaseUrl.href);
          chasePreviewAudioRef.current = chaseAudio;
          chaseAudio.volume = chaseVolumeRef.current / 100;
          chaseSetPreviewPlayback({
            cartridgeId: chaseData.cartridgeId,
            name: String(chaseData.title || "Cartridge preview"),
            duration: chaseDuration,
            startedAt: Date.now() / 1000,
            phase: "loading",
          });
          function ChasePreviewFailed() {
            if (chasePreviewAudioRef.current !== chaseAudio) return;
            window.clearTimeout(chasePreviewTimerRef.current);
            chaseAudio.pause();
            chasePreviewAudioRef.current = null;
            chaseSetPreviewPlayback((chaseCurrent) =>
              chaseCurrent ? { ...chaseCurrent, phase: "error" } : null,
            );
            ChaseNotify(
              "The private preview could not play. Try Preview again.",
              "error",
            );
          }
          chasePreviewTimerRef.current = window.setTimeout(
            ChasePreviewFailed,
            15000,
          );
          chaseAudio.addEventListener(
            "loadedmetadata",
            () => {
              if (chasePreviewAudioRef.current !== chaseAudio) return;
              void chaseAudio
                .play()
                .then(() => {
                  if (chasePreviewAudioRef.current !== chaseAudio) {
                    chaseAudio.pause();
                    return;
                  }
                  window.clearTimeout(chasePreviewTimerRef.current);
                  chaseSetPreviewPlayback((chaseCurrent) =>
                    chaseCurrent
                      ? {
                          ...chaseCurrent,
                          startedAt: Date.now() / 1000,
                          phase: "playing",
                        }
                      : null,
                  );
                  chasePreviewTimerRef.current = window.setTimeout(
                    ChaseStopPreviewAudio,
                    chaseDuration * 1000,
                  );
                })
                .catch(ChasePreviewFailed);
            },
            { once: true },
          );
          chaseAudio.addEventListener(
            "ended",
            () => {
              if (chasePreviewAudioRef.current === chaseAudio)
                ChaseStopPreviewAudio();
            },
            { once: true },
          );
          chaseAudio.addEventListener("error", ChasePreviewFailed, {
            once: true,
          });
        } catch {
          ChaseStopPreviewAudio();
          ChaseNotify("The cartridge preview address is invalid.", "error");
        }
      } else if (chaseData.type === "chase_bootleg:audioStop") {
        ChaseStopAudio();
      } else if (chaseData.type === "chase_bootleg:incomingCall") {
        chaseSetIncomingCall(ChaseNormalizeIncomingCall(chaseData.data));
      } else if (chaseData.type === "chase_bootleg:callState") {
        const chaseState = chaseData.data?.state;
        if (chaseState === "onair" || chaseState === "ringing")
          chaseSetCallOverride({
            state: chaseState,
            stationId: Number.isFinite(chaseData.data.stationId)
              ? chaseData.data.stationId
              : undefined,
            stationName:
              typeof chaseData.data.stationName === "string"
                ? chaseData.data.stationName
                : undefined,
          });
        else if (["idle", "declined", "ended"].includes(chaseState))
          chaseSetCallOverride({ state: "idle" });
      } else if (
        chaseData.type === "chase_bootleg:audio" &&
        (chaseData.provider === "youtube" ||
          chaseData.provider === "soundcloud") &&
        typeof chaseData.url === "string" &&
        !chasePreview &&
        !chasePhone
      ) {
        const chaseStarted = Number(chaseData.startedAt);
        const chaseStartedSeconds = Number.isFinite(chaseStarted)
          ? chaseStarted > 1e12
            ? chaseStarted / 1000
            : chaseStarted
          : null;
        const chaseIdentity = JSON.stringify([
          chaseData.stationId ?? null,
          chaseData.provider,
          chaseData.url,
          chaseStartedSeconds,
          chaseData.duration ?? null,
        ]);
        chaseQualityRef.current = Number.isFinite(chaseData.quality)
          ? Math.max(0, Math.min(1, chaseData.quality))
          : 1;
        chaseGainRef.current = Number.isFinite(chaseData.gain)
          ? Math.max(0, Math.min(1, chaseData.gain))
          : 1;
        const chaseMonitor = chaseData.monitor === true;
        const chasePaused = chaseData.paused === true;
        const chaseWasPaused = chasePausedRef.current;
        chasePausedRef.current = chasePaused;
        chaseMusicVolumeRef.current = Number.isFinite(chaseData.musicVolume)
          ? Math.max(0, Math.min(1, chaseData.musicVolume))
          : 1;
        const chaseOffset =
          chasePaused && Number.isFinite(chaseData.offsetSeconds)
            ? Math.max(0, chaseData.offsetSeconds)
            : chaseStartedSeconds !== null
              ? Math.max(0, Date.now() / 1000 - chaseStartedSeconds)
              : 0;
        const chaseTrackVolume = ChasePlaybackVolume(
          chaseVolumeRef.current,
          chaseQualityRef.current,
          chaseGainRef.current,
          chaseMonitor,
        );
        if (
          chaseAudioIdentityRef.current === chaseIdentity &&
          chasePlayerRef.current
        ) {
          chaseMonitorRef.current = chaseMonitor;
          chaseSetPlayback((chaseCurrent) =>
            chaseCurrent
              ? {
                  ...chaseCurrent,
                  monitor: chaseMonitor,
                  phase: chasePaused
                    ? "paused"
                    : chaseWasPaused
                      ? "loading"
                      : chaseCurrent.phase,
                }
              : null,
          );
          if (chasePaused) {
            chasePlayerRef.current.pause();
            chasePlayerRef.current.seek(chaseOffset);
          } else if (chaseWasPaused) {
            chasePlayerRef.current.seek(chaseOffset);
            chasePlayerRef.current.play();
          }
          ChaseApplyOutputVolume(chaseTrackVolume);
          return;
        }
        ChaseStopAudio();
        const chaseDuration = Number(chaseData.duration);
        if (chaseDuration > 0 && chaseOffset >= chaseDuration) return;
        const chasePlayer = ChaseCreatePlayer({
          provider: chaseData.provider,
          url: chaseData.url,
          onPlaying: () => {
            if (
              chasePlayerRef.current === chasePlayer &&
              chasePausedRef.current
            ) {
              chasePlayer.pause();
              return;
            }
            if (chasePlayerRef.current === chasePlayer)
              chaseSetPlayback((chaseCurrent) =>
                chaseCurrent ? { ...chaseCurrent, phase: "playing" } : null,
              );
          },
          onEnded: () => {
            if (
              chasePlayerRef.current === chasePlayer &&
              !chasePausedRef.current
            )
              ChaseStopAudio();
          },
          onError: (chaseMessage) => {
            if (chasePlayerRef.current !== chasePlayer) return;
            chaseSetPlayback((chaseCurrent) =>
              chaseCurrent ? { ...chaseCurrent, phase: "error" } : null,
            );
            ChaseNotify(chaseMessage, "error");
          },
        });
        chasePlayerRef.current = chasePlayer;
        chaseAudioIdentityRef.current = chaseIdentity;
        chaseMonitorRef.current = chaseMonitor;
        chaseSetPlayback({
          phase: chasePaused ? "paused" : "loading",
          monitor: chaseMonitor,
          stationId: Number.isFinite(chaseData.stationId)
            ? chaseData.stationId
            : undefined,
          name:
            typeof chaseData.title === "string" && chaseData.title
              ? chaseData.title
              : typeof chaseData.name === "string"
                ? chaseData.name
                : "Track",
          provider: chaseData.provider,
        });
        chasePlayer.setVolume(0);
        ChaseApplyOutputVolume(chaseTrackVolume);
        chasePlayer.seek(chaseOffset);
        if (!chasePaused) chasePlayer.play();
      } else if (
        chaseData.type === "chase_bootleg:audio" &&
        typeof chaseData.url === "string" &&
        !chasePreview &&
        !chasePhone
      ) {
        try {
          const chaseUrl = new URL(chaseData.url, window.location.href);
          if (chaseUrl.protocol !== "https:" && chaseUrl.protocol !== "http:")
            return;
          const chaseStarted = Number(chaseData.startedAt);
          const chaseStartedSeconds = Number.isFinite(chaseStarted)
            ? chaseStarted > 1e12
              ? chaseStarted / 1000
              : chaseStarted
            : null;
          const chaseIdentity = JSON.stringify([
            chaseData.stationId ?? null,
            chaseUrl.href,
            chaseStartedSeconds,
            chaseData.duration ?? null,
          ]);
          chaseProfileRef.current = ChaseNormalizeProfile(chaseData.profile);
          chaseQualityRef.current = Number.isFinite(chaseData.quality)
            ? Math.max(0, Math.min(1, chaseData.quality))
            : 1;
          chaseGainRef.current = Number.isFinite(chaseData.gain)
            ? Math.max(0, Math.min(1, chaseData.gain))
            : 1;
          const chaseMonitor = chaseData.monitor === true;
          const chasePaused = chaseData.paused === true;
          const chaseWasPaused = chasePausedRef.current;
          chasePausedRef.current = chasePaused;
          chaseMusicVolumeRef.current = Number.isFinite(chaseData.musicVolume)
            ? Math.max(0, Math.min(1, chaseData.musicVolume))
            : 1;
          const chaseOffset =
            chasePaused && Number.isFinite(chaseData.offsetSeconds)
              ? Math.max(0, chaseData.offsetSeconds)
              : chaseStartedSeconds !== null
                ? Math.max(0, Date.now() / 1000 - chaseStartedSeconds)
                : 0;
          const chaseAudioVolume = ChasePlaybackVolume(
            chaseVolumeRef.current,
            chaseQualityRef.current,
            chaseGainRef.current,
            chaseMonitor,
          );
          if (
            chaseAudioIdentityRef.current === chaseIdentity &&
            chaseAudioRef.current
          ) {
            chaseMonitorRef.current = chaseMonitor;
            chaseSetPlayback((chaseCurrent) =>
              chaseCurrent
                ? {
                    ...chaseCurrent,
                    monitor: chaseMonitor,
                    phase: chasePaused
                      ? "paused"
                      : chaseWasPaused
                        ? "loading"
                        : chaseCurrent.phase,
                  }
                : null,
            );
            if (chasePaused) {
              chaseAudioRef.current.pause();
              chaseAudioRef.current.currentTime = chaseOffset;
            } else if (chaseWasPaused) {
              chaseAudioRef.current.currentTime = chaseOffset;
              void ChaseStartPlayback(chaseAudioRef.current);
            }
            ChaseApplyOutputVolume(chaseAudioVolume);
            if (chaseGraphRef.current)
              ChaseApplyProfile(chaseGraphRef.current, chaseProfileRef.current);
            return;
          }
          ChaseStopAudio();
          const chaseAudio = new Audio(chaseUrl.href);
          chaseAudioRef.current = chaseAudio;
          chaseAudioIdentityRef.current = chaseIdentity;
          chaseMonitorRef.current = chaseMonitor;
          chaseSetPlayback({
            phase: chasePaused ? "paused" : "loading",
            monitor: chaseMonitor,
            stationId: Number.isFinite(chaseData.stationId)
              ? chaseData.stationId
              : undefined,
            name:
              typeof chaseData.title === "string" && chaseData.title
                ? chaseData.title
                : typeof chaseData.name === "string"
                  ? chaseData.name
                  : "Cartridge",
            provider: "file",
          });
          if (
            chaseUrl.origin === window.location.origin &&
            typeof AudioContext !== "undefined"
          ) {
            try {
              chaseContextRef.current ||= new AudioContext();
              chaseGraphRef.current = ChaseConnectAudio(
                chaseContextRef.current,
                chaseAudio,
                chaseProfileRef.current,
              );
            } catch {
              chaseGraphRef.current = null;
            }
          }
          chaseAudio.volume = 0;
          ChaseApplyOutputVolume(chaseAudioVolume);
          chaseAudio.addEventListener(
            "loadedmetadata",
            () => {
              if (chaseAudioRef.current !== chaseAudio) return;
              if (chaseOffset >= chaseAudio.duration) {
                ChaseStopAudio();
                return;
              }
              chaseAudio.currentTime = chaseOffset;
              if (!chasePausedRef.current) void ChaseStartPlayback(chaseAudio);
            },
            { once: true },
          );
          chaseAudio.addEventListener(
            "error",
            () => {
              if (chaseAudioRef.current === chaseAudio) {
                chaseSetPlayback((chaseCurrent) =>
                  chaseCurrent ? { ...chaseCurrent, phase: "error" } : null,
                );
                ChaseNotify("This cartridge could not be loaded.", "error");
              }
            },
            { once: true },
          );
          chaseAudio.addEventListener(
            "ended",
            () => {
              if (
                chaseAudioRef.current === chaseAudio &&
                !chasePausedRef.current
              )
                ChaseStopAudio();
            },
            { once: true },
          );
        } catch {
          ChaseNotify("The cartridge address is invalid.", "error");
        }
      }
    }
    window.addEventListener("message", ChaseReceiveMessage);
    return () => {
      window.removeEventListener("message", ChaseReceiveMessage);
      ChaseStopAudio();
      ChaseStopPreviewAudio();
      void chaseContextRef.current?.close();
      chaseContextRef.current = null;
    };
  }, [
    ChaseApplySnapshot,
    ChaseApplyOutputVolume,
    ChaseNotify,
    ChaseStopAudio,
    ChaseStartPlayback,
    ChaseStopPreviewAudio,
  ]);
  useEffect(() => {
    if (chasePhone) return;
    function ChaseResumeAudio() {
      if (!chaseAudioRef.current || chasePausedRef.current) return;
      if (
        chaseAudioRef.current.paused ||
        (chaseGraphRef.current &&
          chaseContextRef.current?.state === "suspended")
      )
        void ChaseStartPlayback(chaseAudioRef.current);
    }
    window.addEventListener("pointerdown", ChaseResumeAudio);
    window.addEventListener("keydown", ChaseResumeAudio);
    return () => {
      window.removeEventListener("pointerdown", ChaseResumeAudio);
      window.removeEventListener("keydown", ChaseResumeAudio);
    };
  }, [ChaseStartPlayback]);
  useEffect(() => {
    if (!chaseVisible) return;
    function ChaseKeyboard(chaseEvent: KeyboardEvent) {
      if (chaseEvent.defaultPrevented) return;
      if (chaseEvent.key === "Escape") {
        chaseEvent.preventDefault();
        void ChaseClose();
      }
      if (chaseEvent.key === "Tab") {
        const chaseControls =
          chasePanelRef.current?.querySelectorAll<HTMLElement>(
            'button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex="0"]',
          );
        if (!chaseControls?.length) return;
        const chaseFirst = chaseControls[0];
        const chaseLast = chaseControls[chaseControls.length - 1];
        if (chaseEvent.shiftKey && document.activeElement === chaseFirst) {
          chaseEvent.preventDefault();
          chaseLast.focus();
        } else if (
          !chaseEvent.shiftKey &&
          document.activeElement === chaseLast
        ) {
          chaseEvent.preventDefault();
          chaseFirst.focus();
        }
      }
    }
    window.addEventListener("keydown", ChaseKeyboard);
    return () => window.removeEventListener("keydown", ChaseKeyboard);
  }, [chaseVisible, ChaseClose]);
  const chaseCurrentSnapshot =
    chaseSnapshot && chaseCallOverride
      ? {
          ...chaseSnapshot,
          viewer: { ...chaseSnapshot.viewer, call: chaseCallOverride },
        }
      : chaseSnapshot;
  const chaseTuned = chaseSnapshot?.stations.find(
    (chaseStation) => chaseStation.id === chaseSnapshot.tunedStationId,
  );
  const chaseTalkKey = chaseSnapshot?.config.talk?.key ?? chaseSpeechTalkKey;
  const chaseCallPopup = chaseIncomingCall ? (
    <ChaseCallPopup
      call={chaseIncomingCall}
      acceptKey={
        chaseIncomingCall.acceptKey ||
        chaseSnapshot?.config.calls?.acceptKey ||
        "Y"
      }
      declineKey={
        chaseIncomingCall.declineKey ||
        chaseSnapshot?.config.calls?.declineKey ||
        "U"
      }
      listenKeys={chaseVisible}
      busy={chaseBusy}
      action={ChaseAction}
    />
  ) : null;
  const chaseCanOperate = chaseSnapshot?.viewer.canOperate === true;
  const chaseCanScan = chaseSnapshot?.viewer.isPolice === true;
  const chaseCurrentView =
    (chaseView === "studio" && !chaseCanOperate) ||
    (chaseView === "scanner" && !chaseCanScan)
      ? "listen"
      : chaseView;
  if (!chaseVisible)
    return chasePreview ? (
      <div className="chase-preview-closed">
        <strong>SENORA SIGNALWORKS</strong>
        <p>Interactive preview closed.</p>
        <button
          className="chase-button chase-primary"
          onClick={() => chaseSetVisible(true)}
        >
          Open preview
        </button>
      </div>
    ) : (
      <>
        {!chasePhone && !chasePhoneOpen && !chaseCallPopup ? (
          <ChaseFieldHint />
        ) : null}
        {!chasePhone &&
        !chasePhoneOpen &&
        chaseSpeechEnabled &&
        chaseSpeechHud ? (
          <ChaseSpeechIndicator
            speech={chaseSpeech}
            hud
            talkKey={chaseTalkKey}
          />
        ) : null}
        {chasePhoneOpen ? null : chaseCallPopup}
      </>
    );
  if (chasePhone)
    return (
      <ChasePhoneApp
        snapshot={chaseCurrentSnapshot}
        loading={chaseLoading}
        busy={chaseBusy}
        error={chaseError}
        speech={chaseSpeechEnabled ? chaseSpeech : null}
        talkKey={chaseTalkKey}
        talk={ChaseTalk}
        quality={chaseQuality}
        volume={chaseVolume}
        toast={chaseToast}
        action={ChaseAction}
        bootstrap={() => void ChaseBootstrap()}
        changeVolume={ChaseChangeVolume}
        saveVolume={() => void ChaseSaveVolume()}
        dismissToast={() => chaseSetToast(null)}
        callPopup={chaseCallPopup}
      />
    );
  return (
    <div className={`chase-overlay ${chasePreview ? "chase-preview" : ""}`}>
      {chaseCallPopup}
      <div
        className={`chase-app ${chaseReceiver ? "chase-receiver-app" : ""}`}
        ref={chasePanelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label="Senora Signalworks radio console"
      >
        <aside className="chase-sidebar">
          <div className="chase-brand" aria-label="Senora Signalworks">
            <ChaseIcon name="broadcast" size={28} />
          </div>
          <nav aria-label="Radio sections">
            <button
              aria-label="Listen"
              title="Listen"
              className={
                chaseCurrentView === "listen" ? "chase-nav-active" : ""
              }
              aria-current={chaseCurrentView === "listen" ? "page" : undefined}
              onClick={() => chaseSetView("listen")}
            >
              <ChaseIcon name="headphones" size={24} />
              <span>Listen</span>
            </button>
            <button
              aria-label="On air"
              title="On air"
              className={
                chaseCurrentView === "directory" ? "chase-nav-active" : ""
              }
              aria-current={
                chaseCurrentView === "directory" ? "page" : undefined
              }
              onClick={() => chaseSetView("directory")}
            >
              <ChaseIcon name="mic" size={24} />
              <span>On air</span>
            </button>
            {chaseCanOperate ? (
              <button
                aria-label="My studio"
                title="My studio"
                className={
                  chaseCurrentView === "studio" ? "chase-nav-active" : ""
                }
                aria-current={
                  chaseCurrentView === "studio" ? "page" : undefined
                }
                onClick={() => chaseSetView("studio")}
              >
                <ChaseIcon name="studio" size={24} />
                <span>Studio</span>
              </button>
            ) : null}
            {chaseCanScan ? (
              <button
                aria-label="Scanner"
                title="Scanner"
                className={
                  chaseCurrentView === "scanner" ? "chase-nav-active" : ""
                }
                aria-current={
                  chaseCurrentView === "scanner" ? "page" : undefined
                }
                onClick={() => chaseSetView("scanner")}
              >
                <ChaseIcon name="scan" size={24} />
                <span>Scanner</span>
              </button>
            ) : null}
          </nav>
          <div
            className="chase-profile"
            title={chaseSnapshot?.viewer.name || "Connecting"}
          >
            <ChaseIcon name="users" size={20} />
            <span>{chaseSnapshot?.viewer.name || "Connecting"}</span>
          </div>
        </aside>
        <div className="chase-workspace">
          <header className="chase-topbar">
            <div className="chase-breadcrumb">
              <strong>SENORA SIGNALWORKS</strong>
              <span>
                {chaseCurrentView === "studio"
                  ? "Broadcast studio"
                  : chaseCurrentView === "scanner"
                    ? "Field operations"
                    : "Broadcast network"}
              </span>
            </div>
            <div>
              {chasePreview ? (
                <span className="chase-preview-badge">
                  INTERACTIVE PREVIEW · NO LIVE AUDIO
                </span>
              ) : (
                <ChaseStatus live={Boolean(chaseSnapshot) && !chaseError}>
                  {chaseError
                    ? "CONNECTION INTERRUPTED"
                    : chaseSnapshot
                      ? "RECEIVER CONNECTED"
                      : "CONNECTING"}
                </ChaseStatus>
              )}
              <button
                className="chase-icon-button chase-refresh-button"
                aria-label="Refresh station data"
                disabled={chaseLoading || chaseBusy}
                onClick={() => void ChaseBootstrap()}
              >
                <ChaseIcon name="refresh" size={17} />
              </button>
              <button
                className="chase-close-button"
                aria-label="Close radio console"
                onClick={() => void ChaseClose()}
              >
                <span>ESC</span>
                <ChaseIcon name="close" size={18} />
              </button>
            </div>
          </header>
          <main className="chase-main" ref={chaseMainRef}>
            <div className="chase-page-heading">
              <div>
                <h1>
                  {chaseCurrentView === "listen"
                    ? "Radio receiver"
                    : chaseCurrentView === "studio"
                      ? "Broadcast studio"
                      : chaseCurrentView === "directory"
                        ? "Active frequencies"
                        : "Field scanner"}
                </h1>
                <p>
                  {chaseCurrentView === "listen"
                    ? "Browse stations or connect to a frequency."
                    : chaseCurrentView === "studio"
                      ? "Manage your station, crew and transmission."
                      : chaseCurrentView === "directory"
                        ? "Find a live station and see who is on the microphone."
                        : "Take directional readings and review signal history."}
                </p>
              </div>
              <span className="chase-page-badge">
                <ChaseIcon
                  name={chaseCurrentView === "scanner" ? "scan" : "signal"}
                  size={18}
                />
                {chaseCurrentView === "scanner"
                  ? "Authorized access"
                  : "FM NETWORK"}
              </span>
            </div>
            {chaseError ? (
              <div className="chase-connection-error" role="alert">
                <strong>Connection interrupted</strong>
                <p>{chaseError}</p>
                <button
                  className="chase-button chase-secondary"
                  onClick={() => void ChaseBootstrap()}
                >
                  Reconnect
                </button>
              </div>
            ) : null}
            {chaseSpeechEnabled &&
            (chaseReceiver || chaseCurrentView !== "studio") ? (
              <ChaseSpeechIndicator
                speech={chaseSpeech}
                talkKey={chaseTalkKey}
                talk={ChaseTalk}
              />
            ) : null}
            {chaseCurrentSnapshot ? (
              <fieldset
                className="chase-view-fieldset"
                disabled={chaseBusy}
                aria-busy={chaseBusy}
              >
                {chaseReceiver ? (
                  <ChaseReceiver
                    device={chaseReceiver}
                    placed={chaseReceiver === "placed" ? chasePlaced : null}
                    snapshot={chaseCurrentSnapshot}
                    action={ChaseAction}
                    busy={chaseBusy}
                    quality={chaseQuality}
                  />
                ) : chaseCurrentView === "directory" ? (
                  <ChaseDirectory
                    snapshot={chaseCurrentSnapshot}
                    speech={chaseSpeechEnabled ? chaseSpeech : null}
                    action={ChaseAction}
                    busy={chaseBusy || chaseLoading}
                    refresh={() => void ChaseBootstrap()}
                    quality={chaseQuality}
                    onListen={() => chaseSetView("listen")}
                    onMinimize={() => void ChaseClose()}
                  />
                ) : chaseCurrentView === "listen" ? (
                  <ChaseListen
                    snapshot={chaseCurrentSnapshot}
                    action={ChaseAction}
                    busy={chaseBusy}
                    quality={chaseQuality}
                  />
                ) : chaseCurrentView === "studio" ? (
                  <ChaseStudio
                    snapshot={chaseCurrentSnapshot}
                    action={ChaseAction}
                    busy={chaseBusy}
                    playback={chasePlayback}
                    previewPlayback={chasePreviewPlayback}
                    volume={chaseVolume}
                    changeVolume={ChaseChangeVolume}
                    saveVolume={() => void ChaseSaveVolume()}
                    speech={
                      chaseSpeechEnabled
                        ? (chaseSpeech ?? undefined)
                        : undefined
                    }
                    talk={ChaseTalk}
                    talkKey={chaseTalkKey}
                  />
                ) : (
                  <ChaseScanner
                    snapshot={chaseCurrentSnapshot}
                    notify={ChaseNotify}
                  />
                )}
              </fieldset>
            ) : chaseLoading ? (
              <div className="chase-loading" role="status">
                <ChaseIcon name="radio" size={36} />
                <h2>Connecting receiver…</h2>
                <p>Loading your station directory.</p>
                <span />
              </div>
            ) : !chaseError ? (
              <ChaseEmpty title="The receiver is waiting">
                Refresh to connect to your station directory.
              </ChaseEmpty>
            ) : null}
          </main>
          <footer className="chase-player">
            <span className="chase-player-icon">
              <ChaseIcon name="headphones" size={21} />
            </span>
            <div className="chase-player-station">
              <strong>
                {(chasePreviewPlayback
                  ? "Private preview"
                  : chasePlayback?.monitor
                    ? "Private monitor"
                    : null) ||
                  chaseTuned?.name ||
                  (chaseSnapshot?.tunedStationId
                    ? "Unlisted frequency"
                    : "Nothing tuned in")}
              </strong>
              <span>
                {chasePreviewPlayback
                  ? `${chasePreviewPlayback.name} · ${chasePreviewPlayback.phase === "playing" ? "Playing locally" : chasePreviewPlayback.phase === "loading" ? "Loading audio" : "Audio unavailable"}`
                  : chasePlayback?.monitor
                    ? `${chasePlayback.name} · ${chasePlayback.phase === "playing" ? (chaseVolume === 0 ? "Muted" : "Playing locally") : chasePlayback.phase === "paused" ? "Paused" : chasePlayback.phase === "loading" ? "Loading audio" : chasePlayback.phase === "blocked" ? "Click to enable audio" : "Audio unavailable"}`
                    : chaseTuned
                      ? `${ChaseFrequency(chaseTuned.frequency)} FM · ${chaseTuned.showTitle || "Independent radio"}`
                      : "Select a station to connect."}
              </span>
            </div>
            {chaseBusy ? (
              <span className="chase-busy-indicator" role="status">
                Waiting for server…
              </span>
            ) : null}
            <div className="chase-player-volume">
              <ChaseIcon name="volume" size={18} />
              <label
                className="chase-visually-hidden"
                htmlFor="chase-listening-volume"
              >
                Listening volume
              </label>
              <input
                id="chase-listening-volume"
                type="range"
                min="0"
                max="100"
                step="1"
                value={chaseVolume}
                onChange={(chaseEvent) =>
                  ChaseChangeVolume(Number(chaseEvent.target.value))
                }
                onPointerUp={() => void ChaseSaveVolume()}
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
                    void ChaseSaveVolume();
                }}
              />
              <span>{chaseVolume}%</span>
            </div>
            {chaseCurrentView === "directory" &&
            chaseTuned &&
            !chaseReceiver ? (
              <div className="chase-player-actions">
                <button
                  className="chase-button chase-secondary"
                  disabled={chaseBusy}
                  onClick={() =>
                    void ChaseAction("untune", {}, "Receiver disconnected.")
                  }
                >
                  <ChaseIcon name="headphones" />
                  Disconnect
                </button>
                <button
                  className="chase-button chase-secondary"
                  onClick={() => void ChaseClose()}
                >
                  <ChaseIcon name="minus" />
                  Minimize
                </button>
              </div>
            ) : (
              <span className="chase-player-fm">LOCAL RECEIVER</span>
            )}
          </footer>
        </div>
        <ChaseToast toast={chaseToast} dismiss={() => chaseSetToast(null)} />
      </div>
    </div>
  );
}
