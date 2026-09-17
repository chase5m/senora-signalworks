import { useEffect, useState } from "react";
import { ChaseIcon } from "./components";
import type {
  ChaseAction,
  ChaseIncomingCall,
  ChasePlacedRadio,
  ChaseSnapshot,
  ChaseStation,
} from "./types";
export function ChaseNormalizeIncomingCall(
  value: unknown,
): ChaseIncomingCall | null {
  if (!value || typeof value !== "object") return null;
  const chaseCall = value as Partial<ChaseIncomingCall>;
  if (
    !Number.isFinite(chaseCall.callId) ||
    !Number.isFinite(chaseCall.stationId)
  )
    return null;
  return {
    callId: Number(chaseCall.callId),
    stationId: Number(chaseCall.stationId),
    callerName:
      typeof chaseCall.callerName === "string" && chaseCall.callerName.trim()
        ? chaseCall.callerName
        : "Unknown caller",
    stationName:
      typeof chaseCall.stationName === "string"
        ? chaseCall.stationName
        : "Your station",
    ringSeconds: Number.isFinite(chaseCall.ringSeconds)
      ? Math.max(1, Number(chaseCall.ringSeconds))
      : 30,
    receivedAt: Date.now(),
    acceptKey:
      typeof chaseCall.acceptKey === "string" && chaseCall.acceptKey.trim()
        ? chaseCall.acceptKey.trim()
        : undefined,
    declineKey:
      typeof chaseCall.declineKey === "string" && chaseCall.declineKey.trim()
        ? chaseCall.declineKey.trim()
        : undefined,
  };
}
export function ChaseCallPopup({
  call,
  acceptKey,
  declineKey,
  listenKeys,
  busy,
  action,
}: {
  call: ChaseIncomingCall;
  acceptKey: string;
  declineKey: string;
  listenKeys: boolean;
  busy: boolean;
  action: ChaseAction;
}) {
  const [chaseNow, chaseSetNow] = useState(Date.now());
  useEffect(() => {
    const chaseTimer = window.setInterval(() => chaseSetNow(Date.now()), 500);
    return () => window.clearInterval(chaseTimer);
  }, []);
  useEffect(() => {
    if (!listenKeys) return;
    function ChaseCallKeys(chaseEvent: KeyboardEvent) {
      const chaseTarget = chaseEvent.target as HTMLElement | null;
      if (
        chaseEvent.defaultPrevented ||
        chaseTarget?.tagName === "INPUT" ||
        chaseTarget?.tagName === "TEXTAREA" ||
        chaseTarget?.tagName === "SELECT"
      )
        return;
      const chaseKey = chaseEvent.key.toUpperCase();
      if (chaseKey === acceptKey.toUpperCase()) {
        chaseEvent.preventDefault();
        void action("answerCall", { callId: call.callId, accept: true });
      } else if (chaseKey === declineKey.toUpperCase()) {
        chaseEvent.preventDefault();
        void action("answerCall", { callId: call.callId, accept: false });
      }
    }
    window.addEventListener("keydown", ChaseCallKeys);
    return () => window.removeEventListener("keydown", ChaseCallKeys);
  }, [listenKeys, acceptKey, declineKey, action, call.callId]);
  const chaseRemaining = Math.max(
    0,
    Math.ceil(call.ringSeconds - (chaseNow - call.receivedAt) / 1000),
  );
  return (
    <div className="chase-call-popup-layer">
      <div
        className="chase-call-popup"
        role="alertdialog"
        aria-label={`Incoming call from ${call.callerName}`}
      >
        <div className="chase-call-popup-heading">
          <span className="chase-call-popup-icon">
            <ChaseIcon name="phone" size={20} />
          </span>
          <div>
            <span className="chase-eyebrow">INCOMING CALL</span>
            <strong>{call.callerName}</strong>
            <span>{call.stationName}</span>
          </div>
          <span className="chase-call-popup-timer" aria-live="off">
            {chaseRemaining}s
          </span>
        </div>
        <div className="chase-call-popup-actions">
          <button
            className="chase-button chase-primary"
            disabled={busy}
            onClick={() =>
              void action("answerCall", { callId: call.callId, accept: true })
            }
          >
            <ChaseIcon name="check" size={16} />
            Accept
            <kbd>{acceptKey}</kbd>
          </button>
          <button
            className="chase-button chase-danger"
            disabled={busy}
            onClick={() =>
              void action("answerCall", { callId: call.callId, accept: false })
            }
          >
            <ChaseIcon name="close" size={16} />
            Decline
            <kbd>{declineKey}</kbd>
          </button>
        </div>
      </div>
    </div>
  );
}
export function ChaseCallControls({
  snapshot,
  station,
  action,
  busy,
  placed,
}: {
  snapshot: ChaseSnapshot;
  station: ChaseStation | undefined;
  action: ChaseAction;
  busy: boolean;
  placed?: ChasePlacedRadio | null;
}) {
  const chaseCall = snapshot.viewer.call;
  const chaseTunedId = placed
    ? (placed.stationId ?? null)
    : snapshot.tunedStationId;
  if (snapshot.config.calls?.enabled === false) return null;
  if (chaseCall.state === "ringing")
    return (
      <div className="chase-call-controls chase-call-ringing" role="status">
        <span>
          <ChaseIcon name="phone" size={17} />
          Calling{chaseCall.stationName ? ` ${chaseCall.stationName}` : ""}…
        </span>
        <button
          className="chase-button chase-secondary"
          disabled={busy}
          onClick={() => void action("endCall", {}, "Call cancelled.")}
        >
          Cancel
        </button>
      </div>
    );
  if (chaseCall.state === "onair")
    return (
      <div className="chase-call-controls chase-call-onair" role="status">
        <span>
          <ChaseIcon name="mic" size={17} />
          On air with {chaseCall.stationName || "the station"}
        </span>
        <button
          className="chase-button chase-danger"
          disabled={busy}
          onClick={() => void action("endCall", {}, "Call ended.")}
        >
          Hang up
        </button>
      </div>
    );
  if (!station?.micLive || chaseTunedId !== station.id) return null;
  return (
    <div className="chase-call-controls">
      <span>
        <ChaseIcon name="phone" size={17} />
        {station.hostName || "The host"} is taking calls
      </span>
      <button
        className="chase-button chase-secondary"
        disabled={busy || !snapshot.viewer.voiceReady}
        onClick={() =>
          void action(
            "callStation",
            placed
              ? { stationId: station.id, placedNetId: placed.netId }
              : { stationId: station.id },
            "Calling the studio…",
          )
        }
      >
        <ChaseIcon name="phone" size={16} />
        Call the host
      </button>
    </div>
  );
}
