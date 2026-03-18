import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate required fields
    if (!body.name || !body.email || !body.testimonialText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // TODO: In production, store this in a database (Cloudflare D1, KV, or external service)
    // For now, log to console and optionally forward to an email service
    console.log('New testimonial submission:', {
      name: body.name,
      location: body.location,
      email: body.email,
      programType: body.programType,
      originalWaitTime: body.originalWaitTime,
      foundSlotIn: body.foundSlotIn,
      testimonialText: body.testimonialText,
      premiumUser: body.premiumUser,
      allowMarketing: body.allowMarketing,
      photoConsent: body.photoConsent,
      submittedAt: body.submittedAt,
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to user with Premium reward code
    // TODO: Store in Cloudflare Worker backend or external CRM

    // For MVP, you can use a webhook to send data to Google Sheets, Airtable, or Notion
    // Example: Forward to Zapier webhook or Make.com webhook
    const WEBHOOK_URL = process.env.TESTIMONIAL_WEBHOOK_URL;
    if (WEBHOOK_URL) {
      await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    return NextResponse.json(
      { success: true, message: 'Testimonial submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
