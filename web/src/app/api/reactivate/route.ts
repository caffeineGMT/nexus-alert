import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, promo_code } = body;

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Forward to Cloudflare Worker backend
    const workerUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexus-alert.com';
    const response = await fetch(`${workerUrl}/api/reactivate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        promo_code: promo_code || null,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend reactivation error:', error);
      return NextResponse.json(
        { error: 'Failed to create reactivation session' },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Reactivation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
