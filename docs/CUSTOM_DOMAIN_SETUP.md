# Custom Domain Setup Guide for RupeeRush

This guide will help you set up a custom domain for your RupeeRush application.

## 🌐 Current Domain Options

Your RupeeRush application can be accessed via:
- **Default Netlify**: `https://your-app-name.netlify.app`
- **Default Vercel**: `https://your-app-name.vercel.app`
- **Custom Domain**: `https://yourdomain.com` (what we'll set up)

## 🚀 Setting Up Custom Domain

### Option 1: Netlify Custom Domain

1. **Purchase Your Domain**
   - Buy from providers like GoDaddy, Namecheap, Google Domains, etc.
   - Popular choices for Indian businesses:
     - `yourcompany.com`
     - `yourcompany.in`
     - `yourcompany.co.in`

2. **Add Domain in Netlify**
   ```bash
   # In Netlify Dashboard:
   # 1. Go to Site Settings > Domain Management
   # 2. Click "Add custom domain"
   # 3. Enter your domain (e.g., rupeerush.com)
   # 4. Click "Verify"
   ```

3. **Configure DNS Records**
   ```dns
   # Add these records in your domain provider's DNS settings:
   
   # For root domain (rupeerush.com):
   Type: A
   Name: @
   Value: 75.2.60.5
   
   # For www subdomain:
   Type: CNAME
   Name: www
   Value: your-app-name.netlify.app
   
   # Alternative: Use Netlify's DNS (recommended)
   # Point your domain's nameservers to:
   # dns1.p01.nsone.net
   # dns2.p01.nsone.net
   # dns3.p01.nsone.net
   # dns4.p01.nsone.net
   ```

4. **Enable HTTPS**
   ```bash
   # Netlify automatically provides SSL certificates
   # 1. Go to Site Settings > Domain Management
   # 2. Click "Verify DNS configuration"
   # 3. Wait for SSL certificate provisioning (usually 24-48 hours)
   # 4. Enable "Force HTTPS" option
   ```

### Option 2: Vercel Custom Domain

1. **Add Domain in Vercel**
   ```bash
   # In Vercel Dashboard:
   # 1. Go to Project Settings > Domains
   # 2. Enter your domain name
   # 3. Click "Add"
   ```

2. **Configure DNS Records**
   ```dns
   # For root domain:
   Type: A
   Name: @
   Value: 76.76.19.19
   
   # For www subdomain:
   Type: CNAME
   Name: www
   Value: cname.vercel-dns.com
   ```

### Option 3: Custom Server with Domain

1. **Server Setup**
   ```bash
   # If using your own server:
   # 1. Point A record to your server IP
   # 2. Configure web server (Nginx/Apache)
   # 3. Set up SSL certificate (Let's Encrypt)
   ```

## 🔧 Domain Configuration Examples

### Popular Domain Suggestions for RupeeRush

```text
Primary Options:
- rupeerush.com
- rupeerush.in
- rupeerush.co.in

Alternative Options:
- tradewithrupees.com
- fantasytradeindia.com
- stockrush.in
- tradingcontest.in
- virtualtrading.in
```

### DNS Configuration Template

```dns
# Replace 'yourdomain.com' with your actual domain

# Root domain
Type: A
Name: @
Value: [Your hosting provider's IP]
TTL: 3600

# WWW subdomain
Type: CNAME
Name: www
Value: [Your hosting provider's domain]
TTL: 3600

# Email (if needed)
Type: MX
Name: @
Value: [Your email provider's MX records]
Priority: 10
TTL: 3600

# Subdomains (optional)
Type: CNAME
Name: api
Value: [Your API endpoint]
TTL: 3600

Type: CNAME
Name: admin
Value: [Your admin panel]
TTL: 3600
```

## 📱 Update Application Configuration

### 1. Update Environment Variables

```env
# Add to your .env file:
VITE_APP_DOMAIN=https://yourdomain.com
VITE_API_BASE_URL=https://yourdomain.com/api
VITE_CANONICAL_URL=https://yourdomain.com

# Update existing URLs:
VITE_SUPPORT_EMAIL=support@yourdomain.com
VITE_CONTACT_EMAIL=contact@yourdomain.com
```

### 2. Update Clerk Configuration

```bash
# In Clerk Dashboard:
# 1. Go to Configure > Domains
# 2. Add your custom domain
# 3. Update redirect URLs:
#    - https://yourdomain.com
#    - https://yourdomain.com/auth
#    - https://yourdomain.com/contests
```

### 3. Update Supabase Configuration

```bash
# In Supabase Dashboard:
# 1. Go to Authentication > URL Configuration
# 2. Add your domain to allowed origins:
#    - https://yourdomain.com
#    - https://www.yourdomain.com
```

### 4. Update Razorpay Configuration

```bash
# In Razorpay Dashboard:
# 1. Go to Settings > Webhooks
# 2. Update webhook URLs to your domain
# 3. Add domain to allowed origins
```

## 🔒 SSL Certificate Setup

### Automatic SSL (Recommended)

```bash
# Most hosting providers offer automatic SSL:
# - Netlify: Automatic Let's Encrypt
# - Vercel: Automatic SSL
# - Cloudflare: Free SSL with CDN
```

### Manual SSL Setup

```bash
# For custom servers using Certbot:
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Auto-renewal:
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## 📊 Domain Performance Optimization

### CDN Setup (Optional)

```bash
# Cloudflare CDN Setup:
# 1. Sign up at cloudflare.com
# 2. Add your domain
# 3. Update nameservers to Cloudflare's
# 4. Configure caching rules
# 5. Enable security features
```

### Performance Settings

```nginx
# Nginx configuration example:
server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;
    
    # SSL configuration
    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    
    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 🧪 Testing Your Domain

### DNS Propagation Check

```bash
# Check DNS propagation:
nslookup yourdomain.com
dig yourdomain.com

# Online tools:
# - whatsmydns.net
# - dnschecker.org
```

### SSL Certificate Verification

```bash
# Check SSL certificate:
openssl s_client -connect yourdomain.com:443

# Online tools:
# - ssllabs.com/ssltest
# - sslshopper.com/ssl-checker.html
```

## 📞 Support and Troubleshooting

### Common Issues

1. **DNS Not Propagating**
   - Wait 24-48 hours for full propagation
   - Clear DNS cache: `ipconfig /flushdns` (Windows) or `sudo dscacheutil -flushcache` (Mac)

2. **SSL Certificate Issues**
   - Verify DNS is pointing correctly
   - Check certificate authority validation
   - Ensure all subdomains are included

3. **Redirect Loops**
   - Check hosting provider's redirect settings
   - Verify HTTPS enforcement configuration

### Getting Help

- **Netlify Support**: [docs.netlify.com](https://docs.netlify.com)
- **Vercel Support**: [vercel.com/docs](https://vercel.com/docs)
- **Domain Registrar**: Contact your domain provider's support
- **RupeeRush Support**: support@yourdomain.com

## 🎉 Post-Setup Checklist

- [ ] Domain resolves correctly
- [ ] SSL certificate is active
- [ ] All redirects work properly
- [ ] Authentication flows work
- [ ] Payment processing works
- [ ] Email delivery works
- [ ] SEO settings updated
- [ ] Analytics tracking updated
- [ ] Social media links updated

---

**Next Steps**: After setting up your custom domain, update all marketing materials, business cards, and social media profiles with your new domain!