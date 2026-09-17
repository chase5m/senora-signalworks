import { useEffect, useRef, type ReactNode } from "react";
import type { ChaseTone } from "./types";
import { RadioIcon } from "@phosphor-icons/react/dist/csr/Radio";
import { SlidersHorizontalIcon } from "@phosphor-icons/react/dist/csr/SlidersHorizontal";
import { CrosshairIcon } from "@phosphor-icons/react/dist/csr/Crosshair";
import { ArrowRightIcon } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { XIcon } from "@phosphor-icons/react/dist/csr/X";
import { PlayIcon } from "@phosphor-icons/react/dist/csr/Play";
import { StopIcon } from "@phosphor-icons/react/dist/csr/Stop";
import { MicrophoneIcon } from "@phosphor-icons/react/dist/csr/Microphone";
import { CellSignalFullIcon } from "@phosphor-icons/react/dist/csr/CellSignalFull";
import { SpeakerHighIcon } from "@phosphor-icons/react/dist/csr/SpeakerHigh";
import { UsersIcon } from "@phosphor-icons/react/dist/csr/Users";
import { LightningIcon } from "@phosphor-icons/react/dist/csr/Lightning";
import { VanIcon } from "@phosphor-icons/react/dist/csr/Van";
import { WalletIcon } from "@phosphor-icons/react/dist/csr/Wallet";
import { CassetteTapeIcon } from "@phosphor-icons/react/dist/csr/CassetteTape";
import { PlusIcon } from "@phosphor-icons/react/dist/csr/Plus";
import { MinusIcon } from "@phosphor-icons/react/dist/csr/Minus";
import { CheckIcon } from "@phosphor-icons/react/dist/csr/Check";
import { ArrowClockwiseIcon } from "@phosphor-icons/react/dist/csr/ArrowClockwise";
import { HeadphonesIcon } from "@phosphor-icons/react/dist/csr/Headphones";
import { ChatTextIcon } from "@phosphor-icons/react/dist/csr/ChatText";
import { MagnifyingGlassIcon } from "@phosphor-icons/react/dist/csr/MagnifyingGlass";
import { GearSixIcon } from "@phosphor-icons/react/dist/csr/GearSix";
import { BroadcastIcon } from "@phosphor-icons/react/dist/csr/Broadcast";
import { NavigationArrowIcon } from "@phosphor-icons/react/dist/csr/NavigationArrow";
import { PhoneIcon } from "@phosphor-icons/react/dist/csr/Phone";
import { ListBulletsIcon } from "@phosphor-icons/react/dist/csr/ListBullets";
import { CaretDownIcon } from "@phosphor-icons/react/dist/csr/CaretDown";
import { HouseSimpleIcon } from "@phosphor-icons/react/dist/csr/HouseSimple";
import { HandGrabbingIcon } from "@phosphor-icons/react/dist/csr/HandGrabbing";
import { ArrowLineDownIcon } from "@phosphor-icons/react/dist/csr/ArrowLineDown";
import { PauseIcon } from "@phosphor-icons/react/dist/csr/Pause";
import { SkipForwardIcon } from "@phosphor-icons/react/dist/csr/SkipForward";
import { SkipBackIcon } from "@phosphor-icons/react/dist/csr/SkipBack";
import { ArrowUpIcon } from "@phosphor-icons/react/dist/csr/ArrowUp";
import { ArrowDownIcon } from "@phosphor-icons/react/dist/csr/ArrowDown";
import { TrashIcon } from "@phosphor-icons/react/dist/csr/Trash";
import { LinkIcon } from "@phosphor-icons/react/dist/csr/Link";
import { InfoIcon } from "@phosphor-icons/react/dist/csr/Info";
import { MusicNotesIcon } from "@phosphor-icons/react/dist/csr/MusicNotes";
import { HeartIcon } from "@phosphor-icons/react/dist/csr/Heart";
import { MegaphoneIcon } from "@phosphor-icons/react/dist/csr/Megaphone";
import { FloppyDiskIcon } from "@phosphor-icons/react/dist/csr/FloppyDisk";
import { UserPlusIcon } from "@phosphor-icons/react/dist/csr/UserPlus";
import { CompassIcon } from "@phosphor-icons/react/dist/csr/Compass";
const chaseIcons = {
  pause: PauseIcon,
  next: SkipForwardIcon,
  previous: SkipBackIcon,
  up: ArrowUpIcon,
  down: ArrowDownIcon,
  trash: TrashIcon,
  link: LinkIcon,
  info: InfoIcon,
  music: MusicNotesIcon,
  heart: HeartIcon,
  advert: MegaphoneIcon,
  save: FloppyDiskIcon,
  addUser: UserPlusIcon,
  compass: CompassIcon,
  radio: RadioIcon,
  studio: SlidersHorizontalIcon,
  scan: CrosshairIcon,
  arrow: ArrowRightIcon,
  close: XIcon,
  play: PlayIcon,
  stop: StopIcon,
  mic: MicrophoneIcon,
  signal: CellSignalFullIcon,
  volume: SpeakerHighIcon,
  users: UsersIcon,
  bolt: LightningIcon,
  van: VanIcon,
  money: WalletIcon,
  cassette: CassetteTapeIcon,
  plus: PlusIcon,
  minus: MinusIcon,
  check: CheckIcon,
  refresh: ArrowClockwiseIcon,
  headphones: HeadphonesIcon,
  message: ChatTextIcon,
  search: MagnifyingGlassIcon,
  settings: GearSixIcon,
  broadcast: BroadcastIcon,
  direction: NavigationArrowIcon,
  phone: PhoneIcon,
  directory: ListBulletsIcon,
  caret: CaretDownIcon,
  home: HouseSimpleIcon,
  hand: HandGrabbingIcon,
  place: ArrowLineDownIcon,
};
export function ChaseIcon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const ChaseGlyph = chaseIcons[name as keyof typeof chaseIcons] || RadioIcon;
  return <ChaseGlyph size={size} weight="regular" aria-hidden="true" />;
}
export function ChaseEmpty({
  icon = "radio",
  title,
  children,
}: {
  icon?: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="chase-empty">
      <span className="chase-empty-icon">
        <ChaseIcon name={icon} size={28} />
      </span>
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}
export function ChaseStatus({
  live,
  children,
}: {
  live?: boolean;
  children: ReactNode;
}) {
  return (
    <span className={`chase-status ${live ? "chase-status-live" : ""}`}>
      <i />
      {children}
    </span>
  );
}
export function ChaseToast({
  toast,
  dismiss,
}: {
  toast: {
    message: string;
    tone: ChaseTone;
  } | null;
  dismiss: () => void;
}) {
  if (!toast) return null;
  return (
    <div
      className={`chase-toast chase-toast-${toast.tone}`}
      role={toast.tone === "error" ? "alert" : "status"}
    >
      <ChaseIcon
        name={
          toast.tone === "success"
            ? "check"
            : toast.tone === "error"
              ? "close"
              : "radio"
        }
        size={19}
      />
      <span>{toast.message}</span>
      <button aria-label="Dismiss notification" onClick={dismiss}>
        <ChaseIcon name="close" size={16} />
      </button>
    </div>
  );
}
export function ChaseSignal({ quality }: { quality: number | null }) {
  const chasePercent =
    quality === null
      ? null
      : Math.round(Math.max(0, Math.min(1, quality)) * 100);
  return (
    <span
      className="chase-reception"
      aria-label={
        chasePercent === null
          ? "Reception unavailable"
          : `${chasePercent} percent reception`
      }
    >
      <ChaseIcon name="signal" size={20} />
      <span>
        {chasePercent === null
          ? "No reception data"
          : `${chasePercent}% signal`}
      </span>
    </span>
  );
}
export function ChaseDialog({
  title,
  description,
  icon = "radio",
  close,
  children,
}: {
  title: string;
  description?: string;
  icon?: string;
  close: () => void;
  children: ReactNode;
}) {
  const chaseRef = useRef<HTMLDivElement>(null);
  const chaseCloseRef = useRef(close);
  chaseCloseRef.current = close;
  useEffect(() => {
    const chasePrevious = document.activeElement as HTMLElement | null;
    chaseRef.current
      ?.querySelector<HTMLElement>("input, textarea, select, button")
      ?.focus();
    return () => chasePrevious?.focus();
  }, []);
  return (
    <div className="chase-modal-backdrop">
      <div
        className="chase-modal"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={chaseRef}
        onKeyDown={(chaseEvent) => {
          if (chaseEvent.key === "Escape") {
            chaseEvent.stopPropagation();
            chaseEvent.preventDefault();
            chaseCloseRef.current();
          }
          if (chaseEvent.key === "Tab") {
            chaseEvent.stopPropagation();
            const chaseControls = [
              ...(chaseRef.current?.querySelectorAll<HTMLElement>(
                "button:not(:disabled),input:not(:disabled),textarea:not(:disabled),select:not(:disabled)",
              ) || []),
            ];
            const chaseFirst = chaseControls[0];
            const chaseLast = chaseControls.at(-1);
            if (chaseEvent.shiftKey && document.activeElement === chaseFirst) {
              chaseEvent.preventDefault();
              chaseLast?.focus();
            } else if (
              !chaseEvent.shiftKey &&
              document.activeElement === chaseLast
            ) {
              chaseEvent.preventDefault();
              chaseFirst?.focus();
            }
          }
        }}
      >
        <header className="chase-modal-header">
          <span className="chase-modal-icon">
            <ChaseIcon name={icon} size={22} />
          </span>
          <div>
            <h2>{title}</h2>
            {description ? <p>{description}</p> : null}
          </div>
          <button
            className="chase-icon-button"
            aria-label={`Close ${title}`}
            onClick={close}
          >
            <ChaseIcon name="close" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
}
