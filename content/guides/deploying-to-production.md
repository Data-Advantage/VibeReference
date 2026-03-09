---
title: "Deploying to Production"
---

# Deploying to Production

Vercel deployment, environment variables, custom domains, SSL, and CI/CD basics for your SaaS app.

## Deploying to Vercel

Vercel is the default hosting platform for Next.js apps. Deployment takes minutes.

### First Deployment

1. **Push your code to GitHub** (if you haven't already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create my-app --public --push --source .
   ```

2. **Connect to Vercel**:
   - Go to vercel.com and sign in with GitHub
   - Click "Add New Project"
   - Select your repository
   - Vercel auto-detects Next.js settings
   - Click "Deploy"

That's it. Every push to `main` now triggers an automatic deployment.

### Preview Deployments

Every pull request gets its own preview URL automatically. This is useful for:
- Testing changes before merging
- Sharing work-in-progress with others
- Running QA on a production-like environment

## Environment Variables

### Setting Variables in Vercel

Go to **Project Settings > Environment Variables** and add each variable.

Vercel supports three environments:
- **Production** — Your live site
- **Preview** — PR preview deployments
- **Development** — Used with `vercel dev` locally

### Required Variables for a Typical SaaS

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...

# App
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### Security Rules
- **`NEXT_PUBLIC_` prefix** = exposed to the browser. Only use for truly public values (Supabase anon key, publishable Stripe key)
- **Without prefix** = server-only. Use for secrets (service role keys, Stripe secret key, webhook secrets)
- **Never commit `.env` files** to git. Add `.env*.local` to `.gitignore`

## Custom Domains

### Adding a Domain in Vercel

1. Go to **Project Settings > Domains**
2. Enter your domain (e.g., `myapp.com`)
3. Vercel shows DNS records to configure

### DNS Configuration

If your domain is registered elsewhere (Namecheap, Google Domains, etc.):

| Type | Name | Value |
|------|------|-------|
| A | @ | `76.76.21.21` |
| CNAME | www | `cname.vercel-dns.com` |

If you want to use Vercel as your DNS provider (recommended), update your nameservers to the ones Vercel provides.

### SSL/HTTPS

Vercel provides free SSL certificates automatically. No configuration needed. Certificates auto-renew.

### Redirect www to apex (or vice versa)

In your Vercel domain settings, choose your preferred domain. Vercel will automatically redirect the other variant.

## Production Checklist

Before going live, verify:

### Environment & Config
- [ ] All environment variables are set for Production
- [ ] `NEXT_PUBLIC_APP_URL` points to your production domain
- [ ] Stripe is using **live** keys (not test keys)
- [ ] Supabase project is on a paid plan (if expecting traffic)
- [ ] Database connection pooling is enabled

### Functionality
- [ ] Authentication flow works (signup, login, logout, password reset)
- [ ] Payment flow works with a real card (use Stripe's test mode toggle)
- [ ] All pages load without errors (check browser console)
- [ ] Forms submit correctly
- [ ] Emails are delivered (verify SMTP or email service)

### Performance & SEO
- [ ] Images are optimized (use `next/image`)
- [ ] Meta tags are set on all pages
- [ ] `robots.txt` and `sitemap.xml` are configured
- [ ] Open Graph images are set for social sharing
- [ ] Core Web Vitals are acceptable (check with Lighthouse)

### Security
- [ ] No secrets in client-side code
- [ ] RLS enabled on all Supabase tables
- [ ] Rate limiting on API routes
- [ ] CORS configured correctly
- [ ] Error pages don't expose stack traces

## Build & Deploy Settings

### Vercel Build Configuration

In **Project Settings > General**:
- **Framework Preset**: Next.js (auto-detected)
- **Build Command**: `next build` (default)
- **Output Directory**: `.next` (default)
- **Node.js Version**: 18.x or 20.x

### Ignoring Builds

To skip deployments for non-code changes (like docs), add to `vercel.json`:

```json
{
  "ignoreCommand": "git diff HEAD^ HEAD --quiet -- . ':!docs' ':!*.md'"
}
```

## Monitoring After Deployment

### Vercel Analytics

Enable in **Project Settings > Analytics**. Provides:
- Core Web Vitals (LCP, FID, CLS)
- Page views and visitor counts
- Performance by page

### Vercel Logs

Go to **Project > Logs** to see:
- Serverless function invocations
- Build logs
- Error traces

### Set Up Alerts

Configure alerts in Vercel for:
- Build failures
- High error rates
- Performance degradation

## Continuous Deployment Workflow

### Recommended Git Workflow

```
main (production) ← PR ← feature-branch (preview)
```

1. Create a feature branch
2. Push changes → Vercel creates a preview deployment
3. Test on the preview URL
4. Open a PR → Team reviews code + preview
5. Merge to `main` → Vercel deploys to production

### Rollbacks

If a bad deployment goes live:
1. Go to **Project > Deployments**
2. Find the last working deployment
3. Click the three-dot menu > **Promote to Production**

This is instant — no rebuild needed.
