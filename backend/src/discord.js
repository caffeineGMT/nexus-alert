/**
 * Discord Integration for NEXUS Alert Backend
 *
 * Sends notifications to Discord when:
 * - New premium user signs up
 * - User joins Discord community
 * - Referral conversion happens
 * - Community milestones reached
 */

const DISCORD_COLORS = {
  SUCCESS: 0x22c55e,
  INFO: 0x3b82f6,
  WARNING: 0xeab308,
  ERROR: 0xef4444,
  DISCORD: 0x5865F2,
};

/**
 * Send Discord webhook notification
 */
export async function sendDiscordNotification(webhookUrl, payload) {
  if (!webhookUrl) {
    console.warn('[Discord] Webhook URL not configured');
    return;
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('[Discord] Webhook failed:', error);
    }
  } catch (err) {
    console.error('[Discord] Error sending notification:', err);
  }
}

/**
 * Notify when new premium user signs up
 */
export function createNewPremiumUserNotification(email, plan, isFoundingMember, memberNumber) {
  const planLabel = plan === 'annual' ? 'Annual ($49.99/yr)' : 'Monthly ($4.99/mo)';
  const foundingBadge = isFoundingMember ? `\n🏆 **Founding Member #${memberNumber}** — Lifetime 20% discount` : '';

  return {
    embeds: [{
      title: '🎉 New Premium User!',
      description: `**Email:** ${email}\n**Plan:** ${planLabel}${foundingBadge}`,
      color: DISCORD_COLORS.SUCCESS,
      timestamp: new Date().toISOString(),
      footer: { text: 'NEXUS Alert Premium Signups' },
    }],
  };
}

/**
 * Notify when user joins Discord community
 */
export function createDiscordJoinNotification(email, username, memberNumber, isFoundingMember) {
  const foundingBadge = isFoundingMember ? ` (🏆 Founding #${memberNumber})` : '';

  return {
    content: `👋 <@&INSIDER_ROLE_ID>`,
    embeds: [{
      title: '✅ New Member Joined!',
      description: `**Username:** ${username}${foundingBadge}\n**Email:** ${email}\n**Total Members:** ${memberNumber}`,
      color: DISCORD_COLORS.DISCORD,
      timestamp: new Date().toISOString(),
    }],
  };
}

/**
 * Notify when referral conversion happens
 */
export function createReferralConversionNotification(referrerEmail, refereeEmail, freeMonthsEarned) {
  return {
    embeds: [{
      title: '🎁 Referral Converted!',
      description: [
        `**Referrer:** ${referrerEmail}`,
        `**New User:** ${refereeEmail}`,
        `**Free Months Earned:** ${freeMonthsEarned}`,
      ].join('\n'),
      color: DISCORD_COLORS.WARNING,
      timestamp: new Date().toISOString(),
      footer: { text: 'Referral Program' },
    }],
  };
}

/**
 * Notify when community milestone reached
 */
export function createMilestoneNotification(milestone, count) {
  return {
    content: '@everyone',
    embeds: [{
      title: `🎯 Milestone Reached!`,
      description: `We just hit **${count} ${milestone}**! 🎉\n\nThank you for being part of this journey. Keep sharing, keep growing!`,
      color: DISCORD_COLORS.SUCCESS,
      thumbnail: { url: 'https://nexus-alert.com/logo.png' },
      timestamp: new Date().toISOString(),
    }],
  };
}

/**
 * Post weekly tip to Discord
 */
export function createWeeklyTipNotification(weekNumber, topic, content, proTip) {
  return {
    embeds: [{
      title: `💡 Weekly NEXUS Tip — Week ${weekNumber}`,
      description: `**This Week's Topic:** ${topic}\n\n${content}\n\n**💪 Pro Tip:** ${proTip}`,
      color: DISCORD_COLORS.INFO,
      footer: { text: 'Have you noticed patterns? Share in #general!' },
    }],
  };
}

/**
 * Generate Discord invite link with tracking
 */
export function generateDiscordInviteUrl(baseInviteUrl, email, memberNumber, isFoundingMember) {
  // Encode member data in URL state (to be read by Discord bot on join)
  const state = btoa(JSON.stringify({
    email,
    memberNumber,
    isFoundingMember,
    timestamp: Date.now(),
  }));

  return `${baseInviteUrl}?state=${state}`;
}

/**
 * Check if user should get Founding 100 status
 */
export async function checkFoundingMemberStatus(env) {
  // Get current premium user count from KV
  const currentCount = await getPremiumUserCount(env);

  if (currentCount < 100) {
    return {
      isFoundingMember: true,
      memberNumber: currentCount + 1,
      couponId: 'FOUNDING100', // 20% off forever
    };
  }

  return {
    isFoundingMember: false,
    memberNumber: currentCount + 1,
    couponId: null,
  };
}

/**
 * Get current premium user count
 */
async function getPremiumUserCount(env) {
  const count = await env.KV.get('premium_user_count');
  return count ? parseInt(count, 10) : 0;
}

/**
 * Increment premium user count
 */
export async function incrementPremiumUserCount(env) {
  const current = await getPremiumUserCount(env);
  const newCount = current + 1;
  await env.KV.put('premium_user_count', String(newCount));
  return newCount;
}

/**
 * Send milestone notification if threshold crossed
 */
export async function checkAndNotifyMilestone(env, memberCount) {
  const milestones = [50, 100, 200, 500, 1000, 2000, 5000, 10000];

  if (milestones.includes(memberCount)) {
    const milestone = memberCount === 1 ? 'premium user' : 'premium users';
    const payload = createMilestoneNotification(milestone, memberCount);
    await sendDiscordNotification(env.DISCORD_WEBHOOK_URL, payload);
  }
}

/**
 * Weekly tips content calendar
 */
export const WEEKLY_TIPS = [
  {
    week: 1,
    topic: 'Best Times to Check for Appointments',
    content: `📅 **Days:** Tuesday & Thursday (3x more likely than weekends)\n⏰ **Times:** 9-11 AM EST, 2-4 PM EST\n📍 **Locations:** Blaine, WA and Champlain, NY see most activity`,
    proTip: 'Set your NEXUS Alert to check every 2 minutes during these windows.',
  },
  {
    week: 2,
    topic: 'Enrollment Center Selection Strategy',
    content: `✈️ **Airport centers** fill up fast but have more slots\n🚗 **Land border centers** are less competitive\n🏢 **Urban centers** have higher cancellation rates`,
    proTip: 'Monitor 3-5 centers within driving distance. Flexibility = faster booking.',
  },
  {
    week: 3,
    topic: 'What to Do When a Slot Appears',
    content: `1️⃣ Click notification immediately\n2️⃣ Log in (keep password saved)\n3️⃣ Select appointment → Don't hesitate\n4️⃣ Confirm → Screenshot for records\n\n⏱️ Average time: **90 seconds**`,
    proTip: 'Keep GOES account logged in so you skip the login step.',
  },
  {
    week: 4,
    topic: 'Date Range Filters',
    content: `📆 **Too narrow** (<2 weeks) → Miss opportunities\n📆 **Too wide** (>6 months) → Irrelevant alerts\n📆 **Sweet spot:** 2-8 weeks out\n\nMost users book within **21 days** of target.`,
    proTip: 'Start with a 4-week window, expand if no slots after 3 days.',
  },
];

/**
 * Post weekly tip (scheduled via cron)
 */
export async function postWeeklyTip(env, weekNumber) {
  const tipIndex = (weekNumber - 1) % WEEKLY_TIPS.length;
  const tip = WEEKLY_TIPS[tipIndex];

  const payload = createWeeklyTipNotification(weekNumber, tip.topic, tip.content, tip.proTip);
  await sendDiscordNotification(env.DISCORD_WEBHOOK_URL, payload);
}
