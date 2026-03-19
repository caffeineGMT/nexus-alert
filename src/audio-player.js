/**
 * Cross-Browser Sound Playback
 * Handles differences between Chrome's offscreen API and Firefox's audio playback
 */

import { BROWSER, offscreen, features, runtime } from './browser-polyfill.js';

/**
 * Play alert sound with cross-browser compatibility
 * @param {string} soundType - Type of sound (chime, bell, alert, etc.)
 * @param {number} volume - Volume level (0-100)
 */
export async function playAlertSound(soundType = 'chime', volume = 70) {
  try {
    if (features.supportsOffscreenDocuments) {
      // Chrome/Edge: Use offscreen document
      await playViaOffscreen(soundType, volume);
    } else {
      // Firefox/Safari: Use alternative method
      await playViaBackgroundAudio(soundType, volume);
    }
  } catch (err) {
    console.error('[Sound] Failed to play alert:', err);
  }
}

/**
 * Chrome/Edge: Play sound via offscreen document
 */
async function playViaOffscreen(soundType, volume) {
  const hasOffscreen = await offscreen.hasDocument();

  if (!hasOffscreen) {
    await offscreen.createDocument({
      url: 'offscreen.html',
      reasons: ['AUDIO_PLAYBACK'],
      justification: 'Play alert sound when new slots are found',
    });
  }

  chrome.runtime.sendMessage({
    action: 'playSound',
    soundType,
    volume,
  });
}

/**
 * Firefox/Safari: Play sound via Audio element in background
 * Since Firefox service workers don't support Audio(), we'll use a content script approach
 */
async function playViaBackgroundAudio(soundType, volume) {
  // For Firefox, we can play audio directly in the background page
  // Note: This works in Firefox MV3 because it supports background.scripts (not service_worker)
  const audio = new Audio(getSoundURL(soundType));
  audio.volume = volume / 100;

  try {
    await audio.play();
  } catch (err) {
    console.error('[Sound] Failed to play audio in background:', err);

    // Fallback: Try to play in popup if it's open
    try {
      await runtime.sendMessage({
        action: 'playSound',
        soundType,
        volume,
      });
    } catch (msgErr) {
      // Popup not open, sound can't play
      console.warn('[Sound] No active popup to play sound');
    }
  }
}

/**
 * Get sound file URL
 */
function getSoundURL(soundType) {
  const soundMap = {
    chime: 'sounds/chime.mp3',
    bell: 'sounds/bell.mp3',
    alert: 'sounds/alert.mp3',
    notification: 'sounds/notification.mp3',
  };

  const soundFile = soundMap[soundType] || soundMap.chime;
  return runtime.getURL(soundFile);
}

/**
 * Test sound playback (for settings panel)
 */
export async function testSound(soundType, volume) {
  return playAlertSound(soundType, volume);
}
