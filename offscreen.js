// Offscreen document for playing alert sounds (MV3)
chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === 'playSound') {
    playNotificationSound();
  }
});

function playNotificationSound() {
  const ctx = new AudioContext();
  const now = ctx.currentTime;

  // Three-tone ascending chime
  const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
  const duration = 0.15;
  const gap = 0.1;

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, now + i * (duration + gap));
    gain.gain.linearRampToValueAtTime(0.3, now + i * (duration + gap) + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + i * (duration + gap) + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + i * (duration + gap));
    osc.stop(now + i * (duration + gap) + duration + 0.05);
  });
}
