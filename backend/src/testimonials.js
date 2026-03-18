// Testimonial submission and management
// Stores testimonials in KV storage for review and approval

/**
 * Handle testimonial submission from web form
 */
export async function handleTestimonialSubmission(request, env, corsHeaders) {
  try {
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.location || !data.program || !data.timeToFind || !data.story || !data.permissionToShare) {
      return json({ error: 'Missing required fields' }, 400, corsHeaders);
    }

    // Generate submission ID
    const submissionId = `testimonial_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    // Store in KV with metadata
    const testimonial = {
      id: submissionId,
      name: data.name,
      email: data.email,
      location: data.location,
      program: data.program,
      timeToFind: data.timeToFind,
      enrollmentCenter: data.enrollmentCenter || '',
      appointmentDate: data.appointmentDate || '',
      previousWaitTime: data.previousWaitTime || '',
      story: data.story,
      tier: data.tier || 'free',
      permissionToShare: data.permissionToShare,
      submittedAt: data.submittedAt || new Date().toISOString(),
      status: 'pending', // pending | approved | rejected
      approvedAt: null,
      premiumCodeSent: false,
    };

    await env.TESTIMONIALS.put(submissionId, JSON.stringify(testimonial));

    // Add to index for easier retrieval
    const indexKey = 'testimonials_index';
    const indexData = await env.TESTIMONIALS.get(indexKey);
    const index = indexData ? JSON.parse(indexData) : [];
    index.unshift(submissionId); // Add to beginning
    await env.TESTIMONIALS.put(indexKey, JSON.stringify(index));

    // Send notification email to admin
    try {
      await sendTestimonialNotification(env, testimonial);
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
      // Don't fail the request if email fails
    }

    return json({
      success: true,
      message: 'Testimonial submitted successfully',
      id: submissionId
    }, 200, corsHeaders);
  } catch (error) {
    console.error('Error submitting testimonial:', error);
    return json({ error: 'Failed to submit testimonial' }, 500, corsHeaders);
  }
}

/**
 * Get all testimonials (admin only)
 */
export async function handleGetTestimonials(env, corsHeaders, status = null) {
  try {
    const indexKey = 'testimonials_index';
    const indexData = await env.TESTIMONIALS.get(indexKey);

    if (!indexData) {
      return json({ testimonials: [] }, 200, corsHeaders);
    }

    const index = JSON.parse(indexData);
    const testimonials = [];

    for (const id of index) {
      const data = await env.TESTIMONIALS.get(id);
      if (data) {
        const testimonial = JSON.parse(data);

        // Filter by status if provided
        if (status === null || testimonial.status === status) {
          testimonials.push(testimonial);
        }
      }
    }

    return json({
      testimonials,
      total: testimonials.length,
      pending: testimonials.filter(t => t.status === 'pending').length,
      approved: testimonials.filter(t => t.status === 'approved').length,
    }, 200, corsHeaders);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return json({ error: 'Failed to fetch testimonials' }, 500, corsHeaders);
  }
}

/**
 * Approve a testimonial and send Premium code
 */
export async function handleApproveTestimonial(request, env, corsHeaders) {
  try {
    const { id, premiumMonths = 3 } = await request.json();

    const data = await env.TESTIMONIALS.get(id);
    if (!data) {
      return json({ error: 'Testimonial not found' }, 404, corsHeaders);
    }

    const testimonial = JSON.parse(data);

    // Generate Premium code
    const premiumCode = generatePremiumCode(testimonial.name);

    // Update testimonial status
    testimonial.status = 'approved';
    testimonial.approvedAt = new Date().toISOString();
    testimonial.premiumCode = premiumCode;
    testimonial.premiumMonths = premiumMonths;
    testimonial.premiumCodeSent = true;

    await env.TESTIMONIALS.put(id, JSON.stringify(testimonial));

    // TODO: Store Premium code in license database
    // await env.LICENSES.put(premiumCode, JSON.stringify({
    //   email: testimonial.email,
    //   duration: premiumMonths,
    //   type: 'testimonial',
    //   createdAt: new Date().toISOString(),
    // }));

    // Send thank you email with Premium code
    try {
      await sendPremiumCodeEmail(env, testimonial, premiumCode, premiumMonths);
    } catch (emailError) {
      console.error('Failed to send Premium code email:', emailError);
    }

    return json({
      success: true,
      premiumCode,
      testimonial
    }, 200, corsHeaders);
  } catch (error) {
    console.error('Error approving testimonial:', error);
    return json({ error: 'Failed to approve testimonial' }, 500, corsHeaders);
  }
}

/**
 * Reject a testimonial
 */
export async function handleRejectTestimonial(request, env, corsHeaders) {
  try {
    const { id, reason } = await request.json();

    const data = await env.TESTIMONIALS.get(id);
    if (!data) {
      return json({ error: 'Testimonial not found' }, 404, corsHeaders);
    }

    const testimonial = JSON.parse(data);
    testimonial.status = 'rejected';
    testimonial.rejectedAt = new Date().toISOString();
    testimonial.rejectionReason = reason || '';

    await env.TESTIMONIALS.put(id, JSON.stringify(testimonial));

    return json({ success: true }, 200, corsHeaders);
  } catch (error) {
    console.error('Error rejecting testimonial:', error);
    return json({ error: 'Failed to reject testimonial' }, 500, corsHeaders);
  }
}

/**
 * Helper: Generate Premium code
 */
function generatePremiumCode(name) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const random = Math.random().toString(36).substring(2, 7).toUpperCase();

  return `PREMIUM-TESTIMONIAL-${initials}-${random}`;
}

/**
 * Helper: Send notification email to admin
 */
async function sendTestimonialNotification(env, testimonial) {
  const resendApiKey = env.RESEND_API_KEY;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'NEXUS Alert <noreply@nexus-alert.com>',
      to: ['hello@nexus-alert.com'],
      subject: `New Testimonial Submission: ${testimonial.name}`,
      html: `
        <h2>New Testimonial Submission</h2>

        <p><strong>Name:</strong> ${testimonial.name}</p>
        <p><strong>Email:</strong> ${testimonial.email}</p>
        <p><strong>Location:</strong> ${testimonial.location}</p>
        <p><strong>Program:</strong> ${testimonial.program}</p>
        <p><strong>Time to Find:</strong> ${testimonial.timeToFind}</p>
        <p><strong>Enrollment Center:</strong> ${testimonial.enrollmentCenter || 'N/A'}</p>
        <p><strong>Tier:</strong> ${testimonial.tier}</p>

        <h3>Story:</h3>
        <p>${testimonial.story}</p>

        <hr>

        <p><strong>Submitted:</strong> ${testimonial.submittedAt}</p>
        <p><strong>Permission to Share:</strong> ${testimonial.permissionToShare ? 'Yes' : 'No'}</p>

        <p><a href="https://nexus-alert.com/admin/testimonials">Review and Approve</a></p>
      `,
    }),
  });
}

/**
 * Helper: Send Premium code email
 */
async function sendPremiumCodeEmail(env, testimonial, premiumCode, months) {
  const resendApiKey = env.RESEND_API_KEY;

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'NEXUS Alert <hello@nexus-alert.com>',
      to: [testimonial.email],
      subject: 'Thanks! Here\'s your Premium access code 🎁',
      html: `
        <p>Hey ${testimonial.name.split(' ')[0]},</p>

        <p>Amazing, thank you so much for sharing your story! Your testimonial will help a lot of people discover NEXUS Alert.</p>

        <h3>Here's your Premium access code:</h3>

        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; font-family: monospace; font-size: 18px; text-align: center;">
          <strong>${premiumCode}</strong>
        </div>

        <p><strong>To redeem:</strong></p>
        <ol>
          <li>Open the NEXUS Alert extension</li>
          <li>Click "Upgrade to Premium"</li>
          <li>Enter code: <code>${premiumCode}</code></li>
          <li>Enjoy ${months} months of 2-minute checks, email alerts, and priority support!</li>
        </ol>

        <p>Your testimonial will go live on our website and Chrome Web Store listing soon. I'll send you a link once it's published.</p>

        <p>Thanks again — really appreciate it!</p>

        <p>Michael<br>
        NEXUS Alert</p>

        <p style="margin-top: 30px; font-size: 12px; color: #888;">
          P.S. If you know anyone else looking for NEXUS/Global Entry appointments, feel free to share: <a href="https://nexus-alert.com">nexus-alert.com</a>
        </p>
      `,
    }),
  });
}

/**
 * Helper: JSON response
 */
function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}
