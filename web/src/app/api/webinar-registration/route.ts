import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, firmName, phone, currentClients } = data;

    // Validate required fields
    if (!name || !email || !firmName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send registration data to backend for storage and email follow-up
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexus-alert.com';

    const response = await fetch(`${backendUrl}/api/webinar-registration`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        firmName,
        phone,
        currentClients,
        registeredAt: new Date().toISOString(),
        source: 'webinar-landing-page'
      }),
    });

    if (!response.ok) {
      throw new Error('Backend registration failed');
    }

    // Also send notification email with Zoom link (you can add Resend integration here)
    // Example: Send via Resend API
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'NEXUS Alert <webinars@nexus-alert.com>',
          to: [email],
          subject: 'You\'re registered! Webinar: 10x Your Trusted Traveler Client Volume',
          html: `
            <h1>Thanks for registering, ${name.split(' ')[0]}!</h1>

            <p>You're all set for our webinar: <strong>How to 10x Your Trusted Traveler Client Volume</strong></p>

            <p><strong>When:</strong> Every Thursday at 11 AM PT / 2 PM ET<br>
            <strong>Duration:</strong> 45 minutes + Q&A</p>

            <p><strong>Join Zoom Meeting:</strong><br>
            <a href="https://zoom.us/j/YOUR_ZOOM_LINK">Click here to join</a></p>

            <p><strong>What you'll learn:</strong></p>
            <ul>
              <li>How to monitor 20+ clients without manual checking</li>
              <li>White-label email notifications branded with YOUR firm</li>
              <li>Live demo of the Pro dashboard</li>
              <li>Case study: Sarah Chen handles 30+ NEXUS clients</li>
            </ul>

            <p>Can't make it live? We'll send you the recording.</p>

            <p>In the meantime, feel free to start your 60-day free trial:<br>
            <a href="https://nexus-alert.com/pro">Start Free Trial</a></p>

            <p>See you on Thursday!</p>

            <p>Best,<br>
            Michael<br>
            NEXUS Alert Team</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Webinar registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
