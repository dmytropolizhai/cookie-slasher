/**
 * Procedural chiptune music sequencer using Web Audio API.
 * Two-channel: melody (square) + bass (square) + kick/hat percussion.
 */

// Note frequencies (Hz) - one octave lookup
const NOTE: Record<string, number> = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 195.99, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
  C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
  C6: 1046.50,
  '_': 0, // rest
};

type NoteName = keyof typeof NOTE;

// 16-step patterns (each step = 1/8 note at BPM)
const MELODY_PATTERN: NoteName[] = [
  'E5', '_', 'E5', '_', 'G5', '_', 'E5', '_',
  'D5', '_', 'D5', '_', 'F5', '_', 'D5', '_',
];

const MELODY_PATTERN_B: NoteName[] = [
  'C5', '_', 'E5', 'G5', 'A5', '_', 'G5', 'E5',
  'D5', '_', 'F5', 'A5', 'B5', '_', 'A5', 'F5',
];

const BASS_PATTERN: NoteName[] = [
  'C3', '_', 'C3', '_', 'G3', '_', 'G3', '_',
  'A3', '_', 'A3', '_', 'F3', '_', 'F3', '_',
];

const BASS_PATTERN_B: NoteName[] = [
  'C3', '_', 'E3', '_', 'G3', '_', 'E3', '_',
  'D3', '_', 'F3', '_', 'A3', '_', 'F3', '_',
];

// Kick: steps where kick plays
const KICK_STEPS = new Set([0, 8]);
// Hi-hat: every even step
const HIHAT_STEPS = new Set([2, 4, 6, 10, 12, 14]);

export class ChiptunePlayer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private playing = false;
  private stepIndex = 0;
  private patternCycle = 0;
  private nextStepTime = 0;
  private stepDuration = 0;
  private timerId: ReturnType<typeof setTimeout> | null = null;
  private bpm = 138;

  init(ctx: AudioContext, destination: AudioNode): void {
    this.ctx = ctx;
    this.masterGain = ctx.createGain();
    this.masterGain.gain.value = 0.35;
    this.masterGain.connect(destination);
  }

  start(): void {
    if (!this.ctx || this.playing) return;
    this.playing = true;
    this.stepIndex = 0;
    this.patternCycle = 0;
    this.stepDuration = 60 / this.bpm / 2; // 8th note
    this.nextStepTime = this.ctx.currentTime + 0.05;
    this.schedule();
  }

  stop(): void {
    this.playing = false;
    if (this.timerId !== null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    // Fade out
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(0, this.ctx!.currentTime, 0.08);
    }
  }

  setVolume(vol: number): void {
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(vol, this.ctx!.currentTime, 0.05);
    }
  }

  private schedule(): void {
    if (!this.playing || !this.ctx || !this.masterGain) return;
    const LOOKAHEAD = 0.1; // seconds to schedule ahead
    const INTERVAL = 50;   // ms scheduling interval

    while (this.nextStepTime < this.ctx.currentTime + LOOKAHEAD) {
      this.scheduleStep(this.stepIndex, this.nextStepTime);
      this.stepIndex = (this.stepIndex + 1) % 16;
      if (this.stepIndex === 0) {
        this.patternCycle = (this.patternCycle + 1) % 4;
      }
      this.nextStepTime += this.stepDuration;
    }

    this.timerId = setTimeout(() => this.schedule(), INTERVAL);
  }

  private scheduleStep(step: number, time: number): void {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const dest = this.masterGain;

    const useB = this.patternCycle >= 2;
    const melody = useB ? MELODY_PATTERN_B : MELODY_PATTERN;
    const bass = useB ? BASS_PATTERN_B : BASS_PATTERN;

    const melodyFreq = NOTE[melody[step]];
    const bassFreq = NOTE[bass[step]];
    const dur = this.stepDuration * 0.85;

    // Melody voice — square wave
    if (melodyFreq > 0) {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = melodyFreq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.18, time + 0.004);
      g.gain.setValueAtTime(0.18, time + dur * 0.7);
      g.gain.linearRampToValueAtTime(0, time + dur);
      o.connect(g);
      g.connect(dest);
      o.start(time);
      o.stop(time + dur + 0.01);
    }

    // Bass voice — square wave, one octave lower
    if (bassFreq > 0) {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = bassFreq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.22, time + 0.005);
      g.gain.setValueAtTime(0.22, time + dur * 0.8);
      g.gain.linearRampToValueAtTime(0, time + dur);
      o.connect(g);
      g.connect(dest);
      o.start(time);
      o.stop(time + dur + 0.01);
    }

    // Kick drum
    if (KICK_STEPS.has(step)) {
      const o = ctx.createOscillator();
      o.type = 'sine';
      o.frequency.setValueAtTime(160, time);
      o.frequency.exponentialRampToValueAtTime(30, time + 0.12);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.5, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
      o.connect(g);
      g.connect(dest);
      o.start(time);
      o.stop(time + 0.2);
    }

    // Hi-hat
    if (HIHAT_STEPS.has(step)) {
      const bufSize = Math.ceil(ctx.sampleRate * 0.04);
      const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufSize; i++) data[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const hpf = ctx.createBiquadFilter();
      hpf.type = 'highpass';
      hpf.frequency.value = 8000;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0.06, time);
      g.gain.exponentialRampToValueAtTime(0.001, time + 0.04);
      src.connect(hpf);
      hpf.connect(g);
      g.connect(dest);
      src.start(time);
    }
  }
}

export const chiptunePlayer = new ChiptunePlayer();
