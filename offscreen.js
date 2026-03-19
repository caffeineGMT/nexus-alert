// Offscreen document for playing alert sounds (MV3)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'playSound') {
    playNotificationSound(msg.soundType || 'chime', msg.volume ?? 70);
  }
});

const SOUND_PRESETS = {
  chime: {
    frequencies: [523.25, 659.25, 783.99], // C5, E5, G5
    type: 'sine',
    duration: 0.15,
    gap: 0.1,
  },
  bell: {
    frequencies: [880, 1108.73, 1318.51], // A5, C#6, E6
    type: 'sine',
    duration: 0.25,
    gap: 0.05,
  },
  urgent: {
    frequencies: [880, 698.46, 880, 698.46], // A5, F5 alternating
    type: 'square',
    duration: 0.12,
    gap: 0.06,
  },
  subtle: {
    frequencies: [440, 523.25], // A4, C5
    type: 'sine',
    duration: 0.2,
    gap: 0.15,
  },
  // ─── New Sound Presets ────────────────────────────────────────────
  alert: {
    frequencies: [987.77, 1174.66, 987.77], // B5, D6, B5 - attention-grabbing
    type: 'sine',
    duration: 0.18,
    gap: 0.08,
  },
  success: {
    frequencies: [523.25, 659.25, 783.99, 1046.50], // C5, E5, G5, C6 - ascending major chord
    type: 'sine',
    duration: 0.12,
    gap: 0.06,
  },
  notification: {
    frequencies: [659.25, 783.99], // E5, G5 - simple and pleasant
    type: 'triangle',
    duration: 0.15,
    gap: 0.1,
  },
  marimba: {
    frequencies: [523.25, 659.25, 783.99, 1046.50, 783.99], // C5-E5-G5-C6-G5
    type: 'sine',
    duration: 0.1,
    gap: 0.05,
  },
  cosmic: {
    frequencies: [220, 277.18, 329.63, 440], // A3, C#4, E4, A4 - spacey feel
    type: 'sine',
    duration: 0.3,
    gap: 0.1,
  },
  sonar: {
    frequencies: [440, 440], // A4 repeated - ping effect
    type: 'sine',
    duration: 0.08,
    gap: 0.15,
  },
};

function playNotificationSound(soundType, volume) {
  const preset = SOUND_PRESETS[soundType] || SOUND_PRESETS.chime;
  const volumeScale = Math.max(0, Math.min(1, volume / 100));

  const ctx = new AudioContext();
  const now = ctx.currentTime;
  const maxGain = 0.3 * volumeScale;

  preset.frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = preset.type;
    osc.frequency.value = freq;

    const startTime = now + i * (preset.duration + preset.gap);
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(maxGain, startTime + 0.02);
    gain.gain.linearRampToValueAtTime(0, startTime + preset.duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + preset.duration + 0.05);
  });
}
