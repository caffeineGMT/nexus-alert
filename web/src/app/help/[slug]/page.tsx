import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import CrispChatButton from '@/app/components/CrispChatButton';

type Article = {
  slug: string;
  title: string;
  category: string;
  content: {
    intro: string;
    sections: { heading: string; content: string }[];
  };
};

const articles: Record<string, Article> = {
  'how-to-install': {
    slug: 'how-to-install',
    title: 'How to install the extension',
    category: 'Getting Started',
    content: {
      intro:
        'Installing NEXUS Alert is quick and easy. Follow these steps to get started monitoring appointment slots.',
      sections: [
        {
          heading: '1. Open the Chrome Web Store',
          content:
            'Visit the Chrome Web Store at <a href="https://chrome.google.com/webstore" class="text-blue-400 hover:underline">chrome.google.com/webstore</a> and search for "NEXUS Alert" or click the install button on our homepage.',
        },
        {
          heading: '2. Add to Chrome',
          content:
            'Click the blue "Add to Chrome" button in the top-right corner of the extension page.',
        },
        {
          heading: '3. Confirm Installation',
          content:
            'A popup will appear asking you to confirm. Click "Add extension" to proceed with the installation.',
        },
        {
          heading: '4. Pin the Extension',
          content:
            'After installation, click the puzzle icon in your Chrome toolbar, find NEXUS Alert, and click the pin icon to keep it easily accessible.',
        },
        {
          heading: '5. Complete Onboarding',
          content:
            'The extension will automatically open an onboarding page. Follow the prompts to select your preferred enrollment centers and configure your notification preferences.',
        },
      ],
    },
  },
  'select-enrollment-centers': {
    slug: 'select-enrollment-centers',
    title: 'How to select enrollment centers',
    category: 'Setup',
    content: {
      intro:
        'Choose which NEXUS, Global Entry, or SENTRI enrollment centers you want to monitor for available appointments.',
      sections: [
        {
          heading: 'Opening Settings',
          content:
            'Click the NEXUS Alert extension icon in your Chrome toolbar, then click the gear icon in the top-right to open Settings.',
        },
        {
          heading: 'Selecting Locations',
          content:
            'Under "Enrollment Centers," browse the list or use the search box to find specific locations. Check the boxes next to the centers you want to monitor. You can select multiple locations simultaneously.',
        },
        {
          heading: 'Program Filtering',
          content:
            'Use the program filter (NEXUS / Global Entry / SENTRI) to show only centers that support your specific program.',
        },
        {
          heading: 'Popular Locations',
          content:
            'Common locations include: Blaine WA, Seattle WA, Buffalo NY, Detroit MI, San Francisco CA, Toronto ON, Vancouver BC, and Montreal QC.',
        },
        {
          heading: 'Saving Changes',
          content:
            'Your selections are automatically saved. The extension will immediately begin monitoring your chosen locations.',
        },
      ],
    },
  },
  'upgrade-to-premium': {
    slug: 'upgrade-to-premium',
    title: 'How to upgrade to Premium',
    category: 'Premium',
    content: {
      intro:
        'Upgrade to Premium for faster slot checks (every 2 minutes instead of 30), email notifications, and SMS alerts.',
      sections: [
        {
          heading: 'From the Extension',
          content:
            'Click the NEXUS Alert icon, then click the "Upgrade to Premium" banner at the top of the popup.',
        },
        {
          heading: 'From the Website',
          content:
            'Visit <a href="https://nexus-alert.com" class="text-blue-400 hover:underline">nexus-alert.com</a> and click "Upgrade to Premium" in the navigation or scroll to the pricing section.',
        },
        {
          heading: 'Choose Your Plan',
          content:
            'Select either the Monthly plan ($4.99/mo) or Annual plan ($49.99/yr, save 17%). Annual subscribers get 2 months free.',
        },
        {
          heading: 'Enter Payment Details',
          content:
            'You\'ll be redirected to Stripe\'s secure checkout. Enter your payment information and email address.',
        },
        {
          heading: 'Instant Activation',
          content:
            'After payment, your Premium features activate immediately. The extension will automatically start checking every 2 minutes, and you can configure email/SMS alerts in Settings.',
        },
      ],
    },
  },
  'cancel-subscription': {
    slug: 'cancel-subscription',
    title: 'How to cancel subscription',
    category: 'Premium',
    content: {
      intro:
        'You can cancel your Premium subscription at any time. You\'ll retain Premium features until the end of your current billing period.',
      sections: [
        {
          heading: 'Via Stripe Customer Portal',
          content:
            'Click the "Manage Subscription" link in any of your billing emails from NEXUS Alert, or visit the Stripe Customer Portal link we provide after signup.',
        },
        {
          heading: 'Cancellation Process',
          content:
            'In the customer portal, click "Cancel subscription" and follow the prompts. You\'ll be asked to provide optional feedback about why you\'re canceling.',
        },
        {
          heading: 'Access Until Period End',
          content:
            'After canceling, you\'ll continue to have Premium access until the end of your current billing period. For example, if you cancel on January 15th but paid for the month on January 1st, you\'ll have Premium until January 31st.',
        },
        {
          heading: 'Downgrade to Free',
          content:
            'Once your billing period ends, your account will automatically downgrade to the Free tier (30-minute checks, browser notifications only).',
        },
        {
          heading: 'Reactivating',
          content:
            'You can resubscribe at any time by clicking "Upgrade to Premium" again. Your previous preferences will be saved.',
        },
      ],
    },
  },
  'why-no-notifications': {
    slug: 'why-no-notifications',
    title: 'Why am I not getting notifications?',
    category: 'Troubleshooting',
    content: {
      intro:
        'If you\'re not receiving notifications when slots become available, try these troubleshooting steps.',
      sections: [
        {
          heading: 'Check Browser Permissions',
          content:
            'Visit chrome://settings/content/notifications and ensure nexus-alert.com and the extension are allowed to send notifications. If blocked, change the setting to "Allow."',
        },
        {
          heading: 'Verify Extension is Running',
          content:
            'Click the extension icon and ensure "Monitoring Enabled" is toggled ON. If it shows as disabled, click the toggle to activate monitoring.',
        },
        {
          heading: 'Check Notification Settings',
          content:
            'In extension Settings, verify that "Desktop Notifications" is enabled. For Premium users, also check that email/SMS settings are configured with a valid email address or phone number.',
        },
        {
          heading: 'Sound Alerts',
          content:
            'If you want sound alerts, make sure "Play sound on slot found" is enabled in Settings. Note: Chrome may block sound if you haven\'t interacted with the page recently.',
        },
        {
          heading: 'Free Tier Check Frequency',
          content:
            'Free users: slots are checked every 30 minutes. If a slot appears and gets booked within that window, you may miss it. Consider upgrading to Premium (2-minute checks) for better coverage.',
        },
        {
          heading: 'Check Slot History',
          content:
            'Click "View History" in the extension popup to see if any slots were found but you missed the notification. If slots appear in history but you didn\'t receive an alert, it\'s a notification settings issue.',
        },
      ],
    },
  },
  'data-privacy': {
    slug: 'data-privacy',
    title: 'What data does NEXUS Alert collect?',
    category: 'Privacy',
    content: {
      intro:
        'We take your privacy seriously. Here\'s exactly what data we collect and why.',
      sections: [
        {
          heading: 'Extension Data (Local Storage)',
          content:
            'Your selected enrollment centers, notification preferences, and slot history are stored locally in your browser using Chrome\'s storage API. This data never leaves your device unless you upgrade to Premium.',
        },
        {
          heading: 'Premium Account Data',
          content:
            'When you upgrade to Premium, we store your email address and selected enrollment centers on our secure Cloudflare Workers backend to enable email/SMS notifications. Your payment information is handled securely by Stripe and never touches our servers.',
        },
        {
          heading: 'Anonymous Analytics',
          content:
            'We collect anonymous usage data (e.g., number of active users, popular enrollment centers) to improve the extension. This data cannot be linked back to individual users.',
        },
        {
          heading: 'No Browsing History',
          content:
            'We do NOT track your browsing history, visited websites, or any activity outside of the NEXUS Alert extension.',
        },
        {
          heading: 'Third-Party Services',
          content:
            'We use Stripe for payment processing, Resend for email delivery, and Twilio for SMS (Premium only). Each service has its own privacy policy and is GDPR-compliant.',
        },
        {
          heading: 'Data Deletion',
          content:
            'You can request deletion of your data at any time by emailing help@nexus-alert.com. Premium users can also unsubscribe via the link in any email, which will delete all stored data within 30 days.',
        },
      ],
    },
  },
  'check-frequency': {
    slug: 'check-frequency',
    title: 'How often are slots checked?',
    category: 'Features',
    content: {
      intro:
        'The check frequency depends on whether you\'re using the Free or Premium tier.',
      sections: [
        {
          heading: 'Free Tier: Every 30 Minutes',
          content:
            'Free users get slot checks every 30 minutes. This is sufficient for most users, but slots can appear and disappear quickly during peak times.',
        },
        {
          heading: 'Premium Tier: Every 2 Minutes',
          content:
            'Premium subscribers get checks every 2 minutes, giving you a much better chance of catching slots before others. This 15x faster checking is one of the main benefits of upgrading.',
        },
        {
          heading: 'Why Not Faster?',
          content:
            'We intentionally limit check frequency to avoid overloading the CBP API servers. Faster checks could result in IP bans or service degradation for all users.',
        },
        {
          heading: 'Backoff on Errors',
          content:
            'If the CBP API returns errors, the extension will automatically slow down checks temporarily to avoid repeated failures. Once the API recovers, normal frequency resumes.',
        },
        {
          heading: 'Manual Check',
          content:
            'You can manually trigger a check at any time by clicking the "Check Now" button in the extension popup, regardless of your tier.',
        },
      ],
    },
  },
  'monitor-multiple-locations': {
    slug: 'monitor-multiple-locations',
    title: 'Can I monitor multiple locations?',
    category: 'Features',
    content: {
      intro:
        'Yes! Both Free and Premium users can monitor as many enrollment centers as they want.',
      sections: [
        {
          heading: 'Unlimited Locations',
          content:
            'There is no limit to the number of enrollment centers you can monitor simultaneously. Select as many as you need in Settings.',
        },
        {
          heading: 'Cross-Program Monitoring',
          content:
            'You can monitor NEXUS, Global Entry, and SENTRI centers at the same time. The extension will check all selected locations during each check cycle.',
        },
        {
          heading: 'Smart Notifications',
          content:
            'When a slot is found at any of your selected locations, you\'ll receive a notification that includes the location name, date, and time.',
        },
        {
          heading: 'Performance Impact',
          content:
            'Monitoring many locations (e.g., 10+) will slightly increase the time each check cycle takes, but should not significantly affect performance. The extension checks locations sequentially to respect API rate limits.',
        },
        {
          heading: 'Recommended Strategy',
          content:
            'For best results, select 3-5 locations within a reasonable travel distance. This gives you flexibility while keeping check times fast.',
        },
      ],
    },
  },
  'free-vs-premium': {
    slug: 'free-vs-premium',
    title: "What's the difference between Free and Premium?",
    category: 'Premium',
    content: {
      intro: 'Compare the features of our Free and Premium tiers to choose the right plan for you.',
      sections: [
        {
          heading: 'Free Tier Features',
          content:
            '<ul class="list-disc list-inside space-y-2"><li>Slot checks every 30 minutes</li><li>Desktop browser notifications</li><li>Monitor unlimited locations</li><li>NEXUS, Global Entry, and SENTRI support</li><li>Slot history tracking</li><li>Date and time range filtering</li></ul>',
        },
        {
          heading: 'Premium Tier Features ($4.99/mo)',
          content:
            '<ul class="list-disc list-inside space-y-2"><li>Slot checks every 2 minutes (15x faster)</li><li>Email notifications</li><li>SMS text alerts (optional)</li><li>Priority support</li><li>All Free tier features included</li></ul>',
        },
        {
          heading: 'Annual Plan Discount',
          content:
            'Pay annually ($49.99/year) and save 17% compared to monthly billing. That\'s 2 months free!',
        },
        {
          heading: 'Who Should Upgrade?',
          content:
            'Premium is worth it if: (1) You need faster alerts in competitive markets, (2) You want email/SMS so you don\'t miss notifications while away from your computer, or (3) Your appointment is time-sensitive (expiring passport, urgent travel).',
        },
        {
          heading: 'Try Free First',
          content:
            'Start with the Free tier to see if it meets your needs. You can upgrade to Premium at any time with instant activation.',
        },
      ],
    },
  },
  'change-notification-preferences': {
    slug: 'change-notification-preferences',
    title: 'How to change notification preferences',
    category: 'Settings',
    content: {
      intro:
        'Customize how you receive notifications about available appointment slots.',
      sections: [
        {
          heading: 'Desktop Notifications',
          content:
            'Open Settings and toggle "Desktop Notifications" on/off. When enabled, you\'ll see Chrome notifications when slots are found. Make sure Chrome notifications are allowed in your OS settings.',
        },
        {
          heading: 'Sound Alerts',
          content:
            'Toggle "Play sound on slot found" to enable/disable audio alerts. The sound only plays when the extension popup or a Chrome tab is active.',
        },
        {
          heading: 'Auto-Open Booking Page',
          content:
            'Enable "Automatically open booking page" to have Chrome open https://ttp.cbp.dhs.gov/ in a new tab when a slot is found. This saves time but may be disruptive if you have many tabs open.',
        },
        {
          heading: 'Email Notifications (Premium)',
          content:
            'Premium users: enter your email address in Settings to receive email alerts. Emails are sent via Resend and include slot details with a direct link to book.',
        },
        {
          heading: 'SMS Alerts (Premium)',
          content:
            'Premium users: enter your phone number in E.164 format (e.g., +16045551234) to receive SMS alerts via Twilio. SMS is optional and can be disabled by leaving the field empty.',
        },
        {
          heading: 'Testing Notifications',
          content:
            'After changing settings, click "Check Now" to trigger a manual check. If slots are found, you\'ll receive notifications according to your preferences.',
        },
      ],
    },
  },
  'browser-compatibility': {
    slug: 'browser-compatibility',
    title: 'Which browsers are supported?',
    category: 'Installation',
    content: {
      intro: 'NEXUS Alert is built for Chromium-based browsers and has specific version requirements.',
      sections: [
        {
          heading: 'Supported Browsers',
          content:
            '<ul class="list-disc list-inside space-y-2"><li>Google Chrome (version 88+)</li><li>Microsoft Edge (version 88+)</li><li>Brave Browser (version 1.20+)</li><li>Opera (version 74+)</li><li>Vivaldi (version 3.6+)</li></ul>',
        },
        {
          heading: 'Unsupported Browsers',
          content:
            'Firefox and Safari are NOT supported because they use different extension APIs (WebExtensions vs Chrome Extensions Manifest V3). We may add Firefox support in the future.',
        },
        {
          heading: 'Checking Your Browser Version',
          content:
            'In Chrome, go to Settings → About Chrome to see your version number. In Edge, go to Settings → About Microsoft Edge. Make sure you\'re on the latest version for best performance.',
        },
        {
          heading: 'Mobile Support',
          content:
            'Chrome extensions are not supported on mobile browsers (iOS/Android). You must use a desktop or laptop computer.',
        },
      ],
    },
  },
  'extension-not-appearing': {
    slug: 'extension-not-appearing',
    title: 'Extension icon not appearing in toolbar',
    category: 'Installation',
    content: {
      intro: 'If you installed NEXUS Alert but don\'t see the icon in your toolbar, try these steps.',
      sections: [
        {
          heading: 'Pin the Extension',
          content:
            'Click the puzzle icon (Extensions) in your Chrome toolbar, find NEXUS Alert in the list, and click the pin icon next to it. The icon should now appear in your main toolbar.',
        },
        {
          heading: 'Verify Installation',
          content:
            'Go to chrome://extensions in your address bar and verify that NEXUS Alert appears in the list and is enabled (toggle should be blue/on).',
        },
        {
          heading: 'Restart Chrome',
          content:
            'Sometimes extensions don\'t fully load until you restart the browser. Close all Chrome windows completely and reopen Chrome.',
        },
        {
          heading: 'Reinstall the Extension',
          content:
            'If the above steps don\'t work, try uninstalling and reinstalling. Go to chrome://extensions, find NEXUS Alert, click "Remove," then reinstall from the Chrome Web Store.',
        },
      ],
    },
  },
  'uninstall-reinstall': {
    slug: 'uninstall-reinstall',
    title: 'How to uninstall or reinstall the extension',
    category: 'Installation',
    content: {
      intro: 'Complete guide to removing NEXUS Alert from your browser or reinstalling it.',
      sections: [
        {
          heading: 'Uninstalling via Chrome',
          content:
            'Method 1: Right-click the NEXUS Alert icon in your toolbar and select "Remove from Chrome." Method 2: Go to chrome://extensions, find NEXUS Alert, and click the "Remove" button.',
        },
        {
          heading: 'What Happens to Your Data',
          content:
            'Uninstalling the extension will delete all local data (selected locations, notification preferences, slot history). If you\'re a Premium user, your subscription will remain active. Cancel it via the Stripe Customer Portal if you no longer need it.',
        },
        {
          heading: 'Reinstalling',
          content:
            'To reinstall, visit the Chrome Web Store and search for "NEXUS Alert" or click the install link on our homepage at <a href="https://nexus-alert.com" class="text-blue-400 hover:underline">nexus-alert.com</a>. Follow the installation steps again.',
        },
        {
          heading: 'Preserving Your Settings',
          content:
            'Unfortunately, Chrome doesn\'t sync extension data across devices or reinstallations. You\'ll need to reconfigure your enrollment centers and notification preferences after reinstalling. Premium users: your license key will still work.',
        },
      ],
    },
  },
  'notification-sound': {
    slug: 'notification-sound',
    title: 'How to enable or disable notification sounds',
    category: 'Notifications',
    content: {
      intro: 'Manage audio alerts that play when appointment slots are detected.',
      sections: [
        {
          heading: 'Enabling Sound Alerts',
          content:
            'Click the NEXUS Alert icon, go to Settings, and toggle "Play sound on slot found" to ON. The extension will play a notification sound when a slot is detected.',
        },
        {
          heading: 'Browser Autoplay Policy',
          content:
            'Chrome blocks autoplay audio on sites you haven\'t interacted with. If sound isn\'t working, click anywhere on the page or popup first, then try triggering a notification.',
        },
        {
          heading: 'Adjusting Volume',
          content:
            'Use your system volume controls to adjust the notification sound level. The extension uses the default system notification sound and cannot be customized separately.',
        },
        {
          heading: 'Silent Mode',
          content:
            'Toggle "Play sound on slot found" to OFF if you want visual notifications only (desktop notifications, emails, SMS) without audio alerts.',
        },
      ],
    },
  },
  'email-sms-setup': {
    slug: 'email-sms-setup',
    title: 'Setting up email and SMS alerts (Premium)',
    category: 'Notifications',
    content: {
      intro: 'Premium users can receive email and SMS notifications in addition to browser alerts.',
      sections: [
        {
          heading: 'Email Setup',
          content:
            'In Settings, enter your email address in the "Email Notifications" field. Make sure to use an address you check regularly. Emails are sent via Resend and include slot details with a direct booking link.',
        },
        {
          heading: 'SMS Setup',
          content:
            'Enter your phone number in E.164 format (e.g., +16045551234 for US/Canada). Include the country code (+1) and area code. SMS messages are sent via Twilio.',
        },
        {
          heading: 'Verification',
          content:
            'After saving, click "Check Now" to trigger a test check. If slots are found, you should receive notifications via all configured channels (browser, email, SMS).',
        },
        {
          heading: 'Delivery Times',
          content:
            'Email and SMS alerts are usually delivered within 10-30 seconds of slot detection. Delays may occur during high-traffic periods.',
        },
        {
          heading: 'Opting Out',
          content:
            'To disable email or SMS, simply clear the respective field in Settings and save. You can re-enable at any time.',
        },
      ],
    },
  },
  'missed-notification': {
    slug: 'missed-notification',
    title: 'I missed a notification - can I see past alerts?',
    category: 'Notifications',
    content: {
      intro: 'View notification history and past appointment slot alerts.',
      sections: [
        {
          heading: 'Viewing Slot History',
          content:
            'Click the NEXUS Alert icon and select "View History" at the bottom of the popup. This shows all slots detected in the past 30 days, including date, time, location, and program.',
        },
        {
          heading: 'Checking Email History',
          content:
            'Premium users: search your email inbox for messages from help@nexus-alert.com. All slot notifications are archived in your email.',
        },
        {
          heading: 'Why You Might Miss Notifications',
          content:
            'Browser notifications can be dismissed accidentally or hidden by other apps. Enable email/SMS (Premium) for redundancy. Free users: slots may appear and disappear between 30-minute check cycles.',
        },
        {
          heading: 'Re-Enabling Notifications',
          content:
            'If you\'ve disabled notifications, go to chrome://settings/content/notifications and ensure nexus-alert.com is set to "Allow."',
        },
      ],
    },
  },
  'billing-questions': {
    slug: 'billing-questions',
    title: 'Billing and payment methods',
    category: 'Billing',
    content: {
      intro: 'Accepted payment methods, billing cycles, and invoice access.',
      sections: [
        {
          heading: 'Accepted Payment Methods',
          content:
            'We accept all major credit and debit cards (Visa, Mastercard, Amex, Discover) via Stripe. Digital wallets (Apple Pay, Google Pay) are also supported.',
        },
        {
          heading: 'Billing Cycles',
          content:
            'Monthly subscriptions renew on the same day each month (e.g., if you subscribe on Jan 15, you\'ll be charged on the 15th of each month). Annual subscriptions renew yearly.',
        },
        {
          heading: 'Viewing Invoices',
          content:
            'After each payment, you\'ll receive an email receipt from Stripe. You can also access invoices via the Stripe Customer Portal (link provided in billing emails).',
        },
        {
          heading: 'Updating Payment Method',
          content:
            'Visit the Stripe Customer Portal to update your card, billing address, or payment method. Changes take effect immediately.',
        },
        {
          heading: 'Failed Payments',
          content:
            'If a payment fails, we\'ll retry 3 times over 7 days. You\'ll receive email notifications. If all retries fail, your subscription will be canceled and you\'ll downgrade to Free tier.',
        },
      ],
    },
  },
  'refund-policy': {
    slug: 'refund-policy',
    title: 'Refund and money-back guarantee',
    category: 'Billing',
    content: {
      intro: 'Learn about our refund policy and satisfaction guarantee.',
      sections: [
        {
          heading: '30-Day Money-Back Guarantee',
          content:
            'We offer a full refund within 30 days of your first payment if you\'re not satisfied. Email help@nexus-alert.com with your request.',
        },
        {
          heading: 'Partial Refunds',
          content:
            'Refunds for subsequent billing cycles are not guaranteed but will be considered on a case-by-case basis. We do not offer prorated refunds for mid-cycle cancellations.',
        },
        {
          heading: 'Refund Processing Time',
          content:
            'Approved refunds are processed via Stripe and typically appear in your account within 5-10 business days, depending on your bank.',
        },
        {
          heading: 'Abuse Prevention',
          content:
            'We reserve the right to deny refunds if there\'s evidence of abuse (e.g., repeatedly signing up and canceling for refunds).',
        },
      ],
    },
  },
  'extension-not-working': {
    slug: 'extension-not-working',
    title: 'Extension stopped working or checking',
    category: 'Troubleshooting',
    content: {
      intro: 'Fix issues when monitoring stops or the extension becomes unresponsive.',
      sections: [
        {
          heading: 'Verify Monitoring is Enabled',
          content:
            'Click the extension icon and check that the "Monitoring Enabled" toggle is ON. If it\'s OFF, click it to resume monitoring.',
        },
        {
          heading: 'Check for Extension Updates',
          content:
            'Go to chrome://extensions and click "Update" at the top. Outdated versions may have bugs or API compatibility issues.',
        },
        {
          heading: 'Clear Extension Cache',
          content:
            'Go to chrome://extensions, find NEXUS Alert, and click "Details." Scroll down and click "Clear storage." This resets the extension without losing your settings.',
        },
        {
          heading: 'Restart Chrome',
          content:
            'Close all Chrome windows completely and reopen. This often resolves memory leaks or background script crashes.',
        },
        {
          heading: 'Reinstall the Extension',
          content:
            'If none of the above work, uninstall and reinstall NEXUS Alert. You\'ll need to reconfigure your settings.',
        },
      ],
    },
  },
  'error-messages': {
    slug: 'error-messages',
    title: 'Understanding error messages',
    category: 'Troubleshooting',
    content: {
      intro: 'Common error codes and how to resolve them.',
      sections: [
        {
          heading: 'API Rate Limit Error',
          content:
            'Message: "Too many requests. Please wait." This means the CBP API has temporarily blocked your IP due to too many requests. Wait 30 minutes and try again. Premium users have higher rate limits.',
        },
        {
          heading: 'Network Error',
          content:
            'Message: "Unable to reach CBP servers." Check your internet connection. If you\'re on a corporate network or VPN, CBP may block the connection. Try switching networks.',
        },
        {
          heading: 'Invalid Location Error',
          content:
            'Message: "Selected location is no longer available." This means the enrollment center has closed or changed IDs. Update your selected locations in Settings.',
        },
        {
          heading: 'Notification Permission Error',
          content:
            'Message: "Notification permissions denied." Go to chrome://settings/content/notifications and allow notifications for nexus-alert.com.',
        },
      ],
    },
  },
  'slots-not-found': {
    slug: 'slots-not-found',
    title: "Extension says 'no slots' but I see available appointments",
    category: 'Troubleshooting',
    content: {
      intro: 'Troubleshoot slot detection issues and sync problems.',
      sections: [
        {
          heading: 'Verify Location Match',
          content:
            'Make sure the enrollment center you\'re viewing on ttp.cbp.dhs.gov exactly matches one of your selected locations in Settings. Nearby locations may have different slot availability.',
        },
        {
          heading: 'Date Range Filtering',
          content:
            'Check your date range settings. If you\'ve set a date filter (e.g., "only show slots after June 1"), slots outside that range won\'t trigger notifications.',
        },
        {
          heading: 'Check Interval Timing',
          content:
            'Free users: slots are checked every 30 minutes. A slot may have appeared after your last check. Click "Check Now" to force an immediate check.',
        },
        {
          heading: 'Clear Cache and Retry',
          content:
            'Go to chrome://extensions, find NEXUS Alert, click "Details," and clear storage. Then click "Check Now" to refresh data.',
        },
      ],
    },
  },
  'performance-issues': {
    slug: 'performance-issues',
    title: 'Extension is slow or using too much memory',
    category: 'Troubleshooting',
    content: {
      intro: 'Optimize performance and reduce resource usage.',
      sections: [
        {
          heading: 'Reduce Number of Monitored Locations',
          content:
            'Monitoring 10+ locations simultaneously increases CPU/memory usage. Consider reducing to 3-5 locations that are most convenient for you.',
        },
        {
          heading: 'Clear Slot History',
          content:
            'Old slot history accumulates and can slow down the extension. Click "Clear History" in Settings to remove old data (keeps last 7 days).',
        },
        {
          heading: 'Disable Other Extensions',
          content:
            'If you have many Chrome extensions running, they can conflict or compete for resources. Try disabling unnecessary extensions.',
        },
        {
          heading: 'Check System Resources',
          content:
            'Open Chrome\'s Task Manager (Shift+Esc) to see resource usage. If NEXUS Alert is using excessive memory (>100MB), restart Chrome or reinstall the extension.',
        },
      ],
    },
  },
  'data-security': {
    slug: 'data-security',
    title: 'How is my data secured?',
    category: 'Privacy',
    content: {
      intro: 'Security measures and encryption used to protect your information.',
      sections: [
        {
          heading: 'Data Encryption',
          content:
            'All data transmitted between the extension and our backend is encrypted using HTTPS/TLS 1.3. Your email, phone number, and payment information are never stored in plain text.',
        },
        {
          heading: 'Cloudflare Workers Backend',
          content:
            'Premium user data is stored on Cloudflare Workers KV, a globally distributed edge storage system with automatic encryption at rest and DDoS protection.',
        },
        {
          heading: 'Payment Security',
          content:
            'All payment processing is handled by Stripe, a PCI DSS Level 1 certified provider. We never see or store your full credit card number.',
        },
        {
          heading: 'Third-Party Services',
          content:
            'Email delivery (Resend) and SMS (Twilio) are GDPR-compliant and SOC 2 certified. They only receive data necessary for delivery (email address, phone number, message content).',
        },
        {
          heading: 'No Password Storage',
          content:
            'NEXUS Alert does not require account creation or passwords. Premium users are identified by license keys tied to their Stripe subscription.',
        },
      ],
    },
  },
  'data-deletion': {
    slug: 'data-deletion',
    title: 'How to delete my data',
    category: 'Privacy',
    content: {
      intro: 'Request permanent deletion of your account and personal data.',
      sections: [
        {
          heading: 'Free Tier Users',
          content:
            'Free tier data is stored locally in your browser only. To delete, simply uninstall the extension. No server-side data exists.',
        },
        {
          heading: 'Premium Users',
          content:
            'Email help@nexus-alert.com with the subject "Data Deletion Request" and include the email address associated with your subscription. We\'ll delete all server-side data within 30 days.',
        },
        {
          heading: 'What Gets Deleted',
          content:
            'Your email address, phone number (if provided), selected enrollment centers, notification history, and any analytics tied to your account.',
        },
        {
          heading: 'Billing Records',
          content:
            'We\'re required to retain billing records (invoices, transaction IDs) for tax/legal compliance for up to 7 years. However, personally identifiable information in those records can be anonymized upon request.',
        },
        {
          heading: 'Reactivating After Deletion',
          content:
            'After data deletion, you can always re-subscribe and start fresh. Your previous settings and history will not be recoverable.',
        },
      ],
    },
  },
};

export async function generateStaticParams() {
  return Object.keys(articles).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = articles[params.slug];

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} - NEXUS Alert Help`,
    description: article.content.intro,
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles[params.slug];

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <Link href="/" className="text-2xl font-bold text-blue-500">
            NEXUS Alert
          </Link>
        </div>
      </header>

      {/* Breadcrumbs */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-3 flex gap-2 text-sm text-gray-400">
          <Link href="/help" className="hover:text-blue-400">
            Help Center
          </Link>
          <span>/</span>
          <span className="text-gray-300">{article.title}</span>
        </div>
      </nav>

      {/* Article */}
      <article className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="mb-4">
            <span className="inline-block bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
              {article.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {article.title}
          </h1>

          <p className="text-xl text-gray-300 mb-12 leading-relaxed">
            {article.content.intro}
          </p>

          <div className="space-y-8">
            {article.content.sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="text-2xl font-semibold mb-4 text-blue-400">
                  {section.heading}
                </h2>
                <div
                  className="text-gray-300 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
          </div>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t border-gray-800">
            <h3 className="text-xl font-semibold mb-4">Related Articles</h3>
            <div className="grid gap-3">
              {Object.values(articles)
                .filter(
                  (a) =>
                    a.category === article.category && a.slug !== article.slug
                )
                .slice(0, 3)
                .map((related) => (
                  <Link
                    key={related.slug}
                    href={`/help/${related.slug}`}
                    className="block bg-gray-800/30 border border-gray-700 rounded-lg p-4 hover:bg-gray-800 hover:border-blue-500 transition-all"
                  >
                    <h4 className="font-semibold mb-1">{related.title}</h4>
                    <p className="text-sm text-gray-400">
                      {related.content.intro}
                    </p>
                  </Link>
                ))}
            </div>
          </div>

          {/* Contact Support */}
          <div className="mt-12 bg-blue-600/10 border border-blue-500/30 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
            <p className="text-gray-300 mb-4">
              Our support team is here to answer any questions.
            </p>
            <div className="flex gap-3">
              <a
                href="mailto:help@nexus-alert.com"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                Email Support
              </a>
              <CrispChatButton />
            </div>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/help"
            className="text-gray-400 hover:text-blue-500 transition-colors"
          >
            ← Back to Help Center
          </Link>
        </div>
      </footer>
    </div>
  );
}
