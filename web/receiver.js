(() => {
  const elements = Object.fromEntries(
    [...document.querySelectorAll("[id]")].map((element) => [
      element.id.replace("chase-", ""),
      element,
    ]),
  );
  const state = {
    frequency: null,
    label: "Dash Receiver",
    enabled: false,
    quality: null,
    volume: 65,
    stations: [],
    interactive: false,
    canMove: false,
    session: null,
    resource: null,
    minFrequency: 880,
    maxFrequency: 1080,
  };
  let view = "home";
  let page = 0;
  let digits = "";
  let replaceDigits = true;
  let request = null;
  let error = "";
  let directoryKey = "";
  const clamp = (value, minimum, maximum) =>
    Math.max(minimum, Math.min(maximum, value));
  const formatFrequency = (value) =>
    Number.isFinite(value) ? (value / 10).toFixed(1) : "--.-";
  const canInteract = () =>
    state.interactive &&
    typeof state.session === "string" &&
    state.session.length > 0 &&
    typeof state.resource === "string";
  const liveStations = () => state.stations.filter((station) => station.live);
  function feedback(message, isError = false) {
    elements.feedback.textContent = message;
    elements.feedback.dataset.error = String(isError);
    elements.feedback.hidden = !message;
    document.body.dataset.feedback = String(Boolean(message));
  }
  function showView(next) {
    view = next;
    for (const name of ["home", "directory", "keypad", "settings"])
      elements[name].hidden = name !== view;
    render();
  }
  function renderDirectory() {
    const stations = liveStations();
    const pages = Math.max(1, Math.ceil(stations.length / 4));
    page = clamp(page, 0, pages - 1);
    const key = JSON.stringify([
      page,
      state.frequency,
      state.enabled,
      stations,
    ]);
    if (directoryKey !== key) {
      directoryKey = key;
      elements["station-list"].replaceChildren();
      if (!stations.length) {
        const empty = document.createElement("p");
        empty.className = "station-empty";
        empty.textContent = "No stations are broadcasting right now.";
        elements["station-list"].append(empty);
      }
      for (const station of stations.slice(page * 4, page * 4 + 4)) {
        const button = document.createElement("button");
        button.className = "station-choice";
        button.setAttribute(
          "aria-pressed",
          String(state.enabled && station.frequency === state.frequency),
        );
        button.setAttribute(
          "aria-label",
          `${formatFrequency(station.frequency)} FM, ${station.name}`,
        );
        const frequency = document.createElement("strong");
        frequency.textContent = formatFrequency(station.frequency);
        const label = document.createElement("span");
        label.textContent = station.name;
        button.append(frequency, label);
        button.addEventListener("click", () =>
          sendAction("tune", { stationId: station.id }),
        );
        elements["station-list"].append(button);
      }
    }
    for (const button of elements["station-list"].querySelectorAll("button"))
      button.disabled = !canInteract() || Boolean(request);
    elements["station-count"].textContent =
      `${stations.length} live ${stations.length === 1 ? "station" : "stations"}`;
    elements["page-number"].textContent = `${page + 1} / ${pages}`;
    elements["page-previous"].disabled =
      !canInteract() || Boolean(request) || page === 0;
    elements["page-next"].disabled =
      !canInteract() || Boolean(request) || page >= pages - 1;
  }
  function render() {
    const locked = !canInteract() || Boolean(request);
    document.body.dataset.view = view;
    document.body.dataset.enabled = String(state.enabled);
    document.body.dataset.interactive = String(canInteract());
    elements.receiver.setAttribute("aria-busy", String(Boolean(request)));
    elements.status.textContent = request
      ? "UPDATING"
      : state.enabled
        ? "CONNECTED"
        : "STANDBY";
    elements.frequency.textContent = formatFrequency(state.frequency);
    elements.label.textContent = state.label;
    elements["station-caption"].textContent = state.enabled
      ? "NOW TUNED"
      : state.frequency === null
        ? "SELECT A STATION"
        : "LAST STATION";
    elements.quality.textContent = !state.enabled
      ? "RECEIVER ON STANDBY"
      : state.quality === null
        ? "SIGNAL --"
        : `SIGNAL ${Math.round(state.quality * 100)}%`;
    elements.volume.textContent = `${Math.round(state.volume)}%`;
    elements["volume-summary"].textContent = Math.round(state.volume);
    elements["volume-meter"].value = state.volume;
    elements.power.textContent = state.enabled ? "Turn off" : "Turn on";
    for (const button of document.querySelectorAll("button"))
      button.disabled = locked;
    elements["volume-down"].disabled = locked || state.volume <= 0;
    elements["volume-up"].disabled = locked || state.volume >= 100;
    elements.move.disabled = locked || !state.canMove;
    elements.previous.disabled = elements.next.disabled =
      locked || liveStations().length === 0;
    elements["tune-value"].textContent = digits
      ? formatFrequency(Number(digits))
      : "--.-";
    elements["band-range"].textContent =
      `${formatFrequency(state.minFrequency)} – ${formatFrequency(state.maxFrequency)} FM`;
    const tuneFrequency = Number(digits);
    elements["tune-submit"].disabled =
      locked ||
      !digits ||
      tuneFrequency < state.minFrequency ||
      tuneFrequency > state.maxFrequency;
    if (view === "directory") renderDirectory();
    feedback(error || (request ? "Updating receiver…" : ""), Boolean(error));
  }
  function receiveDisplay(event) {
    const message = event.data;
    if (!message || message.type !== "chase_bootleg:receiverDisplay") return;
    const next = message.data || message;
    if (!next || typeof next !== "object") return;
    const nextSession = typeof next.session === "string" ? next.session : null;
    const nextResource =
      typeof next.resource === "string" &&
      /^[a-zA-Z0-9_-]{1,64}$/.test(next.resource)
        ? next.resource
        : null;
    const nextInteractive = next.interactive === true;
    if (
      state.session !== nextSession ||
      state.resource !== nextResource ||
      !nextInteractive
    ) {
      request?.controller.abort();
      request = null;
      error = "";
      view = "home";
      for (const name of ["home", "directory", "keypad", "settings"])
        elements[name].hidden = name !== view;
      if (document.activeElement instanceof HTMLElement)
        document.activeElement.blur();
    }
    state.session = nextSession;
    state.resource = nextResource;
    state.interactive = nextInteractive;
    state.canMove = next.canMove === true;
    state.enabled = next.enabled === true;
    state.frequency = Number.isFinite(next.frequency) ? next.frequency : null;
    state.label = typeof next.label === "string" ? next.label : "Dash Receiver";
    state.quality = Number.isFinite(next.quality)
      ? clamp(next.quality, 0, 1)
      : null;
    state.volume = Number.isFinite(next.volume)
      ? clamp(next.volume, 0, 100)
      : 65;
    state.minFrequency = Number.isInteger(next.minFrequency)
      ? next.minFrequency
      : 880;
    state.maxFrequency =
      Number.isInteger(next.maxFrequency) &&
      next.maxFrequency >= state.minFrequency
        ? next.maxFrequency
        : 1080;
    if (
      !Number.isInteger(state.frequency) ||
      state.frequency < state.minFrequency ||
      state.frequency > state.maxFrequency
    )
      state.frequency = null;
    if (Array.isArray(next.stations))
      state.stations = next.stations
        .filter(
          (station) =>
            station &&
            Number.isInteger(station.id) &&
            Number.isInteger(station.frequency) &&
            typeof station.name === "string",
        )
        .map((station) => ({
          id: station.id,
          name: station.name,
          frequency: station.frequency,
          live: station.live === true,
        }))
        .sort((a, b) => a.frequency - b.frequency || a.id - b.id);
    render();
  }
  async function sendAction(action, data = {}) {
    if (!canInteract() || request) return;
    const current = {
      controller: new AbortController(),
      session: state.session,
      resource: state.resource,
    };
    request = current;
    error = "";
    render();
    const timeout = setTimeout(() => current.controller.abort(), 8000);
    try {
      const response = await fetch(
        `https://${current.resource}/chase_bootleg:dashboard`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json; charset=UTF-8" },
          body: JSON.stringify({ session: current.session, action, data }),
          signal: current.controller.signal,
        },
      );
      if (!response.ok)
        throw new Error("Receiver unavailable. Close and reopen the radio.");
      const result = await response.json();
      if (request !== current) return;
      if (result?.ok !== true)
        throw new Error(
          typeof result?.error === "string"
            ? result.error
            : result?.error?.message ||
                result?.message ||
                "The receiver could not complete that action.",
        );
      if (
        result.data &&
        typeof result.data === "object" &&
        typeof result.data.enabled === "boolean"
      )
        receiveDisplay({
          data: {
            type: "chase_bootleg:receiverDisplay",
            data: {
              ...state,
              ...result.data,
              session: current.session,
              resource: current.resource,
            },
          },
        });
      if (request !== current) return;
      if (action === "tune") showView("home");
      if (action === "close" || action === "move") {
        state.interactive = false;
        state.session = null;
        if (document.activeElement instanceof HTMLElement)
          document.activeElement.blur();
        showView("home");
      }
    } catch (failure) {
      if (request === current)
        error =
          failure.name === "AbortError"
            ? "Receiver timed out. Close and reopen the radio."
            : failure.message || "Receiver unavailable.";
    } finally {
      clearTimeout(timeout);
      if (request === current) {
        request = null;
        render();
      }
    }
  }
  function stepStation(direction) {
    const stations = liveStations();
    if (!stations.length) return;
    const current = stations.findIndex(
      (station) => station.frequency === state.frequency,
    );
    const index =
      current < 0
        ? direction > 0
          ? 0
          : stations.length - 1
        : (current + direction + stations.length) % stations.length;
    sendAction("tune", { stationId: stations[index].id });
  }
  function openKeypad() {
    digits = state.frequency === null ? "" : String(state.frequency);
    replaceDigits = true;
    error = "";
    showView("keypad");
  }
  elements["volume-down"].addEventListener("click", () =>
    sendAction("volume", { volume: clamp(state.volume - 5, 0, 100) }),
  );
  elements["volume-up"].addEventListener("click", () =>
    sendAction("volume", { volume: clamp(state.volume + 5, 0, 100) }),
  );
  elements.previous.addEventListener("click", () => stepStation(-1));
  elements.next.addEventListener("click", () => stepStation(1));
  elements.power.addEventListener("click", () =>
    state.enabled
      ? sendAction("untune")
      : state.frequency !== null
        ? sendAction("tune", { frequency: state.frequency })
        : showView("directory"),
  );
  elements.stations.addEventListener("click", () => {
    page = 0;
    showView("directory");
  });
  elements["tune-open"].addEventListener("click", openKeypad);
  elements["settings-open"].addEventListener("click", () =>
    showView("settings"),
  );
  elements["settings-back"].addEventListener("click", () => showView("home"));
  elements.move.addEventListener("click", () => sendAction("move"));
  elements.close.addEventListener("click", () => sendAction("close"));
  elements["directory-back"].addEventListener("click", () => showView("home"));
  elements["keypad-back"].addEventListener("click", () => showView("home"));
  elements["page-previous"].addEventListener("click", () => {
    page -= 1;
    render();
  });
  elements["page-next"].addEventListener("click", () => {
    page += 1;
    render();
  });
  elements["tune-clear"].addEventListener("click", () => {
    digits = "";
    replaceDigits = false;
    render();
  });
  elements["tune-erase"].addEventListener("click", () => {
    digits = digits.slice(0, -1);
    replaceDigits = false;
    render();
  });
  elements["tune-submit"].addEventListener("click", () =>
    sendAction("tune", { frequency: Number(digits) }),
  );
  for (const button of document.querySelectorAll("[data-digit]"))
    button.addEventListener("click", () => {
      if (replaceDigits) digits = "";
      replaceDigits = false;
      if (digits.length < 4) digits += button.dataset.digit;
      render();
    });
  window.addEventListener("message", receiveDisplay);
  render();
})();
