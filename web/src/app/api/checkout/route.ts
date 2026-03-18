import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, plan, ref, utm_source, utm_campaign } = await req.json();

    if (!email) {
      return Response.json({ error: 'Email is required' }, { status: 400 });
    }

    // Forward to backend worker (production: https://api.nexus-alert.com)
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexus-alert.com';

    // Build request body with optional referral code and UTM parameters
    const body: {
      email: string;
      plan: string;
      ref?: string;
      utm_source?: string;
      utm_campaign?: string;
    } = {
      email,
      plan: plan || 'monthly', // Default to monthly if not specified
    };
    if (ref) {
      body.ref = ref;
    }
    if (utm_source) {
      body.utm_source = utm_source;
    }
    if (utm_campaign) {
      body.utm_campaign = utm_campaign;
    }

    const response = await fetch(`${backendUrl}/api/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(
        { error: data.error || 'Checkout failed' },
        { status: response.status }
      );
    }

    return Response.json({ url: data.url }, { status: 200 });
  } catch (error) {
    console.error('Checkout error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
