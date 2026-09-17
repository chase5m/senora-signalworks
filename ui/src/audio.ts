export type ChaseAudioProfile = {
  low: number;
  high: number;
  distortion: number;
};
export function ChasePlaybackVolume(
  volume: number,
  quality: number,
  gain: number,
  monitor: boolean,
) {
  return (volume / 100) * (monitor ? 1 : quality * gain);
}
export type ChaseAudioGraph = {
  source: MediaElementAudioSourceNode;
  highpass: BiquadFilterNode;
  lowpass: BiquadFilterNode;
  shaper: WaveShaperNode;
  context?: AudioContext;
  distortion?: number;
};
export function ChaseNormalizeProfile(value: unknown): ChaseAudioProfile {
  const chaseProfile =
    value && typeof value === "object"
      ? (value as Partial<ChaseAudioProfile>)
      : {};
  const chaseLow = Number.isFinite(chaseProfile.low)
    ? Math.max(20, Math.min(2000, Number(chaseProfile.low)))
    : 20;
  return {
    low: chaseLow,
    high: Number.isFinite(chaseProfile.high)
      ? Math.max(chaseLow + 500, Math.min(20000, Number(chaseProfile.high)))
      : 20000,
    distortion: Number.isFinite(chaseProfile.distortion)
      ? Math.max(0, Math.min(0.5, Number(chaseProfile.distortion)))
      : 0,
  };
}
export function ChaseApplyProfile(
  graph: ChaseAudioGraph,
  profile: ChaseAudioProfile,
) {
  const chaseFrequency = (parameter: AudioParam, value: number) => {
    if (graph.context && typeof parameter.setTargetAtTime === "function")
      parameter.setTargetAtTime(value, graph.context.currentTime, 0.08);
    else parameter.value = value;
  };
  chaseFrequency(graph.highpass.frequency, profile.low);
  chaseFrequency(graph.lowpass.frequency, profile.high);
  if (graph.distortion === profile.distortion) return;
  graph.distortion = profile.distortion;
  if (profile.distortion === 0) {
    graph.shaper.curve = null;
    return;
  }
  const chaseCurve = new Float32Array(1024);
  const chaseDrive = 1 + profile.distortion * 20;
  for (let chaseIndex = 0; chaseIndex < chaseCurve.length; chaseIndex++) {
    const chaseX = (chaseIndex * 2) / (chaseCurve.length - 1) - 1;
    chaseCurve[chaseIndex] =
      Math.tanh(chaseX * chaseDrive) / Math.tanh(chaseDrive);
  }
  graph.shaper.curve = chaseCurve;
}
export function ChaseConnectAudio(
  context: AudioContext,
  audio: HTMLAudioElement,
  profile: ChaseAudioProfile,
): ChaseAudioGraph {
  const chaseHighpass = context.createBiquadFilter();
  chaseHighpass.type = "highpass";
  const chaseLowpass = context.createBiquadFilter();
  chaseLowpass.type = "lowpass";
  const chaseShaper = context.createWaveShaper();
  chaseShaper.oversample = "2x";
  const chaseSource = context.createMediaElementSource(audio);
  const chaseGraph = {
    context,
    source: chaseSource,
    highpass: chaseHighpass,
    lowpass: chaseLowpass,
    shaper: chaseShaper,
  };
  ChaseApplyProfile(chaseGraph, profile);
  chaseSource.connect(chaseHighpass);
  chaseHighpass.connect(chaseLowpass);
  chaseLowpass.connect(chaseShaper);
  chaseShaper.connect(context.destination);
  return chaseGraph;
}
export function ChaseCreateVolumeFader(write: (value: number) => void) {
  let chaseCurrent = 0;
  let chaseTarget = 0;
  let chaseTimer: ReturnType<typeof setTimeout> | undefined;
  let chaseTime = performance.now();
  function ChaseStep() {
    chaseTimer = undefined;
    const chaseNow = performance.now();
    const chaseElapsed = Math.max(1, Math.min(250, chaseNow - chaseTime));
    chaseTime = chaseNow;
    chaseCurrent +=
      (chaseTarget - chaseCurrent) * (1 - Math.exp(-chaseElapsed / 90));
    if (Math.abs(chaseTarget - chaseCurrent) < 0.001)
      chaseCurrent = chaseTarget;
    write(chaseCurrent);
    if (chaseCurrent !== chaseTarget) chaseTimer = setTimeout(ChaseStep, 30);
  }
  return {
    set(value: number) {
      chaseTarget = Number.isFinite(value)
        ? Math.max(0, Math.min(1, value))
        : 0;
      if (chaseTimer === undefined) {
        chaseTime = performance.now();
        chaseTimer = setTimeout(ChaseStep, 30);
      }
    },
    cancel() {
      clearTimeout(chaseTimer);
      chaseTimer = undefined;
      chaseCurrent = 0;
      chaseTarget = 0;
    },
  };
}
export function ChaseDisconnectAudio(graph: ChaseAudioGraph | null) {
  if (!graph) return;
  graph.source.disconnect();
  graph.highpass.disconnect();
  graph.lowpass.disconnect();
  graph.shaper.disconnect();
}
