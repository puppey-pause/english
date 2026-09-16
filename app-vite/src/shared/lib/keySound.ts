/**
 * Звук набора без файлов: короткий шумовой щелчок + телесный тук на каждую
 * букву, низкий рык на ошибку, два тона на завершённую фразу.
 * AudioContext создаётся лениво — первое касание клавиши уже жест пользователя.
 */

const KEY = "en-typing-sound";

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;
let enabled = read();

function read(): boolean {
  try {
    return localStorage.getItem(KEY) !== "off";
  } catch {
    return true;
  }
}

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

/** обычная буква */
export const clickKey = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  burst(c, 1850 + Math.random() * 350, 0.028, 0.075);
  tone(c, { freq: 196, dur: 0.03, gain: 0.05, type: "triangle" });
};

/** пробел — глуше и ниже */
export const clickSpace = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  burst(c, 1050, 0.04, 0.07);
  tone(c, { freq: 138, dur: 0.045, gain: 0.055, type: "triangle" });
};

/** backspace */
export const clickBack = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  burst(c, 1400, 0.03, 0.05);
};

/** не та буква */
export const soundWrong = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  tone(c, { freq: 150, to: 92, dur: 0.16, gain: 0.075, type: "sawtooth" });
};

/** фраза набрана верно */
export const soundDone = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  tone(c, { freq: 620, dur: 0.1, gain: 0.07 });
  tone(c, { freq: 930, dur: 0.14, gain: 0.06, delay: 0.085 });
};

/** конец подхода */
export const soundRunEnd = (): void => {
  if (!enabled) return;
  const c = ac();
  if (!c) return;
  [523, 659, 784, 1046].forEach((f, i) =>
    tone(c, { freq: f, dur: 0.16, gain: 0.055, delay: i * 0.09 })
  );
};
