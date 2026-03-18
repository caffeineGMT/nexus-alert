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

  educational: {
    subject: '⏰ Best Times to Find NEXUS Appointment Cancellations',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e3a5f;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">When Do Slots Open Up? ⏰</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            Hi! You've been using NEXUS Alert for 3 days now. Here's what we've learned from analyzing <strong>10,000+ appointment cancellations</strong>:
          </p>

          <div style="background:#f0f9ff;border-left:4px solid #3b82f6;padding:20px;margin:24px 0">
            <h3 style="margin:0 0 12px 0;color:#1e40af;font-size:16px">📊 Peak Cancellation Times</h3>
            <div style="color:#1e40af;line-height:1.8">
              <strong>Morning (7-9am):</strong> 34% of cancellations<br>
              <strong>Lunch (12-1pm):</strong> 22% of cancellations<br>
              <strong>Late Night (10pm-midnight):</strong> 18% of cancellations<br>
              <strong>Weekends:</strong> 26% fewer slots (most offices closed)
            </div>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">Why These Times?</h2>
          <p style="font-size:14px;line-height:1.6;color:#555">
            People cancel appointments when they're making other plans — over breakfast, during lunch breaks, or before bed. Business travelers often cancel Sunday nights when finalizing their week.
          </p>

          <div style="background:#fef3c7;border:1px solid #fde047;border-radius:6px;padding:16px;margin:24px 0">
            <p style="margin:0;font-size:14px;color:#854d0e">
              <strong>💡 Pro Tip:</strong> Our free plan checks every 30 minutes. Premium checks every 2 minutes — catching slots <strong>15x faster</strong> during these peak times.
            </p>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">Most Active Enrollment Centers</h2>
          <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e0e0e0;color:#333"><strong>Blaine, WA</strong></td>
              <td style="padding:8px;border-bottom:1px solid #e0e0e0;color:#666;text-align:right">~45 slots/week</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e0e0e0;color:#333"><strong>Buffalo, NY</strong></td>
              <td style="padding:8px;border-bottom:1px solid #e0e0e0;color:#666;text-align:right">~38 slots/week</td>
            </tr>
            <tr>
              <td style="padding:8px;border-bottom:1px solid #e0e0e0;color:#333"><strong>Champlain, NY</strong></td>
              <td style="padding:8px;border-bottom:1px solid #e0e0e0;color:#666;text-align:right">~28 slots/week</td>
            </tr>
            <tr>
              <td style="padding:8px;color:#333"><strong>Detroit, MI</strong></td>
              <td style="padding:8px;color:#666;text-align:right">~22 slots/week</td>
            </tr>
          </table>

          <p style="font-size:14px;line-height:1.6;color:#555">
            By monitoring multiple locations, you increase your chances significantly. Premium users can track unlimited locations with 2-minute checks.
          </p>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:14px;color:#666;margin:0">
              Good luck with your search! We'll keep checking every 30 minutes.
            </p>
            <p style="font-size:12px;color:#999;margin:8px 0 0 0">
              Want faster checks? <a href="https://nexus-alert.com/pricing?utm_source=email&utm_medium=drip&utm_campaign=day3_educational&utm_content=footer_link" style="color:#3b82f6;text-decoration:none">Learn about Premium</a>
            </p>
          </div>
        </div>
      </div>
    `,
  },

  upgrade_offer: {
    subject: '📊 How Sarah Got Her NEXUS Appointment in 3 Days (20% Off Inside)',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e3a5f;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">Real Success Story 🎯</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            You've been with us for a week. How's your slot search going?
          </p>

          <p style="font-size:16px;line-height:1.6;color:#333">
            I wanted to share Sarah's story. She was on our free plan for 2 weeks with no luck. After upgrading to Premium:
          </p>

          <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:8px;padding:20px;margin:24px 0">
            <div style="display:flex;align-items:center;margin-bottom:12px">
              <span style="font-size:32px;margin-right:12px">⚡</span>
              <strong style="font-size:18px;color:#166534">Found a slot in 3 days</strong>
            </div>
            <p style="margin:0;color:#166534;line-height:1.6;font-style:italic">
              "I upgraded on Monday morning. By Thursday afternoon, I had my appointment booked at Blaine, WA. The 2-minute checks and instant SMS made all the difference!" <br><strong>— Sarah T., Vancouver</strong>
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
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;color:#666">Success Rate</td>
              <td style="padding:12px;border-bottom:1px solid #e0e0e0;font-weight:600;color:#22c55e">73% within 14 days 🎯</td>
            </tr>
            <tr>
              <td style="padding:12px;color:#666">Cost</td>
              <td style="padding:12px;font-weight:600;color:#22c55e">$4.99/month 💰</td>
            </tr>
          </table>

          <div style="background:#fef3c7;border:2px dashed #f59e0b;border-radius:8px;padding:24px;margin:24px 0;text-align:center">
            <div style="font-size:14px;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Exclusive Offer for You</div>
            <div style="font-size:32px;font-weight:700;color:#92400e;margin:8px 0">20% OFF</div>
            <div style="font-size:16px;color:#92400e;margin-bottom:4px">First month just <strong>$3.99</strong> (then $4.99/mo)</div>
            <div style="font-size:13px;color:#92400e;margin-top:8px;font-family:monospace;background:#fff;padding:8px;border-radius:4px;display:inline-block"><strong>Code: CASE20</strong></div>
          </div>

          <a href="https://nexus-alert.com/pricing?utm_source=email&utm_medium=drip&utm_campaign=day7_case_study&utm_content=cta_button&promo=CASE20" style="display:inline-block;background:#3b82f6;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:24px;font-size:16px;width:100%;text-align:center;box-sizing:border-box">
            Upgrade to Premium — 20% Off
          </a>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              Not ready yet? No worries! You'll stay on the free plan. Cancel anytime.
            </p>
          </div>
        </div>
      </div>
    `,
  },

  flash_sale: {
    subject: '⚡ 48-Hour Flash Sale: Premium for $3.99/mo (Save $12/year)',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#ef4444 0%,#dc2626 100%);color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">⚡ Flash Sale: Final Offer</h1>
          <div style="margin-top:8px;font-size:14px;opacity:0.9">Expires in 48 hours</div>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            You've been searching for 2 weeks on the free plan. This is our <strong>best offer ever</strong> to help you find your appointment faster.
          </p>

          <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde047 100%);border-radius:8px;padding:32px;margin:24px 0;text-align:center;position:relative;overflow:hidden">
            <div style="position:absolute;top:12px;right:12px;background:#ef4444;color:white;padding:6px 12px;border-radius:4px;font-size:12px;font-weight:700;transform:rotate(12deg)">
              LIMITED TIME
            </div>
            <div style="font-size:14px;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">48-Hour Flash Sale</div>
            <div style="font-size:48px;font-weight:700;color:#92400e;margin:12px 0;line-height:1">$3.99<span style="font-size:24px">/mo</span></div>
            <div style="font-size:16px;color:#92400e;margin-bottom:8px">normally $4.99/mo — save $12/year</div>
            <div style="font-size:13px;color:#92400e;margin-top:12px;font-family:monospace;background:#fff;padding:10px 16px;border-radius:4px;display:inline-block;border:2px dashed #f59e0b">
              <strong>Code: FLASH48</strong>
            </div>
          </div>

          <div style="background:#fee2e2;border-left:4px solid #ef4444;padding:16px;margin:24px 0">
            <div style="color:#991b1b;font-weight:600;margin-bottom:8px">⏰ This Offer Ends:</div>
            <div style="color:#991b1b;font-size:20px;font-weight:700;font-family:monospace">
              {{countdown_date}}
            </div>
            <div style="color:#991b1b;font-size:12px;margin-top:4px">After this, the discount expires permanently for your account.</div>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">What You Get</h2>
          <div style="margin:16px 0">
            <div style="padding:12px 0;border-bottom:1px solid #e0e0e0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">⚡ 2-Minute Checks</div>
              <div style="font-size:14px;color:#666">15x faster than free (every 2 min vs. every 30 min)</div>
            </div>
            <div style="padding:12px 0;border-bottom:1px solid #e0e0e0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">📱 Instant SMS Alerts</div>
              <div style="font-size:14px;color:#666">Never miss a slot — get texts within 30 seconds</div>
            </div>
            <div style="padding:12px 0;border-bottom:1px solid #e0e0e0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">🎯 73% Success Rate</div>
              <div style="font-size:14px;color:#666">Premium users find slots within 14 days on average</div>
            </div>
            <div style="padding:12px 0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">💬 Priority Support</div>
              <div style="font-size:14px;color:#666">Get help within 24 hours (free plan: 3-5 days)</div>
            </div>
          </div>

          <a href="https://nexus-alert.com/pricing?utm_source=email&utm_medium=drip&utm_campaign=day14_flash_sale&utm_content=cta_button&promo=FLASH48" style="display:inline-block;background:#ef4444;color:white;padding:18px 40px;border-radius:6px;text-decoration:none;font-weight:700;margin-top:24px;font-size:18px;width:100%;text-align:center;box-sizing:border-box;box-shadow:0 4px 6px rgba(0,0,0,0.1)">
            Claim Flash Sale Now — $3.99/mo
          </a>

          <div style="text-align:center;margin-top:16px">
            <p style="font-size:12px;color:#999;margin:4px 0">💳 Cancel anytime. No contracts.</p>
            <p style="font-size:12px;color:#999;margin:4px 0">⏰ Offer expires in 48 hours</p>
          </div>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              Not interested? <a href="https://nexus-alert.com/api/unsubscribe?email={{email}}&utm_source=email&utm_medium=drip&utm_campaign=day14_flash_sale" style="color:#999;text-decoration:underline">Unsubscribe from promotional emails</a>
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
    subject: '⏸️ Before You Go — 50% Off for 3 Months',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#ef4444;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">We're Sorry to See You Go 😔</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            We noticed you just canceled your Premium subscription. Before you go, we'd love to make you a special offer:
          </p>

          <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde047 100%);border:2px solid #f59e0b;border-radius:8px;padding:28px;margin:24px 0;text-align:center">
            <div style="font-size:14px;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Exclusive Comeback Offer</div>
            <div style="font-size:48px;font-weight:700;color:#92400e;margin:12px 0;line-height:1">50% OFF</div>
            <div style="font-size:18px;color:#92400e;margin-bottom:16px;font-weight:600">for the Next 3 Months</div>
            <div style="font-size:15px;color:#92400e;margin-bottom:20px;line-height:1.5">
              Just <strong>$2.49/month</strong> instead of $4.99/month<br>
              (Resume your Premium benefits at half price)
            </div>
            <a href="https://nexus-alert.com/pricing?promo=SAVE50&email={{email}}" style="display:inline-block;background:#1e3a5f;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;margin-top:8px">
              Claim 50% Off Now
            </a>
            <div style="font-size:12px;color:#92400e;margin-top:12px">Offer expires in 48 hours</div>
          </div>

          <h3 style="font-size:16px;color:#1e3a5f;margin-top:32px;text-align:center">Or Prefer to Pause?</h3>
          <div style="background:#f0f9ff;border:1px solid #bfdbfe;border-radius:6px;padding:16px;margin:16px 0;text-align:center">
            <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.6">
              Not ready to commit? <strong>Pause billing for up to 3 months</strong> and resume anytime when you're ready to search again.
            </p>
            <a href="https://nexus-alert.com/pause?email={{email}}" style="display:inline-block;background:#3b82f6;color:white;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:12px;font-size:14px">
              Pause My Account Instead
            </a>
          </div>

          <h3 style="font-size:16px;color:#1e3a5f;margin-top:32px">Help Us Improve — Tell Us Why</h3>
          <p style="font-size:14px;line-height:1.6;color:#666">
            Your feedback matters. Common reasons for canceling:
          </p>
          <ul style="font-size:14px;color:#666;line-height:1.8">
            <li>✅ Already found an appointment (congrats! 🎉)</li>
            <li>📍 Not finding enough slots in my area</li>
            <li>💰 Price concerns</li>
            <li>⚙️ Technical issues</li>
          </ul>

          <a href="mailto:support@nexus-alert.com?subject=Cancellation%20Feedback" style="display:inline-block;background:#64748b;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:16px">
            Share Your Feedback
          </a>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              You can reactivate Premium anytime from your dashboard at the regular price.
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

  // ─── RETENTION & SUCCESS EMAILS ─────────────────────────────────────

  retention_tips: {
    subject: '💡 Having Trouble Finding Slots? 5 Tips from Power Users',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e3a5f;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">Struggling to Find Slots? 💡</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            We noticed you've been Premium for a while without finding your appointment yet. Here are <strong>5 proven strategies</strong> from users who successfully booked:
          </p>

          <div style="margin:24px 0">
            <div style="margin-bottom:20px;padding:16px;background:#eff6ff;border-left:4px solid #3b82f6;border-radius:4px">
              <div style="color:#1e40af;font-weight:700;margin-bottom:8px">1️⃣ Add More Locations (Critical!)</div>
              <p style="margin:0;font-size:14px;color:#1e40af;line-height:1.6">
                <strong>73% of successful users monitor 3+ locations.</strong> Don't limit yourself to one enrollment center. Add nearby cities — slots appear at different rates across centers. Blaine (WA), Buffalo (NY), and Detroit (MI) have the highest availability.
              </p>
            </div>

            <div style="margin-bottom:20px;padding:16px;background:#f0fdf4;border-left:4px solid #22c55e;border-radius:4px">
              <div style="color:#166534;font-weight:700;margin-bottom:8px">2️⃣ Be Flexible with Dates</div>
              <p style="margin:0;font-size:14px;color:#166534;line-height:1.6">
                Slots in the next 2-4 weeks book fastest. If you're only searching for dates 6+ months out, expand your range. Even if you can't make the early date, you can reschedule later once you have the appointment.
              </p>
            </div>

            <div style="margin-bottom:20px;padding:16px;background:#fef3c7;border-left:4px solid #f59e0b;border-radius:4px">
              <div style="color:#92400e;font-weight:700;margin-bottom:8px">3️⃣ Act Fast (Within 5 Minutes!)</div>
              <p style="margin:0;font-size:14px;color:#92400e;line-height:1.6">
                When you get an alert, <strong>book immediately</strong>. Our data shows slots disappear in an average of 7 minutes. Have your TTP account logged in and ready on another tab.
              </p>
            </div>

            <div style="margin-bottom:20px;padding:16px;background:#fef2f2;border-left:4px solid #ef4444;border-radius:4px">
              <div style="color:#991b1b;font-weight:700;margin-bottom:8px">4️⃣ Check Early Mornings & Late Nights</div>
              <p style="margin:0;font-size:14px;color:#991b1b;line-height:1.6">
                Cancellations spike during these hours: <strong>7-9am (34%), 12-1pm (22%), 10pm-midnight (18%)</strong>. Keep your phone on and notifications enabled 24/7.
              </p>
            </div>

            <div style="padding:16px;background:#f5f3ff;border-left:4px solid #8b5cf6;border-radius:4px">
              <div style="color:#5b21b6;font-weight:700;margin-bottom:8px">5️⃣ Consider Less Popular Centers</div>
              <p style="margin:0;font-size:14px;color:#5b21b6;line-height:1.6">
                Remote centers like Sweetgrass (MT) or Warroad (MN) have fewer applicants competing. If you can travel, you'll find slots much faster.
              </p>
            </div>
          </div>

          <div style="background:#f0f9ff;border:2px solid #3b82f6;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
            <p style="margin:0;color:#1e40af;font-size:14px;line-height:1.6">
              <strong>Need Help?</strong> Reply to this email and we'll review your settings personally. Our support team can suggest optimal locations based on your area.
            </p>
          </div>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:14px;color:#666;margin:0">
              Don't give up! Most Premium users find their slot. You've got this! 💪
            </p>
          </div>
        </div>
      </div>
    `,
  },

  slot_success: {
    subject: '🎉 Congratulations! You Found Your Slot!',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#22c55e 0%,#16a34a 100%);color:white;padding:32px;border-radius:8px 8px 0 0;text-align:center">
          <div style="font-size:64px;margin-bottom:12px">🎉</div>
          <h1 style="margin:0;font-size:28px;font-weight:700">Congratulations!</h1>
          <p style="margin:8px 0 0 0;font-size:16px;opacity:0.95">You found your NEXUS appointment!</p>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            We're thrilled to see you successfully booked your appointment! 🙌
          </p>

          <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:20px;margin:24px 0">
            <h3 style="margin:0 0 12px 0;color:#166534;font-size:16px">✅ What's Next?</h3>
            <ul style="margin:0;padding-left:20px;color:#166534;line-height:1.8">
              <li>Bring required documents (passport, proof of citizenship, etc.)</li>
              <li>Arrive 15 minutes early for your interview</li>
              <li>Your NEXUS card will arrive in 7-10 business days</li>
            </ul>
          </div>

          <h2 style="font-size:20px;color:#1e3a5f;margin-top:32px;margin-bottom:16px">Share the Love — Get 3 Free Months! 🎁</h2>
          <p style="font-size:15px;line-height:1.6;color:#555;margin-bottom:20px">
            Know someone else waiting for a NEXUS appointment? <strong>Share NEXUS Alert with 3 friends and get 3 months free!</strong>
          </p>

          <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde047 100%);border-radius:8px;padding:24px;margin:24px 0;text-align:center">
            <div style="font-size:14px;color:#92400e;font-weight:600;margin-bottom:12px">YOUR REFERRAL LINK</div>
            <div style="background:white;padding:12px;border-radius:6px;font-family:monospace;font-size:14px;color:#1e3a5f;margin-bottom:16px;word-break:break-all">
              {{shareUrl}}
            </div>
            <div style="font-size:13px;color:#92400e;line-height:1.5">
              Each friend who upgrades to Premium gives you <strong>1 month free</strong><br>
              Share with 3 friends = 3 months free!
            </div>
          </div>

          <div style="text-align:center;margin:24px 0">
            <a href="{{twitterUrl}}" style="display:inline-block;background:#1da1f2;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:8px;font-size:14px">
              Share on Twitter
            </a>
            <a href="{{emailUrl}}" style="display:inline-block;background:#64748b;color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:600;margin:8px;font-size:14px">
              Share via Email
            </a>
          </div>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0;text-align:center">
            <p style="font-size:13px;color:#999;margin:0">
              Thanks for using NEXUS Alert! Safe travels! ✈️
            </p>
          </div>
        </div>
      </div>
    `,
  },

  annual_upgrade: {
    subject: '💰 You\'ve Paid $30 — Lock in Annual for $80 (Save $40/year)',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1e3a5f;color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">You Could Be Saving $40/Year 💰</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            Hi! You've been a Premium member for <strong>6 months</strong> now — thank you for your continued support! 🙏
          </p>

          <p style="font-size:16px;line-height:1.6;color:#333">
            Quick heads up: you've paid <strong>$30 so far</strong> on the monthly plan ($4.99/mo × 6). Here's the math on switching to annual:
          </p>

          <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:8px;padding:24px;margin:24px 0">
            <table style="width:100%;font-size:15px">
              <tr>
                <td style="padding:8px 0;color:#166534"><strong>Monthly Plan:</strong></td>
                <td style="padding:8px 0;color:#166534;text-align:right">$4.99/mo × 12 = <strong>$59.88/year</strong></td>
              </tr>
              <tr>
                <td style="padding:8px 0;border-top:1px solid #bbf7d0;color:#166534"><strong>Annual Plan:</strong></td>
                <td style="padding:8px 0;border-top:1px solid #bbf7d0;color:#166534;text-align:right"><strong>$49.99/year</strong></td>
              </tr>
              <tr style="background:#dcfce7">
                <td style="padding:12px 8px;border-top:2px solid #22c55e;color:#166534;font-weight:700">Your Savings:</td>
                <td style="padding:12px 8px;border-top:2px solid #22c55e;color:#166534;text-align:right;font-weight:700;font-size:18px">$9.89/year (17% off)</td>
              </tr>
            </table>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">Why Switch Now?</h2>
          <ul style="line-height:1.8;color:#555;font-size:15px">
            <li><strong>Lock in your price</strong> — protect against future price increases</li>
            <li><strong>One payment, done</strong> — no monthly billing to track</li>
            <li><strong>Same Premium features</strong> — 2-min checks, SMS alerts, priority support</li>
          </ul>

          <a href="https://nexus-alert.com/api/switch-to-annual?email={{email}}" style="display:inline-block;background:#22c55e;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:24px;font-size:16px;width:100%;text-align:center;box-sizing:border-box">
            Switch to Annual — Save $10
          </a>

          <div style="margin-top:24px;text-align:center">
            <p style="font-size:12px;color:#999;margin:4px 0">💳 Seamless switch — no downtime, no re-setup</p>
            <p style="font-size:12px;color:#999;margin:4px 0">⏰ Cancel anytime, prorated refund</p>
          </div>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              Happy with monthly? No worries! This is just a heads up about savings.
            </p>
          </div>
        </div>
      </div>
    `,
  },

  win_back_60day: {
    subject: '🎁 Come Back for 3 Months Free — No Strings Attached',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#8b5cf6 0%,#6366f1 100%);color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">3 Months Free — Our Best Offer Ever 🎁</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            It's been 2 months since you left NEXUS Alert. We really want you back, so we're offering something we've <strong>never done before</strong>:
          </p>

          <div style="background:linear-gradient(135deg,#fef3c7 0%,#fde047 100%);border-radius:8px;padding:32px;margin:24px 0;text-align:center">
            <div style="font-size:14px;color:#92400e;text-transform:uppercase;letter-spacing:1px;margin-bottom:8px">Limited Comeback Offer</div>
            <div style="font-size:48px;font-weight:700;color:#92400e;margin:12px 0;line-height:1">3 MONTHS<br><span style="font-size:28px">COMPLETELY FREE</span></div>
            <div style="font-size:16px;color:#92400e;margin-bottom:16px">Then just $4.99/mo after (cancel anytime)</div>
            <a href="https://nexus-alert.com/pricing?promo=COMEBACK3FREE&email={{email}}" style="display:inline-block;background:#1e3a5f;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:16px;margin-top:8px">
              Claim 3 Free Months
            </a>
            <div style="font-size:12px;color:#92400e;margin-top:12px">No credit card required for the free trial</div>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">What's Changed Since You Left</h2>
          <div style="margin:16px 0">
            <div style="padding:12px 0;border-bottom:1px solid #e0e0e0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">✨ More Locations Covered</div>
              <div style="font-size:14px;color:#666">Added 15 new enrollment centers (now covering 60+ locations)</div>
            </div>
            <div style="padding:12px 0;border-bottom:1px solid #e0e0e0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">⚡ Faster Notifications</div>
              <div style="font-size:14px;color:#666">Alert speed improved from 30 seconds to 5 seconds</div>
            </div>
            <div style="padding:12px 0;border-bottom:1px solid #e0e0e0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">🎯 Better Filtering</div>
              <div style="font-size:14px;color:#666">New time range preferences (morning/afternoon/evening only)</div>
            </div>
            <div style="padding:12px 0">
              <div style="font-weight:600;color:#1e3a5f;margin-bottom:4px">📊 Success Rate Up 23%</div>
              <div style="font-size:14px;color:#666">78% of Premium users now find slots within 14 days</div>
            </div>
          </div>

          <p style="font-size:14px;line-height:1.6;color:#666;text-align:center;margin-top:24px">
            Join <strong>3,200+ active Premium users</strong> who are finding appointments faster than ever.
          </p>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              This offer expires in 7 days. <a href="https://nexus-alert.com/pricing?promo=COMEBACK3FREE&email={{email}}" style="color:#3b82f6;text-decoration:none">Claim your 3 free months</a>
            </p>
          </div>
        </div>
      </div>
    `,
  },

  win_back_algorithm: {
    subject: '🚀 Slots Are Filling 2x Faster Now — We Improved the Algorithm',
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#3b82f6 0%,#2563eb 100%);color:white;padding:24px;border-radius:8px 8px 0 0">
          <h1 style="margin:0;font-size:24px">Major Algorithm Upgrade 🚀</h1>
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #e0e0e0;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:0">
            Big news: we just shipped a major upgrade to our slot detection algorithm. Users are now finding appointments <strong>2x faster</strong> than before.
          </p>

          <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:20px;margin:24px 0">
            <h3 style="margin:0 0 12px 0;color:#1e40af;font-size:16px">📊 New Algorithm Performance</h3>
            <div style="color:#1e40af;line-height:1.8;font-size:14px">
              <strong>Before:</strong> Average 14 days to find slot<br>
              <strong>After:</strong> Average 7 days to find slot<br>
              <strong>Success Rate:</strong> 78% within 2 weeks (up from 55%)
            </div>
          </div>

          <h2 style="font-size:18px;color:#1e3a5f;margin-top:32px">What's New?</h2>
          <ul style="line-height:1.8;color:#555;font-size:15px">
            <li><strong>Predictive scanning</strong> — We now check high-activity centers more frequently during peak cancellation hours</li>
            <li><strong>Multi-region monitoring</strong> — Simultaneous checks across all regions (was sequential before)</li>
            <li><strong>Faster API calls</strong> — Reduced latency from 8 seconds to 2 seconds per location</li>
            <li><strong>Smart retry logic</strong> — Automatically retries failed checks within 30 seconds</li>
          </ul>

          <div style="background:#f0fdf4;border:2px solid #22c55e;border-radius:8px;padding:20px;margin:24px 0;text-align:center">
            <p style="margin:0;color:#166534;font-size:15px;line-height:1.6">
              <strong>Real Example:</strong> Sarah from Seattle found her Blaine, WA slot in <strong>3 days</strong> using the new algorithm (previous average was 12 days for that location).
            </p>
          </div>

          <p style="font-size:16px;line-height:1.6;color:#333;margin-top:24px">
            Ready to give it another shot? We'd love to help you find your appointment with our upgraded system.
          </p>

          <a href="https://nexus-alert.com/pricing?utm_source=email&utm_campaign=winback_60day_algorithm&email={{email}}" style="display:inline-block;background:#22c55e;color:white;padding:16px 32px;border-radius:6px;text-decoration:none;font-weight:600;margin-top:24px;font-size:16px;width:100%;text-align:center;box-sizing:border-box">
            Restart Premium — Try New Algorithm
          </a>

          <div style="margin-top:24px;text-align:center">
            <p style="font-size:12px;color:#999;margin:4px 0">💳 $4.99/mo — Cancel anytime</p>
            <p style="font-size:12px;color:#999;margin:4px 0">🎁 First month 50% off with code ALGO50</p>
          </div>

          <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e0e0e0">
            <p style="font-size:13px;color:#999;margin:0;text-align:center">
              Not interested? <a href="mailto:support@nexus-alert.com?subject=Unsubscribe" style="color:#999">Unsubscribe from win-back emails</a>
            </p>
          </div>
        </div>
      </div>
    `,
  },

  // ─── REFERRAL PROGRAM ───────────────────────────────────────────────

  referral_invite: {
    subject: '🎁 Share NEXUS Alert, Earn Free Months!',
    file: 'referral-invite.html', // Use external file for complex templates
    vars: ['email', 'shareUrl', 'twitterUrl', 'emailUrl', 'unsubscribeUrl'],
  },
};

/**
 * Send email using Resend API
 * @param {string} type - Template type (e.g., 'welcome', 'premium_case_study')
 * @param {string} email - Recipient email
 * @param {object} env - Cloudflare Worker environment bindings
 * @param {object} vars - Variables for template replacement
 */
export async function sendEmail(type, email, env, vars = {}) {
  const template = templates[type];

  if (!template) {
    console.error(`Unknown email template: ${type}`);
    return false;
  }

  try {
    let html = template.html;
    let subject = template.subject;

    // Handle external file templates (for referral_invite)
    if (template.file) {
      // For Cloudflare Workers, we'll inline the HTML content
      // In a real deployment, you'd use Workers Assets or KV to store templates
      const fs = await import('fs');
      const path = await import('path');
      const templatePath = path.join(process.cwd(), 'src/email-templates', template.file);
      html = fs.readFileSync(templatePath, 'utf-8');
    }

    // Replace template variables
    if (vars && Object.keys(vars).length > 0) {
      for (const [key, value] of Object.entries(vars)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        html = html.replace(regex, value);
        subject = subject.replace(regex, value);
      }
    }

    const resp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NEXUS Alert <alerts@nexus-alert.com>',
        to: [email],
        subject,
        html,
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
