/**
 * Tiny Web Audio mixer: SFX stings + looping garden themes.
 * No music files — each level is a short pentatonic pattern.
 */

export type MusicId = "title" | "meadow" | "trail" | "crossing" | "twin" | "maze" | "hollow" | "queen";

type Theme = {
  bpm: number;
  /** Eighth-note steps in the loop. */
  steps: number;
  bass: number[];
  lead: number[];
  harmony?: number[];
  spark?: number[];
  bassType: OscillatorType;
  leadType: OscillatorType;
};

const MUTE_KEY = "flower-quest-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let sfxBus: GainNode | null = null;
let musicBus: GainNode | null = null;
let muted = false;
let musicPaused = false;
let currentTune: MusicId | null = null;
let step = 0;
let nextTime = 0;
let timer: ReturnType<typeof setTimeout> | null = null;
const muteListeners = new Set<(value: boolean) => void>();

const THEMES: Record<MusicId, Theme> = {
  title: {
    bpm: 78,
    steps: 16,
    bass: [43, 0, 0, 0, 50, 0, 0, 0, 47, 0, 0, 0, 50, 0, 0, 0],
    lead: [67, 0, 71, 0, 74, 0, 0, 71, 72, 0, 71, 0, 69, 0, 67, 0],
    bassType: "sine",
    leadType: "sine",
  },
  meadow: {
    bpm: 90,
    steps: 16,
    bass: [43, 0, 0, 47, 50, 0, 0, 43, 45, 0, 0, 47, 50, 0, 47, 0],
    lead: [67, 71, 74, 71, 76, 0, 74, 71, 72, 74, 71, 67, 69, 0, 67, 0],
    spark: [0, 0, 79, 0, 0, 0, 83, 0, 0, 79, 0, 0, 0, 76, 0, 0],
    bassType: "sine",
    leadType: "triangle",
  },
  trail: {
    bpm: 104,
    steps: 16,
    bass: [38, 0, 45, 0, 38, 0, 50, 0, 37, 0, 45, 0, 38, 0, 45, 38],
    lead: [62, 66, 69, 66, 74, 69, 66, 62, 61, 62, 66, 69, 74, 0, 69, 66],
    bassType: "triangle",
    leadType: "triangle",
  },
  crossing: {
    bpm: 76,
    steps: 16,
    bass: [48, 0, 0, 0, 43, 0, 0, 48, 45, 0, 0, 0, 43, 0, 41, 0],
    lead: [64, 0, 0, 67, 0, 0, 71, 0, 0, 67, 0, 64, 0, 0, 72, 0],
    spark: [0, 0, 84, 0, 0, 83, 0, 0, 79, 0, 0, 76, 0, 84, 0, 0],
    bassType: "sine",
    leadType: "sine",
  },
  twin: {
    bpm: 96,
    steps: 16,
    bass: [45, 0, 52, 0, 45, 0, 48, 0, 41, 0, 48, 0, 45, 0, 52, 0],
    lead: [64, 67, 71, 67, 64, 0, 72, 71, 69, 72, 76, 72, 69, 0, 71, 67],
    harmony: [67, 71, 74, 71, 67, 0, 76, 74, 72, 76, 79, 76, 72, 0, 74, 71],
    bassType: "sine",
    leadType: "triangle",
  },
  maze: {
    bpm: 72,
    steps: 16,
    bass: [40, 0, 0, 47, 40, 0, 43, 0, 36, 0, 0, 43, 40, 0, 47, 0],
    lead: [64, 0, 67, 0, 63, 0, 64, 0, 59, 0, 62, 0, 64, 0, 0, 59],
    spark: [0, 0, 0, 76, 0, 0, 75, 0, 0, 0, 71, 0, 0, 0, 72, 0],
    bassType: "sine",
    leadType: "triangle",
  },
  hollow: {
    bpm: 108,
    steps: 16,
    bass: [48, 48, 0, 52, 55, 0, 48, 52, 45, 45, 0, 48, 52, 0, 45, 48],
    lead: [72, 76, 79, 76, 81, 79, 76, 72, 69, 72, 76, 79, 81, 84, 79, 76],
    spark: [0, 84, 0, 88, 0, 84, 0, 0, 0, 81, 0, 84, 0, 88, 0, 84],
    bassType: "triangle",
    leadType: "triangle",
  },
  queen: {
    bpm: 116,
    steps: 16,
    bass: [36, 0, 43, 0, 48, 0, 43, 36, 41, 0, 48, 0, 53, 0, 48, 41],
    lead: [60, 67, 72, 67, 75, 72, 67, 60, 65, 72, 77, 72, 80, 77, 72, 65],
    harmony: [67, 72, 75, 72, 79, 75, 72, 67, 72, 77, 80, 77, 84, 80, 77, 72],
    spark: [84, 0, 87, 0, 91, 0, 87, 0, 89, 0, 92, 0, 96, 0, 92, 0],
    bassType: "sawtooth",
    leadType: "square",
  },
};

function midi(n: number) {
  return 440 * 2 ** ((n - 69) / 12);
}

function readMute() {
  try {
    return localStorage.getItem(MUTE_KEY) === "1";
  } catch {
    return false;
  }
}

function writeMute(value: boolean) {
  try {
    localStorage.setItem(MUTE_KEY, value ? "1" : "0");
  } catch {
    /* ignore */
  }
}

export function isMuted() {
  return muted;
}

export function subscribeMute(fn: (value: boolean) => void) {
  muteListeners.add(fn);
  fn(muted);
  return () => {
    muteListeners.delete(fn);
  };
}

function notifyMute() {
  muteListeners.forEach((fn) => fn(muted));
}

function applyGains(now = ctx?.currentTime ?? 0) {
  if (!master || !musicBus || !ctx) return;
  const masterTarget = muted ? 0.0001 : 1;
  const musicTarget = muted ? 0.0001 : musicPaused ? 0.04 : 0.22;
  master.gain.setTargetAtTime(masterTarget, now, 0.04);
  musicBus.gain.setTargetAtTime(musicTarget, now, 0.06);
}

export function unlockAudio() {
  if (typeof window === "undefined") return;
  const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AC) return;
  if (!ctx) {
    ctx = new AC({ latencyHint: "interactive" });
    master = ctx.createGain();
    sfxBus = ctx.createGain();
    musicBus = ctx.createGain();
    sfxBus.gain.value = 0.9;
    musicBus.gain.value = 0.22;
    master.gain.value = muted ? 0.0001 : 1;
    sfxBus.connect(master);
    musicBus.connect(master);
    master.connect(ctx.destination);
    muted = readMute();
    applyGains(ctx.currentTime);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) void ctx?.resume();
    });
  }
  if (ctx.state === "suspended") void ctx.resume();
}

function getCtx() {
  unlockAudio();
  return ctx;
}

function tone(freq: number, duration: number, type: OscillatorType, gain = 0.07, delay = 0) {
  const audio = getCtx();
  if (!audio || !sfxBus || muted) return;
  const start = audio.currentTime + delay;
  const osc = audio.createOscillator();
  const amp = audio.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  amp.gain.setValueAtTime(gain, start);
  amp.gain.exponentialRampToValueAtTime(0.001, start + duration);
  osc.connect(amp);
  amp.connect(sfxBus);
  osc.start(start);
  osc.stop(start + duration + 0.02);
  osc.onended = () => {
    osc.disconnect();
    amp.disconnect();
  };
}

function note(bus: GainNode, midiNote: number, when: number, dur: number, type: OscillatorType, vol: number) {
  if (!ctx || midiNote <= 0) return;
  const osc = ctx.createOscillator();
  const amp = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(midi(midiNote), when);
  amp.gain.setValueAtTime(0.0001, when);
  amp.gain.exponentialRampToValueAtTime(vol, when + 0.02);
  amp.gain.exponentialRampToValueAtTime(0.0001, when + dur);
  osc.connect(amp);
  amp.connect(bus);
  osc.start(when);
  osc.stop(when + dur + 0.03);
  osc.onended = () => {
    osc.disconnect();
    amp.disconnect();
  };
}

function scheduleStep(theme: Theme, index: number, when: number) {
  if (!musicBus || muted) return;
  const eighth = 60 / theme.bpm / 2;
  const i = index % theme.steps;
  if (theme.bass[i]) note(musicBus, theme.bass[i], when, eighth * 1.6, theme.bassType, 0.045);
  if (theme.lead[i]) note(musicBus, theme.lead[i], when, eighth * 1.15, theme.leadType, 0.038);
  if (theme.harmony?.[i]) note(musicBus, theme.harmony[i], when, eighth * 1.1, "sine", 0.022);
  if (theme.spark?.[i]) note(musicBus, theme.spark[i], when, eighth * 0.7, "sine", 0.018);
}

function pump() {
  if (!ctx || !currentTune) return;
  const theme = THEMES[currentTune];
  const eighth = 60 / theme.bpm / 2;
  while (nextTime < ctx.currentTime + 0.16) {
    scheduleStep(theme, step, nextTime);
    nextTime += eighth;
    step = (step + 1) % theme.steps;
  }
  timer = setTimeout(pump, 40);
}

function stopPump() {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
}

export function startMusic(id: MusicId) {
  const audio = getCtx();
  if (!audio) return;
  if (currentTune === id && timer) return;
  currentTune = id;
  step = 0;
  nextTime = audio.currentTime + 0.06;
  musicPaused = false;
  applyGains(audio.currentTime);
  stopPump();
  pump();
}

export function stopMusic() {
  currentTune = null;
  stopPump();
}

export function setMusicPaused(paused: boolean) {
  musicPaused = paused;
  applyGains();
}

export function toggleMute() {
  muted = !muted;
  writeMute(muted);
  applyGains();
  notifyMute();
}

export function sfxCollect() {
  tone(523, 0.09, "triangle", 0.06, 0);
  tone(659, 0.1, "triangle", 0.06, 0.07);
  tone(784, 0.14, "triangle", 0.05, 0.14);
}

export function sfxHurt() {
  tone(180, 0.16, "square", 0.05, 0);
  tone(120, 0.2, "sawtooth", 0.04, 0.05);
}

export function sfxUnlock() {
  tone(392, 0.1, "triangle", 0.05, 0);
  tone(523, 0.12, "triangle", 0.06, 0.08);
  tone(659, 0.18, "triangle", 0.05, 0.18);
}

export function sfxWin() {
  tone(523, 0.12, "triangle", 0.06, 0);
  tone(659, 0.12, "triangle", 0.06, 0.1);
  tone(784, 0.12, "triangle", 0.06, 0.2);
  tone(1046, 0.28, "triangle", 0.05, 0.32);
}

export function sfxLose() {
  tone(330, 0.18, "sine", 0.05, 0);
  tone(247, 0.22, "sine", 0.05, 0.14);
  tone(196, 0.3, "sine", 0.05, 0.3);
}

export function sfxPowerUp(kind: "swift" | "frost" | "heart") {
  if (kind === "swift") {
    tone(659, 0.08, "triangle", 0.06, 0);
    tone(880, 0.09, "triangle", 0.07, 0.06);
    tone(1046, 0.16, "sine", 0.08, 0.12);
  } else if (kind === "frost") {
    tone(987, 0.12, "sine", 0.06, 0);
    tone(1318, 0.2, "sine", 0.07, 0.08);
    tone(1760, 0.25, "triangle", 0.05, 0.16);
  } else if (kind === "heart") {
    tone(523, 0.1, "sine", 0.06, 0);
    tone(659, 0.1, "sine", 0.06, 0.08);
    tone(784, 0.12, "sine", 0.07, 0.16);
    tone(1046, 0.22, "sine", 0.08, 0.24);
  }
}

export function sfxAlert() {
  tone(880, 0.08, "square", 0.04, 0);
  tone(1174, 0.1, "square", 0.05, 0.07);
}

export function sfxFreeze() {
  tone(320, 0.12, "sawtooth", 0.04, 0);
  tone(160, 0.18, "square", 0.04, 0.08);
}

