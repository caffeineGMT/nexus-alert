'use client';

import Link from 'next/link';
import { useState, useMemo } from 'react';
import HelpSearchBar from '../components/HelpSearchBar';

const articles = [
  // Installation (4 questions)
  {
    slug: 'how-to-install',
    title: 'How to install the extension',
    description: 'Step-by-step guide to installing NEXUS Alert from the Chrome Web Store',
    category: 'Installation',
  },
  {
    slug: 'browser-compatibility',
    title: 'Which browsers are supported?',
    description: 'Learn which browsers and versions work with NEXUS Alert',
    category: 'Installation',
  },
  {
    slug: 'extension-not-appearing',
    title: 'Extension icon not appearing in toolbar',
    description: 'Fix issues with the extension not showing up after installation',
    category: 'Installation',
  },
  {
    slug: 'uninstall-reinstall',
    title: 'How to uninstall or reinstall the extension',
    description: 'Complete guide to removing or reinstalling NEXUS Alert',
    category: 'Installation',
  },

  // Notifications (5 questions)
  {
    slug: 'why-no-notifications',
    title: 'Why am I not getting notifications?',
    description: 'Troubleshoot notification issues and ensure alerts are working properly',
    category: 'Notifications',
  },
  {
    slug: 'change-notification-preferences',
    title: 'How to change notification preferences',
    description: 'Customize sound alerts, desktop notifications, and email/SMS settings',
    category: 'Notifications',
  },
  {
    slug: 'notification-sound',
    title: 'How to enable or disable notification sounds',
    description: 'Manage audio alerts for appointment notifications',
    category: 'Notifications',
  },
  {
    slug: 'email-sms-setup',
    title: 'Setting up email and SMS alerts (Premium)',
    description: 'Configure email and text message notifications for Premium users',
    category: 'Notifications',
  },
  {
    slug: 'missed-notification',
    title: 'I missed a notification - can I see past alerts?',
    description: 'View notification history and past appointment slot alerts',
    category: 'Notifications',
  },

  // Billing (4 questions)
  {
    slug: 'upgrade-to-premium',
    title: 'How to upgrade to Premium',
    description: 'Upgrade to get faster checks (every 2 minutes) and SMS/email alerts',
    category: 'Billing',
  },
  {
    slug: 'cancel-subscription',
    title: 'How to cancel subscription',
    description: 'Manage or cancel your Premium subscription at any time',
    category: 'Billing',
  },
  {
    slug: 'billing-questions',
    title: 'Billing and payment methods',
    description: 'Accepted payment methods, billing cycles, and invoice access',
    category: 'Billing',
  },
  {
    slug: 'refund-policy',
    title: 'Refund and money-back guarantee',
    description: 'Learn about our refund policy and satisfaction guarantee',
    category: 'Billing',
  },

  // Troubleshooting (4 questions)
  {
    slug: 'extension-not-working',
    title: 'Extension stopped working or checking',
    description: 'Fix issues when monitoring stops or extension becomes unresponsive',
    category: 'Troubleshooting',
  },
  {
    slug: 'error-messages',
    title: 'Understanding error messages',
    description: 'Common error codes and how to resolve them',
    category: 'Troubleshooting',
  },
  {
    slug: 'slots-not-found',
    title: "Extension says 'no slots' but I see available appointments",
    description: 'Troubleshoot slot detection issues and sync problems',
    category: 'Troubleshooting',
  },
  {
    slug: 'performance-issues',
    title: 'Extension is slow or using too much memory',
    description: 'Optimize performance and reduce resource usage',
    category: 'Troubleshooting',
  },

  // Privacy (3 questions)
  {
    slug: 'data-privacy',
    title: 'What data does NEXUS Alert collect?',
    description: 'Learn about our privacy practices and data collection policies',
    category: 'Privacy',
  },
  {
    slug: 'data-security',
    title: 'How is my data secured?',
    description: 'Security measures and encryption used to protect your information',
    category: 'Privacy',
  },
  {
    slug: 'data-deletion',
    title: 'How to delete my data',
    description: 'Request permanent deletion of your account and personal data',
    category: 'Privacy',
  },

  // Features (3 questions)
  {
    slug: 'check-frequency',
    title: 'How often are slots checked?',
    description: 'Understand the difference between Free (30 min) and Premium (2 min) check intervals',
    category: 'Features',
  },
  {
    slug: 'monitor-multiple-locations',
    title: 'Can I monitor multiple locations?',
    description: 'Yes! Monitor as many enrollment centers as you want simultaneously',
    category: 'Features',
  },
  {
    slug: 'free-vs-premium',
    title: "What's the difference between Free and Premium?",
    description: 'Compare Free and Premium tier features and pricing',
    category: 'Features',
  },

  // Setup (1 question)
  {
    slug: 'select-enrollment-centers',
    title: 'How to select enrollment centers',
    description: 'Learn how to choose which NEXUS, Global Entry, or SENTRI locations to monitor',
    category: 'Setup',
  },
];

const categories = ['Installation', 'Notifications', 'Billing', 'Troubleshooting', 'Privacy', 'Features', 'Setup'];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredArticles = useMemo(() => {
    if (!searchQuery.trim()) return articles;

    const query = searchQuery.toLowerCase();
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.description.toLowerCase().includes(query) ||
        article.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const visibleCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories;
    return categories.filter((category) =>
      filteredArticles.some((article) => article.category === category)
    );
  }, [searchQuery, filteredArticles]);

  const highlightText = (text: string) => {
    if (!searchQuery.trim()) return text;

    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-blue-500/30 text-blue-300">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };
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

      {/* Hero */}
      <section className="py-16 text-center">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            How can we help you?
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            Browse our knowledge base for answers to common questions
          </p>

          {/* Search Bar */}
          <HelpSearchBar onSearch={setSearchQuery} />
        </div>
      </section>

      {/* Search Results Count */}
      {searchQuery && (
        <div className="container mx-auto px-4 max-w-5xl mb-4">
          <p className="text-gray-400">
            Found <span className="text-blue-400 font-semibold">{filteredArticles.length}</span>{' '}
            {filteredArticles.length === 1 ? 'article' : 'articles'} matching "{searchQuery}"
          </p>
        </div>
      )}

      {/* Knowledge Base Articles */}
      <section className="pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-xl text-gray-400 mb-6">
                No articles found matching "{searchQuery}"
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Clear Search
              </button>
            </div>
          ) : (
            visibleCategories.map((category) => {
              const categoryArticles = filteredArticles.filter((a) => a.category === category);
              if (categoryArticles.length === 0) return null;

              return (
                <div key={category} className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 text-blue-400">{category}</h2>
                  <div className="grid gap-4">
                    {categoryArticles.map((article) => (
                      <Link
                        key={article.slug}
                        href={`/help/${article.slug}`}
                        className="block bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:bg-gray-800 hover:border-blue-500 transition-all"
                      >
                        <h3 className="text-xl font-semibold mb-2">
                          {highlightText(article.title)}
                        </h3>
                        <p className="text-gray-400">{highlightText(article.description)}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Still Need Help */}
      <section className="py-12 bg-gray-900/50">
        <div className="container mx-auto px-4 text-center max-w-2xl">
          <h2 className="text-2xl font-bold mb-4">Still need help?</h2>
          <p className="text-gray-400 mb-6">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || 'help@nexus-alert.com'}`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Email Support
            </a>
            <button
              onClick={() => {
                // Trigger Crisp chat
                if (typeof window !== 'undefined' && (window as any).$crisp) {
                  (window as any).$crisp.push(['do', 'chat:open']);
                }
              }}
              className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Live Chat
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-6">
            We typically respond within 24 hours. Premium users get priority support.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <Link href="/" className="hover:text-blue-500 transition-colors">
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}
