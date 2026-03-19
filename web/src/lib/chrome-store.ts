/**
 * Chrome Web Store URL utilities
 * Handles extension installation links with fallback to install guide
 */

const EXTENSION_ID = process.env.NEXT_PUBLIC_CHROME_EXTENSION_ID || '';
const CHROME_WEB_STORE_BASE = 'https://chrome.google.com/webstore/detail/nexus-alert';
const INSTALL_GUIDE_FALLBACK = '/install-guide';

interface UTMParams {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
}

/**
 * Get Chrome Web Store installation URL
 * Returns /install-guide if extension ID is not set (not yet published)
 *
 * @param utmParams - Optional UTM tracking parameters
 * @returns Chrome Web Store URL or fallback URL
 */
export function getChromeStoreUrl(utmParams?: UTMParams): string {
  // If extension not yet published, return install guide
  if (!EXTENSION_ID) {
    return INSTALL_GUIDE_FALLBACK;
  }

  // Build Chrome Web Store URL
  const url = new URL(`${CHROME_WEB_STORE_BASE}/${EXTENSION_ID}`);

  // Add UTM parameters if provided
  if (utmParams) {
    if (utmParams.source) url.searchParams.set('utm_source', utmParams.source);
    if (utmParams.medium) url.searchParams.set('utm_medium', utmParams.medium);
    if (utmParams.campaign) url.searchParams.set('utm_campaign', utmParams.campaign);
    if (utmParams.content) url.searchParams.set('utm_content', utmParams.content);
  }

  return url.toString();
}

/**
 * Check if extension is published to Chrome Web Store
 */
export function isExtensionPublished(): boolean {
  return !!EXTENSION_ID && EXTENSION_ID.length === 32;
}

/**
 * Get install button text based on publication status
 */
export function getInstallButtonText(): string {
  return isExtensionPublished() ? 'Add to Chrome — Free' : 'Get Install Instructions';
}

/**
 * Determine if link should open in new tab
 * Chrome Web Store links open in new tab, install guide stays in same tab
 */
export function shouldOpenInNewTab(): boolean {
  return isExtensionPublished();
}
