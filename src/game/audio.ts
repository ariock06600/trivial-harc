// Gentle procedural Web Audio API chimes for board interactions (no external audio files)

let audioCtx: AudioContext | null = null;
let muted = false;

function getCtx(): AudioContext | null {
  if (muted || typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextCtor) return null;
    try {
      audioCtx = new AudioContextCtor();
    } catch {
      return null;
    }
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

function playTone(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  gainPeak = 0.08,
  delay = 0,
) {
  const ctx = getCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  } catch {
    // Ignore audio context restrictions in headless environments
  }
}

export function setMuted(value: boolean) {
  muted = value;
}

export function isMuted(): boolean {
  return muted;
}

export function playDiceRollSound() {
  playTone(320, 0.06, 'triangle', 0.06, 0);
  playTone(410, 0.06, 'triangle', 0.06, 0.06);
  playTone(520, 0.09, 'triangle', 0.07, 0.12);
}

export function playStepSound() {
  playTone(480, 0.08, 'sine', 0.06, 0);
}

export function playCorrectSound() {
  playTone(523.25, 0.14, 'sine', 0.08, 0);
  playTone(659.25, 0.16, 'sine', 0.08, 0.1);
  playTone(783.99, 0.24, 'sine', 0.08, 0.2);
}

export function playGentleWrongSound() {
  playTone(330, 0.15, 'triangle', 0.05, 0);
  playTone(280, 0.2, 'triangle', 0.05, 0.12);
}

export function playWedgeCelebrationSound() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((n, idx) => {
    playTone(n, 0.22, 'sine', 0.09, idx * 0.09);
  });
}
