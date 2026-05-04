# Blew - Vercel Deployment Guide

## 🚀 Deployment Instructions

### Step 1: Prerequisites

- Neon PostgreSQL account: https://console.neon.tech/
- Vercel account: https://vercel.com/
- GitHub repository with code pushed
- Solana devnet SOL (free, get from faucet)

### Step 2: Set Up Neon Database

1. Create a Neon project: https://console.neon.tech/
2. Create a database named `blew`
3. Get the connection string: `postgresql://user:password@ep-xxxx.xxx.us-east-1.aws.neon.tech/blew?sslmode=require`
4. Save this as `DATABASE_URL` for later

### Step 3: Deploy to Vercel

#### Option A: Via CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd c:/zebra/work/Projects/PIas/blew
vercel deploy --prod
```

#### Option B: Via GitHub

1. Push code to GitHub: `git push origin main`
2. Go to https://vercel.com/new
3. Import your Blew repository
4. Select Framework: Next.js
5. Proceed to environment variables

### Step 4: Configure Environment Variables

In Vercel dashboard, set these environment variables for **Production**:

```env
DATABASE_URL=postgresql://user:password@ep-xxxx.xxx.us-east-1.aws.neon.tech/blew?sslmode=require
SOLANA_CLUSTER=devnet
SOLANA_RPC_URL=https://api.devnet.solana.com
HELIUS_RPC_URL=                          # Optional: for rate limiting
CRON_SECRET=blew_cron_secret_12345678   # Generate random string
```

**Getting CRON_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Run Prisma Migrations

```bash
# Connect to your production database
# Option 1: Via Vercel CLI
vercel env pull
npm run db:migrate

# Option 2: Manually
export DATABASE_URL="your_neon_connection_string"
npm run db:migrate
```

### Step 6: Set Up Cron Job for Background Tasks

The background job endpoint runs TX monitoring and webhook delivery.

#### Option A: EasyCron (Recommended for MVP)

1. Go to https://www.easycron.com/
2. Create new cron:
   - **URL:** `https://your-vercel-deployment.vercel.app/api/cron/background-jobs`
   - **Method:** POST
   - **Headers:** 
     ```
     Authorization: Bearer YOUR_CRON_SECRET
     ```
   - **Cron Expression:** `*/5 * * * *` (every 5 seconds)
   - **Timeout:** 30 seconds

#### Option B: AWS EventBridge

1. Create EventBridge rule:
   - Rate: 5 seconds
   - Target: HTTPS POST to `/api/cron/background-jobs`
   - Include header: `Authorization: Bearer YOUR_CRON_SECRET`

#### Option C: Vercel Cron Functions (When Available)

```typescript
// pages/api/cron/background-jobs.ts
export const config = {
  maxDuration: 60,
}

// Already implemented in repo
```

### Step 7: Verify Deployment

```bash
# Test API health
curl https://your-vercel-deployment.vercel.app/api/health

# Test dashboard
curl https://your-vercel-deployment.vercel.app/dashboard

# Test cron job (requires CRON_SECRET)
curl -X POST https://your-vercel-deployment.vercel.app/api/cron/background-jobs \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Step 8: Merchant Integration

Once deployed, merchants can:

1. Register: `POST /api/merchants/register`
   ```json
   {
     "email": "merchant@example.com",
     "name": "My Store",
     "walletAddress": "GrwLnSoHzA2ER15aMZDUZBv94HeggqzuZh63zPhuc9Qh",
     "webhookUrl": "https://my-store.com/webhook"
   }
   ```

2. Receive API key and webhook secret

3. Embed widget on website
   ```html
   <script src="https://unpkg.com/@blew/widget@latest/dist/index.js"></script>
   <script>
     BlewWidget({
       merchantId: 'merchant_123',
       amount: 0.5,
       token: 'SOL',
       apiKey: 'blew_xxxx',
       onSuccess: (data) => console.log('Payment confirmed:', data)
     })
   </script>
   ```

---

## 📊 Production Checklist

- [ ] Database migrated to production
- [ ] Environment variables set in Vercel
- [ ] Health check passing
- [ ] Dashboard accessible
- [ ] Cron job running every 5 seconds
- [ ] Merchant registration working
- [ ] Test payment created and confirmed
- [ ] Webhook delivery validated
- [ ] Error logging configured
- [ ] Rate limiting in place (if needed)
- [ ] HTTPS enabled (Vercel default)
- [ ] Domain configured (custom domain or vercel.app)

---

## 🔍 Monitoring & Debugging

### View Logs

```bash
# Vercel dashboard
# https://vercel.com/dashboard → Select project → Functions

# Or via CLI
vercel logs --follow
```

### Common Issues

**1. Database connection failed**
```
Error: connect ECONNREFUSED
→ Check DATABASE_URL is correct
→ Verify Neon database is running
→ Check IP whitelist allows Vercel IPs
```

**2. Payment confirmation not working**
```
Error: Solana RPC timeout
→ Check SOLANA_RPC_URL is correct
→ Switch to Helius if rate limited
→ Verify network is devnet/testnet
```

**3. Webhook delivery failing**
```
Error: Cannot reach merchant webhook
→ Verify webhook URL is reachable
→ Check merchant webhook secret is correct
→ Verify network allows outbound HTTPS
```

### Enable Debug Logging

Add to `.env`:
```env
LOGGING_LEVEL=debug
DEBUG=blew:*
```

---

## 🔐 Security Checklist

- [ ] Database uses SSL connection (sslmode=require)
- [ ] CRON_SECRET is strong (32+ characters)
- [ ] API keys stored securely (never in client code)
- [ ] Webhook secrets stored in Neon
- [ ] CORS configured for widget origin
- [ ] Rate limiting on public endpoints
- [ ] Input validation on all endpoints
- [ ] Error messages don't leak sensitive info

---

## 📈 Scaling Considerations

### Current Limits
- Free tier: ~$0-5/month
- Database: Neon free tier (3GB)
- RPC: Helius free tier (10M requests/month)
- Vercel: 100 functions/100GB bandwidth free tier

### For Production
- Upgrade Neon: $20+/month
- Upgrade Vercel: $20+/month
- Use Phantom as HSM: https://www.phantom.app/business
- Consider dedicated RPC: $100+/month

---

## 🎓 Testing on Devnet

```bash
# 1. Get test SOL
airdrop 1 <your_devnet_wallet>

# 2. Test merchant registration
curl -X POST http://localhost:3000/api/merchants/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "name": "Test Store",
    "walletAddress": "GrwLnSoHzA2ER15aMZDUZBv94HeggqzuZh63zPhuc9Qh"
  }'

# 3. Test payment creation
curl -X POST http://localhost:3000/api/payments \
  -H "X-API-Key: blew_xxxx" \
  -H "Content-Type: application/json" \
  -d '{
    "merchantId": "merchant_123",
    "amount": "0.5",
    "token": "SOL"
  }'

# 4. View dashboard
open http://localhost:3000/dashboard
```

---

## 🚀 Post-Deployment Rollout

### Phase 1: Beta (Week 1)
- Deploy to `staging.vercel.app`
- Test with internal merchants
- Verify all endpoints working
- Check logs for errors

### Phase 2: Production (Week 2)
- Deploy to `blew-prod.vercel.app`
- Announce to merchant community
- Monitor for issues
- Gather feedback

### Phase 3: Scale (Week 3+)
- Monitor performance metrics
- Upgrade infrastructure as needed
- Plan for mainnet deployment
- Consider additional features

---

**Deployment Status:** ✅ Ready for production  
**Last Updated:** May 4, 2026  
**Next Steps:** Test on devnet, then deploy to Vercel production
