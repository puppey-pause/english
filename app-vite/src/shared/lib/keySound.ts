/**
 * Звук набора без файлов. Два набора: «клавиши» (щелчок + тук на букву) и
 * «тир» (выстрел на букву, рикошет на ошибку, перезарядка на конец фразы).
 * AudioContext создаётся лениво — первое касание клавиши уже жест пользователя.
 */

const KEY = "en-typing-sound";
const PACK = "en-typing-pack";

/** чем озвучен набор: печатная машинка или тир */
export type SoundPack = "keys" | "range";

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let longNoise: AudioBuffer | null = null;
let enabled = read();
let pack: SoundPack = readPack();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

function readPack(): SoundPack {
  try {
    return localStorage.getItem(PACK) === "range" ? "range" : "keys";
  } catch {
    return "keys";
  }
}

export const soundPack = (): SoundPack => pack;

export const setSoundPack = (p: SoundPack): void => {
  pack = p;
  try {
    localStorage.setItem(PACK, p);
  } catch {
    /* приватный режим — просто не запоминаем */
  }
};

export const soundOn = (): boolean => enabled;

export const setSoundOn = (v: boolean): void => {
  enabled = v;
  try {
    localStorage.setItem(KEY, v ? "on" : "off");
  } catch {
    /* приватный режим — просто не запоминаем */
  }
};

function ac(): AudioContext | null {
  type WithLegacy = typeof window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext ?? (window as WithLegacy).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext): AudioBuffer {
  if (noise) return noise;
  const len = Math.floor(c.sampleRate * 0.05);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  noise = buf;
  return buf;
}

/** полсекунды шума — на хвост выстрела короткого буфера не хватает */
function longNoiseBuffer(c: AudioContext): AudioBuffer {
  if (longNoise) return longNoise;
  const len = Math.floor(c.sampleRate * 0.6);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
  longNoise = buf;
  return buf;
}

interface ToneOpts {
  freq: number;
  to?: number;
  dur: number;
  gain: number;
  type?: OscillatorType;
  delay?: number;
}

function tone(c: AudioContext, o: ToneOpts): void {
  const t = c.currentTime + (o.delay ?? 0);
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = o.type ?? "sine";
  osc.frequency.setValueAtTime(o.freq, t);
  if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t + o.dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(o.gain, t + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t + o.dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + o.dur + 0.02);
}

function burst(c: AudioContext, freq: number, dur: number, gain: number): void {
  const t = c.currentTime;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.value = freq;
  bp.Q.value = 1.1;
  const g = c.createGain();
  g.gain.setValueAtTime(gain, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + dur + 0.02);
}

/**
 * Выстрел в три слоя: щелчок бойка, резкий треск дульного хлопка и низкий
 * «бум» с хвостом. Без слоёв получается сухой клик, а не оружие.
 */
function shot(c: AudioContext, big: boolean): void {
  const t = c.currentTime;
  const vol = big ? 1 : 0.72;

  // треск: высокий шум с очень резкой атакой
  const crack = c.createBufferSource();
  crack.buffer = longNoiseBuffer(c);
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 1400;
  const crackGain = c.createGain();
  crackGain.gain.setValueAtTime(0.85 * vol, t);
  crackGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.055);
  crack.connect(hp).connect(crackGain).connect(c.destination);
  crack.start(t);
  crack.stop(t + 0.1);

  // тело: широкий шум, фильтр валится вниз — это и даёт «бум» с хвостом
  const body = c.createBufferSource();
  body.buffer = longNoiseBuffer(c);
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.setValueAtTime(1800, t);
  lp.frequency.exponentialRampToValueAtTime(170, t + (big ? 0.34 : 0.24));
  lp.Q.value = 1.4;
  const bodyGain = c.createGain();
  bodyGain.gain.setValueAtTime(0.9 * vol, t + 0.004);
  bodyGain.gain.exponentialRampToValueAtTime(0.0001, t + (big ? 0.38 : 0.26));
  body.connect(lp).connect(bodyGain).connect(c.destination);
  body.start(t);
  body.stop(t + 0.45);

  // отдача: короткий низкий удар
  tone(c, { freq: big ? 74 : 96, to: big ? 34 : 46, dur: big ? 0.16 : 0.11, gain: 0.5 * vol, type: "sine" });
}

/** затвор: два металлических щелчка со скользящим шумом между ними */
function reload(c: AudioContext): void {
  burst(c, 2600, 0.03, 0.12);
  const t = c.currentTime + 0.1;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  const bp = c.createBiquadFilter();
  bp.type = "bandpass";
  bp.frequency.setValueAtTime(900, t);
  bp.frequency.exponentialRampToValueAtTime(2200, t + 0.12);
  bp.Q.value = 3;
  const g = c.createGain();
  g.gain.setValueAtTime(0.09, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 0.13);
  src.connect(bp).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + 0.16);
  tone(c, { freq: 1500, dur: 0.035, gain: 0.1, type: "square", delay: 0.25 });
  tone(c, { freq: 780, dur: 0.05, gain: 0.09, type: "square", delay: 0.3 });
}

/** обычная буква */
export const clickKey = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  if (pack === "range") {
    shot(c, false);
    return;
  }
  burst(c, 1850 + Math.random() * 350, 0.028, 0.075);
  tone(c, { freq: 196, dur: 0.03, gain: 0.05, type: "triangle" });
};

/** пробел — глуше и ниже */
export const clickSpace = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  if (pack === "range") {
    shot(c, true);
    return;
  }
  burst(c, 1050, 0.04, 0.07);
  tone(c, { freq: 138, dur: 0.045, gain: 0.055, type: "triangle" });
};

/** backspace */
export const clickBack = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  if (pack === "range") {
    // осечка: сухой щелчок бойка без выстрела
    tone(c, { freq: 1200, dur: 0.02, gain: 0.07, type: "square" });
    return;
  }
  burst(c, 1400, 0.03, 0.05);
};

/** не та буква */
export const soundWrong = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  if (pack === "range") {
    // мимо: рикошет вниз
    tone(c, { freq: 1700, to: 240, dur: 0.22, gain: 0.08, type: "sawtooth" });
    return;
  }
  tone(c, { freq: 150, to: 92, dur: 0.16, gain: 0.075, type: "sawtooth" });
};

/** фраза набрана верно */
export const soundDone = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  if (pack === "range") {
    // строка добита — перезарядка
    reload(c);
    return;
  }
  tone(c, { freq: 620, dur: 0.1, gain: 0.07 });
  tone(c, { freq: 930, dur: 0.14, gain: 0.06, delay: 0.085 });
};

/** конец подхода */
export const soundRunEnd = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  if (pack === "range") {
    // конец подхода: короткая очередь и затвор
    [0, 0.09, 0.18].forEach((d) => window.setTimeout(() => shot(c, false), d * 1000));
    window.setTimeout(() => reload(c), 420);
    return;
  }
  [523, 659, 784, 1046].forEach((f, i) =>
    tone(c, { freq: f, dur: 0.16, gain: 0.055, delay: i * 0.09 })
  );
};
