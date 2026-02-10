/**
 * Audio constants for consistent sound design across the application
 */

// Audio context settings
export const AUDIO_CONTEXT_SAMPLE_RATE = 44100; // Hz

// Debounce settings
export const PAGE_FLIP_DEBOUNCE_MS = 150; // ms between page flip sounds

// Volume levels
export const VOLUME = {
  // Music volume
  musicDefault: 0.3,
  musicMin: 0,
  musicMax: 1,
  musicStep: 0.05,

  // Sound effect volumes (gain values)
  sfxClick: 0.15,
  sfxPageFlip: 0.15,
  sfxUnlock: 0.15,
  sfxCookie: 0.25,
  sfxCamera: 0.3,
  sfxReveal: 0.12,
  sfxCatch: 0.2,
  sfxMiss: 0.15,
  sfxPop: 0.2,
  sfxSuccess: 0.15,
  sfxButton: 0.4,
  sfxDing: 0.3,
} as const;

// Duration values (in seconds)
export const DURATION = {
  click: 0.06,
  clickShort: 0.03,
  pageFlip: 0.05,
  unlockNote: 0.4,
  cookieCrunch: 0.05,
  cameraClick: 0.02,
  cameraWhir: 0.13,
  reveal: 0.8,
  catch: 0.15,
  miss: 0.2,
  pop: 0.1,
  success: 0.5,
  button: 0.03,
  ding: 1.5,
  dingHarmonic: 1,
} as const;

// Frequency values (in Hz)
export const FREQUENCY = {
  // Click sounds
  clickStart: 1800,
  clickEnd: 1200,
  clickThudStart: 150,
  clickThudEnd: 80,

  // Unlock/magic sounds
  unlockNotes: [523, 659, 784, 1047], // C5, E5, G5, C6 arpeggio
  unlockVibrato: 6,
  unlockVibratoGain: 0.02, // multiplier of frequency

  // Cookie crunch
  crunchHighpass: 1200,
  crunchLowpass: 5000,

  // Camera shutter
  cameraClickHighpass: 2000,
  cameraWhirStart: 150,
  cameraWhirEnd: 50,

  // Reveal/ta-da chord
  revealChord: [
    { freq: 523, delay: 0 },      // C5
    { freq: 659, delay: 0.05 },   // E5
    { freq: 784, delay: 0.1 },    // G5
    { freq: 1047, delay: 0.15 },  // C6
  ],

  // Catch game
  catchStart: 800,
  catchEnd: 1200,
  missStart: 400,
  missEnd: 150,

  // Pop sound
  popStart: 600,
  popEnd: 200,

  // Success chord
  successChord: [523, 659, 784], // C, E, G

  // Button click
  buttonHighpass: 1500,
  buttonLowpass: 6000,

  // Ding sound (bell)
  dingMain: 830,        // High G
  dingHarmonic: 1660,   // Octave up

  // Upgrade chord
  upgradeChord: [440, 554, 659], // A, C#, E
} as const;

// Envelope timing
export const ENVELOPE = {
  // Click envelope
  clickAttack: 0.003,
  clickDecay: 0.05,
  clickThudAttack: 0.005,
  clickThudDecay: 0.05,

  // Ding envelope
  dingAttack: 0.01,
  dingDecay: 1.5,
  dingHarmonicAttack: 0.01,
  dingHarmonicDecay: 1,

  // Success envelope
  successNoteAttack: 0.02,
  successNoteDelay: 0.05,

  // Pop envelope
  popDecay: 0.1,

  // Button envelope
  buttonDecayMultiplier: 0.1,

  // Upgrade envelope
  upgradeNoteDelay: 0.1,
  upgradeAttack: 0.02,
  upgradeDecay: 0.3,

  // Reveal envelope
  revealAttack: 0.05,
  revealDelay: 0.05,

  // Catch envelope
  catchDecay: 0.15,

  // Miss envelope
  missDecay: 0.2,

  // Unlock envelope
  unlockAttack: 0.02,
  unlockNoteDelay: 0.1,

  // Camera envelope
  cameraWhirAttack: 0.02,
  cameraWhirDecay: 0.15,
} as const;

// Filter settings
export const FILTER = {
  // Scratch sound (for scratch card)
  scratchLowpass: 4000,
  scratchLowpassVariation: 1000,
  scratchLowpassQ: 0.5,
  scratchHighpass: 400,
  scratchHighpassQ: 0.5,
  scratchDurationMin: 0.06,
  scratchDurationMax: 0.03,
  scratchGain: 0.06,

  // Noise texture
  noiseEnvelopeMultiplier: 0.15,
  noiseSmoothRatio: 0.4,
  noiseTextureMultiplier: 0.15,
} as const;

// Oscillator types
export const OSCILLATOR_TYPE = {
  sine: "sine" as const,
  square: "square" as const,
  sawtooth: "sawtooth" as const,
  triangle: "triangle" as const,
} as const;

// Biquad filter types
export const FILTER_TYPE = {
  lowpass: "lowpass" as const,
  highpass: "highpass" as const,
  bandpass: "bandpass" as const,
  notch: "notch" as const,
  peaking: "peaking" as const,
} as const;
