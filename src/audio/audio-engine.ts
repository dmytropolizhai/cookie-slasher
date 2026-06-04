/**
 * Web Audio API sound engine.
 * All sounds are synthesized procedurally — no audio files needed.
 */

export type SoundKey =
  | 'slice_normal'
  | 'slice_golden'
  | 'slice_fake'
  | 'slice_bomb'
  | 'slice_critical'
  | 'katana_swing'
  | 'combo_up'
  | 'combo_break'
  | 'slow_mo_in'
  | 'slow_mo_out'
  | 'miss'
  | 'explosion'
  | 'boss_roar';

interface SynthParams {
  type: OscillatorType;
  freq: number;
  freqEnd?: number;
  duration: number;
  attack?: number;
  decay?: number;
  gain?: number;
  noiseLayer?: boolean;
  noiseGain?: number;
  /** second oscillator for harmony */
  freq2?: number;
  type2?: OscillatorType;
  detune?: number;
}

function createNoise(ctx: AudioContext, duration: number, gain: number): { node: AudioNode; source: AudioBufferSourceNode } {
  const bufferSize = Math.ceil(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1);
  }
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const gainNode = ctx.createGain();
  gainNode.gain.value = gain;
  source.connect(gainNode);
  return { node: gainNode, source };
}

function scheduleEnvelope(
  gainNode: GainNode,
  _ctx: AudioContext,
  now: number,
  attack: number,
  sustain: number,
  release: number,
  peakGain: number,
): void {
  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(peakGain, now + attack);
  gainNode.gain.setValueAtTime(peakGain, now + attack + sustain);
  gainNode.gain.linearRampToValueAtTime(0, now + attack + sustain + release);
}

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private muted = false;

  private ensureContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new AudioContext();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.muted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  private getDestination(): AudioNode {
    this.ensureContext();
    return this.masterGain!;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.masterGain) {
      this.masterGain.gain.setTargetAtTime(muted ? 0 : 1, this.masterGain.context.currentTime, 0.05);
    }
  }

  isMuted(): boolean {
    return this.muted;
  }

  /** Low-level synth: one or two oscillators + optional noise */
  private synth(params: SynthParams): void {
    const ctx = this.ensureContext();
    const dest = this.getDestination();
    const now = ctx.currentTime;

    const {
      type, freq, freqEnd, duration,
      attack = 0.002, decay = 0,
      gain = 0.3,
      noiseLayer = false, noiseGain = 0.1,
      freq2, type2, detune = 0,
    } = params;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (freqEnd !== undefined) {
      osc.frequency.exponentialRampToValueAtTime(Math.max(freqEnd, 1), now + duration);
    }
    if (detune !== 0) osc.detune.value = detune;

    const gainNode = ctx.createGain();
    const sustain = Math.max(0, duration - attack - decay);
    scheduleEnvelope(gainNode, ctx, now, attack, sustain, decay, gain);

    osc.connect(gainNode);
    gainNode.connect(dest);
    osc.start(now);
    osc.stop(now + duration + 0.01);

    if (freq2 !== undefined) {
      const osc2 = ctx.createOscillator();
      osc2.type = type2 ?? type;
      osc2.frequency.setValueAtTime(freq2, now);
      if (freqEnd !== undefined) {
        const ratio = freq2 / freq;
        osc2.frequency.exponentialRampToValueAtTime(Math.max(freqEnd * ratio, 1), now + duration);
      }
      const gainNode2 = ctx.createGain();
      scheduleEnvelope(gainNode2, ctx, now, attack, sustain, decay, gain * 0.6);
      osc2.connect(gainNode2);
      gainNode2.connect(dest);
      osc2.start(now);
      osc2.stop(now + duration + 0.01);
    }

    if (noiseLayer) {
      const { node: noiseNode, source: noiseSrc } = createNoise(ctx, duration + 0.05, noiseGain);
      const noiseEnv = ctx.createGain();
      scheduleEnvelope(noiseEnv, ctx, now, 0.001, Math.max(0, duration * 0.2), duration * 0.8, 1);
      noiseNode.connect(noiseEnv);
      noiseEnv.connect(dest);
      noiseSrc.start(now);
      // buffer source auto-stops when buffer ends
    }
  }

  // ── SFX definitions ──────────────────────────────────────────────────

  play(key: SoundKey): void {
    switch (key) {
      case 'slice_normal':    this.sfxSliceNormal(); break;
      case 'slice_golden':    this.sfxSliceGolden(); break;
      case 'slice_fake':      this.sfxSliceFake(); break;
      case 'slice_bomb':      this.sfxExplosion(); break;
      case 'slice_critical':  this.sfxCritical(); break;
      case 'katana_swing':    this.sfxSwing(); break;
      case 'combo_up':        this.sfxComboUp(); break;
      case 'combo_break':     this.sfxComboBreak(); break;
      case 'slow_mo_in':      this.sfxSlowMoIn(); break;
      case 'slow_mo_out':     this.sfxSlowMoOut(); break;
      case 'miss':            this.sfxMiss(); break;
      case 'explosion':       this.sfxExplosion(); break;
      case 'boss_roar':       this.sfxBossRoar(); break;
    }
  }

  private sfxSliceNormal(): void {
    // Sharp whoosh + high click
    this.synth({ type: 'sawtooth', freq: 1200, freqEnd: 400, duration: 0.08, attack: 0.001, decay: 0.07, gain: 0.18 });
    this.synth({ type: 'square', freq: 2400, freqEnd: 600, duration: 0.05, attack: 0.001, decay: 0.04, gain: 0.1 });
  }

  private sfxSliceGolden(): void {
    // Bright shimmering slice
    this.synth({ type: 'sine', freq: 1600, freqEnd: 800, duration: 0.12, attack: 0.002, decay: 0.1, gain: 0.22 });
    this.synth({ type: 'sine', freq: 2200, freqEnd: 1100, duration: 0.14, attack: 0.002, decay: 0.12, gain: 0.14 });
    this.synth({ type: 'triangle', freq: 3200, freqEnd: 2400, duration: 0.08, attack: 0.001, decay: 0.07, gain: 0.08 });
  }

  private sfxSliceFake(): void {
    // Dull thud, descending
    this.synth({ type: 'square', freq: 300, freqEnd: 80, duration: 0.18, attack: 0.003, decay: 0.16, gain: 0.25 });
    this.synth({ type: 'sawtooth', freq: 600, freqEnd: 100, duration: 0.1, attack: 0.002, decay: 0.09, gain: 0.12 });
  }

  private sfxExplosion(): void {
    const ctx = this.ensureContext();
    const dest = this.getDestination();
    const now = ctx.currentTime;

    // Low boom
    const boom = ctx.createOscillator();
    boom.type = 'sine';
    boom.frequency.setValueAtTime(120, now);
    boom.frequency.exponentialRampToValueAtTime(20, now + 0.4);
    const boomGain = ctx.createGain();
    boomGain.gain.setValueAtTime(0.5, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    boom.connect(boomGain);
    boomGain.connect(dest);
    boom.start(now);
    boom.stop(now + 0.42);

    // Noise burst
    const bufSize = Math.ceil(ctx.sampleRate * 0.5);
    const buf = ctx.createBuffer(1, bufSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufSize; i++) d[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    const bpf = ctx.createBiquadFilter();
    bpf.type = 'bandpass';
    bpf.frequency.value = 800;
    bpf.Q.value = 0.5;
    noise.connect(bpf);
    bpf.connect(noiseGain);
    noiseGain.connect(dest);
    noise.start(now);
  }

  private sfxCritical(): void {
    // Epic power chord + high shine
    const ctx = this.ensureContext();
    const dest = this.getDestination();
    const now = ctx.currentTime;

    const freqs = [220, 330, 440, 660];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.value = f;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.12, now + 0.01 + i * 0.01);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      o.connect(g);
      g.connect(dest);
      o.start(now);
      o.stop(now + 0.65);
    });

    // Rising sweep
    const sweep = ctx.createOscillator();
    sweep.type = 'sine';
    sweep.frequency.setValueAtTime(400, now);
    sweep.frequency.exponentialRampToValueAtTime(3200, now + 0.5);
    const sweepGain = ctx.createGain();
    sweepGain.gain.setValueAtTime(0.15, now);
    sweepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    sweep.connect(sweepGain);
    sweepGain.connect(dest);
    sweep.start(now);
    sweep.stop(now + 0.52);
  }

  private sfxSwing(): void {
    // Whoosh
    this.synth({ type: 'sawtooth', freq: 800, freqEnd: 200, duration: 0.1, attack: 0.005, decay: 0.09, gain: 0.1 });
  }

  private sfxComboUp(): void {
    // Ascending arpeggio
    const ctx = this.ensureContext();
    const dest = this.getDestination();
    const now = ctx.currentTime;
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + i * 0.055);
      g.gain.linearRampToValueAtTime(0.1, now + i * 0.055 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.055 + 0.09);
      o.connect(g);
      g.connect(dest);
      o.start(now + i * 0.055);
      o.stop(now + i * 0.055 + 0.1);
    });
  }

  private sfxComboBreak(): void {
    // Descending sad arpeggio
    const ctx = this.ensureContext();
    const dest = this.getDestination();
    const now = ctx.currentTime;
    const notes = [440, 349, 261, 174];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = 'square';
      o.frequency.value = freq;
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now + i * 0.07);
      g.gain.linearRampToValueAtTime(0.12, now + i * 0.07 + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.07 + 0.12);
      o.connect(g);
      g.connect(dest);
      o.start(now + i * 0.07);
      o.stop(now + i * 0.07 + 0.13);
    });
  }

  private sfxSlowMoIn(): void {
    // Pitch-shift down effect
    this.synth({ type: 'sine', freq: 600, freqEnd: 180, duration: 0.35, attack: 0.01, decay: 0.32, gain: 0.2 });
    this.synth({ type: 'triangle', freq: 900, freqEnd: 270, duration: 0.3, attack: 0.01, decay: 0.28, gain: 0.12 });
  }

  private sfxSlowMoOut(): void {
    // Pitch-shift up effect
    this.synth({ type: 'sine', freq: 180, freqEnd: 600, duration: 0.25, attack: 0.01, decay: 0.22, gain: 0.18 });
  }

  private sfxMiss(): void {
    // Error buzz
    this.synth({ type: 'sawtooth', freq: 220, freqEnd: 110, duration: 0.22, attack: 0.005, decay: 0.2, gain: 0.2 });
    this.synth({ type: 'square', freq: 160, freqEnd: 80, duration: 0.28, attack: 0.005, decay: 0.25, gain: 0.15 });
  }

  private sfxBossRoar(): void {
    const ctx = this.ensureContext();
    const dest = this.getDestination();
    const now = ctx.currentTime;

    // Rumble oscillators
    [55, 82, 110].forEach((f) => {
      const o = ctx.createOscillator();
      o.type = 'sawtooth';
      o.frequency.setValueAtTime(f, now);
      o.frequency.exponentialRampToValueAtTime(f * 0.5, now + 0.8);
      const g = ctx.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.15, now + 0.05);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
      o.connect(g);
      g.connect(dest);
      o.start(now);
      o.stop(now + 0.9);
    });
  }

  /**
   * Returns the AudioContext and master gain node, creating them if needed.
   * Used by the chiptune player to connect its output to the master chain.
   */
  getAudioNodes(): { ctx: AudioContext; masterGain: GainNode } {
    const ctx = this.ensureContext();
    return { ctx, masterGain: this.masterGain! };
  }

  resume(): void {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume();
    }
  }

  dispose(): void {
    this.ctx?.close();
    this.ctx = null;
    this.masterGain = null;
  }
}

export const audioEngine = new AudioEngine();
