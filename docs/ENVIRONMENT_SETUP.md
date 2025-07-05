# Environment Configuration Guide for RupeeRush

This guide will help you set up all the necessary environment variables for your RupeeRush fantasy trading platform.

## 🚀 Quick Start

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Fill in the required values in your `.env` file
3. Restart your development server

## 📋 Required Environment Variables

### 1. Authentication (Clerk) - **REQUIRED**

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key_here
```

**How to get:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select existing one
3. Go to "API Keys" section
4. Copy the "Publishable Key"

**Important:** Use `pk_test_` for development and `pk_live_` for production.

### 2. Database (Supabase) - **REQUIRED**

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

**How to get:**
1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Create a new project or select existing one
3. Go to Settings → API
4. Copy "Project URL" and "anon public" key

### 3. Payments (Razorpay) - **REQUIRED FOR PRODUCTION**

```env
# For Development (Test Mode)
VITE_RAZORPAY_KEY_ID=rzp_test_your_test_key_here
VITE_RAZORPAY_KEY_SECRET=your_test_secret_here

# For Production (Live Mode)
VITE_RAZORPAY_KEY_ID=rzp_live_your_live_key_here
VITE_RAZORPAY_KEY_SECRET=your_live_secret_here
```

**How to get:**
1. Go to [Razorpay Dashboard](https://dashboard.razorpay.com/)
2. Create account and complete KYC
3. Go to Settings → API Keys
4. Generate Test/Live keys as needed

**Security Note:** Keep live keys secure and never commit them to version control!

## 🔧 Optional Environment Variables

### Market Data APIs (For Live Data)

#### Finnhub API (Primary)
```env
VITE_FINNHUB_API_KEY=your_finnhub_api_key_here
VITE_FINNHUB_WEBHOOK_TOKEN=your_webhook_token_here
```

**How to get:**
1. Go to [Finnhub.io](https://finnhub.io/)
2. Sign up for free account
3. Get API key from dashboard
4. Generate webhook token for real-time data

#### Alpha Vantage API (Backup)
```env
VITE_ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
```

**How to get:**
1. Go to [Alpha Vantage](https://www.alphavantage.co/)
2. Sign up for free account
3. Get API key from dashboard

### Monitoring & Analytics

#### Sentry (Error Tracking)
```env
VITE_SENTRY_DSN=your_sentry_dsn_here
```

#### Google Analytics
```env
VITE_GA_TRACKING_ID=your_google_analytics_id_here
```

## 🏗️ Environment-Specific Setup

### Development Environment

```env
VITE_NODE_ENV=development
VITE_USE_MOCK_DATA=true
VITE_DEBUG_MODE=true
VITE_SHOW_DEV_TOOLS=true
```

### Staging Environment

```env
VITE_NODE_ENV=staging
VITE_USE_MOCK_DATA=false
VITE_DEBUG_MODE=false
VITE_SHOW_DEV_TOOLS=false
```

### Production Environment

```env
VITE_NODE_ENV=production
VITE_USE_MOCK_DATA=false
VITE_DEBUG_MODE=false
VITE_SHOW_DEV_TOOLS=false
VITE_ENABLE_LOGGING=false
```

## 🔒 Security Best Practices

### 1. Environment File Security
- Never commit `.env` files to version control
- Use different keys for development/staging/production
- Regularly rotate API keys
- Use environment-specific configurations

### 2. Key Management
- Store production keys in secure environment variable systems
- Use CI/CD pipeline secrets for deployment
- Implement key rotation policies
- Monitor API key usage

### 3. Access Control
- Limit API key permissions to minimum required
- Use IP whitelisting where possible
- Implement rate limiting
- Monitor for unusual activity

## 🚀 Deployment Configuration

### Netlify Deployment

1. Go to Netlify Dashboard
2. Site Settings → Environment Variables
3. Add all required environment variables
4. Deploy your site

### Vercel Deployment

1. Go to Vercel Dashboard
2. Project Settings → Environment Variables
3. Add variables for each environment (Development, Preview, Production)
4. Deploy your project

### Custom Server Deployment

1. Set environment variables on your server:
   ```bash
   export VITE_CLERK_PUBLISHABLE_KEY="your_key_here"
   export VITE_SUPABASE_URL="your_url_here"
   # ... other variables
   ```

2. Or use a `.env` file on the server (ensure proper permissions)

## 🧪 Testing Your Configuration

### 1. Check Environment Variables
```bash
# In your project directory
npm run dev
```

### 2. Verify Services
- **Clerk:** Try signing up/logging in
- **Supabase:** Check database connections
- **Razorpay:** Test payment flow (use test mode)
- **Market Data:** Verify stock price updates

### 3. Common Issues

#### Clerk Issues
- Ensure publishable key starts with `pk_test_` or `pk_live_`
- Check domain configuration in Clerk dashboard
- Verify redirect URLs are set correctly

#### Supabase Issues
- Ensure URL format is correct: `https://xxx.supabase.co`
- Check RLS policies are properly configured
- Verify anon key permissions

#### Razorpay Issues
- Use test keys for development
- Ensure webhook URLs are configured
- Check currency settings (INR)

## 📞 Support

If you encounter issues with environment setup:

1. Check the console for error messages
2. Verify all required variables are set
3. Ensure API keys are valid and active
4. Contact support: support@rupeerush.com

## 🔄 Environment Variable Updates

When updating environment variables:

1. Update `.env.example` with new variables
2. Document changes in this guide
3. Notify team members of required updates
4. Update deployment configurations
5. Test in all environments

---

**Remember:** Keep your environment variables secure and never share production keys publicly!