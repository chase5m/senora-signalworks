export type ChaseView = "listen" | "studio" | "scanner" | "directory";
export type ChasePhoneTab =
  "home" | "listen" | "stations" | "devices" | "studio";
export type ChaseSpeechStation = {
  stationId?: number;
  stationName?: string;
  frequency?: number;
  hostName?: string;
};
export type ChaseSpeechRole = "host" | "cohost" | "caller";
export type ChaseSpeech = {
  local: ChaseSpeechStation & {
    mode: "station" | "idle";
    talking: boolean;
    micOpen: boolean;
    transmitting: boolean;
    role?: ChaseSpeechRole;
  };
  receiver:
    | (ChaseSpeechStation & {
        talking: boolean;
        hostSource?: number;
      })
    | null;
};
export type ChaseDevice = "vehicle" | "portable" | "buds";
export type ChaseReceiverKind = ChaseDevice | "placed";
export type ChasePlacedRadio = {
  netId: number;
  stationId?: number | null;
  frequency?: number | null;
  label: string;
  ownerName?: string;
  quality?: number | null;
};
export type ChaseProvider = "file" | "youtube" | "soundcloud";
export type ChaseTrackProvider = Exclude<ChaseProvider, "file">;
export type ChasePlayback = {
  phase: "loading" | "playing" | "blocked" | "error";
  monitor: boolean;
  stationId?: number;
  name: string;
  provider: ChaseProvider;
};
export type ChaseStationMode = "dj" | "autonomous";
export type ChaseTrack = {
  id: number;
  provider: ChaseTrackProvider;
  url: string;
  title: string;
  duration: number;
};
export type ChaseNowPlaying = {
  provider: ChaseProvider;
  title: string;
  duration: number;
  startedAt: number;
};
export type ChaseCallState = {
  state: "idle" | "ringing" | "onair";
  stationId?: number;
  stationName?: string;
};
export type ChaseIncomingCall = {
  callId: number;
  callerName: string;
  stationId: number;
  stationName: string;
  ringSeconds: number;
  receivedAt: number;
  acceptKey?: string;
  declineKey?: string;
};
export type ChaseDevices = {
  active: ChaseDevice | "none";
  carry: "hand" | "shoulder";
  owned: Record<ChaseDevice, number>;
  canShop?: boolean;
  vehicle: {
    installed: boolean;
    netId?: number;
    canInstall: boolean;
    canControl: boolean;
    canMove?: boolean;
    positionError?: string;
    mount?: {
      x: number;
      y: number;
      z: number;
      rx: number;
      ry: number;
      rz: number;
    } | null;
  };
  shop?: {
    device: ChaseDevice;
    item: string;
    label: string;
    price: number;
  }[];
  tunedStationId?: number | null;
  placedNearby?: ChasePlacedRadio[];
  canPlace?: boolean;
};
export type ChaseStage =
  "stored" | "parked" | "deploying" | "ready" | "live" | "packing";
export type ChaseStation = {
  id: number;
  name: string;
  tagline: string;
  frequency: number;
  power: string;
  isPublic: boolean;
  stage: ChaseStage;
  live: boolean;
  micLive: boolean;
  talking?: boolean;
  listeners: number;
  battery: number;
  showTitle: string;
  hostName: string;
  canManage: boolean;
  canWithdraw: boolean;
  balance?: number;
  vehicleNetId?: number;
  mode?: ChaseStationMode;
  cohostNames: string[];
  nowPlaying?: ChaseNowPlaying | null;
  queue?: ChaseTrack[];
  autoplay?: boolean;
  pendingCall?: {
    callId: number;
    callerName: string;
    expiresAt: number;
  } | null;
  caller?: {
    name: string;
  } | null;
};
export type ChaseRequest = {
  id: number;
  stationId: number;
  senderName: string;
  kind: "request" | "advertisement";
  message: string;
  status: "pending" | "accepted" | "dismissed";
  createdAt: number;
};
export type ChaseSnapshot = {
  viewer: {
    name: string;
    isPolice: boolean;
    canCreate: boolean;
    canOperate?: boolean;
    voiceReady: boolean;
    isHost?: boolean;
    isCoHost?: boolean;
    call: ChaseCallState;
  };
  stations: ChaseStation[];
  mine: ChaseStation | null;
  tunedStationId: number | null;
  requests: ChaseRequest[];
  cartridges: {
    id: string;
    name: string;
    description: string;
    duration: number;
  }[];
  config: {
    stationPrice: number;
    maxTip: number;
    frequencyMin: number;
    frequencyMax: number;
    currency: string;
    powerModes: {
      id: string;
      label: string;
      range: number;
    }[];
    requestMaxLength: number;
    speech?: {
      enabled: boolean;
      hud: boolean;
    };
    talk?: {
      command: string;
      key: string;
    };
    broadcastJob?: {
      enabled: boolean;
      name: string;
      requireDuty: boolean;
      minGrade: number;
    };
    music?: {
      enabled: boolean;
      providers: {
        youtube: boolean;
        soundcloud: boolean;
      };
      maxQueue: number;
      maxDurationSeconds: number;
      minDurationSeconds: number;
    };
    calls?: {
      enabled: boolean;
      ringSeconds: number;
      acceptKey: string;
      declineKey: string;
    };
  };
  crew: {
    source: number;
    name: string;
    memberId?: number;
  }[];
  voiceReady: boolean;
  volume?: number;
  devices?: ChaseDevices;
  speech?: ChaseSpeech;
};
export type ChaseScan = {
  detected: boolean;
  frequency: number;
  strength: number;
  bearing: number;
  uncertainty: number;
  readings: number;
  searchArea?: {
    x: number;
    y: number;
    radius: number;
  };
  message: string;
};
export type ChaseEnvelope<T> =
  | {
      ok: true;
      data: T;
    }
  | {
      ok: false;
      error: {
        code: string;
        message: string;
      };
    };
export type ChaseAction = (
  action: string,
  data?: Record<string, unknown>,
  message?: string,
) => Promise<boolean>;
export type ChaseTone = "success" | "error" | "info";
export type ChaseTalk = (pressed: boolean) => void;
