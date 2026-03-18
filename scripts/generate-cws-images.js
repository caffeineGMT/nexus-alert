#!/usr/bin/env node

/**
 * Generate Chrome Web Store promotional images and screenshots
 * Uses sharp for image generation since puppeteer is problematic
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLORS = {
  primary: '#3b82f6',
  secondary: '#22c55e',
  background: '#0a0a0a',
  surface: '#111111',
  border: '#222222',
  text: '#ffffff',
  textMuted: '#888888',
  accent: '#3b82f6',
  success: '#22c55e',
  warning: '#eab308',
};

async function generateMarquee() {
  const width = 1400;
  const height = 560;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${COLORS.background};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f0f1a;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)"/>

      <!-- Border -->
      <rect width="${width}" height="${height}" fill="none" stroke="${COLORS.border}" stroke-width="2"/>

      <!-- Icon -->
      <circle cx="300" cy="280" r="80" fill="${COLORS.primary}" opacity="0.2"/>
      <circle cx="300" cy="280" r="60" fill="${COLORS.primary}" opacity="0.4"/>
      <text x="300" y="305" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">🔔</text>

      <!-- Title -->
      <text x="520" y="200" font-family="Arial, sans-serif" font-size="64" font-weight="bold" fill="${COLORS.text}">NEXUS Alert</text>

      <!-- Tagline -->
      <text x="520" y="260" font-family="Arial, sans-serif" font-size="32" fill="${COLORS.textMuted}">Never Miss Your Appointment</text>

      <!-- Features -->
      <text x="520" y="330" font-family="Arial, sans-serif" font-size="24" fill="${COLORS.success}">✓ Real-time monitoring</text>
      <text x="520" y="370" font-family="Arial, sans-serif" font-size="24" fill="${COLORS.success}">✓ Instant notifications</text>
      <text x="520" y="410" font-family="Arial, sans-serif" font-size="24" fill="${COLORS.success}">✓ Multi-location tracking</text>

      <!-- Badge -->
      <rect x="980" y="460" width="180" height="60" rx="30" fill="${COLORS.primary}"/>
      <text x="1070" y="497" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">FREE TIER</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../store-assets/marquee-1400x560.png'));

  console.log('✓ Generated marquee-1400x560.png');
}

async function generateSmallTile() {
  const width = 440;
  const height = 280;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${COLORS.background};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#0f0f1a;stop-opacity:1" />
        </linearGradient>
      </defs>

      <!-- Background -->
      <rect width="${width}" height="${height}" fill="url(#bg)"/>

      <!-- Border -->
      <rect width="${width}" height="${height}" fill="none" stroke="${COLORS.border}" stroke-width="2"/>

      <!-- Icon -->
      <circle cx="220" cy="100" r="50" fill="${COLORS.primary}" opacity="0.3"/>
      <text x="220" y="120" font-family="Arial, sans-serif" font-size="48" text-anchor="middle">🔔</text>

      <!-- Title -->
      <text x="220" y="190" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">NEXUS Alert</text>

      <!-- Subtitle -->
      <text x="220" y="230" font-family="Arial, sans-serif" font-size="18" fill="${COLORS.textMuted}" text-anchor="middle">Appointment Slot Finder</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../store-assets/small-tile-440x280.png'));

  console.log('✓ Generated small-tile-440x280.png');
}

async function generateScreenshot1() {
  // Screenshot 1: Monitor locations
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Browser chrome -->
      <rect width="${width}" height="${height}" fill="#f5f5f5"/>
      <rect width="${width}" height="40" fill="#e0e0e0"/>
      <circle cx="20" cy="20" r="6" fill="#ff5f56"/>
      <circle cx="40" cy="20" r="6" fill="#ffbd2e"/>
      <circle cx="60" cy="20" r="6" fill="#27c93f"/>

      <!-- Extension popup -->
      <rect x="440" y="80" width="400" height="640" fill="${COLORS.background}" rx="8"/>
      <rect x="440" y="80" width="400" height="640" fill="none" stroke="${COLORS.border}" stroke-width="1"/>

      <!-- Header -->
      <rect x="440" y="80" width="400" height="60" fill="${COLORS.surface}"/>
      <text x="460" y="115" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${COLORS.text}">🔔 NEXUS Alert</text>

      <!-- Tab -->
      <rect x="460" y="150" width="100" height="32" fill="${COLORS.primary}" rx="4"/>
      <text x="510" y="172" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}" text-anchor="middle">Monitor</text>

      <!-- Program selector -->
      <rect x="460" y="200" width="360" height="40" fill="${COLORS.surface}" rx="6"/>
      <text x="470" y="225" font-family="Arial, sans-serif" font-size="14" fill="${COLORS.text}">Program: NEXUS</text>

      <!-- Locations -->
      <text x="460" y="265" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="${COLORS.textMuted}">ENROLLMENT CENTERS</text>

      <rect x="460" y="280" width="360" height="40" fill="${COLORS.surface}" rx="6"/>
      <circle cx="475" cy="300" r="6" fill="${COLORS.success}"/>
      <text x="495" y="305" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}">Blaine, WA</text>

      <rect x="460" y="330" width="360" height="40" fill="${COLORS.surface}" rx="6"/>
      <circle cx="475" cy="350" r="6" fill="${COLORS.success}"/>
      <text x="495" y="355" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}">Peace Arch, WA</text>

      <rect x="460" y="380" width="360" height="40" fill="${COLORS.surface}" rx="6"/>
      <circle cx="475" cy="400" r="6" fill="${COLORS.success}"/>
      <text x="495" y="405" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}">Buffalo-Fort Erie, NY</text>

      <rect x="460" y="430" width="360" height="40" fill="${COLORS.surface}" rx="6"/>
      <circle cx="475" cy="450" r="6" fill="${COLORS.border}"/>
      <text x="495" y="455" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">Detroit, MI</text>

      <!-- Status -->
      <rect x="460" y="500" width="360" height="60" fill="${COLORS.surface}" rx="6"/>
      <text x="640" y="525" font-family="Arial, sans-serif" font-size="12" fill="${COLORS.textMuted}" text-anchor="middle">Last checked: 2 minutes ago</text>
      <text x="640" y="545" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.success}" text-anchor="middle">Monitoring 3 locations</text>

      <!-- Footer -->
      <rect x="460" y="640" width="360" height="60" fill="${COLORS.primary}" rx="6"/>
      <text x="640" y="675" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">Check Now</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../store-assets/1-monitor-locations.png'));

  console.log('✓ Generated 1-monitor-locations.png');
}

async function generateScreenshot2() {
  // Screenshot 2: Slots found
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Browser chrome -->
      <rect width="${width}" height="${height}" fill="#f5f5f5"/>
      <rect width="${width}" height="40" fill="#e0e0e0"/>
      <circle cx="20" cy="20" r="6" fill="#ff5f56"/>
      <circle cx="40" cy="20" r="6" fill="#ffbd2e"/>
      <circle cx="60" cy="20" r="6" fill="#27c93f"/>

      <!-- Extension popup -->
      <rect x="440" y="80" width="400" height="640" fill="${COLORS.background}" rx="8"/>
      <rect x="440" y="80" width="400" height="640" fill="none" stroke="${COLORS.border}" stroke-width="1"/>

      <!-- Header -->
      <rect x="440" y="80" width="400" height="60" fill="${COLORS.surface}"/>
      <text x="460" y="115" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${COLORS.text}">🔔 NEXUS Alert</text>

      <!-- Success banner -->
      <rect x="460" y="150" width="360" height="50" fill="${COLORS.success}" opacity="0.2" rx="6"/>
      <text x="640" y="180" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${COLORS.success}" text-anchor="middle">3 Slots Found!</text>

      <!-- Slot card 1 -->
      <rect x="460" y="220" width="360" height="120" fill="${COLORS.surface}" rx="8"/>
      <rect x="460" y="220" width="360" height="120" fill="none" stroke="${COLORS.success}" stroke-width="2" rx="8"/>
      <text x="470" y="245" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="${COLORS.text}">Blaine, WA</text>
      <text x="470" y="270" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">March 25, 2026 at 10:00 AM</text>
      <text x="470" y="290" font-family="Arial, sans-serif" font-size="12" fill="${COLORS.textMuted}">Available now</text>
      <rect x="470" y="305" width="340" height="28" fill="${COLORS.success}" rx="4"/>
      <text x="640" y="323" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">Book Now</text>

      <!-- Slot card 2 -->
      <rect x="460" y="360" width="360" height="120" fill="${COLORS.surface}" rx="8"/>
      <rect x="460" y="360" width="360" height="120" fill="none" stroke="${COLORS.success}" stroke-width="2" rx="8"/>
      <text x="470" y="385" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="${COLORS.text}">Peace Arch, WA</text>
      <text x="470" y="410" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">March 28, 2026 at 2:30 PM</text>
      <text x="470" y="430" font-family="Arial, sans-serif" font-size="12" fill="${COLORS.textMuted}">Available now</text>
      <rect x="470" y="445" width="340" height="28" fill="${COLORS.success}" rx="4"/>
      <text x="640" y="463" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">Book Now</text>

      <!-- Slot card 3 -->
      <rect x="460" y="500" width="360" height="120" fill="${COLORS.surface}" rx="8"/>
      <rect x="460" y="500" width="360" height="120" fill="none" stroke="${COLORS.success}" stroke-width="2" rx="8"/>
      <text x="470" y="525" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="${COLORS.text}">Buffalo-Fort Erie, NY</text>
      <text x="470" y="550" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">April 2, 2026 at 9:00 AM</text>
      <text x="470" y="570" font-family="Arial, sans-serif" font-size="12" fill="${COLORS.textMuted}">Available now</text>
      <rect x="470" y="585" width="340" height="28" fill="${COLORS.success}" rx="4"/>
      <text x="640" y="603" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">Book Now</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../store-assets/2-slots-found.png'));

  console.log('✓ Generated 2-slots-found.png');
}

async function generateScreenshot3() {
  // Screenshot 3: Settings page
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Browser chrome -->
      <rect width="${width}" height="${height}" fill="#f5f5f5"/>
      <rect width="${width}" height="40" fill="#e0e0e0"/>
      <circle cx="20" cy="20" r="6" fill="#ff5f56"/>
      <circle cx="40" cy="20" r="6" fill="#ffbd2e"/>
      <circle cx="60" cy="20" r="6" fill="#27c93f"/>

      <!-- Extension popup -->
      <rect x="440" y="80" width="400" height="640" fill="${COLORS.background}" rx="8"/>
      <rect x="440" y="80" width="400" height="640" fill="none" stroke="${COLORS.border}" stroke-width="1"/>

      <!-- Header -->
      <rect x="440" y="80" width="400" height="60" fill="${COLORS.surface}"/>
      <text x="460" y="115" font-family="Arial, sans-serif" font-size="18" font-weight="bold" fill="${COLORS.text}">🔔 NEXUS Alert</text>

      <!-- Tab -->
      <rect x="580" y="150" width="100" height="32" fill="${COLORS.primary}" rx="4"/>
      <text x="630" y="172" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}" text-anchor="middle">Settings</text>

      <!-- Settings section -->
      <text x="460" y="215" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="${COLORS.textMuted}">CHECK INTERVAL</text>

      <rect x="460" y="230" width="360" height="50" fill="${COLORS.surface}" rx="6"/>
      <circle cx="475" cy="255" r="6" fill="${COLORS.primary}"/>
      <text x="495" y="260" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}">Every 30 minutes (Free)</text>

      <rect x="460" y="290" width="360" height="50" fill="${COLORS.surface}" rx="6" opacity="0.5"/>
      <circle cx="475" cy="315" r="6" fill="${COLORS.border}"/>
      <text x="495" y="320" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">Every 2 minutes (Premium) 👑</text>

      <!-- Notifications -->
      <text x="460" y="375" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="${COLORS.textMuted}">NOTIFICATIONS</text>

      <rect x="460" y="390" width="360" height="40" fill="${COLORS.surface}" rx="6"/>
      <circle cx="475" cy="410" r="6" fill="${COLORS.success}"/>
      <text x="495" y="415" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}">Desktop notifications</text>

      <rect x="460" y="440" width="360" height="40" fill="${COLORS.surface}" rx="6"/>
      <circle cx="475" cy="460" r="6" fill="${COLORS.success}"/>
      <text x="495" y="465" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.text}">Sound alerts</text>

      <rect x="460" y="490" width="360" height="40" fill="${COLORS.surface}" rx="6" opacity="0.5"/>
      <circle cx="475" cy="510" r="6" fill="${COLORS.border}"/>
      <text x="495" y="515" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">Email alerts (Premium) 👑</text>

      <!-- Premium upgrade card -->
      <rect x="460" y="560" width="360" height="140" fill="${COLORS.primary}" opacity="0.1" rx="8"/>
      <rect x="460" y="560" width="360" height="140" fill="none" stroke="${COLORS.primary}" stroke-width="2" rx="8"/>
      <text x="640" y="590" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">Upgrade to Premium</text>
      <text x="640" y="615" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}" text-anchor="middle">Check every 2 minutes</text>
      <text x="640" y="635" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}" text-anchor="middle">Email &amp; SMS alerts</text>
      <rect x="520" y="650" width="240" height="35" fill="${COLORS.primary}" rx="4"/>
      <text x="640" y="673" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">$4.99/month</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../store-assets/3-settings-premium.png'));

  console.log('✓ Generated 3-settings-premium.png');
}

async function generateScreenshot4() {
  // Screenshot 4: Onboarding
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Browser chrome -->
      <rect width="${width}" height="${height}" fill="#f5f5f5"/>
      <rect width="${width}" height="40" fill="#e0e0e0"/>
      <circle cx="20" cy="20" r="6" fill="#ff5f56"/>
      <circle cx="40" cy="20" r="6" fill="#ffbd2e"/>
      <circle cx="60" cy="20" r="6" fill="#27c93f"/>
      <text x="100" y="27" font-family="Arial, sans-serif" font-size="13" fill="#666">chrome-extension://nexus-alert/onboarding.html</text>

      <!-- Page content -->
      <rect x="0" y="40" width="${width}" height="${height - 40}" fill="${COLORS.background}"/>

      <!-- Progress -->
      <rect x="340" y="100" width="600" height="4" fill="${COLORS.surface}" rx="2"/>
      <rect x="340" y="100" width="400" height="4" fill="${COLORS.primary}" rx="2"/>
      <text x="640" y="130" font-family="Arial, sans-serif" font-size="14" fill="${COLORS.textMuted}" text-anchor="middle">Step 2 of 3</text>

      <!-- Title -->
      <text x="640" y="180" font-family="Arial, sans-serif" font-size="32" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">Select Enrollment Centers</text>
      <text x="640" y="220" font-family="Arial, sans-serif" font-size="16" fill="${COLORS.textMuted}" text-anchor="middle">Choose the locations you want to monitor for appointments</text>

      <!-- Location cards -->
      <rect x="340" y="260" width="280" height="100" fill="${COLORS.surface}" rx="8"/>
      <rect x="340" y="260" width="280" height="100" fill="none" stroke="${COLORS.primary}" stroke-width="2" rx="8"/>
      <circle cx="360" cy="310" r="8" fill="${COLORS.primary}"/>
      <text x="385" y="300" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${COLORS.text}">Blaine, WA</text>
      <text x="385" y="325" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">Peace Arch Border Crossing</text>

      <rect x="660" y="260" width="280" height="100" fill="${COLORS.surface}" rx="8"/>
      <rect x="660" y="260" width="280" height="100" fill="none" stroke="${COLORS.primary}" stroke-width="2" rx="8"/>
      <circle cx="680" cy="310" r="8" fill="${COLORS.primary}"/>
      <text x="705" y="300" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${COLORS.text}">Buffalo-Fort Erie, NY</text>
      <text x="705" y="325" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">Rainbow Bridge Crossing</text>

      <rect x="340" y="380" width="280" height="100" fill="${COLORS.surface}" rx="8"/>
      <rect x="340" y="380" width="280" height="100" fill="none" stroke="${COLORS.border}" stroke-width="1" rx="8"/>
      <circle cx="360" cy="430" r="8" fill="${COLORS.border}"/>
      <text x="385" y="420" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${COLORS.text}">Detroit, MI</text>
      <text x="385" y="445" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">Detroit-Windsor Tunnel</text>

      <rect x="660" y="380" width="280" height="100" fill="${COLORS.surface}" rx="8"/>
      <rect x="660" y="380" width="280" height="100" fill="none" stroke="${COLORS.border}" stroke-width="1" rx="8"/>
      <circle cx="680" cy="430" r="8" fill="${COLORS.border}"/>
      <text x="705" y="420" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${COLORS.text}">Seattle, WA</text>
      <text x="705" y="445" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}">Enrollment Center</text>

      <!-- Continue button -->
      <rect x="490" y="620" width="300" height="50" fill="${COLORS.primary}" rx="8"/>
      <text x="640" y="652" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${COLORS.text}" text-anchor="middle">Continue to Settings</text>

      <text x="640" y="700" font-family="Arial, sans-serif" font-size="13" fill="${COLORS.textMuted}" text-anchor="middle">2 locations selected</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../store-assets/4-onboarding-step2.png'));

  console.log('✓ Generated 4-onboarding-step2.png');
}

async function generateScreenshot5() {
  // Screenshot 5: Notification
  const width = 1280;
  const height = 800;

  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <!-- Desktop background -->
      <defs>
        <linearGradient id="desktop" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#desktop)"/>

      <!-- macOS menu bar -->
      <rect width="${width}" height="28" fill="#000000" opacity="0.3"/>
      <text x="20" y="19" font-family="Arial, sans-serif" font-size="13" font-weight="bold" fill="#ffffff"></text>
      <text x="${width - 100}" y="19" font-family="Arial, sans-serif" font-size="12" fill="#ffffff">3:42 PM</text>

      <!-- Notification -->
      <rect x="880" y="50" width="380" height="140" fill="#ffffff" rx="12"/>
      <rect x="880" y="50" width="380" height="140" fill="none" stroke="#e0e0e0" stroke-width="1" rx="12"/>

      <!-- Notification icon -->
      <rect x="900" y="70" width="50" height="50" fill="${COLORS.primary}" rx="8"/>
      <text x="925" y="105" font-family="Arial, sans-serif" font-size="28" text-anchor="middle">🔔</text>

      <!-- Notification content -->
      <text x="970" y="85" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">NEXUS Alert</text>
      <text x="1240" y="85" font-family="Arial, sans-serif" font-size="11" fill="#999" text-anchor="end">now</text>

      <text x="970" y="110" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#000">Appointment Found!</text>
      <text x="970" y="133" font-family="Arial, sans-serif" font-size="13" fill="#666">Blaine, WA - March 25, 2026</text>
      <text x="970" y="153" font-family="Arial, sans-serif" font-size="13" fill="#666">10:00 AM slot now available</text>

      <!-- Action buttons -->
      <rect x="970" y="165" width="120" height="20" fill="${COLORS.success}" rx="4"/>
      <text x="1030" y="179" font-family="Arial, sans-serif" font-size="11" font-weight="bold" fill="#fff" text-anchor="middle">Book Now</text>

      <rect x="1100" y="165" width="80" height="20" fill="#f0f0f0" rx="4"/>
      <text x="1140" y="179" font-family="Arial, sans-serif" font-size="11" fill="#666" text-anchor="middle">Dismiss</text>
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile(path.join(__dirname, '../store-assets/5-notification.png'));

  console.log('✓ Generated 5-notification.png');
}

async function main() {
  console.log('Generating Chrome Web Store images...\n');

  try {
    await generateMarquee();
    await generateSmallTile();
    await generateScreenshot1();
    await generateScreenshot2();
    await generateScreenshot3();
    await generateScreenshot4();
    await generateScreenshot5();

    console.log('\n✓ All images generated successfully!');
    console.log('\nGenerated files:');
    console.log('  - store-assets/marquee-1400x560.png');
    console.log('  - store-assets/small-tile-440x280.png');
    console.log('  - store-assets/1-monitor-locations.png');
    console.log('  - store-assets/2-slots-found.png');
    console.log('  - store-assets/3-settings-premium.png');
    console.log('  - store-assets/4-onboarding-step2.png');
    console.log('  - store-assets/5-notification.png');
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

main();
