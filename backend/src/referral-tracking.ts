/**
 * Referral Tracking System for NEXUS Alert
 *
 * Features:
 * - Generate unique referral codes from email
 * - Track referral clicks and conversions
 * - Award 1 month free per successful referral
 * - Monthly leaderboard
 */

interface ReferralStats {
  code: string;
  email: string;
  clicks: number;
  conversions: number;
  freeMonthsEarned: number;
  createdAt: Date;
  lastUpdated: Date;
}

interface ReferralEvent {
  code: string;
  refereeEmail?: string;
  type: 'click' | 'signup' | 'conversion';
  timestamp: Date;
  metadata?: Record<string, any>;
}

export class ReferralTracker {
  private kv: KVNamespace;

  constructor(kv: KVNamespace) {
    this.kv = kv;
  }

  /**
   * Generate referral code from email (8-char base64)
   */
  static generateCode(email: string): string {
    const encoded = btoa(email.toLowerCase().trim());
    return encoded.substring(0, 8).toUpperCase();
  }

  /**
   * Get or create referral stats for user
   */
  async getStats(email: string): Promise<ReferralStats> {
    const code = ReferralTracker.generateCode(email);
    const key = `referral:${code}`;
    const existing = await this.kv.get(key, 'json') as ReferralStats | null;

    if (existing) {
      return existing;
    }

    // Create new referral entry
    const newStats: ReferralStats = {
      code,
      email,
      clicks: 0,
      conversions: 0,
      freeMonthsEarned: 0,
      createdAt: new Date(),
      lastUpdated: new Date(),
    };

    await this.kv.put(key, JSON.stringify(newStats));
    return newStats;
  }

  /**
   * Track referral click (when someone visits with ?ref=CODE)
   */
  async trackClick(code: string, refereeIp?: string): Promise<void> {
    const key = `referral:${code}`;
    const stats = await this.kv.get(key, 'json') as ReferralStats | null;

    if (!stats) {
      console.warn(`[Referral] Unknown code: ${code}`);
      return;
    }

    stats.clicks += 1;
    stats.lastUpdated = new Date();

    await this.kv.put(key, JSON.stringify(stats));

    // Log event
    await this.logEvent({
      code,
      type: 'click',
      timestamp: new Date(),
      metadata: { ip: refereeIp },
    });
  }

  /**
   * Track referral conversion (when referred user upgrades to premium)
   */
  async trackConversion(referrerCode: string, refereeEmail: string, stripePriceId: string): Promise<void> {
    const key = `referral:${referrerCode}`;
    const stats = await this.kv.get(key, 'json') as ReferralStats | null;

    if (!stats) {
      console.warn(`[Referral] Unknown code: ${referrerCode}`);
      return;
    }

    stats.conversions += 1;
    stats.freeMonthsEarned += 1; // 1 month free per conversion
    stats.lastUpdated = new Date();

    await this.kv.put(key, JSON.stringify(stats));

    // Log event
    await this.logEvent({
      code: referrerCode,
      refereeEmail,
      type: 'conversion',
      timestamp: new Date(),
      metadata: { stripePriceId },
    });

    // Award free month to referrer (via Stripe coupon or subscription extension)
    await this.awardFreeMonth(stats.email);
  }

  /**
   * Award 1 free month to referrer
   */
  private async awardFreeMonth(email: string): Promise<void> {
    // Implementation: Either create a Stripe coupon or extend subscription end date
    // For now, log it and handle manually
    console.log(`[Referral] Award 1 free month to ${email}`);

    // TODO: Integrate with Stripe to extend subscription
    // Option 1: Create invoice credit
    // Option 2: Update subscription end date
    // Option 3: Apply coupon to next billing cycle
  }

  /**
   * Get monthly leaderboard (top 10 referrers)
   */
  async getLeaderboard(): Promise<Array<{ email: string; code: string; conversions: number; freeMonthsEarned: number }>> {
    // List all referral keys
    const list = await this.kv.list({ prefix: 'referral:' });
    const allStats: ReferralStats[] = [];

    for (const key of list.keys) {
      const stats = await this.kv.get(key.name, 'json') as ReferralStats;
      if (stats) allStats.push(stats);
    }

    // Sort by conversions desc, take top 10
    return allStats
      .sort((a, b) => b.conversions - a.conversions)
      .slice(0, 10)
      .map(s => ({
        email: s.email,
        code: s.code,
        conversions: s.conversions,
        freeMonthsEarned: s.freeMonthsEarned,
      }));
  }

  /**
   * Log referral event for analytics
   */
  private async logEvent(event: ReferralEvent): Promise<void> {
    const eventKey = `referral-event:${Date.now()}-${Math.random().toString(36).substring(7)}`;
    await this.kv.put(eventKey, JSON.stringify(event), {
      expirationTtl: 60 * 60 * 24 * 90, // Keep events for 90 days
    });
  }

  /**
   * Get all conversion events for a user (for displaying in dashboard)
   */
  async getConversionEvents(email: string): Promise<ReferralEvent[]> {
    const code = ReferralTracker.generateCode(email);
    const list = await this.kv.list({ prefix: 'referral-event:' });
    const events: ReferralEvent[] = [];

    for (const key of list.keys) {
      const event = await this.kv.get(key.name, 'json') as ReferralEvent;
      if (event && event.code === code && event.type === 'conversion') {
        events.push(event);
      }
    }

    return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}

/**
 * API Route Handlers for Cloudflare Workers
 */

export async function handleGetReferralStats(request: Request, env: any): Promise<Response> {
  const url = new URL(request.url);
  const code = url.pathname.split('/').pop();

  if (!code) {
    return new Response('Missing referral code', { status: 400 });
  }

  const tracker = new ReferralTracker(env.KV);
  const key = `referral:${code}`;
  const stats = await env.KV.get(key, 'json') as ReferralStats | null;

  if (!stats) {
    return new Response(JSON.stringify({ clicks: 0, conversions: 0, freeMonthsEarned: 0 }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({
    clicks: stats.clicks,
    conversions: stats.conversions,
    freeMonthsEarned: stats.freeMonthsEarned,
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function handleTrackReferralClick(request: Request, env: any): Promise<Response> {
  const { code } = await request.json();
  const ip = request.headers.get('CF-Connecting-IP') || undefined;

  const tracker = new ReferralTracker(env.KV);
  await tracker.trackClick(code, ip);

  return new Response('OK', { status: 200 });
}

export async function handleGetLeaderboard(request: Request, env: any): Promise<Response> {
  const tracker = new ReferralTracker(env.KV);
  const leaderboard = await tracker.getLeaderboard();

  return new Response(JSON.stringify(leaderboard), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
