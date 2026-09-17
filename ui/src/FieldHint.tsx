import { useEffect, useState } from "react";
import { ChaseIcon } from "./components";
type ChaseFieldHintState = {
  mode: "carried" | "placed";
  carry?: "hand" | "shoulder";
  canPlace: boolean;
  placeKey: string;
  cancelKey: string;
};
export function ChaseFieldHint() {
  const [chaseHint, chaseSetHint] = useState<ChaseFieldHintState | null>(null);
  useEffect(() => {
    function ChaseReceiveHint(event: MessageEvent) {
      if (event.data?.type !== "chase_bootleg:fieldHint") return;
      const chaseData = event.data.data;
      if (!chaseData || !["carried", "placed"].includes(chaseData.mode)) {
        chaseSetHint(null);
        return;
      }
      const chaseNext: ChaseFieldHintState = {
        mode: chaseData.mode,
        carry: chaseData.carry === "shoulder" ? "shoulder" : "hand",
        canPlace: chaseData.canPlace === true,
        placeKey:
          typeof chaseData.placeKey === "string"
            ? chaseData.placeKey.slice(0, 24)
            : "Bound key",
        cancelKey:
          typeof chaseData.cancelKey === "string"
            ? chaseData.cancelKey.slice(0, 24)
            : "Bound key",
      };
      chaseSetHint((previous) =>
        previous &&
        previous.mode === chaseNext.mode &&
        previous.carry === chaseNext.carry &&
        previous.canPlace === chaseNext.canPlace &&
        previous.placeKey === chaseNext.placeKey &&
        previous.cancelKey === chaseNext.cancelKey
          ? previous
          : chaseNext,
      );
    }
    window.addEventListener("message", ChaseReceiveHint);
    return () => window.removeEventListener("message", ChaseReceiveHint);
  }, []);
  if (!chaseHint) return null;
  return (
    <aside className="chase-field-hint" aria-label="Field Radio controls">
      <div className="chase-field-hint-title">
        <ChaseIcon name="radio" size={21} />
        <strong>Field Radio</strong>
        <span>
          {chaseHint.mode === "placed"
            ? "On the floor"
            : chaseHint.carry === "shoulder"
              ? "Shoulder carry"
              : "Hand carry"}
        </span>
      </div>
      <div className="chase-field-hint-actions">
        {chaseHint.mode === "placed" || chaseHint.canPlace ? (
          <span>
            <kbd>{chaseHint.placeKey}</kbd>
            {chaseHint.mode === "placed" ? "Pick up radio" : "Place on floor"}
          </span>
        ) : null}
        {chaseHint.mode === "carried" ? (
          <span>
            <kbd>{chaseHint.cancelKey}</kbd>Put away
          </span>
        ) : (
          <span>Third eye · Tune / call host</span>
        )}
      </div>
      <small>Change controls in Settings → Key Bindings → FiveM</small>
    </aside>
  );
}
