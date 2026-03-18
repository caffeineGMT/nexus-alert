import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { name, email, organization, website, estimatedReferrals } = data;

    // Validate required fields
    if (!name || !email || !organization) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Send application data to backend for storage
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.nexus-alert.com';

    const response = await fetch(`${backendUrl}/api/partner-application`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        organization,
        website,
        estimatedReferrals,
        appliedAt: new Date().toISOString(),
        status: 'pending'
      }),
    });

    if (!response.ok) {
      throw new Error('Backend application submission failed');
    }

    // Send confirmation email
    const RESEND_API_KEY = process.env.RESEND_API_KEY;

    if (RESEND_API_KEY) {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'NEXUS Alert Partners <partners@nexus-alert.com>',
          to: [email],
          subject: 'Partner Application Received - NEXUS Alert',
          html: `
            <h1>Thanks for applying, ${name.split(' ')[0]}!</h1>

            <p>We've received your application for the NEXUS Alert Partner Program.</p>

            <p><strong>What's next:</strong></p>
            <ol>
              <li>We'll review your application (usually takes 1-2 business days)</li>
              <li>If approved, you'll receive a unique referral link and partner dashboard access</li>
              <li>You can start referring customers and earning 20% recurring commission!</li>
            </ol>

            <p><strong>Your Application Details:</strong></p>
            <ul>
              <li>Name: ${name}</li>
              <li>Organization: ${organization}</li>
              <li>Email: ${email}</li>
              ${website ? `<li>Website: ${website}</li>` : ''}
              ${estimatedReferrals ? `<li>Estimated Monthly Reach: ${estimatedReferrals}</li>` : ''}
            </ul>

            <p>Questions? Reply to this email or contact us at partners@nexus-alert.com</p>

            <p>Best,<br>
            Michael<br>
            NEXUS Alert Partnership Team</p>
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Partner application error:', error);
    return NextResponse.json(
      { error: 'Application submission failed' },
      { status: 500 }
    );
  }
}
