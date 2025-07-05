# Database Setup Guide for RupeeRush

This guide will help you set up your Supabase database and storage for the RupeeRush fantasy trading platform.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: RupeeRush
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users (Asia Pacific for India)
5. Click "Create new project"
6. Wait for project to be ready (2-3 minutes)

### 2. Get Database Connection Details

From your Supabase project dashboard:

1. Go to **Settings** → **Database**
2. Copy your connection details:

```
Direct Connection (for persistent connections):
postgresql://postgres:[YOUR-PASSWORD]@db.oyuyzzmtpdzvakppfeyz.supabase.co:5432/postgres

Transaction Pooler (for serverless/short connections):
postgresql://postgres.oyuyzzmtpdzvakppfeyz:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

Session Pooler (IPv4 compatible):
postgresql://postgres.oyuyzzmtpdzvakppfeyz:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres
```

### 3. Get API Keys

1. Go to **Settings** → **API**
2. Copy these values to your `.env` file:

```env
VITE_SUPABASE_URL=https://oyuyzzmtpdzvakppfeyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 4. Run Database Migrations

The database schema is already defined in migration files. To apply them:

#### Option A: Using Supabase Dashboard (Recommended)

1. Go to **SQL Editor** in your Supabase dashboard
2. Run each migration file in order:
   - `20250525061041_teal_temple.sql`
   - `20250525061232_polished_river.sql`
   - `20250526031411_sweet_water.sql`
   - `20250621031019_damp_ember.sql`
   - `20250621031020_fix_storage_policies.sql` (new)

3. Copy and paste the content of each file and click "Run"

#### Option B: Using Supabase CLI (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref oyuyzzmtpdzvakppfeyz

# Push migrations
supabase db push
```

### 5. Set Up Storage Bucket

1. Go to **Storage** in your Supabase dashboard
2. Click "Create a new bucket"
3. Create bucket with these settings:
   - **Name**: `kyc-documents`
   - **Public**: ❌ (Keep private)
   - **File size limit**: 10 MB
   - **Allowed MIME types**: `image/jpeg,image/png,image/jpg,application/pdf`

4. The storage policies will be automatically applied from the migration

## 📊 Database Schema Overview

Your RupeeRush database includes these tables:

### Core Tables

1. **profiles** - User profile information
   - Links to Supabase auth.users
   - Stores username, full name, avatar
   - Timestamps for created/updated

2. **portfolios** - User trading portfolios
   - Links to profiles
   - Stores portfolio name, initial value, cash
   - Tracks portfolio performance

3. **portfolio_stocks** - Individual stock holdings
   - Links to portfolios
   - Stores symbol, quantity, average price
   - Tracks current value and performance

4. **kyc_details** - KYC verification information
   - Links to users
   - Stores personal info, ID details, bank details
   - Tracks verification status

5. **contests_participants** - Contest participation
   - Links users to contests
   - Tracks rankings and performance
   - Stores profit/loss data

### Security Features

- **Row Level Security (RLS)** enabled on all tables
- **Policies** ensure users can only access their own data
- **Foreign key constraints** maintain data integrity
- **Indexes** for optimal query performance

## 🔒 Security Configuration

### Row Level Security Policies

All tables have RLS policies that ensure:
- Users can only see their own data
- Authenticated users required for all operations
- Proper foreign key relationships enforced

### Storage Security

KYC documents are stored securely with:
- User-specific folder structure
- Upload-only permissions (no updates/deletes)
- Private bucket (not publicly accessible)
- File type and size restrictions

## 🧪 Testing Your Database

### 1. Test Connection

```sql
-- Run this in SQL Editor to test connection
SELECT 
  current_database() as database_name,
  current_user as user_name,
  version() as postgres_version;
```

### 2. Verify Tables

```sql
-- Check if all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

### 3. Test RLS Policies

```sql
-- This should return empty (no access without auth)
SELECT * FROM profiles;

-- This should work after authentication
SELECT auth.uid() as current_user_id;
```

### 4. Test Storage Bucket

1. Go to **Storage** → **kyc-documents**
2. Try uploading a test image
3. Verify you can see the file
4. Check that policies prevent unauthorized access

## 🔧 Environment Configuration

Add these to your `.env` file:

```env
# Database (Required)
VITE_SUPABASE_URL=https://oyuyzzmtpdzvakppfeyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Optional: Direct database connection for server-side operations
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.oyuyzzmtpdzvakppfeyz.supabase.co:5432/postgres
```

## 📈 Performance Optimization

### Indexes

The schema includes optimized indexes for:
- User lookups by ID
- Portfolio queries by user
- Contest participant rankings
- KYC status checks

### Connection Pooling

For production, use the appropriate connection string:
- **Serverless/Lambda**: Transaction Pooler
- **Traditional servers**: Direct Connection
- **IPv4 networks**: Session Pooler

## 🚨 Troubleshooting

### Common Issues

#### Migration Errors
```
ERROR: relation "table_name" already exists
```
**Solution**: Tables already exist, skip that migration

#### RLS Policy Errors
```
ERROR: new row violates row-level security policy
```
**Solution**: Ensure user is authenticated and owns the data

#### Storage Upload Errors
```
ERROR: new row violates policy
```
**Solution**: Check bucket exists and user is authenticated

### Getting Help

1. Check Supabase logs in dashboard
2. Verify environment variables are correct
3. Test authentication flow first
4. Contact support: support@rupeerush.com

## 🔄 Backup and Maintenance

### Automated Backups

Supabase provides:
- Daily automated backups (7 days retention)
- Point-in-time recovery
- Manual backup creation

### Maintenance Tasks

1. **Weekly**: Review slow queries in dashboard
2. **Monthly**: Check storage usage and cleanup
3. **Quarterly**: Review and update RLS policies
4. **Annually**: Rotate API keys and passwords

## 📞 Support

For database setup issues:
- **Supabase Support**: [support.supabase.com](https://support.supabase.com)
- **RupeeRush Support**: support@rupeerush.com
- **Documentation**: [supabase.com/docs](https://supabase.com/docs)

---

**Next Steps**: After completing database setup, proceed to environment configuration and application deployment.