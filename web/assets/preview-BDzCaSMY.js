let chaseSnapshot = {
  devices: {
    active: "buds",
    carry: "hand",
    owned: { vehicle: 1, portable: 1, buds: 1 },
    canShop: true,
    vehicle: {
      installed: false,
      netId: 44,
      canInstall: true,
      canControl: true
    },
    shop: [
      {
        device: "vehicle",
        item: "ssw_vehicle_receiver",
        label: "Dash Receiver",
        price: 2500
      },
      {
        device: "portable",
        item: "ssw_portable_radio",
        label: "Field Radio",
        price: 1200
      },
      {
        device: "buds",
        item: "ssw_signalbuds",
        label: "Signalbuds",
        price: 850
      }
    ],
    tunedStationId: 2,
    placedNearby: [
      {
        netId: 1201,
        stationId: 2,
        frequency: 921,
        label: "SOFT SPOT",
        ownerName: "Cleo",
        quality: 0.86
      }
    ],
    canPlace: true
  },
  viewer: {
    name: "Chase",
    isPolice: true,
    canCreate: true,
    canOperate: true,
    voiceReady: true,
    isHost: false,
    isCoHost: false,
    call: { state: "idle" }
  },
  stations: [
    {
      id: 1,
      name: "OFFLINE FM",
      tagline: "For the ones still out.",
      frequency: 987,
      power: "low",
      isPublic: true,
      stage: "live",
      live: true,
      micLive: false,
      listeners: 24,
      battery: 78,
      showTitle: "The midnight detour",
      hostName: "Chase",
      canManage: true,
      canWithdraw: true,
      balance: 1250,
      vehicleNetId: 44,
      mode: "dj",
      cohostNames: [],
      nowPlaying: null,
      queue: [
        {
          id: 1,
          provider: "youtube",
          url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
          title: "Late shift loop",
          duration: 212
        },
        {
          id: 2,
          provider: "soundcloud",
          url: "https://soundcloud.com/senora/after-hours",
          title: "After hours (edit)",
          duration: 287
        }
      ],
      autoplay: false,
      pendingCall: null,
      caller: null
    },
    {
      id: 2,
      name: "SOFT SPOT",
      tagline: "A little less noise.",
      frequency: 921,
      power: "low",
      isPublic: true,
      stage: "live",
      live: true,
      micLive: true,
      listeners: 12,
      battery: 91,
      showTitle: "After hours, together",
      hostName: "Cleo",
      canManage: false,
      canWithdraw: false,
      mode: "autonomous",
      cohostNames: ["Milo"],
      nowPlaying: {
        provider: "youtube",
        title: "Slow lights over Vespucci",
        duration: 245,
        startedAt: Math.floor(Date.now() / 1e3) - 60
      }
    },
    {
      id: 3,
      name: "EASTSIDE",
      tagline: "From the block, to the city.",
      frequency: 1043,
      power: "high",
      isPublic: true,
      stage: "ready",
      live: false,
      micLive: false,
      listeners: 0,
      battery: 64,
      showTitle: "Eastside exchange",
      hostName: "Vince",
      canManage: false,
      canWithdraw: false,
      mode: "dj",
      cohostNames: [],
      nowPlaying: null
    }
  ],
  mine: null,
  tunedStationId: 2,
  requests: [
    {
      id: 1,
      stationId: 1,
      senderName: "Jules",
      kind: "request",
      message: "Send some love to everyone finishing the late shift at Hayes tonight.",
      status: "pending",
      createdAt: 1789402200
    },
    {
      id: 2,
      stationId: 1,
      senderName: "Milo",
      kind: "advertisement",
      message: "Bike meet at the canals. Roll through after midnight. Everyone welcome.",
      status: "pending",
      createdAt: 1789402100
    }
  ],
  cartridges: [
    {
      id: "ident",
      name: "Station ident",
      description: "Your signature on the air.",
      duration: 8
    },
    {
      id: "break",
      name: "Back in a minute",
      description: "A short intermission cue.",
      duration: 12
    },
    {
      id: "signoff",
      name: "Until next time",
      description: "Close the night with a sign-off.",
      duration: 10
    }
  ],
  config: {
    stationPrice: 15e3,
    maxTip: 5e3,
    frequencyMin: 880,
    frequencyMax: 1080,
    currency: "$",
    powerModes: [
      { id: "low", label: "Local", range: 1200 },
      { id: "high", label: "Citywide", range: 3e3 }
    ],
    requestMaxLength: 240,
    music: {
      enabled: true,
      providers: { youtube: true, soundcloud: true },
      maxQueue: 50,
      maxDurationSeconds: 3600,
      minDurationSeconds: 5
    },
    calls: { enabled: true, ringSeconds: 30, acceptKey: "Y", declineKey: "U" },
    speech: { enabled: true, hud: true },
    talk: { command: "senoratalk", key: "CAPITAL" }
  },
  crew: [
    { source: 14, name: "Cleo", memberId: 1 },
    { source: 0, name: "Milo", memberId: 2 }
  ],
  voiceReady: true,
  speech: {
    local: {
      mode: "idle",
      talking: false,
      micOpen: false,
      transmitting: false
    },
    receiver: {
      stationId: 2,
      stationName: "SOFT SPOT",
      frequency: 921,
      hostName: "Cleo",
      hostSource: 14,
      talking: false
    }
  }
};
chaseSnapshot.mine = { ...chaseSnapshot.stations[0] };
function ChasePreviewSpeech() {
  const chaseMine = chaseSnapshot.mine;
  const chaseTuned = chaseSnapshot.stations.find((chaseStation) => chaseStation.id === chaseSnapshot.tunedStationId);
  chaseSnapshot.speech = {
    local: chaseMine?.micLive && chaseSnapshot.viewer.isHost ? {
      mode: "idle",
      talking: false,
      micOpen: true,
      transmitting: false,
      role: "host",
      stationId: chaseMine.id,
      stationName: chaseMine.name,
      frequency: chaseMine.frequency,
      hostName: chaseMine.hostName
    } : { mode: "idle", talking: false, micOpen: false, transmitting: false },
    receiver: chaseTuned && chaseTuned.id !== chaseMine?.id ? {
      stationId: chaseTuned.id,
      stationName: chaseTuned.name,
      frequency: chaseTuned.frequency,
      hostName: chaseTuned.hostName,
      hostSource: 14,
      talking: false
    } : null
  };
}
function ChasePreviewPlaced(payload) {
  const chaseNetId = Number(payload.placedNetId ?? payload.netId);
  const chasePlaced = chaseSnapshot.devices?.placedNearby?.find((chaseItem) => chaseItem.netId === chaseNetId);
  if (!chasePlaced)
    throw new Error("That radio is no longer nearby.");
  return chasePlaced;
}
function ChasePreviewRefreshPlace() {
  const chaseDevices = chaseSnapshot.devices;
  if (!chaseDevices)
    return;
  chaseDevices.canPlace = chaseDevices.owned.portable > 0 || chaseDevices.active === "portable";
}
function ChasePreviewStation() {
  if (!chaseSnapshot.mine)
    throw new Error("Create a station first.");
  return chaseSnapshot.mine;
}
async function ChasePreviewPost(endpoint, payload) {
  await new Promise((chaseResolve) => window.setTimeout(chaseResolve, 300));
  if (endpoint === "close" || endpoint === "volume" || endpoint === "talk")
    return {};
  if (endpoint === "bootstrap")
    return structuredClone(chaseSnapshot);
  const chaseAction = endpoint === "scan" ? "scan" : String(payload.action);
  const chaseData = endpoint === "scan" ? payload : payload.data || {};
  if (chaseAction === "scan") {
    const chaseFrequency = Number(chaseData.frequency);
    return {
      detected: chaseFrequency === 987 || chaseFrequency === 921,
      frequency: chaseFrequency,
      strength: 0.68,
      bearing: 62,
      uncertainty: 26,
      readings: 1,
      message: "Signal acquired. Move to a different location before taking another reading."
    };
  }
  if (chaseAction === "equipDevice" && chaseSnapshot.devices) {
    const chaseDevice = String(chaseData.device);
    if (!["vehicle", "portable", "buds", "none"].includes(chaseDevice))
      throw new Error("Unknown receiver.");
    if (chaseDevice !== "none" && chaseDevice !== "vehicle" && chaseSnapshot.devices.owned[chaseDevice] < 1)
      throw new Error("Purchase this receiver first.");
    chaseSnapshot.devices.active = chaseDevice;
    if (chaseData.carry === "hand" || chaseData.carry === "shoulder")
      chaseSnapshot.devices.carry = chaseData.carry;
    if (chaseDevice === "none")
      chaseSnapshot.tunedStationId = null;
  } else if (chaseAction === "installReceiver" && chaseSnapshot.devices) {
    if (chaseSnapshot.devices.owned.vehicle < 1)
      throw new Error("Purchase a Dash Receiver first.");
    chaseSnapshot.devices.vehicle.installed = true;
    chaseSnapshot.devices.vehicle.canInstall = false;
    chaseSnapshot.devices.owned.vehicle -= 1;
  } else if (chaseAction === "placeRadio" && chaseSnapshot.devices) {
    const chaseDevices = chaseSnapshot.devices;
    if (chaseDevices.owned.portable < 1 && chaseDevices.active !== "portable")
      throw new Error("You need a Field Radio to place one.");
    const chaseCarried = chaseDevices.active === "portable" ? chaseSnapshot.tunedStationId : null;
    const chaseStation = chaseSnapshot.stations.find((chaseItem) => chaseItem.id === chaseCarried);
    if (chaseDevices.active === "portable") {
      chaseDevices.active = "none";
      chaseSnapshot.tunedStationId = null;
      chaseDevices.tunedStationId = null;
    }
    chaseDevices.owned.portable = Math.max(0, chaseDevices.owned.portable - 1);
    chaseDevices.placedNearby = [
      ...chaseDevices.placedNearby || [],
      {
        netId: 1300 + (chaseDevices.placedNearby?.length || 0),
        stationId: chaseStation?.id ?? null,
        frequency: chaseStation?.frequency ?? null,
        label: chaseStation?.name || "No station selected",
        ownerName: chaseSnapshot.viewer.name,
        quality: chaseStation ? 0.86 : null
      }
    ];
    ChasePreviewRefreshPlace();
  } else if (chaseAction === "pickupRadio" && chaseSnapshot.devices) {
    const chasePlaced = ChasePreviewPlaced(chaseData);
    chaseSnapshot.devices.placedNearby = (chaseSnapshot.devices.placedNearby || []).filter((chaseItem) => chaseItem.netId !== chasePlaced.netId);
    chaseSnapshot.devices.owned.portable += 1;
    ChasePreviewRefreshPlace();
  } else if (chaseAction === "tune") {
    const chaseStation = chaseSnapshot.stations.find((chaseItem) => chaseItem.id === chaseData.stationId || chaseItem.frequency === chaseData.frequency);
    if (!chaseStation?.live)
      throw new Error("No live transmission found on that frequency.");
    if (chaseData.placedNetId !== void 0) {
      const chasePlaced = ChasePreviewPlaced(chaseData);
      chasePlaced.stationId = chaseStation.id;
      chasePlaced.frequency = chaseStation.frequency;
      chasePlaced.label = chaseStation.name;
      chasePlaced.quality = 0.86;
    } else {
      chaseSnapshot.tunedStationId = chaseStation.id;
      if (chaseSnapshot.devices)
        chaseSnapshot.devices.tunedStationId = chaseStation.id;
    }
  } else if (chaseAction === "untune") {
    if (chaseData.placedNetId !== void 0) {
      const chasePlaced = ChasePreviewPlaced(chaseData);
      chasePlaced.stationId = null;
      chasePlaced.frequency = null;
      chasePlaced.label = "No station selected";
      chasePlaced.quality = null;
    } else
      chaseSnapshot.tunedStationId = null;
  } else if (chaseAction === "tip") {
    const chaseAmount = Number(chaseData.amount);
    if (chaseData.stationId === chaseSnapshot.mine?.id)
      throw new Error("You cannot tip your own station.");
    if (!Number.isInteger(chaseAmount) || chaseAmount < 1 || chaseAmount > chaseSnapshot.config.maxTip)
      throw new Error("Enter a valid whole-number tip.");
  } else if (chaseAction === "request") {
    if (!String(chaseData.message).trim())
      throw new Error("Write a message first.");
  } else if (chaseAction === "callStation") {
    const chaseStation = chaseSnapshot.stations.find((chaseItem) => chaseItem.id === chaseData.stationId);
    const chaseHeardId = chaseData.placedNetId !== void 0 ? ChasePreviewPlaced(chaseData).stationId : chaseSnapshot.tunedStationId;
    if (!chaseStation?.micLive || chaseHeardId !== chaseStation.id)
      throw new Error("Tune in to a station with an open microphone first.");
    chaseSnapshot.viewer.call = {
      state: "ringing",
      stationId: chaseStation.id,
      stationName: chaseStation.name
    };
    window.setTimeout(() => {
      chaseSnapshot.viewer.call = {
        state: "onair",
        stationId: chaseStation.id,
        stationName: chaseStation.name
      };
      window.postMessage({
        type: "chase_bootleg:callState",
        data: {
          state: "onair",
          stationId: chaseStation.id,
          stationName: chaseStation.name
        }
      }, "*");
    }, 2500);
  } else if (chaseAction === "endCall" && chaseSnapshot.viewer.call.state !== "idle") {
    chaseSnapshot.viewer.call = { state: "idle" };
  } else if (chaseAction === "answerCall") {
    const chaseMine = ChasePreviewStation();
    if (!chaseMine.pendingCall || chaseMine.pendingCall.callId !== chaseData.callId)
      throw new Error("That call is no longer waiting.");
    chaseMine.caller = chaseData.accept ? { name: chaseMine.pendingCall.callerName } : null;
    chaseMine.pendingCall = null;
  } else {
    const chaseMine = ChasePreviewStation();
    if (chaseAction === "updateStation") {
      if (!String(chaseData.name).trim())
        throw new Error("Your station needs a name.");
      Object.assign(chaseMine, chaseData);
    } else if (chaseAction === "spawnVan") {
      chaseMine.stage = "parked";
      chaseMine.vehicleNetId = 44;
    } else if (chaseAction === "storeVan") {
      chaseMine.stage = "stored";
      delete chaseMine.vehicleNetId;
    } else if (chaseAction === "deploy") {
      chaseMine.stage = "ready";
    } else if (chaseAction === "pack") {
      chaseMine.stage = "parked";
      chaseMine.live = false;
      chaseMine.micLive = false;
    } else if (chaseAction === "broadcast") {
      chaseMine.live = Boolean(chaseData.enabled);
      chaseMine.stage = chaseMine.live ? "live" : "ready";
      if (!chaseMine.live)
        chaseMine.micLive = false;
    } else if (chaseAction === "microphone") {
      chaseMine.micLive = Boolean(chaseData.enabled);
      chaseSnapshot.viewer.isHost = chaseMine.micLive;
      if (!chaseMine.micLive)
        chaseMine.cohostNames = [];
      if (chaseMine.micLive && !chaseMine.pendingCall)
        window.setTimeout(() => {
          if (!chaseMine.micLive || chaseMine.caller)
            return;
          chaseMine.pendingCall = {
            callId: 7,
            callerName: "Jules",
            expiresAt: Math.floor(Date.now() / 1e3) + 30
          };
          window.postMessage({
            type: "chase_bootleg:incomingCall",
            data: {
              callId: 7,
              callerName: "Jules",
              stationId: chaseMine.id,
              stationName: chaseMine.name,
              ringSeconds: 30,
              acceptKey: "Y",
              declineKey: "U"
            }
          }, "*");
        }, 4e3);
    } else if (chaseAction === "endCall") {
      chaseMine.caller = null;
    } else if (chaseAction === "setMode") {
      if (chaseData.mode !== "dj" && chaseData.mode !== "autonomous")
        throw new Error("Unknown station mode.");
      chaseMine.mode = chaseData.mode;
    } else if (chaseAction === "queueAdd") {
      const chaseQueue = chaseMine.queue || [];
      chaseQueue.push({
        id: Date.now(),
        provider: String(chaseData.url).includes("soundcloud") ? "soundcloud" : "youtube",
        url: String(chaseData.url),
        title: String(chaseData.title || chaseData.url),
        duration: Number(chaseData.duration) || 0
      });
      chaseMine.queue = chaseQueue;
    } else if (chaseAction === "queueRemove") {
      chaseMine.queue = (chaseMine.queue || []).filter((chaseTrack) => chaseTrack.id !== chaseData.trackId);
    } else if (chaseAction === "playTrack" || chaseAction === "skipTrack") {
      if (!chaseMine.live)
        throw new Error("Start the broadcast first.");
      const chaseQueue = chaseMine.queue || [];
      const chaseIndex = chaseAction === "playTrack" ? chaseQueue.findIndex((chaseTrack2) => chaseTrack2.id === chaseData.trackId) : chaseQueue.findIndex((chaseTrack2) => chaseTrack2.title === chaseMine.nowPlaying?.title) + 1;
      const chaseTrack = chaseQueue[chaseMine.mode === "autonomous" && chaseQueue.length ? chaseIndex % chaseQueue.length : chaseIndex];
      chaseMine.nowPlaying = chaseTrack ? {
        provider: chaseTrack.provider,
        title: chaseTrack.title,
        duration: chaseTrack.duration,
        startedAt: Math.floor(Date.now() / 1e3)
      } : null;
      chaseMine.autoplay = Boolean(chaseTrack);
    } else if (chaseAction === "stopCartridge") {
      chaseMine.nowPlaying = null;
      chaseMine.autoplay = false;
    } else if (chaseAction === "recharge") {
      chaseMine.battery = 100;
    } else if (chaseAction === "moderateRequest") {
      const chaseRequest = chaseSnapshot.requests.find((chaseItem) => chaseItem.id === chaseData.requestId);
      if (chaseRequest)
        chaseRequest.status = chaseData.status;
    } else if (chaseAction === "crewAdd") {
      const chaseSource = Number(chaseData.source);
      if (!Number.isInteger(chaseSource) || chaseSource < 1)
        throw new Error("Enter a valid player server ID.");
      if (chaseSnapshot.crew.some((chaseItem) => chaseItem.source === chaseSource))
        throw new Error("This player is already on your crew.");
      chaseSnapshot.crew.push({
        source: chaseSource,
        name: `Guest ${chaseSource}`,
        memberId: chaseSource + 100
      });
    } else if (chaseAction === "crewRemove") {
      chaseSnapshot.crew = chaseSnapshot.crew.filter((chaseItem) => chaseData.memberId ? chaseItem.memberId !== chaseData.memberId : chaseItem.source !== chaseData.source);
    } else if (chaseAction === "withdraw") {
      const chaseAmount = Number(chaseData.amount);
      if (!Number.isInteger(chaseAmount) || chaseAmount < 1 || chaseAmount > (chaseMine.balance || 0))
        throw new Error("The withdrawal exceeds the available station balance.");
      chaseMine.balance = (chaseMine.balance || 0) - chaseAmount;
    } else if (chaseAction !== "playCartridge") {
      throw new Error("This action is unavailable in the preview.");
    }
    chaseSnapshot.stations = chaseSnapshot.stations.map((chaseItem) => chaseItem.id === chaseMine.id ? { ...chaseMine } : chaseItem);
  }
  ChasePreviewSpeech();
  return structuredClone(chaseSnapshot);
}
export {
  ChasePreviewPost
};
