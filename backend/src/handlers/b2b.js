// B2B Marketing Handlers for Webinar Registrations and Partner Applications

export async function handleWebinarRegistration(request, env, corsHeaders) {
  try {
    const data = await request.json();
    const { name, email, firmName, phone, currentClients } = data;

    // Validate required fields
    if (!name || !email || !firmName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const registrationKey = `webinar:${email.toLowerCase()}`;
    const registration = {
      name,
      email: email.toLowerCase(),
      firmName,
      phone,
      currentClients,
      registeredAt: new Date().toISOString(),
      source: 'webinar-landing-page',
      status: 'registered'
    };

    // Store in KV
    await env.NEXUS_ALERTS_KV.put(registrationKey, JSON.stringify(registration));

    // Add to webinar registration list
    const listKey = 'webinar:registrations:list';
    const list = JSON.parse(await env.NEXUS_ALERTS_KV.get(listKey) || '[]');
    if (!list.includes(email.toLowerCase())) {
      list.push(email.toLowerCase());
      await env.NEXUS_ALERTS_KV.put(listKey, JSON.stringify(list));
    }

    // Send confirmation email via Resend (if configured)
    if (env.RESEND_API_KEY) {
      const firstName = name.split(' ')[0];
      const zoomLink = env.WEBINAR_ZOOM_LINK || 'https://zoom.us/j/YOUR_ZOOM_LINK';

      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'NEXUS Alert Webinars <webinars@nexus-alert.com>',
            to: [email],
            subject: `You're registered! Webinar: 10x Your Trusted Traveler Client Volume`,
            html: `
              <h1>Thanks for registering, ${firstName}!</h1>

              <p>You're all set for our webinar: <strong>How to 10x Your Trusted Traveler Client Volume</strong></p>

              <p><strong>When:</strong> Every Thursday at 11 AM PT / 2 PM ET<br>
              <strong>Duration:</strong> 45 minutes + Q&A</p>

              <p><strong>Join Zoom Meeting:</strong><br>
              <a href="${zoomLink}" style="display: inline-block; background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 16px 0;">Join Webinar</a></p>

              <p><strong>What you'll learn:</strong></p>
              <ul>
                <li>How to monitor 20+ clients without manual checking</li>
                <li>White-label email notifications branded with YOUR firm</li>
                <li>Live demo of the Pro dashboard</li>
                <li>Case study: Sarah Chen handles 30+ NEXUS clients</li>
                <li>Integration with Clio/MyCase</li>
              </ul>

              <p>Can't make it live? We'll send you the recording.</p>

              <p>In the meantime, feel free to start your 60-day free trial:<br>
              <a href="https://nexus-alert.com/pro" style="color: #2563eb;">Start Free Trial →</a></p>

              <p>See you on Thursday!</p>

              <p>Best,<br>
              Michael<br>
              NEXUS Alert Team</p>
            `,
          }),
        });

        if (!response.ok) {
          console.error('Failed to send webinar confirmation email');
        }
      } catch (emailError) {
        console.error('Error sending webinar confirmation:', emailError);
      }
    }

    // Track in analytics
    await trackEvent(env, 'webinar_registration', {
      email,
      firmName,
      currentClients,
      source: 'landing_page'
    });

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Webinar registration error:', error);
    return new Response(
      JSON.stringify({ error: 'Registration failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

export async function handlePartnerApplication(request, env, corsHeaders) {
  try {
    const data = await request.json();
    const { name, email, organization, website, estimatedReferrals } = data;

    // Validate required fields
    if (!name || !email || !organization) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate unique partner ID
    const partnerId = `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const application = {
      partnerId,
      name,
      email: email.toLowerCase(),
      organization,
      website,
      estimatedReferrals,
      appliedAt: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      commissionRate: 0.20, // 20%
      totalReferrals: 0,
      totalEarnings: 0,
      payoutMethod: null,
      referralCode: null
    };

    // Store application in KV
    const applicationKey = `partner:application:${email.toLowerCase()}`;
    await env.NEXUS_ALERTS_KV.put(applicationKey, JSON.stringify(application));

    // Add to applications list
    const listKey = 'partner:applications:list';
    const list = JSON.parse(await env.NEXUS_ALERTS_KV.get(listKey) || '[]');
    if (!list.includes(email.toLowerCase())) {
      list.push(email.toLowerCase());
      await env.NEXUS_ALERTS_KV.put(listKey, JSON.stringify(list));
    }

    // Send confirmation email
    if (env.RESEND_API_KEY) {
      const firstName = name.split(' ')[0];

      try {
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'NEXUS Alert Partners <partners@nexus-alert.com>',
            to: [email],
            subject: 'Partner Application Received - NEXUS Alert',
            html: `
              <h1>Thanks for applying, ${firstName}!</h1>

              <p>We've received your application for the NEXUS Alert Partner Program.</p>

              <p><strong>What's next:</strong></p>
              <ol>
                <li>We'll review your application (usually takes 1-2 business days)</li>
                <li>If approved, you'll receive a unique referral link and partner dashboard access</li>
                <li>You can start referring customers and earning 20% recurring commission!</li>
              </ol>

              <p><strong>Your Application Details:</strong></p>
              <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Organization:</strong> ${organization}</li>
                <li><strong>Email:</strong> ${email}</li>
                ${website ? `<li><strong>Website:</strong> ${website}</li>` : ''}
                ${estimatedReferrals ? `<li><strong>Estimated Monthly Reach:</strong> ${estimatedReferrals}</li>` : ''}
              </ul>

              <p><strong>Commission Structure:</strong></p>
              <ul>
                <li>Pro Tier ($99/mo): <strong>$19.80/month per customer</strong></li>
                <li>Premium Tier ($4.99/mo): <strong>$1.00/month per customer</strong></li>
                <li>Annual Plans: 20% of annual payment upfront</li>
              </ul>

              <p>Questions? Reply to this email or contact us at partners@nexus-alert.com</p>

              <p>Best,<br>
              Michael<br>
              NEXUS Alert Partnership Team</p>
            `,
          }),
        });

        if (!response.ok) {
          console.error('Failed to send partner application confirmation');
        }
      } catch (emailError) {
        console.error('Error sending partner confirmation:', emailError);
      }
    }

    // Notify admin (send to yourself)
    if (env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'NEXUS Alert System <system@nexus-alert.com>',
            to: ['guomaitao@gmail.com'], // Your email
            subject: `🤝 New Partner Application: ${name} (${organization})`,
            html: `
              <h1>New Partner Application</h1>

              <p><strong>Applicant:</strong> ${name}<br>
              <strong>Email:</strong> ${email}<br>
              <strong>Organization:</strong> ${organization}<br>
              ${website ? `<strong>Website:</strong> <a href="${website}">${website}</a><br>` : ''}
              ${estimatedReferrals ? `<strong>Estimated Reach:</strong> ${estimatedReferrals}<br>` : ''}
              <strong>Applied At:</strong> ${new Date().toLocaleString()}</p>

              <p><strong>Actions:</strong></p>
              <ul>
                <li>Review their website and social presence</li>
                <li>Approve or reject via partner dashboard</li>
                <li>If approved, generate referral code and send access</li>
              </ul>

              <p><strong>Partner ID:</strong> ${partnerId}</p>
            `,
          }),
        });
      } catch (adminEmailError) {
        console.error('Error sending admin notification:', adminEmailError);
      }
    }

    // Track in analytics
    await trackEvent(env, 'partner_application', {
      email,
      organization,
      estimatedReferrals,
      source: 'landing_page'
    });

    return new Response(
      JSON.stringify({ success: true, partnerId }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Partner application error:', error);
    return new Response(
      JSON.stringify({ error: 'Application submission failed' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
}

// Helper function to track events (simple analytics)
async function trackEvent(env, eventName, data) {
  try {
    const eventKey = `event:${eventName}:${Date.now()}`;
    const event = {
      name: eventName,
      data,
      timestamp: new Date().toISOString()
    };

    await env.NEXUS_ALERTS_KV.put(eventKey, JSON.stringify(event), {
      expirationTtl: 60 * 60 * 24 * 90 // 90 days
    });

    // Also increment counter
    const counterKey = `counter:${eventName}`;
    const currentCount = parseInt(await env.NEXUS_ALERTS_KV.get(counterKey) || '0');
    await env.NEXUS_ALERTS_KV.put(counterKey, String(currentCount + 1));
  } catch (error) {
    console.error('Error tracking event:', error);
  }
}
