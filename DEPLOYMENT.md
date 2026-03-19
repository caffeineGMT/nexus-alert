# Deployment Workflow

## Overview
**GitHub is the staging environment. All production deployments are manual.**

This project uses a **manual deployment strategy** where:
- **GitHub** = Code staging (no auto-deployment)
- **Production** = Manually deployed by Michael when ready

## Engineer Workflow

### 1. Write Code
Make your changes to the codebase

### 2. Verify Build
Run `npm run build` to verify **ZERO errors**:
```bash
cd web
npm run build
```

### 3. Fix Errors
If build fails, fix all errors and repeat step 2

### 4. Commit and Push to GitHub
```bash
git add -A
git commit -m "descriptive message"
git push origin main
```

**That's it!** Code is now in GitHub (staging). Production deployment is handled manually by Michael.

## Production Deployment (Manual Only)

Production deployment is done manually by Michael. This includes:
- Vercel deployments
- Cloudflare Workers (backend)
- Any other hosting platforms

### DO NOT:
- ❌ Deploy to Vercel
- ❌ Run `vercel`, `vercel deploy`, or any Vercel CLI commands
- ❌ Run `npm run build` for deployment purposes (only for verification)
- ❌ Auto-deploy to any hosting platform

### DO:
- ✅ Push to GitHub (staging)
- ✅ Run `npm run build` to verify zero errors
- ✅ Commit descriptive messages
- ✅ Let Michael handle production deployments

## Local Development

### Development Server
```bash
cd web
npm run dev  # http://localhost:3000
```

### Test Production Build Locally
```bash
cd web
npm run build
npx serve out  # http://localhost:3000
```

## Deployment Status

- **Staging**: Check GitHub repository
- **Production**: Ask Michael for deployment status

## Notes

- No automatic deployments anywhere
- GitHub is for code staging only
- All production deployments require manual trigger by Michael
- This ensures full control over what goes live and when
