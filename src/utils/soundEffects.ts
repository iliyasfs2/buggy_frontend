class SoundManager {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  setEnabled(val: boolean): void {
    this.enabled = val;
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("buggy_sound_enabled", val ? "true" : "false");
      } catch {}
    }
  }

  isEnabled(): boolean {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("buggy_sound_enabled");
      if (stored !== null) return stored === "true";
    }
    return this.enabled;
  }

  private getContext(): AudioContext | null {
    if (!this.isEnabled()) return null;
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  playCorrect(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50];

      notes.forEach((freq, i) => {
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(freq, now + i * 0.08);

        gain1.gain.setValueAtTime(0, now + i * 0.08);
        gain1.gain.linearRampToValueAtTime(0.4, now + i * 0.08 + 0.02);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.start(now + i * 0.08);
        osc1.stop(now + i * 0.08 + 0.35);
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq, now + i * 0.08);
        
        gain2.gain.setValueAtTime(0, now + i * 0.08);
        gain2.gain.linearRampToValueAtTime(0.3, now + i * 0.08 + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3);

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.start(now + i * 0.08);
        osc2.stop(now + i * 0.08 + 0.35);
      });
    } catch {}
  }

  playIncorrect(): void {
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sawtooth";
      osc1.frequency.setValueAtTime(160, now);
      osc1.frequency.exponentialRampToValueAtTime(100, now + 0.3);

      osc2.type = "sawtooth";
      osc2.frequency.setValueAtTime(164, now);
      osc2.frequency.exponentialRampToValueAtTime(102, now + 0.3);
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(2000, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.3);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } catch {}
  }

  playSwoosh(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(500, now);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.25);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch {}
  }

  playIgnite(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.exponentialRampToValueAtTime(20, now + 0.5);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 1.5;
      }
      
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "bandpass";
      noiseFilter.frequency.setValueAtTime(1500, now);
      noiseFilter.frequency.linearRampToValueAtTime(300, now + 0.5);
      noiseFilter.Q.value = 0.5;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0, now);
      noiseGain.gain.linearRampToValueAtTime(0.8, now + 0.1);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      noiseSource.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noiseSource.start(now);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.5);
    } catch {}
  }

  playSoftClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = "lowpass";
      filter.frequency.setValueAtTime(1000, now);

      osc.type = "sine";
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.035);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.08, now + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {}
  }

  playClick(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(100, now + 0.07);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch {}
  }

  playVictory(): void {
    const ctx = this.getContext();
    if (!ctx) return;
    try {
      const now = ctx.currentTime;
      const notes = [261.63, 392.00, 523.25, 659.25, 783.99];
      const timing = [0, 0.15, 0.3, 0.45, 0.6];

      notes.forEach((freq, i) => {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = "square";
        osc1.frequency.setValueAtTime(freq, now + timing[i]);
        
        osc2.type = "sawtooth";
        osc2.frequency.setValueAtTime(freq * 1.01, now + timing[i]);

        const isLast = i === notes.length - 1;
        const volume = isLast ? 0.4 : 0.25;
        const duration = isLast ? 1.5 : 0.2;

        gain.gain.setValueAtTime(0, now + timing[i]);
        gain.gain.linearRampToValueAtTime(volume, now + timing[i] + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, now + timing[i] + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);

        osc1.start(now + timing[i]);
        osc2.start(now + timing[i]);
        osc1.stop(now + timing[i] + duration + 0.1);
        osc2.stop(now + timing[i] + duration + 0.1);
      });
    } catch {}
  }
}

export const soundEffects = new SoundManager();
