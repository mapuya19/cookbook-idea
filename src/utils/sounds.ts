// Sound utilities using Web Audio API
// All sounds are generated programmatically - no external files needed

type AudioContextType = typeof AudioContext;

// Shared audio context for better performance and to avoid creating too many contexts
let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  try {
    if (sharedAudioContext && sharedAudioContext.state !== 'closed') {
      // Resume if suspended (e.g., after user interaction requirement)
      if (sharedAudioContext.state === 'suspended') {
        sharedAudioContext.resume();
      }
      return sharedAudioContext;
    }
    
    const AudioContextClass = window.AudioContext || 
      (window as unknown as { webkitAudioContext: AudioContextType }).webkitAudioContext;
    sharedAudioContext = new AudioContextClass();
    return sharedAudioContext;
  } catch {
    return null;
  }
}

// Debounce tracking for page flip sound
let lastPageFlipTime = 0;
const PAGE_FLIP_DEBOUNCE_MS = 150;

// Check if user prefers reduced motion
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Play a satisfying click sound for page navigation and button clicks
 * Clean, tactile feel inspired by modern UI interactions
 */
export function playPageFlip(): void {
  if (prefersReducedMotion()) return;
  
  // Debounce to prevent rapid-fire sounds
  const currentTime = Date.now();
  if (currentTime - lastPageFlipTime < PAGE_FLIP_DEBOUNCE_MS) return;
  lastPageFlipTime = currentTime;
  
  playClick();
}

/**
 * Core click sound - satisfying, subtle tactile feedback
 */
export function playClick(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;

  // Primary click tone - short, punchy
  const clickOsc = audioContext.createOscillator();
  const clickGain = audioContext.createGain();
  
  clickOsc.type = "sine";
  clickOsc.frequency.setValueAtTime(1800, now);
  clickOsc.frequency.exponentialRampToValueAtTime(1200, now + 0.03);
  
  // Very quick attack and decay for crisp click
  clickGain.gain.setValueAtTime(0, now);
  clickGain.gain.linearRampToValueAtTime(0.15, now + 0.003);
  clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  
  clickOsc.connect(clickGain);
  clickGain.connect(audioContext.destination);
  
  clickOsc.start(now);
  clickOsc.stop(now + 0.06);

  // Subtle low "thud" for body/weight
  const thudOsc = audioContext.createOscillator();
  const thudGain = audioContext.createGain();
  
  thudOsc.type = "sine";
  thudOsc.frequency.setValueAtTime(150, now);
  thudOsc.frequency.exponentialRampToValueAtTime(80, now + 0.04);
  
  thudGain.gain.setValueAtTime(0, now);
  thudGain.gain.linearRampToValueAtTime(0.08, now + 0.005);
  thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
  
  thudOsc.connect(thudGain);
  thudGain.connect(audioContext.destination);
  
  thudOsc.start(now);
  thudOsc.stop(now + 0.06);
}

/**
 * Play a magical unlock/discovery sound
 */
export function playUnlockSound(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Ascending arpeggio with sparkle
  const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
  
  notes.forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
    oscillator.type = "sine";

    // Add slight vibrato for sparkle effect
    const vibrato = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();
    vibrato.frequency.value = 6;
    vibratoGain.gain.value = freq * 0.02;
    vibrato.connect(vibratoGain);
    vibratoGain.connect(oscillator.frequency);
    vibrato.start(audioContext.currentTime + i * 0.1);
    vibrato.stop(audioContext.currentTime + i * 0.1 + 0.4);

    gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + i * 0.1 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.4);

    oscillator.start(audioContext.currentTime + i * 0.1);
    oscillator.stop(audioContext.currentTime + i * 0.1 + 0.4);
  });
}

/**
 * Play a cookie crunch/click sound
 */
export function playCookieClick(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Short crunchy click
  const bufferSize = audioContext.sampleRate * 0.03;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const envelope = Math.exp(-i / (bufferSize * 0.15));
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;

  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 1200;

  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 5000;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.25;

  noiseSource.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gainNode);
  gainNode.connect(audioContext.destination);

  noiseSource.start();
  noiseSource.stop(audioContext.currentTime + 0.05);
}

/**
 * Play a scratch sound for the scratch card
 * Designed to sound like scratching a lottery ticket with a coin
 */
export function playScratchSound(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  
  // Create a longer, more natural scratching noise
  const duration = 0.06 + Math.random() * 0.03; // Vary duration slightly
  const bufferSize = Math.floor(audioContext.sampleRate * duration);
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  // Generate noise with natural scratching texture
  // Use pink-ish noise (weighted random) for more organic sound
  let lastValue = 0;
  for (let i = 0; i < bufferSize; i++) {
    // Smooth envelope - gentle attack and decay
    const position = i / bufferSize;
    const envelope = Math.sin(position * Math.PI) * 0.8; // Smooth bell curve
    
    // Mix of white noise and filtered noise for texture
    const whiteNoise = Math.random() * 2 - 1;
    // Lowpass the noise by averaging with previous sample (creates softer texture)
    const smoothNoise = whiteNoise * 0.6 + lastValue * 0.4;
    lastValue = smoothNoise;
    
    // Add subtle variation to simulate uneven scratching
    const scratchTexture = Math.sin(i * 0.05) * 0.15 + 1;
    
    data[i] = smoothNoise * envelope * scratchTexture * 0.4;
  }

  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;

  // Lowpass filter to remove harsh high frequencies
  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 4000 + Math.random() * 1000; // Slight variation
  lowpass.Q.value = 0.5;

  // Highpass to remove rumble
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 400;
  highpass.Q.value = 0.5;

  // Gentle gain
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.06;

  noiseSource.connect(lowpass);
  lowpass.connect(highpass);
  highpass.connect(gainNode);
  gainNode.connect(audioContext.destination);

  noiseSource.start(now);
  noiseSource.stop(now + duration);
}

/**
 * Play a camera shutter sound
 */
export function playCameraShutter(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Two-part shutter: click + mechanical whir
  
  // Part 1: Initial click
  const clickBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.02, audioContext.sampleRate);
  const clickData = clickBuffer.getChannelData(0);
  for (let i = 0; i < clickData.length; i++) {
    const envelope = Math.exp(-i / (clickData.length * 0.1));
    clickData[i] = (Math.random() * 2 - 1) * envelope;
  }

  const clickSource = audioContext.createBufferSource();
  clickSource.buffer = clickBuffer;

  const clickHighpass = audioContext.createBiquadFilter();
  clickHighpass.type = "highpass";
  clickHighpass.frequency.value = 2000;

  const clickGain = audioContext.createGain();
  clickGain.gain.value = 0.3;

  clickSource.connect(clickHighpass);
  clickHighpass.connect(clickGain);
  clickGain.connect(audioContext.destination);

  clickSource.start();
  clickSource.stop(audioContext.currentTime + 0.03);

  // Part 2: Mechanical whir
  const whirOsc = audioContext.createOscillator();
  const whirGain = audioContext.createGain();

  whirOsc.type = "sawtooth";
  whirOsc.frequency.setValueAtTime(150, audioContext.currentTime + 0.02);
  whirOsc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.15);

  whirGain.gain.setValueAtTime(0, audioContext.currentTime + 0.02);
  whirGain.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.04);
  whirGain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

  whirOsc.connect(whirGain);
  whirGain.connect(audioContext.destination);

  whirOsc.start(audioContext.currentTime + 0.02);
  whirOsc.stop(audioContext.currentTime + 0.15);
}

/**
 * Play a reveal/ta-da sound for scratch card completion
 */
export function playRevealSound(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Triumphant chord
  const frequencies = [
    { freq: 523, delay: 0 },      // C5
    { freq: 659, delay: 0.05 },   // E5
    { freq: 784, delay: 0.1 },    // G5
    { freq: 1047, delay: 0.15 },  // C6
  ];

  frequencies.forEach(({ freq, delay }) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = "sine";
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, audioContext.currentTime + delay);
    gain.gain.linearRampToValueAtTime(0.12, audioContext.currentTime + delay + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + delay + 0.8);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(audioContext.currentTime + delay);
    osc.stop(audioContext.currentTime + delay + 0.8);
  });
}

/**
 * Play a catch/collect sound for the catch game
 */
export function playCatchSound(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.1);

  gain.gain.setValueAtTime(0.2, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 0.15);
}

/**
 * Play a miss/drop sound for the catch game
 */
export function playMissSound(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(400, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.2);

  gain.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start();
  osc.stop(audioContext.currentTime + 0.2);
}

/**
 * Play a pop sound for card interactions
 */
export function playPopSound(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(600, now);
  oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.1);
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.2, now);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  oscillator.start(now);
  oscillator.stop(now + 0.1);
}

/**
 * Play a success chime for game wins
 */
export function playSuccessSound(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  const notes = [523, 659, 784]; // C, E, G chord
  notes.forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + i * 0.1 + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.5);

    oscillator.start(audioContext.currentTime + i * 0.1);
    oscillator.stop(audioContext.currentTime + i * 0.1 + 0.5);
  });
}

/**
 * Play a satisfying click sound for button interactions
 */
export function playButtonClick(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  const bufferSize = audioContext.sampleRate * 0.02;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const envelope = Math.exp(-i / (bufferSize * 0.1));
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;

  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 1500;

  const lowpass = audioContext.createBiquadFilter();
  lowpass.type = "lowpass";
  lowpass.frequency.value = 6000;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.4;

  noiseSource.connect(highpass);
  highpass.connect(lowpass);
  lowpass.connect(gainNode);
  gainNode.connect(audioContext.destination);

  noiseSource.start();
  noiseSource.stop(audioContext.currentTime + 0.03);
}

/**
 * Play upgrade sound for game upgrades
 */
export function playUpgradeSound(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  [440, 554, 659].forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.1);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.1);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + i * 0.1 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.1 + 0.3);

    oscillator.start(audioContext.currentTime + i * 0.1);
    oscillator.stop(audioContext.currentTime + i * 0.1 + 0.3);
  });
}

/**
 * Play a pleasant ding sound
 */
export function playDingSound(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;

  // Main tone
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(830, now); // High G
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.3, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.01, now + 1.5);

  oscillator.start(now);
  oscillator.stop(now + 1.5);

  // Second harmonic for richness
  const oscillator2 = audioContext.createOscillator();
  const gainNode2 = audioContext.createGain();

  oscillator2.connect(gainNode2);
  gainNode2.connect(audioContext.destination);

  oscillator2.frequency.setValueAtTime(1660, now); // Octave up
  oscillator2.type = "sine";

  gainNode2.gain.setValueAtTime(0, now);
  gainNode2.gain.linearRampToValueAtTime(0.1, now + 0.01);
  gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 1);

  oscillator2.start(now);
  oscillator2.stop(now + 1);
}

/**
 * Play a quiz correct answer celebration sound
 * Happy ascending tones
 */
export function playQuizCorrect(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Happy ascending tones
  [523, 659, 784, 1047].forEach((freq, i) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(freq, audioContext.currentTime + i * 0.08);
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0, audioContext.currentTime + i * 0.08);
    gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + i * 0.08 + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + i * 0.08 + 0.3);

    oscillator.start(audioContext.currentTime + i * 0.08);
    oscillator.stop(audioContext.currentTime + i * 0.08 + 0.3);
  });
}

/**
 * Play a quiz incorrect answer gentle sound
 * Soft descending tone
 */
export function playQuizIncorrect(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Gentle descending tone
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.2);
  oscillator.type = "sine";

  gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.2);
}

/**
 * Play a beat hit sound for rhythm game
 * Crisp percussive tap sound
 */
export function playBeatHit(): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;

  // Crisp percussive hit
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(800, now);
  osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start(now);
  osc.stop(now + 0.15);
}

/**
 * Play rhythm game combo sound
 * Pitch increases with combo count
 */
export function playComboSound(combo: number): void {
  if (prefersReducedMotion()) return;

  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Pitch increases with combo
  const baseFreq = 400 + (Math.min(combo, 10) * 50);

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(baseFreq, audioContext.currentTime);
  osc.frequency.setValueAtTime(baseFreq * 1.5, audioContext.currentTime + 0.1);

  gain.gain.setValueAtTime(0.2, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

  osc.connect(gain);
  gain.connect(audioContext.destination);

  osc.start(audioContext.currentTime);
  osc.stop(audioContext.currentTime + 0.2);
}

