import { useCallback, useEffect, useRef } from "react";
import { ChaseIcon } from "./components";
import { ChaseFrequency } from "./transport";
import type {
  ChaseSpeech,
  ChaseSpeechRole,
  ChaseSpeechStation,
  ChaseTalk,
} from "./types";
const chaseTalkKeyLabels: Record<string, string> = {
  LMENU: "Left Alt",
  RMENU: "Right Alt",
  CAPITAL: "Caps Lock",
  LSHIFT: "Left Shift",
  RSHIFT: "Right Shift",
  LCONTROL: "Left Ctrl",
  RCONTROL: "Right Ctrl",
  SPACE: "Space",
};
export function ChaseTalkKeyLabel(key?: string) {
  const chaseKey =
    typeof key === "string" && key.trim() ? key.trim() : "CAPITAL";
  return chaseTalkKeyLabels[chaseKey.toUpperCase()] || chaseKey;
}
export function ChaseNormalizeSpeech(value: unknown): ChaseSpeech | null {
  if (!value || typeof value !== "object") return null;
  const chaseValue = value as Partial<ChaseSpeech>;
  if (!chaseValue.local || typeof chaseValue.local !== "object") return null;
  const chaseLocal = chaseValue.local;
  const chaseReceiver = chaseValue.receiver;
  return {
    local: {
      ...ChaseSpeechStationFields(chaseLocal),
      mode: chaseLocal.mode === "station" ? "station" : "idle",
      talking: chaseLocal.talking === true,
      micOpen: chaseLocal.micOpen === true,
      transmitting: chaseLocal.transmitting === true,
      role: ["host", "cohost", "caller"].includes(chaseLocal.role as string)
        ? (chaseLocal.role as ChaseSpeechRole)
        : undefined,
    },
    receiver:
      chaseReceiver && typeof chaseReceiver === "object"
        ? {
            ...ChaseSpeechStationFields(chaseReceiver),
            talking: chaseReceiver.talking === true,
            hostSource: Number.isFinite(chaseReceiver.hostSource)
              ? chaseReceiver.hostSource
              : undefined,
          }
        : null,
  };
}
function ChaseSpeechStationFields(
  value: ChaseSpeechStation,
): ChaseSpeechStation {
  return {
    stationId: Number.isFinite(value.stationId) ? value.stationId : undefined,
    stationName:
      typeof value.stationName === "string" ? value.stationName : undefined,
    frequency: Number.isFinite(value.frequency) ? value.frequency : undefined,
    hostName: typeof value.hostName === "string" ? value.hostName : undefined,
  };
}
function ChaseSpeechDetail(value: ChaseSpeechStation) {
  return [
    value.stationName,
    value.frequency !== undefined
      ? `${ChaseFrequency(value.frequency)} FM`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");
}
function ChaseTalkButton({
  transmitting,
  talk,
}: {
  transmitting: boolean;
  talk: ChaseTalk;
}) {
  const chasePressedRef = useRef(false);
  const chaseTalkRef = useRef(talk);
  chaseTalkRef.current = talk;
  const ChaseSet = useCallback((pressed: boolean) => {
    if (chasePressedRef.current === pressed) return;
    chasePressedRef.current = pressed;
    chaseTalkRef.current(pressed);
  }, []);
  useEffect(() => {
    const ChaseRelease = () => ChaseSet(false);
    window.addEventListener("blur", ChaseRelease);
    return () => {
      window.removeEventListener("blur", ChaseRelease);
      ChaseRelease();
    };
  }, [ChaseSet]);
  return (
    <button
      type="button"
      className="chase-speech-talk"
      aria-pressed={transmitting}
      onPointerDown={(chaseEvent) => {
        if (chaseEvent.pointerType === "mouse" && chaseEvent.button !== 0)
          return;
        chaseEvent.preventDefault();
        ChaseSet(true);
      }}
      onPointerUp={() => ChaseSet(false)}
      onPointerLeave={() => ChaseSet(false)}
      onPointerCancel={() => ChaseSet(false)}
      onKeyDown={(chaseEvent) => {
        if (
          (chaseEvent.key === " " || chaseEvent.key === "Enter") &&
          !chaseEvent.repeat
        ) {
          chaseEvent.preventDefault();
          ChaseSet(true);
        }
      }}
      onKeyUp={(chaseEvent) => {
        if (chaseEvent.key === " " || chaseEvent.key === "Enter") {
          chaseEvent.preventDefault();
          ChaseSet(false);
        }
      }}
      onBlur={() => ChaseSet(false)}
      onContextMenu={(chaseEvent) => chaseEvent.preventDefault()}
    >
      <ChaseIcon name="mic" size={16} />
      {transmitting ? "Live" : "Hold to talk"}
    </button>
  );
}
export function ChaseSpeechIndicator({
  speech,
  hud = false,
  talkKey,
  talk,
}: {
  speech: ChaseSpeech | null;
  hud?: boolean;
  talkKey?: string;
  talk?: ChaseTalk;
}) {
  if (!speech) return null;
  const chaseLocal = speech.local;
  const chaseReceiving =
    speech.receiver?.talking === true ? speech.receiver : null;
  if (!chaseLocal.micOpen && !chaseReceiving) return null;
  const chaseTalk = !hud && talk ? talk : null;
  return (
    <div
      className={hud ? "chase-speech-hud" : "chase-speech-inline"}
      aria-label="Speech activity"
      role="status"
      aria-live="off"
    >
      {chaseLocal.micOpen ? (
        <div
          className={`chase-speech-chip ${chaseLocal.transmitting ? "chase-speech-onair" : "chase-speech-ready"}`}
          data-speech="local"
        >
          <ChaseIcon name="mic" size={20} />
          <div>
            <strong>
              {chaseLocal.transmitting ? "ON AIR" : "Station mic"}
            </strong>
            <span>
              {chaseLocal.transmitting
                ? ChaseSpeechDetail(chaseLocal) || "Station microphone"
                : chaseTalk
                  ? "Hold the mic button to talk"
                  : `Hold ${ChaseTalkKeyLabel(talkKey)} to talk`}
            </span>
          </div>
          {chaseTalk ? (
            <ChaseTalkButton
              transmitting={chaseLocal.transmitting}
              talk={chaseTalk}
            />
          ) : null}
        </div>
      ) : null}
      {chaseReceiving ? (
        <div
          className="chase-speech-chip chase-speech-receiving"
          data-speech="receiver"
        >
          <ChaseIcon name="headphones" size={20} />
          <div>
            <strong>
              On-air speech from{" "}
              {chaseReceiving.hostName ||
                chaseReceiving.stationName ||
                "the host"}
            </strong>
            <span>{ChaseSpeechDetail(chaseReceiving) || "Station host"}</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}
