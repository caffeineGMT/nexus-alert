import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

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
              <button
                onClick={() => {
                  if (typeof window !== 'undefined' && (window as any).$crisp) {
                    (window as any).$crisp.push(['do', 'chat:open']);
                  }
                }}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors text-sm"
              >
                Live Chat
              </button>
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
