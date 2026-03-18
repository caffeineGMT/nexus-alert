import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, reason, feedback } = body;

    if (!email || !reason) {
      return NextResponse.json(
        { error: 'Email and reason are required' },
        { status: 400 }
      );
    }

    // Forward to Cloudflare Worker backend
    const workerUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexus-alert.com';
    const response = await fetch(`${workerUrl}/api/exit-survey`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        reason,
        feedback: feedback || null,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Backend exit survey error:', error);
      return NextResponse.json(
        { error: 'Failed to submit survey' },
        { status: 500 }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Exit survey API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
