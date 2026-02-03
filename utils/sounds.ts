// Sound utilities using Web Audio API
// All sounds are generated programmatically - no external files needed

type AudioContextType = typeof AudioContext;

function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass = window.AudioContext || 
      (window as unknown as { webkitAudioContext: AudioContextType }).webkitAudioContext;
    return new AudioContextClass();
  } catch {
    return null;
  }
}

// Check if user prefers reduced motion
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Play a subtle page flip/paper rustle sound
 */
export function playPageFlip(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  // Create noise buffer for paper rustle
  const bufferSize = audioContext.sampleRate * 0.08; // 80ms
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  // Fill with filtered noise that sounds like paper
  for (let i = 0; i < bufferSize; i++) {
    // Quick attack, medium decay
    const envelope = Math.exp(-i / (bufferSize * 0.3));
    // Add some variation for more natural sound
    const variation = Math.sin(i * 0.01) * 0.3 + 0.7;
    data[i] = (Math.random() * 2 - 1) * envelope * variation * 0.5;
  }

  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;

  // Bandpass filter to make it sound more like paper
  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 2000;
  bandpass.Q.value = 0.5;

  // High-pass to remove low rumble
  const highpass = audioContext.createBiquadFilter();
  highpass.type = "highpass";
  highpass.frequency.value = 800;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.15;

  noiseSource.connect(bandpass);
  bandpass.connect(highpass);
  highpass.connect(gainNode);
  gainNode.connect(audioContext.destination);

  noiseSource.start();
  noiseSource.stop(audioContext.currentTime + 0.1);
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
 */
export function playScratchSound(): void {
  if (prefersReducedMotion()) return;
  
  const audioContext = getAudioContext();
  if (!audioContext) return;

  const bufferSize = audioContext.sampleRate * 0.02;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const envelope = Math.exp(-i / (bufferSize * 0.5));
    data[i] = (Math.random() * 2 - 1) * envelope * 0.3;
  }

  const noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;

  const bandpass = audioContext.createBiquadFilter();
  bandpass.type = "bandpass";
  bandpass.frequency.value = 3000;
  bandpass.Q.value = 1;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = 0.08;

  noiseSource.connect(bandpass);
  bandpass.connect(gainNode);
  gainNode.connect(audioContext.destination);

  noiseSource.start();
  noiseSource.stop(audioContext.currentTime + 0.03);
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
