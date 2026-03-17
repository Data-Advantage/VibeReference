# How to Fix Common Vercel Account Issues

Vercel is the go-to deployment platform for solo founders, but account issues can stop your project cold. This guide covers the most common Vercel account problems and exactly how to fix them — from login failures to build errors to hitting plan limits.

## Can't Log In to Your Vercel Account

### Wrong login method

Vercel accounts are tied to the method you used to sign up. If you signed up with GitHub, you must continue logging in with GitHub — not email.

**Fix:** Go to [vercel.com/login](https://vercel.com/login), select the same provider you used to sign up (GitHub, GitLab, Bitbucket, or email).

### Email OTP not arriving

If you signed up with email, Vercel sends a six-digit one-time password (OTP) each time you log in.

**Fix:**
- Check your spam or junk folder
- Make sure you're checking the correct email address
- Wait up to 2 minutes before requesting a new OTP
- Add `noreply@vercel.com` to your contacts

### Two-factor authentication (2FA) locked out

If your team has 2FA enforcement enabled and you lose access to your authenticator:

**Fix:**
- Use a backup code saved when you set up 2FA
- Contact [Vercel support](https://vercel.com/support) to recover access

### GitHub app installation error

Sometimes signing up with GitHub fails due to GitHub database inconsistencies. Vercel installs its GitHub App but can't retrieve the installation.

**Fix:** Wait a couple of minutes, then try reconnecting GitHub in your account settings. If it persists, contact [GitHub Support](https://support.github.com/contact).

---

## Deployment Failures

### Build error: "Error" in build logs

The most common cause of deployment failure is a build script error.

**Fix:**
1. In your Vercel dashboard, go to **Deployments** → select the failed deployment
2. Expand the **Building** accordion to see build logs
3. Scroll to find red text where "Error" appears — look a few lines *above* the final error message for the actual cause
4. Run the same build command locally first: `npm run build` (or `yarn build`, `pnpm build`)
5. Fix the error locally, then push again

### Missing build script

If your `package.json` has no `build` script and no `api` directory, Vercel won't know how to build your project.

**Fix:** Add a build script to `package.json`:

```json
{
  "scripts": {
    "build": "next build"
  }
}
```

### Missing public/output directory

Vercel expects your build to output files to a specific directory.

**Fix:** In your project settings → **Build & Development Settings**, verify the **Output Directory** matches what your build actually produces (e.g., `out`, `.next`, `dist`, `public`).

### Build logs not available

This happens when Vercel detects a problem *before* the build starts:

- Invalid `vercel.json` configuration
- Commit author is not a team member
- Ignored Build Steps conflict

**Fix:** Check the error overlay on the Deployments page for the specific message. Validate your `vercel.json` using the [Vercel JSON schema](https://openapi.vercel.sh/vercel.json).

### "Cannot load project settings"

Error occurs when your local `.vercel` directory points to a team you're no longer a member of, or you're logged in to the wrong account.

**Fix:**
```bash
# Remove the stale .vercel config
rm -rf .vercel

# Redeploy to re-link
vercel
```

---

## Hobby Plan Limits Exceeded

The Hobby plan is free but has usage limits that reset every 30 days. When you hit them, features stop working until the cycle resets.

### Key Hobby plan limits

| Resource | Hobby Limit |
|----------|-------------|
| Deployments per day | 100 |
| Build execution minutes | 6,000/month |
| Function invocations | 1,000,000/month |
| Function duration | 100 GB-hours/month |
| Image optimization | 1,000 source images/month |
| Web Analytics events | 50,000/month |

### Build cancelled: out of memory (OOM)

Builds get 8 GB of memory and 23 GB of disk. Large dependencies or assets can exceed these limits.

**Fix:**
- Set `VERCEL_BUILD_SYSTEM_REPORT=1` as an environment variable to get detailed usage reports
- Reduce dependencies — audit what's in `node_modules`
- Use `npm install --only=production` to skip dev dependencies:
  - In project settings → **Build & Development Settings** → **Install Command**: set to `npm install --only=production`
- Remove large media files from your repo; use a CDN instead

### Build timeout (45-minute limit)

Builds that run longer than 45 minutes are automatically cancelled.

**Fix:**
- Clear the build cache: go to **Deployments** → **Redeploy** → uncheck "Use existing Build Cache"
- Or use the CLI: `vercel --force`
- For Next.js: follow [Vercel's guide to reducing build time](https://vercel.com/docs/build-output-api/v3)

### Exceeded usage — upgrade or wait

If you've hit monthly limits on the Hobby plan, you have two options:

1. **Wait** — limits reset 30 days after the cycle started
2. **Upgrade to Pro** — $20/month per user, with 4× higher limits across the board

---

## Team and Collaboration Problems

### Can't add team members

Team collaboration requires the **Pro plan** ($20/user/month). The Hobby plan is for individual use only.

**Fix:** Upgrade to Pro → Settings → Billing → Upgrade.

### Committer's deployment is blocked

When a team uses **Manual Approval** mode, new contributors' deployments are blocked until a team owner approves them.

**Fix (as team owner):**
1. Go to team Settings → **Members** → **Collaboration**
2. Find the pending approval and click **Approve**

If the committer has no Vercel account, they must create one and link their Git provider first.

### Hit the 10-member request limit

A team can only have 10 open join requests at once.

**Fix:** Approve or decline pending requests in Settings → Members before new ones can come in.

### Can't leave a team

You cannot leave a team if you're the last Owner or last confirmed Member.

**Fix:**
1. Assign another Member as Owner first
2. Then leave from Settings → scroll to **Leave Team**

If you're the only Member remaining, delete the team instead.

---

## Git Integration Problems

### Lost access to Git repository

Vercel loses Git access if:
- The repository is deleted or archived
- The Vercel GitHub App is uninstalled
- Access permissions were changed for the GitHub App

**Fix:**
1. Go to [GitHub Settings → Applications](https://github.com/settings/installations)
2. Under **Installed GitHub Apps**, click **Vercel**
3. Make sure your repository is listed under accessible repositories
4. If not, click **Configure** and add it

### Preview branch can't be used as production branch

If a Git branch is already configured as a preview branch (assigned to a domain or environment variable), Vercel won't let you set it as the production branch.

**Fix:**
1. Go to project Settings → **Domains**: remove the Git branch assignment from any domains
2. Go to project Settings → **Environment Variables**: remove the Git branch from any variables set to that branch
3. Now you can set it as the production branch

---

## Billing and Account Issues

### Account blocked (451 error)

Vercel blocks accounts or deployments that violate their [fair use guidelines](https://vercel.com/docs/limits/fair-use-guidelines) or Terms of Service.

**Fix:** Contact [registration@vercel.com](mailto:registration@vercel.com) directly.

### Hobby plan — commercial use restriction

The Hobby plan is restricted to non-commercial, personal use only. Running a business on the Hobby plan violates Vercel's fair use policy.

**Fix:** Upgrade to Pro before launching your commercial product.

### Changing your primary email

**Fix:**
1. Settings → scroll to **Emails**
2. Click **Add Another** to add a new email address
3. Verify the new address via the link Vercel sends
4. In the dot menu next to the new address, click **Set as Primary**

---

## vercel.json Configuration Errors

### Conflicting config files

If both `vercel.json` and `now.json` exist in your project, Vercel throws an error.

**Fix:** Delete `now.json` — it's the legacy config format.

Similarly:
- Delete `.now` directory if `.vercel` also exists
- Remove `NOW_`-prefixed env vars if `VERCEL_`-prefixed versions also exist

### Invalid route source pattern

Vercel routes use `path-to-regexp` syntax, not standard regex. Negative lookaheads must be wrapped in a group.

**Before (broken):**
```json
{ "source": "/feedback/(?!general)", "destination": "/api/feedback/general" }
```

**After (fixed):**
```json
{ "source": "/feedback/((?!general).*)", "destination": "/api/feedback/general" }
```

---

## Quick Reference: Common Errors and Fixes

| Error | Likely Cause | Fix |
|-------|-------------|-----|
| Build failed — exit code 1 | Script error | Run `npm run build` locally first |
| "Team access required to deploy" | Manual approval mode | Team owner must approve membership |
| 451 error on your site | Account blocked | Email registration@vercel.com |
| "Cannot load project settings" | Wrong account / stale config | Delete `.vercel` folder, redeploy |
| Build cancelled | OOM or timeout | Clear cache, reduce dependencies |
| OTP not received | Spam filter | Check spam, add Vercel to contacts |
| Can't connect GitHub | App installation failed | Wait 2 min, retry; contact GitHub Support |

---

## Resources

- [Vercel Account Management Docs](https://vercel.com/docs/accounts)
- [Vercel Error List](https://vercel.com/docs/errors/error-list)
- [Vercel Hobby Plan Details](https://vercel.com/docs/plans/hobby)
- [Troubleshooting Build Errors](https://vercel.com/docs/deployments/troubleshoot-a-build)
- [Vercel Support](https://vercel.com/support)
