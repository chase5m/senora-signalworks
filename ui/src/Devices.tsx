import { useEffect, useRef, useState } from "react";
import { ChaseIcon, ChaseSignal, ChaseStatus } from "./components";
import { ChaseCallControls } from "./Call";
import { ChaseFrequency } from "./transport";
import type {
  ChaseAction,
  ChasePlacedRadio,
  ChaseReceiverKind,
  ChaseSnapshot,
} from "./types";
export const chaseDeviceLabels = {
  vehicle: "SSW Dash Receiver",
  portable: "SSW Field Radio",
  buds: "Signalbuds",
};
export const chaseDeviceImages = {
  vehicle: "images/ssw_vehicle_receiver.png",
  portable: "images/ssw_portable_radio.png",
  buds: "images/ssw_signalbuds.png",
};
const chaseDeviceIcons = {
  vehicle: "van",
  portable: "radio",
  buds: "headphones",
};
export function ChasePlaceButton({
  snapshot,
  action,
  busy,
  className = "chase-button chase-secondary",
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
  className?: string;
}) {
  if (snapshot.devices?.canPlace !== true) return null;
  return (
    <button
      type="button"
      className={className}
      disabled={busy}
      onClick={() =>
        void action("placeRadio", {}, "Field Radio placed on the ground.")
      }
    >
      <ChaseIcon name="place" size={18} />
      Place on the ground
    </button>
  );
}
export function ChaseDeviceControls({
  snapshot,
  action,
  busy,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
}) {
  const chaseDevices = snapshot.devices;
  if (!chaseDevices) return null;
  return (
    <div className="chase-device-controls">
      <div className="chase-panel-heading">
        <span className="chase-eyebrow">LISTENING DEVICE</span>
        <span className="chase-count-pill">
          {chaseDevices.active === "none"
            ? "NONE EQUIPPED"
            : chaseDeviceLabels[chaseDevices.active]}
        </span>
      </div>
      <div className="chase-device-switch">
        {(["vehicle", "portable", "buds"] as const).map((chaseDevice) => (
          <button
            key={chaseDevice}
            className={`chase-button ${chaseDevices.active === chaseDevice ? "chase-primary" : "chase-secondary"}`}
            aria-pressed={chaseDevices.active === chaseDevice}
            disabled={
              busy ||
              (chaseDevice === "vehicle"
                ? !chaseDevices.vehicle.installed ||
                  !chaseDevices.vehicle.canControl
                : chaseDevices.owned[chaseDevice] < 1)
            }
            onClick={() =>
              void action(
                "equipDevice",
                { device: chaseDevice, carry: chaseDevices.carry },
                "Receiver selected.",
              )
            }
          >
            <ChaseIcon name={chaseDeviceIcons[chaseDevice]} size={18} />
            {chaseDevice === "vehicle"
              ? "Dash"
              : chaseDevice === "portable"
                ? "Field"
                : "Buds"}
          </button>
        ))}
      </div>
      {chaseDevices.active === "portable" ? (
        <div className="chase-carry-controls">
          <span>Carry position</span>
          <div className="chase-segmented">
            {(["hand", "shoulder"] as const).map((chaseCarry) => (
              <button
                key={chaseCarry}
                aria-pressed={chaseDevices.carry === chaseCarry}
                className={
                  chaseDevices.carry === chaseCarry ? "chase-selected" : ""
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
      {chaseDevices.active !== "none" ? (
        <button
          className="chase-text-button"
          disabled={busy}
          onClick={() =>
            void action("equipDevice", { device: "none" }, "Receiver put away.")
          }
        >
          Put away receiver
        </button>
      ) : (
        <p className="chase-caption">
          Equip a receiver to listen. Buy one from the Senora kiosk vendor in
          Legion Square.
        </p>
      )}
      <ChasePlaceButton
        snapshot={snapshot}
        action={action}
        busy={busy}
        className="chase-text-button chase-place-button"
      />
      {!chaseDevices.vehicle.installed && chaseDevices.owned.vehicle > 0 ? (
        <div className="chase-receiver-install">
          <p>
            {chaseDevices.vehicle.canInstall
              ? "Your Dash Receiver is ready to install in this vehicle."
              : chaseDevices.vehicle.positionError ||
                "Park in the driver seat to position your Dash Receiver."}
          </p>
          <button
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
                "Choose the receiver position, then save to install.",
              )
            }
          >
            <ChaseIcon name="van" size={18} />
            Position receiver
          </button>
        </div>
      ) : null}
      {chaseDevices.vehicle.installed && chaseDevices.vehicle.canMove ? (
        <button
          className="chase-button chase-secondary"
          disabled={busy}
          onClick={() =>
            void action("moveReceiver", { netId: chaseDevices.vehicle.netId })
          }
        >
          <ChaseIcon name="van" size={18} />
          Reposition dashboard receiver
        </button>
      ) : null}
    </div>
  );
}
export function ChaseReceiver({
  snapshot,
  action,
  busy,
  quality,
  device,
  placed = null,
}: {
  snapshot: ChaseSnapshot;
  action: ChaseAction;
  busy: boolean;
  quality: number | null;
  device: ChaseReceiverKind;
  placed?: ChasePlacedRadio | null;
}) {
  const chasePlaced =
    device === "placed" && placed
      ? (snapshot.devices?.placedNearby?.find(
          (chaseItem) => chaseItem.netId === placed.netId,
        ) ?? placed)
      : null;
  const chaseTunedId = chasePlaced
    ? (chasePlaced.stationId ?? null)
    : snapshot.tunedStationId;
  const chaseTuned = snapshot.stations.find(
    (chaseStation) => chaseStation.id === chaseTunedId,
  );
  const [chaseFrequency, chaseSetFrequency] = useState(
    chaseTuned?.frequency ??
      chasePlaced?.frequency ??
      snapshot.config.frequencyMin,
  );
  const chaseTunedRef = useRef(chaseTunedId);
  useEffect(() => {
    if (chaseTunedRef.current === chaseTunedId) return;
    chaseTunedRef.current = chaseTunedId;
    if (chaseTuned) chaseSetFrequency(chaseTuned.frequency);
  }, [chaseTunedId, chaseTuned]);
  const chasePlacedData = chasePlaced ? { placedNetId: chasePlaced.netId } : {};
  const chasePlacedNearby = snapshot.devices?.placedNearby;
  const chasePlacedGone =
    chasePlaced !== null &&
    Array.isArray(chasePlacedNearby) &&
    !chasePlacedNearby.some(
      (chaseItem) => chaseItem.netId === chasePlaced.netId,
    );
  const chaseLocked = busy || chasePlacedGone;
  const chaseDisplayDevice =
    device === "placed"
      ? "portable"
      : snapshot.devices?.active && snapshot.devices.active !== "none"
        ? snapshot.devices.active
        : device;
  const chaseQuality = chasePlaced ? (chasePlaced.quality ?? quality) : quality;
  return (
    <div className="chase-compact-receiver">
      <div className="chase-hardware-header">
        <ChaseIcon name={chaseDeviceIcons[chaseDisplayDevice]} size={25} />
        <div>
          <h2>{chaseDeviceLabels[chaseDisplayDevice]}</h2>
          <p>
            {chasePlaced
              ? `PLACED BY ${(chasePlaced.ownerName || "UNKNOWN").toUpperCase()}`
              : "SENORA SIGNALWORKS"}
          </p>
        </div>
        <ChaseSignal quality={chaseQuality} />
      </div>
      <div className="chase-hardware-screen">
        <div>
          <span>{chasePlaced ? "FIELD RADIO · GROUND" : "FM RECEIVER"}</span>
          <ChaseStatus live={Boolean(chaseTunedId)}>
            {chaseTunedId ? "CONNECTED" : "STANDBY"}
          </ChaseStatus>
        </div>
        <strong>
          {ChaseFrequency(chaseFrequency)}
          <span>MHz</span>
        </strong>
        <p>
          {chaseTuned?.name ||
            (chaseTunedId
              ? chasePlaced?.label || "Unlisted station"
              : "No station connected")}
        </p>
      </div>
      <form
        className="chase-hardware-tuner"
        onSubmit={(chaseEvent) => {
          chaseEvent.preventDefault();
          if (chasePlacedGone) return;
          void action(
            "tune",
            { frequency: chaseFrequency, ...chasePlacedData },
            "Receiver tuned.",
          );
        }}
      >
        <label>
          Frequency in MHz
          <input
            type="number"
            min={snapshot.config.frequencyMin / 10}
            max={snapshot.config.frequencyMax / 10}
            step="0.1"
            value={chaseFrequency / 10}
            required
            onChange={(chaseEvent) =>
              chaseSetFrequency(
                Math.round(Number(chaseEvent.target.value) * 10),
              )
            }
          />
        </label>
        <button className="chase-button chase-primary" disabled={chaseLocked}>
          Tune frequency
        </button>
        <button
          type="button"
          className="chase-button chase-secondary"
          disabled={chaseLocked || !chaseTunedId}
          onClick={() =>
            void action("untune", chasePlacedData, "Receiver disconnected.")
          }
        >
          Stop
        </button>
      </form>
      {chaseTuned && chaseTuned.id !== snapshot.mine?.id ? (
        <ChaseCallControls
          snapshot={snapshot}
          station={chaseTuned}
          action={action}
          busy={chaseLocked}
          placed={chasePlaced}
        />
      ) : null}
      {chasePlaced ? (
        <div className="chase-placed-actions">
          <p className="chase-caption">
            {chasePlacedGone
              ? "This field radio is no longer here."
              : "Anyone nearby can tune this radio, call from it or pick it up."}
          </p>
          <button
            type="button"
            className="chase-button chase-secondary"
            disabled={chaseLocked}
            onClick={() =>
              void action(
                "pickupRadio",
                { netId: chasePlaced.netId },
                "Field Radio picked up.",
              )
            }
          >
            <ChaseIcon name="hand" size={18} />
            Pick up
          </button>
        </div>
      ) : (
        <ChaseDeviceControls snapshot={snapshot} action={action} busy={busy} />
      )}
    </div>
  );
}
