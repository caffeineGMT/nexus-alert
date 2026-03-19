# Staging & Production Deployment Workflow

## Overview
This project uses a **two-tier deployment strategy**:
- **GitHub Pages** = Staging/Preview environment
- **Vercel** = Production environment (manual trigger only)

## Workflow

```
Code Changes → Build Passes → Push to GitHub → GitHub Pages Auto-Deploy → Preview & Test → Manual Vercel Deploy
```

### 1. Staging (GitHub Pages) - Automatic
- **Trigger**: Every push to `main` branch
- **URL**: https://caffeinegmt.github.io/nexus-alert/
- **Purpose**: Preview changes before production
- **Process**: Fully automated via GitHub Actions

### 2. Production (Vercel) - Manual
- **Trigger**: Manual deployment by Michael
- **URL**: https://nexus-alert.vercel.app (or custom domain)
- **Purpose**: Live production site
- **Process**: Manual trigger only - never auto-deployed

## GitHub Pages Setup

The GitHub Actions workflow (`.github/workflows/deploy-github-pages.yml`) automatically:
1. Builds the Next.js app with `basePath: /nexus-alert`
2. Exports static files to `out/` directory
3. Deploys to GitHub Pages
4. Available at: https://caffeinegmt.github.io/nexus-alert/

### First-Time Setup (One-Time Only)
1. Go to: https://github.com/caffeineGMT/nexus-alert/settings/pages
2. Under "Build and deployment":
   - **Source**: Select "GitHub Actions"
3. Save

## Development Workflow

### For Every Change:
```bash
# 1. Make your changes
npm run dev  # Test locally at http://localhost:3000

# 2. Commit and push
git add -A
git commit -m "Your feature description"
git push origin main

# 3. GitHub Actions auto-builds and deploys to staging
# Check workflow: https://github.com/caffeineGMT/nexus-alert/actions

# 4. Preview at: https://caffeinegmt.github.io/nexus-alert/

# 5. If staging looks good, manually deploy to Vercel production
```

### Testing Staging Build Locally
```bash
cd web
NEXT_PUBLIC_BASE_PATH=/nexus-alert npm run build
npx serve out  # Preview at http://localhost:3000/nexus-alert
```

## Environment Variables

- **Local Development**: No `NEXT_PUBLIC_BASE_PATH` (runs at `/`)
- **GitHub Pages**: `NEXT_PUBLIC_BASE_PATH=/nexus-alert` (set in workflow)
- **Vercel Production**: No `NEXT_PUBLIC_BASE_PATH` (runs at `/`)

## Deployment Status

Check deployment status:
- **Staging**: https://github.com/caffeineGMT/nexus-alert/actions
- **Production**: Vercel dashboard (manual deployments only)

## Rollback

- **GitHub Pages**: Revert the commit and push
- **Vercel**: Use Vercel dashboard to rollback to previous deployment

## Notes

- GitHub Pages serves from the `main` branch via GitHub Actions
- Production Vercel deployments are **never** automatic - always manual
- The `basePath` is only used for GitHub Pages staging, not for production
- The `.nojekyll` file prevents GitHub Pages from processing files with Jekyll
