---
description: Connect a custom domain to your Vercel project in 3 steps. DNS records, SSL setup, www vs apex, and CLI commands for production deployments.
---

# Vercel Domains

Vercel Domains lets you purchase, manage, and configure custom domains directly from the Vercel platform. You can connect domains to your Vercel projects, manage DNS records, and set up SSL certificates — all from the Vercel dashboard or CLI.

## Setting Up a Custom Domain

### 1. Add a Domain to Your Project

In your Vercel project settings, go to Domains and add your domain:

```bash
# Or via CLI
vercel domains add yourdomain.com
```

### 2. Configure DNS

If your domain is registered elsewhere, point it to Vercel:

**Option A: Using Vercel Nameservers (Recommended)**

Update your domain registrar's nameservers to:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

**Option B: Using CNAME/A Records**

| Type | Name | Value |
|------|------|-------|
| A | @ | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |

### 3. SSL Certificates

Vercel automatically provisions and renews SSL certificates for all custom domains. No configuration needed — HTTPS works immediately.

## Domain Configuration

### Redirects

Configure which domain is primary:

- `yourdomain.com` → `www.yourdomain.com` (or vice versa)
- Set one as primary, the other redirects automatically

### Subdomains

Add subdomains for different projects or environments:

- `app.yourdomain.com` → Main application
- `docs.yourdomain.com` → Documentation site
- `api.yourdomain.com` → API endpoints

### Preview Deployment Domains

Every branch and PR gets a unique preview URL:
- `your-project-git-branch-name.vercel.app`

## Environment-Specific Domains

| Environment | Domain |
|-------------|--------|
| Production | `yourdomain.com` |
| Preview | `your-project-***.vercel.app` |
| Development | `localhost:3000` |

## Best Practices

- Use Vercel nameservers for the simplest setup and fastest DNS propagation
- Set up both root domain (`yourdomain.com`) and `www` subdomain
- Configure redirects so one is canonical (for SEO)
- Use environment variables with `NEXT_PUBLIC_APP_URL` that change per environment

## Resources

- [Vercel Domains Documentation](https://vercel.com/docs/projects/domains)
- [Vercel DNS Documentation](https://vercel.com/docs/projects/domains/working-with-dns)
- [Custom Domain Troubleshooting](https://vercel.com/docs/projects/domains/troubleshooting)
