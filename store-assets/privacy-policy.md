# Privacy Policy — NEXUS Alert

**Last updated:** March 10, 2026

## Overview

NEXUS Alert is a free, open-source Chrome extension that monitors appointment availability on the CBP Trusted Traveler Programs website (ttp.cbp.dhs.gov). Your privacy matters — this extension is designed to keep all your data local.

## What Data We Collect

**None.** NEXUS Alert does not collect, transmit, or store any personal data on external servers.

## What Data Is Stored Locally

The extension stores the following data in your browser's local storage (chrome.storage.local):

- **Your preferences:** Selected program, enrollment centers, date/time filters, polling interval, notification settings
- **Slot history:** A log of appointment slots discovered during monitoring, used to show statistics and avoid duplicate notifications
- **Cached location data:** Enrollment center names and addresses fetched from the CBP public API

This data never leaves your browser and is deleted when you uninstall the extension.

## External Services

The extension makes requests only to:

- **ttp.cbp.dhs.gov** — The official CBP Trusted Traveler Programs website, to check for available appointment slots and fetch enrollment center information. This is a public API that does not require authentication.

No other external services, analytics platforms, or third-party servers are contacted.

## Permissions

- **alarms** — Schedule periodic slot checks
- **notifications** — Show desktop notifications when slots are found
- **storage** — Save your preferences and slot history locally
- **offscreen** — Play sound alerts when new slots appear
- **host_permissions (ttp.cbp.dhs.gov)** — Access the CBP scheduler API to check for available slots

## Open Source

The complete source code is available at: https://github.com/caffeineGMT/nexus-alert

## Contact

For questions about this privacy policy, please open an issue on GitHub: https://github.com/caffeineGMT/nexus-alert/issues

## Changes

Any changes to this privacy policy will be reflected in the GitHub repository and this document will be updated accordingly.
