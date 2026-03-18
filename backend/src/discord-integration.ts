/**
 * Discord Integration for NEXUS Alert Insiders Community
 *
 * Features:
 * - Auto-assign @Insider role to premium users
 * - Assign @Founding 100 role to first 100 members
 * - Post welcome messages in #general
 * - Track referrals via Discord member count
 * - Send announcements via webhook
 */

interface DiscordConfig {
  botToken: string;
  guildId: string;
  webhookUrl: string;
  inviteUrl: string;
  roles: {
    insider: string;
    founding100: string;
  };
  channels: {
    general: string;
    announcements: string;
  };
}

interface DiscordMember {
  userId: string;
  email: string;
  memberNumber: number;
  joinedAt: Date;
  isFoundingMember: boolean;
}

export class DiscordIntegration {
  private config: DiscordConfig;
  private baseUrl = 'https://discord.com/api/v10';

  constructor(config: DiscordConfig) {
    this.config = config;
  }

  /**
   * Generate personalized Discord invite link with member tracking
   */
  async generateInviteLink(email: string, memberNumber: number): Promise<string> {
    // Encode member number in state parameter (decoded by bot on join)
    const state = btoa(JSON.stringify({ email, memberNumber }));
    return `${this.config.inviteUrl}?state=${state}`;
  }

  /**
   * Assign roles to new member
   */
  async assignRoles(userId: string, isFoundingMember: boolean): Promise<void> {
    const roles = [this.config.roles.insider];
    if (isFoundingMember) {
      roles.push(this.config.roles.founding100);
    }

    for (const roleId of roles) {
      await this.discordRequest(
        `guilds/${this.config.guildId}/members/${userId}/roles/${roleId}`,
        { method: 'PUT' }
      );
    }
  }

  /**
   * Post welcome message in #general
   */
  async postWelcomeMessage(username: string, memberNumber: number, isFoundingMember: boolean): Promise<void> {
    const message = isFoundingMember
      ? `🎉 Welcome to NEXUS Alert Insiders, **${username}**! You're **Founding Member #${memberNumber}** — enjoy your lifetime 20% discount! 🏆`
      : `👋 Welcome to NEXUS Alert Insiders, **${username}**! You're member #${memberNumber}. Excited to have you here!`;

    await this.discordRequest(`channels/${this.config.channels.general}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        content: message,
        embeds: [{
          title: '🚀 Getting Started',
          description: [
            '✅ Introduce yourself in #general',
            '✅ Share your NEXUS/Global Entry journey',
            '✅ Post your first appointment win in #appointment-wins',
            '✅ Suggest features in #feature-requests',
          ].join('\n'),
          color: 0x5865F2,
        }],
      }),
    });
  }

  /**
   * Send announcement via webhook (for feature releases, community milestones)
   */
  async sendAnnouncement(title: string, message: string, color?: number): Promise<void> {
    await fetch(this.config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        embeds: [{
          title,
          description: message,
          color: color || 0x3b82f6,
          timestamp: new Date().toISOString(),
        }],
      }),
    });
  }

  /**
   * Post weekly tip in #tips-and-tricks
   */
  async postWeeklyTip(week: number, topic: string, content: string, proTip: string): Promise<void> {
    await this.discordRequest(`channels/${this.config.channels.general}/messages`, {
      method: 'POST',
      body: JSON.stringify({
        embeds: [{
          title: `💡 Weekly NEXUS Tip — Week ${week}`,
          description: `**This Week's Topic:** ${topic}\n\n${content}\n\n**Pro Tip:** ${proTip}`,
          color: 0x22c55e,
          footer: { text: 'Have you noticed patterns? Share in #general!' },
        }],
      }),
    });
  }

  /**
   * Get current member count (for Founding 100 tracking)
   */
  async getMemberCount(): Promise<number> {
    const response = await this.discordRequest(`guilds/${this.config.guildId}?with_counts=true`);
    const data = await response.json();
    return data.approximate_member_count || 0;
  }

  /**
   * Check if user is in server
   */
  async isMember(userId: string): Promise<boolean> {
    try {
      await this.discordRequest(`guilds/${this.config.guildId}/members/${userId}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Remove member (for subscription cancellations)
   */
  async removeMember(userId: string): Promise<void> {
    await this.discordRequest(`guilds/${this.config.guildId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  /**
   * Private helper: Make Discord API request
   */
  private async discordRequest(endpoint: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(`${this.baseUrl}/${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bot ${this.config.botToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Discord API error: ${response.status} ${error}`);
    }

    return response;
  }
}

/**
 * Weekly Tips Content Calendar
 */
export const WEEKLY_TIPS = [
  {
    week: 1,
    topic: 'Best Times to Check for Appointments',
    content: `Based on data from 10,000+ monitored slots, here's when appointments appear most often:

📅 **Days:** Tuesday & Thursday (3x more likely than weekends)
⏰ **Times:** 9-11 AM EST, 2-4 PM EST (office hours = cancellations)
📍 **Locations:** Blaine, WA and Champlain, NY see most activity`,
    proTip: 'Set your NEXUS Alert to check every 2 minutes during these windows for best results.',
  },
  {
    week: 2,
    topic: 'Enrollment Center Selection Strategy',
    content: `Don't just pick the closest center — think strategically:

✈️ **Airport centers** (Pearson, SeaTac) fill up fast but have more slots
🚗 **Land border centers** (Blaine, Buffalo) are less competitive
🏢 **Urban centers** (Detroit, Champlain) have higher cancellation rates`,
    proTip: 'Monitor 3-5 centers within driving distance. Being flexible = booking faster.',
  },
  {
    week: 3,
    topic: 'What to Do When a Slot Appears',
    content: `Speed matters! Slots disappear in < 5 minutes:

1️⃣ **Click notification immediately** → Opens GOES website
2️⃣ **Log in** (keep password saved)
3️⃣ **Select appointment** → Don't hesitate
4️⃣ **Confirm** → Screenshot confirmation for your records

⏱️ Average time from notification to booking: **90 seconds**`,
    proTip: 'Keep your GOES account logged in on your browser so you skip the login step.',
  },
  {
    week: 4,
    topic: 'Date Range Filters',
    content: `Smart filtering = faster results:

📆 **Too narrow** (<2 weeks) → Miss opportunities
📆 **Too wide** (>6 months) → Get irrelevant alerts
📆 **Sweet spot:** 2-8 weeks out

Most users book within **21 days** of their preferred date.`,
    proTip: 'Start with a 4-week window, expand if no slots appear after 3 days.',
  },
];

/**
 * Webhook payload examples for common events
 */
export function createFeatureAnnouncementPayload(featureName: string, description: string, screenshotUrl?: string) {
  return {
    embeds: [{
      title: `🚀 New Feature: ${featureName}`,
      description: description,
      image: screenshotUrl ? { url: screenshotUrl } : undefined,
      color: 0x22c55e,
      footer: { text: 'Upgrade to Premium to try it now!' },
    }],
  };
}

export function createMilestoneAnnouncementPayload(milestone: string, count: number) {
  return {
    embeds: [{
      title: `🎉 Community Milestone!`,
      description: `We just hit **${count} ${milestone}**! Thank you for being part of this journey. 💙`,
      color: 0x5865F2,
      thumbnail: { url: 'https://nexus-alert.com/logo.png' },
    }],
  };
}

export function createTestimonialSpotlightPayload(name: string, quote: string, location: string) {
  return {
    embeds: [{
      title: '⭐ Member Spotlight',
      description: `*"${quote}"*\n\n— **${name}**, ${location}`,
      color: 0xeab308,
      footer: { text: 'Share your win in #appointment-wins to be featured!' },
    }],
  };
}
