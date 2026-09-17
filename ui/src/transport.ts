import type {
  ChaseCallState,
  ChaseEnvelope,
  ChasePlacedRadio,
  ChaseSnapshot,
  ChaseStation,
} from "./types";
declare global {
  interface Window {
    GetParentResourceName?: () => string;
  }
}
export const chasePreview =
  new URLSearchParams(window.location.search).get("preview") === "1" &&
  !window.GetParentResourceName;
export const chasePhone =
  new URLSearchParams(window.location.search).get("phone") === "1";
export function ChaseNormalizeList<T>(
  chaseValue: T[] | object | undefined,
): T[] {
  if (Array.isArray(chaseValue)) return chaseValue;
  if (
    chaseValue &&
    typeof chaseValue === "object" &&
    Object.keys(chaseValue).length === 0
  )
    return [];
  throw new Error(
    "The station returned an invalid list. Refresh to reconnect.",
  );
}
function ChaseNormalizeStation(station: ChaseStation): ChaseStation {
  return {
    ...station,
    cohostNames:
      station.cohostNames === undefined
        ? []
        : ChaseNormalizeList(station.cohostNames),
    queue:
      station.queue === undefined
        ? undefined
        : ChaseNormalizeList(station.queue),
    nowPlaying: station.nowPlaying ?? null,
  };
}
function ChaseNormalizeCall(value: unknown): ChaseCallState {
  const chaseCall = value as Partial<ChaseCallState> | undefined;
  if (
    chaseCall &&
    typeof chaseCall === "object" &&
    (chaseCall.state === "ringing" || chaseCall.state === "onair")
  )
    return {
      state: chaseCall.state,
      stationId: Number.isFinite(chaseCall.stationId)
        ? chaseCall.stationId
        : undefined,
      stationName:
        typeof chaseCall.stationName === "string"
          ? chaseCall.stationName
          : undefined,
    };
  return { state: "idle" };
}
export function ChaseNormalizeSnapshot(value: unknown): ChaseSnapshot {
  if (!value || typeof value !== "object")
    throw new Error(
      "The station returned incomplete data. Refresh to reconnect.",
    );
  const chaseCandidate = value as Partial<ChaseSnapshot>;
  if (
    !chaseCandidate.viewer ||
    !chaseCandidate.config ||
    !Number.isFinite(chaseCandidate.config.frequencyMin) ||
    !Number.isFinite(chaseCandidate.config.frequencyMax)
  )
    throw new Error(
      "The station returned incomplete data. Refresh to reconnect.",
    );
  return {
    ...chaseCandidate,
    viewer: {
      ...chaseCandidate.viewer,
      call: ChaseNormalizeCall(chaseCandidate.viewer.call),
    },
    stations: ChaseNormalizeList<ChaseStation>(chaseCandidate.stations).map(
      ChaseNormalizeStation,
    ),
    requests: ChaseNormalizeList(chaseCandidate.requests),
    crew: ChaseNormalizeList(chaseCandidate.crew),
    cartridges: ChaseNormalizeList(chaseCandidate.cartridges),
    mine: chaseCandidate.mine
      ? ChaseNormalizeStation(chaseCandidate.mine)
      : null,
    tunedStationId: chaseCandidate.tunedStationId ?? null,
    config: {
      ...chaseCandidate.config,
      powerModes: ChaseNormalizeList(chaseCandidate.config.powerModes),
    },
    devices: chaseCandidate.devices
      ? {
          ...chaseCandidate.devices,
          shop:
            chaseCandidate.devices.shop === undefined
              ? []
              : ChaseNormalizeList(chaseCandidate.devices.shop),
          tunedStationId: chaseCandidate.devices.tunedStationId ?? null,
          placedNearby:
            chaseCandidate.devices.placedNearby === undefined
              ? []
              : ChaseNormalizeList<ChasePlacedRadio>(
                  chaseCandidate.devices.placedNearby,
                ).filter((chasePlaced) => Number.isInteger(chasePlaced.netId)),
          canPlace: chaseCandidate.devices.canPlace === true,
        }
      : undefined,
  } as ChaseSnapshot;
}
export async function ChasePost<T>(
  endpoint: string,
  data: Record<string, unknown> = {},
): Promise<T> {
  if (chasePreview) {
    const chaseDemo = await import("./preview");
    return chaseDemo.ChasePreviewPost(endpoint, data) as Promise<T>;
  }
  const chasePhoneResource = new URLSearchParams(window.location.search).get(
    "resource",
  );
  const chaseResource =
    chasePhone && chasePhoneResource === "chase_bootleg"
      ? "chase_bootleg"
      : window.GetParentResourceName?.();
  if (!chaseResource)
    throw new Error("Open Senora Signalworks from your in-game receiver.");
  const chaseController = new AbortController();
  const chaseTimeout = window.setTimeout(() => chaseController.abort(), 12000);
  try {
    const chaseResponse = await fetch(
      `https://${chaseResource}/chase_bootleg:${endpoint}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=UTF-8" },
        body: JSON.stringify(data),
        signal: chaseController.signal,
      },
    );
    if (!chaseResponse.ok)
      throw new Error("The radio could not reach the server. Try again.");
    const chaseResult = (await chaseResponse.json()) as ChaseEnvelope<T>;
    if (
      !chaseResult ||
      typeof chaseResult !== "object" ||
      typeof chaseResult.ok !== "boolean"
    )
      throw new Error(
        "The server returned an unreadable response. Refresh to reconnect.",
      );
    if (chaseResult.ok !== true)
      throw new Error(
        chaseResult.error?.message ||
          "The server could not complete that action.",
      );
    return chaseResult.data;
  } catch (chaseError) {
    if (chaseError instanceof DOMException && chaseError.name === "AbortError")
      throw new Error(
        "The server took too long to respond. Refresh before trying again.",
      );
    throw chaseError;
  } finally {
    window.clearTimeout(chaseTimeout);
  }
}
export function ChaseFrequency(value: number) {
  return (value / 10).toFixed(1);
}
export function ChaseMoney(value: number, currency: string) {
  return `${currency}${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)}`;
}
export function ChaseClock(seconds: number) {
  const chaseWhole = Math.max(0, Math.floor(seconds));
  return `${Math.floor(chaseWhole / 60)}:${(chaseWhole % 60).toString().padStart(2, "0")}`;
}
export function ChaseNormalizePlaced(value: unknown): ChasePlacedRadio | null {
  if (!value || typeof value !== "object") return null;
  const chasePlaced = value as Partial<ChasePlacedRadio>;
  if (!Number.isInteger(chasePlaced.netId) || Number(chasePlaced.netId) < 1)
    return null;
  return {
    netId: Number(chasePlaced.netId),
    stationId: Number.isFinite(chasePlaced.stationId)
      ? Number(chasePlaced.stationId)
      : null,
    frequency: Number.isFinite(chasePlaced.frequency)
      ? Number(chasePlaced.frequency)
      : null,
    label:
      typeof chasePlaced.label === "string" && chasePlaced.label.trim()
        ? chasePlaced.label
        : "No station selected",
    ownerName:
      typeof chasePlaced.ownerName === "string" && chasePlaced.ownerName.trim()
        ? chasePlaced.ownerName
        : undefined,
    quality: Number.isFinite(chasePlaced.quality)
      ? Math.max(0, Math.min(1, Number(chasePlaced.quality)))
      : null,
  };
}
export function ChaseError(value: unknown) {
  return value instanceof Error
    ? value.message
    : "Something interrupted the connection. Please try again.";
}
