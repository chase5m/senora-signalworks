import { useEffect, useRef, useState } from "react";
import { ChasePost } from "./transport";
import "./dashboard.css";
type ChaseAxis = "x" | "y" | "z";
type ChaseMount = Record<ChaseAxis | "rx" | "ry" | "rz", number>;
type ChaseEditor = {
  session: string;
  mode: "place" | "interact";
  transform: "move" | "rotate";
  axis: ChaseAxis;
  mount: ChaseMount;
  installed: boolean;
  busy: boolean;
  error?: string;
};
type ChaseEditorCommand = {
  command: "mode" | "axis" | "reset" | "nudge" | "save" | "cancel";
  mode?: "move" | "rotate";
  axis?: ChaseAxis;
  direction?: number;
  fine?: boolean;
};
export function ChaseDashboardOverlay() {
  const [chaseEditor, chaseSetEditor] = useState<ChaseEditor | null>(null);
  const [chaseError, chaseSetError] = useState("");
  const [chaseSaving, chaseSetSaving] = useState(false);
  const chaseEditorRef = useRef<ChaseEditor | null>(null);
  const chasePending = useRef(false);
  const chaseGeneration = useRef(0);
  async function ChaseCommand(payload: ChaseEditorCommand) {
    if (
      !chaseEditorRef.current ||
      chaseEditorRef.current.busy ||
      chasePending.current
    )
      return;
    const chaseVersion = chaseGeneration.current;
    const chaseSave = payload.command === "save";
    if (chaseSave) {
      chasePending.current = true;
      chaseSetSaving(true);
    }
    chaseSetError("");
    try {
      await ChasePost("dashboardEditor", {
        ...payload,
        session: chaseEditorRef.current.session,
      });
    } catch (error) {
      if (chaseVersion === chaseGeneration.current)
        chaseSetError(
          error instanceof Error
            ? error.message
            : "The receiver could not complete this action.",
        );
    } finally {
      if (chaseVersion === chaseGeneration.current) {
        chasePending.current = false;
        chaseSetSaving(false);
      }
    }
  }
  useEffect(() => {
    if (new URLSearchParams(location.search).get("phone") === "1") return;
    function ChaseReceive(event: MessageEvent) {
      if (event.data?.type !== "chase_bootleg:dashboardEditor") return;
      const value = event.data.data;
      if (
        !value ||
        !["place", "interact"].includes(value.mode) ||
        typeof value.session !== "string" ||
        !value.session
      ) {
        chaseGeneration.current += 1;
        chaseEditorRef.current = null;
        chasePending.current = false;
        chaseSetSaving(false);
        chaseSetError("");
        chaseSetEditor(null);
        return;
      }
      if (chaseEditorRef.current?.session !== value.session) {
        chaseGeneration.current += 1;
        chasePending.current = false;
        chaseSetSaving(false);
        chaseSetError("");
      }
      const mount = Object.fromEntries(
        ["x", "y", "z", "rx", "ry", "rz"].map((key) => [
          key,
          Number.isFinite(value.mount?.[key]) ? value.mount[key] : 0,
        ]),
      ) as ChaseMount;
      const next: ChaseEditor = {
        session: value.session,
        mode: value.mode,
        transform: value.transform === "rotate" ? "rotate" : "move",
        axis: ["x", "y", "z"].includes(value.axis) ? value.axis : "x",
        mount,
        installed: value.installed === true,
        busy: value.busy === true,
        error: typeof value.error === "string" ? value.error : undefined,
      };
      chaseEditorRef.current = next;
      chaseSetEditor(next);
    }
    function ChaseKeyboard(event: KeyboardEvent) {
      const state = chaseEditorRef.current;
      if (!state) return;
      const key = event.key.toLowerCase();
      let command: ChaseEditorCommand | null = null;
      if (key === "escape") command = { command: "cancel" };
      else if (state.mode === "place") {
        if (key === "t" || key === "r")
          command = { command: "mode", mode: key === "r" ? "rotate" : "move" };
        else if (key === "x" || key === "y" || key === "z")
          command = { command: "axis", axis: key };
        else if (key === "enter" && !event.repeat)
          command = { command: "save" };
        else if (
          [
            "arrowleft",
            "arrowdown",
            "-",
            "arrowright",
            "arrowup",
            "+",
            "=",
          ].includes(key)
        )
          command = {
            command: "nudge",
            direction: ["arrowleft", "arrowdown", "-"].includes(key) ? -1 : 1,
            fine: event.shiftKey,
          };
      }
      if (command) {
        event.preventDefault();
        event.stopImmediatePropagation();
        void ChaseCommand(command);
      }
    }
    window.addEventListener("message", ChaseReceive);
    window.addEventListener("keydown", ChaseKeyboard, true);
    return () => {
      chaseGeneration.current += 1;
      window.removeEventListener("message", ChaseReceive);
      window.removeEventListener("keydown", ChaseKeyboard, true);
    };
  }, []);
  if (!chaseEditor) return null;
  const chaseBusy = chaseEditor.busy || chaseSaving;
  if (chaseEditor.mode === "interact")
    return (
      <aside
        className="chase-dashboard-screen-hint"
        aria-label="Dashboard screen controls"
      >
        <span>
          <strong>SSW DASH RECEIVER</strong>Click the screen to tune in
        </span>
        <button onClick={() => void ChaseCommand({ command: "cancel" })}>
          <kbd>ESC</kbd>Close
        </button>
      </aside>
    );
  return (
    <aside
      className="chase-dashboard-editor"
      aria-label="Dashboard receiver placement"
    >
      <header>
        <span>SSW / DASH RECEIVER</span>
        <h2>
          {chaseEditor.installed
            ? "Adjust your receiver"
            : "Make it fit your dash"}
        </h2>
        <p>Move and tilt the screen until it sits where you want it.</p>
      </header>
      <fieldset disabled={chaseBusy}>
        <div className="chase-dashboard-modes">
          <button
            aria-pressed={chaseEditor.transform === "move"}
            onClick={() => void ChaseCommand({ command: "mode", mode: "move" })}
          >
            <kbd>T</kbd>Move
          </button>
          <button
            aria-pressed={chaseEditor.transform === "rotate"}
            onClick={() =>
              void ChaseCommand({ command: "mode", mode: "rotate" })
            }
          >
            <kbd>R</kbd>Rotate
          </button>
        </div>
        <div className="chase-dashboard-axis" aria-label="Selected axis">
          {(["x", "y", "z"] as const).map((axis) => (
            <button
              key={axis}
              data-axis={axis}
              aria-pressed={chaseEditor.axis === axis}
              onClick={() => void ChaseCommand({ command: "axis", axis })}
            >
              {axis.toUpperCase()}
              <span>
                {axis === "x" ? "Side" : axis === "y" ? "Depth" : "Height"}
              </span>
            </button>
          ))}
        </div>
        <div className="chase-dashboard-adjust">
          <button
            aria-label="Decrease selected axis"
            onClick={() =>
              void ChaseCommand({ command: "nudge", direction: -1 })
            }
          >
            −
          </button>
          <output>
            {chaseEditor.transform === "move"
              ? (chaseEditor.mount[chaseEditor.axis] * 100).toFixed(1)
              : chaseEditor.mount[`r${chaseEditor.axis}`].toFixed(1)}
            <small>{chaseEditor.transform === "move" ? "cm" : "°"}</small>
          </output>
          <button
            aria-label="Increase selected axis"
            onClick={() =>
              void ChaseCommand({ command: "nudge", direction: 1 })
            }
          >
            +
          </button>
        </div>
        <ul>
          <li>
            <b>Left mouse</b>Drag a colored axis
          </li>
          <li>
            <b>Right mouse</b>Look around your cabin
          </li>
          <li>
            <b>Arrow keys</b>Adjust selected axis
          </li>
          <li>
            <b>Hold Shift</b>Fine adjustment
          </li>
        </ul>
        <button
          className="chase-dashboard-reset"
          onClick={() => void ChaseCommand({ command: "reset" })}
        >
          Reset position
        </button>
      </fieldset>
      {chaseError || chaseEditor.error ? (
        <p className="chase-dashboard-error" role="alert">
          {chaseError || chaseEditor.error}
        </p>
      ) : null}
      <footer>
        <button
          className="chase-dashboard-save"
          disabled={chaseBusy}
          onClick={() => void ChaseCommand({ command: "save" })}
        >
          <kbd>↵</kbd>
          {chaseBusy
            ? "Saving…"
            : chaseEditor.installed
              ? "Save position"
              : "Install receiver"}
        </button>
        <button
          disabled={chaseBusy}
          onClick={() => void ChaseCommand({ command: "cancel" })}
        >
          <kbd>ESC</kbd>Cancel
        </button>
      </footer>
      <small>
        {chaseEditor.installed
          ? "Changes apply when you save."
          : "The item is used only when you install."}
      </small>
    </aside>
  );
}
