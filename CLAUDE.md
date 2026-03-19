# CLAUDE.md

## DEPLOYMENT WORKFLOW

**GitHub is the staging environment. All production deployments are manual.**

### Engineer Workflow (YOU):
1. **Write code** — Make your changes to the codebase
2. **Verify build** — Run `npm run build` (in `/web` directory) to verify ZERO errors
3. **Fix errors** — If build fails, fix all errors and repeat step 2
4. **Commit and push** — Commit changes and push to GitHub
   ```bash
   git add -A
   git commit -m "descriptive message"
   git push origin main
   ```

### Production Deployment (MANUAL ONLY):
- **DO NOT** deploy to Vercel
- **DO NOT** run `vercel`, `vercel deploy`, or any Vercel CLI commands
- **DO NOT** run `npm run build` for deployment purposes (only for verification)
- All deployments to hosting platforms are handled manually by Michael
- Never auto-deploy

### Summary:
- ✅ Push to GitHub (staging)
- ✅ Run `npm run build` to verify (no errors)
- ❌ Deploy to Vercel or any hosting platform
- ❌ Auto-deploy anything
