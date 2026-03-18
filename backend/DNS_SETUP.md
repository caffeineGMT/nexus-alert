# DNS Configuration for Production

This guide covers setting up the custom domain `api.nexus-alert.com` for the NEXUS Alert backend.

## Prerequisites

- Domain `nexus-alert.com` added to Cloudflare account
- Backend deployed to Cloudflare Workers
- Access to Cloudflare Dashboard

## Option 1: Automatic Setup (Recommended)

Cloudflare Workers can automatically configure DNS when you add a custom domain.

### Steps:

1. **Deploy your worker first** (see PRODUCTION_DEPLOYMENT.md)

2. **Navigate to Custom Domains:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Select your account
   - Click **Workers & Pages**
   - Click on **nexus-alert-backend**
   - Go to **Triggers** tab

3. **Add Custom Domain:**
   - Click **Add Custom Domain**
   - Enter: `api.nexus-alert.com`
   - Click **Add Custom Domain**

4. **Wait for SSL Certificate:**
   - Cloudflare will automatically:
     - Create necessary DNS records (AAAA + A records or CNAME)
     - Provision Universal SSL certificate
     - Configure routing
   - This takes 1-5 minutes typically

5. **Verify:**
   ```bash
   # Check DNS resolution
   dig api.nexus-alert.com

   # Test endpoint
   curl https://api.nexus-alert.com/api/status
   ```

## Option 2: Manual DNS Configuration

If you prefer to configure DNS manually:

### Create DNS Records:

**For Cloudflare Workers (recommended):**

Create a **CNAME** record:
```
Type: CNAME
Name: api
Content: nexus-alert-backend.YOURSUBDOMAIN.workers.dev
Proxy status: Proxied (orange cloud)
TTL: Auto
```

**Or create A/AAAA records:**

If you're using a specific Worker IP (less common):
```
Type: A
Name: api
Content: <Worker IP address>
Proxy status: Proxied
TTL: Auto
```

### Enable SSL/TLS:

1. Go to **SSL/TLS** in Cloudflare Dashboard
2. Set SSL/TLS encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

## Verification Checklist

After setup, verify the following:

### DNS Resolution
```bash
# Should show Cloudflare IPs
dig api.nexus-alert.com +short

# Should return CNAME or A/AAAA records
dig api.nexus-alert.com ANY +noall +answer
```

**Expected output:**
```
api.nexus-alert.com.    300    IN    A    104.XXX.XXX.XXX
api.nexus-alert.com.    300    IN    AAAA    2606:XXXX:...
```

### SSL Certificate
```bash
# Check SSL certificate
openssl s_client -connect api.nexus-alert.com:443 -servername api.nexus-alert.com < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -A2 "Subject:"
```

Should show:
- Subject includes `api.nexus-alert.com`
- Issuer is Cloudflare or Let's Encrypt
- Valid dates cover current date

### API Endpoint
```bash
# Test status endpoint
curl -i https://api.nexus-alert.com/api/status
```

**Expected response:**
```
HTTP/2 200
content-type: application/json
...

{
  "status": "ok",
  "timestamp": "2026-03-18T12:00:00Z"
}
```

### Force HTTPS Redirect
```bash
# Should redirect to HTTPS
curl -I http://api.nexus-alert.com/api/status
```

**Expected:**
```
HTTP/1.1 301 Moved Permanently
Location: https://api.nexus-alert.com/api/status
```

## Troubleshooting

### Issue: DNS not resolving

**Check:**
- Wait 5-10 minutes for DNS propagation
- Verify domain is on Cloudflare nameservers: `dig nexus-alert.com NS`
- Check DNS records in Cloudflare Dashboard → DNS

**Fix:**
```bash
# Flush local DNS cache (macOS)
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder

# Flush local DNS cache (Linux)
sudo systemd-resolve --flush-caches
```

### Issue: SSL certificate error

**Symptoms:**
- "Certificate not trusted" error
- "NET::ERR_CERT_COMMON_NAME_INVALID"

**Fix:**
1. Go to Cloudflare Dashboard → SSL/TLS → Edge Certificates
2. Verify Universal SSL is enabled
3. Wait up to 15 minutes for certificate provisioning
4. Check certificate status shows "Active Certificate"

### Issue: 522 Connection Timed Out

**Cause:** Workers not responding or route not configured

**Fix:**
1. Verify worker is deployed: `npx wrangler deployments list --env production`
2. Check custom domain is added in Workers dashboard
3. Verify route configuration matches domain

### Issue: 404 Not Found on all routes

**Cause:** Custom domain not connected to worker

**Fix:**
1. Go to Workers & Pages → nexus-alert-backend → Triggers
2. Verify `api.nexus-alert.com` is listed under Custom Domains
3. Click "Add Custom Domain" if not present

### Issue: Mixed content warnings (HTTP + HTTPS)

**Fix:**
1. Cloudflare Dashboard → SSL/TLS
2. Set encryption mode to **Full (strict)**
3. Enable **Always Use HTTPS**
4. Enable **Automatic HTTPS Rewrites**

## Security Best Practices

### Enable Security Headers

Add to your Worker response:
```javascript
headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
headers.set('X-Content-Type-Options', 'nosniff');
headers.set('X-Frame-Options', 'DENY');
headers.set('X-XSS-Protection', '1; mode=block');
headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
```

### Enable WAF (Web Application Firewall)

1. Go to **Security** → **WAF** in Cloudflare Dashboard
2. Enable Managed Rules
3. Configure rate limiting for API endpoints:
   - `/api/register`: 10 requests per minute per IP
   - `/api/checkout`: 5 requests per minute per IP
   - `/api/webhooks/*`: Allow only Stripe IPs

### Configure DDoS Protection

1. Go to **Security** → **DDoS**
2. Set sensitivity to **High**
3. Enable challenge for suspicious requests

### Monitor with Analytics

1. Go to **Analytics & Logs** → **Workers Analytics**
2. Set up alerts for:
   - Error rate > 5%
   - Response time > 1s
   - Unusual traffic spikes

## DNS Records Summary

After complete setup, your DNS should look like:

| Type | Name | Content | Proxy | TTL |
|------|------|---------|-------|-----|
| CNAME | api | nexus-alert-backend.workers.dev | Proxied | Auto |
| A | @ | (Cloudflare IP) | Proxied | Auto |
| AAAA | @ | (Cloudflare IPv6) | Proxied | Auto |
| CNAME | www | nexus-alert.com | Proxied | Auto |

## Additional Domains (Future)

If you need additional subdomains:

### For Landing Page (www.nexus-alert.com):
```
Type: CNAME
Name: www
Content: nexus-alert.vercel.app (or your hosting provider)
Proxy: Proxied
```

### For Email (mail.nexus-alert.com):
```
Type: MX
Name: @
Content: mx.resend.com (or your email provider)
Priority: 10
```

### For Status Page (status.nexus-alert.com):
```
Type: CNAME
Name: status
Content: <status-page-provider>
Proxy: DNS only (not proxied)
```

## Health Checks

Set up health checks to monitor API availability:

1. Go to **Traffic** → **Health Checks**
2. Click **Create Health Check**
3. Configure:
   - **URL:** `https://api.nexus-alert.com/api/status`
   - **Monitor type:** HTTPS
   - **Check frequency:** Every 1 minute
   - **Expected HTTP codes:** 200
   - **Notification email:** your-email@example.com

4. Configure alerts:
   - Alert when health check fails 3 times in a row
   - Email + PagerDuty/Slack notification

---

**Production API URL:** https://api.nexus-alert.com

**DNS Status Check:** https://dnschecker.org/#A/api.nexus-alert.com

**SSL Status Check:** https://www.ssllabs.com/ssltest/analyze.html?d=api.nexus-alert.com
