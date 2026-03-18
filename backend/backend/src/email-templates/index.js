// Email Templates for NEXUS Alert Drip Campaigns
// Each template includes subject and HTML content with inline CSS

export const templates = {
  // ─── FREE USER SEQUENCE ─────────────────────────────────────────────

  welcome: {
    subject: '👋 Welcome to NEXUS Alert!',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e3a5f;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">Welcome to NEXUS Alert! 👋</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            Thanks for signing up! We're excited to help you find NEXUS, Global Entry, and SENTRI appointment slots.
          </p>

          <div style="background:#f0f9ff;border-left:4px solid #3b82f6;padding:16px;margin:24px 0">
            <p style="margin:0;font-size:14px;color:#1e40af">
              <strong>💡 Pro Tip:</strong> Slots disappear within minutes. Check your email frequently and book immediately when you see an alert!
            </p>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">What's Next?</h2>
          <ul style="line-height:1.8;color:#555">
            <li>We'll check for slots <strong>every 30 minutes</strong> on your free plan</li>
            <li>You'll receive email alerts when matching slots are found</li>
            <li>Make sure to add <strong>notifications@nexus-alert.com</strong> to your contacts</li>
          </ul>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:14px;color:#666;margin:0">
              Questions? Just reply to this email — we're here to help!
            </p>
          </div>
        </div>
      </div>
    `,
  },

  premium_case_study: {
    subject: '📊 How Sarah Got Her NEXUS Appointment in 48 Hours',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e3a5f;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">Real Success Story 🎯</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            Hi there! Quick question: <strong>How's your slot search going?</strong>
          </p>

          <p style="font-size:16px;line-height:1.6;color:#333">
            I wanted to share Sarah's story. She was on our free plan for 2 weeks with no luck. After upgrading to Premium:
          </p>

          <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:8px;padding:20px;margin:24px 0">
            <div style="display:flex;align-items:center;margin-bottom:12px">
              <span style="font-size:32px;margin-right:12px">⚡</span>
              <strong style="font-size:18px;color:#166534">Found a slot in 48 hours</strong>
            </div>
            <p style="margin:0;color:#166534;line-height:1.6">
              "I upgraded on Monday morning. By Wednesday afternoon, I had my appointment booked at Blaine, WA. The 2-minute checks and instant SMS made all the difference!" — Sarah T., Vancouver
            </p>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">Why Premium Works Better</h2>
          <table style="width:100%;border-collapse:collapse;margin:20px 0">
            <tr>
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;color:#666;width:40%">Check Frequency</td>
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;font-weight:600;color:#22c55e">Every 2 minutes ⚡</td>
            </tr>
            <tr>
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;color:#666">SMS Alerts</td>
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;font-weight:600;color:#22c55e">Instant notifications 📱</td>
            </tr>
            <tr>
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;color:#666">Priority Support</td>
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;font-weight:600;color:#22c55e">24-hour response 💬</td>
            </tr>
            <tr>
              <td style="padding:12px;color:#666">Cost</td>
              <td style="padding:12px;font-weight:600;color:#22c55e">$4.99/month 💰</td>
            </tr>
          </table>

          <p style="font-size:14px;line-height:1.6;color:#666;margin-top:24px">
            Most Premium users find slots within the first week. At $4.99/month, it's less than a single coffee run — and you can cancel anytime.
          </p>

          <a href="https://nexus-alert.com/pricing" style="display:inline-block;background:#3b82f6;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:24px;font-size:16px">
            Upgrade to Premium
          </a>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              Not ready yet? No problem! You'll stay on the free plan.
            </p>
          </div>
        </div>
      </div>
    `,
  },

  upgrade_offer: {
    subject: '🎁 Special Offer: First Month 20% Off',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">Limited Time: 20% Off Premium 🎁</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            You've been with us for a week, and we appreciate your patience on the free plan!
          </p>

          <p style="font-size:16px;line-height:1.6;color:#333">
            To help you find your appointment faster, we're offering <strong>20% off your first month of Premium</strong>.
          </p>

          <div style="background:#fef3c7;border:2px dashed #f59e0b;border-radius:8px;padding:24px;margin:24px 0;text-align:center">
            <div style="font-size:14px;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Special Offer</div>
            <div style="font-size:32px;font-weight:700;color:#92400e;margin:8px 0">$3.99</div>
            <div style="font-size:14px;color:#92400e">First month (then $4.99/mo)</div>
            <div style="font-size:12px;color:#92400e;margin-top:12px">Offer expires in 48 hours</div>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">What You'll Get</h2>
          <div style="margin:16px 0">
            <div style="display:flex;align-items:start;margin-bottom:12px">
              <span style="color:#22c55e;font-size:20px;margin-right:12px">✓</span>
              <div>
                <strong style="color:#1e3a5f">15x Faster Checks</strong>
                <div style="font-size:14px;color:#666">Every 2 minutes vs. every 30 minutes</div>
              </div>
            </div>
            <div style="display:flex;align-items:start;margin-bottom:12px">
              <span style="color:#22c55e;font-size:20px;margin-right:12px">✓</span>
              <div>
                <strong style="color:#1e3a5f">Instant SMS Alerts</strong>
                <div style="font-size:14px;color:#666">Don't miss slots while away from email</div>
              </div>
            </div>
            <div style="display:flex;align-items:start;margin-bottom:12px">
              <span style="color:#22c55e;font-size:20px;margin-right:12px">✓</span>
              <div>
                <strong style="color:#1e3a5f">Priority Support</strong>
                <div style="font-size:14px;color:#666">Get help when you need it</div>
              </div>
            </div>
          </div>

          <a href="https://nexus-alert.com/pricing?promo=WEEK1" style="display:inline-block;background:#3b82f6;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:24px;font-size:16px;width:100%;text-align:center;box-sizing:border-box">
            Claim 20% Off Now
          </a>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              Cancel anytime. No contracts. No hidden fees.
            </p>
          </div>
        </div>
      </div>
    `,
  },

  // ─── PREMIUM USER SEQUENCE ──────────────────────────────────────────

  premium_welcome: {
    subject: '🎉 Welcome to Premium! Here\'s What to Expect',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">🎉 You're Now Premium!</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            Thank you for upgrading! Your account is now fully activated with all Premium features.
          </p>

          <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:20px;margin:24px 0">
            <h3 style="margin:0 0 12px 0;color:#166534;font-size:16px">⚡ Premium Features Now Active</h3>
            <ul style="margin:0;padding-left:20px;color:#166534">
              <li style="margin-bottom:8px"><strong>2-minute checks</strong> — 15x faster than free plan</li>
              <li style="margin-bottom:8px"><strong>SMS alerts</strong> — Never miss a slot</li>
              <li style="margin-bottom:8px"><strong>Priority support</strong> — We respond within 24 hours</li>
            </ul>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">Next Steps</h2>
          <ol style="line-height:1.8;color:#555">
            <li>Add your phone number in settings for SMS alerts</li>
            <li>Double-check your location preferences are correct</li>
            <li>Keep your phone nearby — slots can appear anytime!</li>
          </ol>

          <div style="background:#fef9c3;border:1px solid #fde047;border-radius:6px;padding:16px;margin:24px 0">
            <p style="margin:0;font-size:14px;color:#854d0e">
              <strong>💡 Most Premium users find slots within 7 days.</strong> Stay patient and ready to book!
            </p>
          </div>

          <a href="https://nexus-alert.com/dashboard" style="display:inline-block;background:#3b82f6;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:24px;font-size:16px">
            Go to Dashboard
          </a>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:14px;color:#666;margin:0">
              Questions? Reply to this email anytime!
            </p>
          </div>
        </div>
      </div>
    `,
  },

  tips: {
    subject: '💡 5 Pro Tips to Get Your Appointment Faster',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e3a5f;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">Pro Tips for Success 💡</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            You've been Premium for a week. Here are insider tips from users who successfully booked:
          </p>

          <div style="margin:24px 0">
            <div style="margin-bottom:24px">
              <div style="background:#eff6ff;padding:16px;border-radius:6px">
                <div style="color:#1e40af;font-weight:600;margin-bottom:8px">1. Check Multiple Locations</div>
                <p style="margin:0;font-size:14px;color:#1e40af">Don't limit yourself to one enrollment center. Add 3-5 nearby locations to increase your chances.</p>
              </div>
            </div>

            <div style="margin-bottom:24px">
              <div style="background:#f0fdf4;padding:16px;border-radius:6px">
                <div style="color:#166534;font-weight:600;margin-bottom:8px">2. Be Flexible with Dates</div>
                <p style="margin:0;font-size:14px;color:#166534">Slots in the next 2-4 weeks fill fastest. If possible, leave your date range open.</p>
              </div>
            </div>

            <div style="margin-bottom:24px">
              <div style="background:#fef3c7;padding:16px;border-radius:6px">
                <div style="color:#92400e;font-weight:600;margin-bottom:8px">3. Act Within 5 Minutes</div>
                <p style="margin:0;font-size:14px;color:#92400e">When you get an alert, book immediately. Slots disappear in 3-10 minutes on average.</p>
              </div>
            </div>

            <div style="margin-bottom:24px">
              <div style="background:#fef2f2;padding:16px;border-radius:6px">
                <div style="color:#991b1b;font-weight:600;margin-bottom:8px">4. Enable All Notifications</div>
                <p style="margin:0;font-size:14px;color:#991b1b">Make sure SMS, email, and push notifications are all turned on. Don't rely on just one channel.</p>
              </div>
            </div>

            <div style="margin-bottom:24px">
              <div style="background:#f5f3ff;padding:16px;border-radius:6px">
                <div style="color:#5b21b6;font-weight:600;margin-bottom:8px">5. Check Early Mornings & Late Nights</div>
                <p style="margin:0;font-size:14px;color:#5b21b6">Slots often appear during off-hours (6-8am, 10pm-midnight). Keep your phone on and nearby.</p>
              </div>
            </div>
          </div>

          <div style="background:#f0f9ff;border:2px solid #3b82f6;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
            <p style="margin:0;color:#1e40af;font-size:14px">
              <strong>🎯 Success Rate:</strong> Premium users following these tips have a <strong>73% success rate</strong> within 14 days.
            </p>
          </div>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:14px;color:#666;margin:0">
              Good luck! Reply if you have questions.
            </p>
          </div>
        </div>
      </div>
    `,
  },

  // ─── CHURN PREVENTION & WIN-BACK ────────────────────────────────────

  pause_offer: {
    subject: '⏸️ We\'d Love to Keep You — Here\'s a Pause Option',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#ef4444;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">We're Sorry to See You Go 😔</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            We noticed you just canceled your Premium subscription. Before you go, we'd love to offer an alternative:
          </p>

          <div style="background:#fef3c7;border:2px solid #f59e0b;border-radius:8px;padding:24px;margin:24px 0;text-align:center">
            <h3 style="margin:0 0 12px 0;color:#92400e;font-size:18px">Pause Instead of Cancel</h3>
            <p style="margin:0;color:#92400e;font-size:14px;line-height:1.6">
              Keep your account active but pause billing for up to 3 months. Resume anytime when you're ready to search again!
            </p>
            <a href="https://nexus-alert.com/pause" style="display:inline-block;background:#f59e0b;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:16px">
              Pause My Account
            </a>
          </div>

          <h3 style="font-size:16px;color:#1e3a5f;margin-top:32px">Or Tell Us Why You Left</h3>
          <p style="font-size:14px;line-height:1.6;color:#666">
            Your feedback helps us improve. Common reasons include:
          </p>
          <ul style="font-size:14px;color:#666;line-height:1.8">
            <li>Already found an appointment (congrats! 🎉)</li>
            <li>Not finding enough slots in my area</li>
            <li>Price concerns</li>
            <li>Technical issues</li>
          </ul>

          <a href="mailto:support@nexus-alert.com?subject=Cancellation%20Feedback" style="display:inline-block;background:#64748b;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:16px">
            Share Feedback
          </a>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              You can reactivate Premium anytime from your dashboard.
            </p>
          </div>
        </div>
      </div>
    `,
  },

  win_back: {
    subject: '🎁 We Miss You — Come Back for 50% Off',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%);color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">We Miss You! Come Back for 50% Off 🎁</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            It's been a month since you left Premium, and we'd love to have you back!
          </p>

          <p style="font-size:16px;line-height:1.6;color:#333">
            Things have improved since you left:
          </p>

          <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:20px;margin:24px 0">
            <h3 style="margin:0 0 12px 0;color:#166534;font-size:16px">✨ What's New</h3>
            <ul style="margin:0;padding-left:20px;color:#166534;line-height:1.8">
              <li>More locations covered (added 15 new enrollment centers)</li>
              <li>Faster notifications (down from 30 seconds to 5 seconds)</li>
              <li>Better slot filtering (time range preferences)</li>
            </ul>
          </div>

          <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde047 100%);border-radius:8px;padding:32px;margin:24px 0;text-align:center">
            <div style="font-size:14px;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Exclusive Win-Back Offer</div>
            <div style="font-size:36px;font-weight:700;color:#92400e;margin:8px 0">50% OFF</div>
            <div style="font-size:16px;color:#92400e;margin-bottom:16px">First 3 months — just $2.49/mo</div>
            <a href="https://nexus-alert.com/pricing?promo=WINBACK50" style="display:inline-block;background:#1e3a5f;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px">
              Claim 50% Off Now
            </a>
            <div style="font-size:12px;color:#92400e;margin-top:12px">Offer expires in 7 days</div>
          </div>

          <p style="font-size:14px;line-height:1.6;color:#666;text-align:center">
            Join <strong>2,400+ happy Premium users</strong> who've found their appointments faster.
          </p>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              No thanks? <a href="mailto:support@nexus-alert.com?subject=Unsubscribe" style="color:#999">Unsubscribe from win-back emails</a>
            </p>
          </div>
        </div>
      </div>
    `,
  },
};

/**
 * Send email using Resend API
 * @param {string} type - Template type (e.g., 'welcome', 'premium_case_study')
 * @param {string} email - Recipient email
 * @param {object} env - Cloudflare Worker environment bindings
 */
export async function sendEmail(type, email, env) {
  const template = templates[type];

  if (!template) {
    console.error(`Unknown email template: ${type}`);
    return false;
  }

  try {
    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NEXUS Alert <alerts@nexus-alert.com>',
        to: [email],
        subject: template.subject,
        html: template.html,
      }),
    });

    if (!resp.ok) {
      const error = await resp.text();
      console.error(`Failed to send ${type} email to ${email}:`, error);
      return false;
    }

    console.log(`Sent ${type} email to ${email}`);
    return true;
  } catch (err) {
    console.error(`Error sending ${type} email to ${email}:`, err);
    return false;
  }
}
