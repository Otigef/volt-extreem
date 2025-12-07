# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Code Quality
- [ ] All tests pass: `pnpm test`
- [ ] TypeScript compiles without errors: `pnpm typecheck`
- [ ] Code formatted: `pnpm format.fix`
- [ ] No console errors in browser dev tools
- [ ] No linting errors

### Build & Test
- [ ] Production build completes successfully: `pnpm build`
- [ ] Local production server runs: `pnpm start`
- [ ] All routes load correctly (SPA routing)
- [ ] 404 page works for invalid routes
- [ ] All animations and interactions work

### Configuration
- [ ] All environment variables are documented in `env.example.txt`
- [ ] Environment variables are set in deployment platform
- [ ] SMTP credentials are configured (for contact form)
- [ ] CORS origins are configured if needed
- [ ] Port configuration is correct

### Content
- [ ] Meta tags in `index.html` are updated with your domain
- [ ] Open Graph images are set and accessible
- [ ] Favicon is configured
- [ ] Contact information is correct
- [ ] Portfolio content is up-to-date

### API Endpoints
- [ ] Health check works: `/api/health`
- [ ] Ping endpoint works: `/api/ping`
- [ ] Demo endpoint works: `/api/demo`
- [ ] Contact form sends emails correctly
- [ ] Error handling works for all endpoints

### Security
- [ ] No secrets or API keys in code
- [ ] Environment variables are secure
- [ ] HTTPS is enabled (automatic on Netlify/Vercel)
- [ ] Security headers are configured
- [ ] CORS is properly configured

### Performance
- [ ] Images are optimized
- [ ] Bundle size is reasonable (< 1MB gzipped)
- [ ] Lighthouse score is 90+
- [ ] Core Web Vitals are good
- [ ] Loading time is acceptable

## Platform-Specific

### Netlify
- [ ] Build command is set: `pnpm install && pnpm run build:client`
- [ ] Publish directory is set: `dist/spa`
- [ ] Functions directory is set: `netlify/functions`
- [ ] Environment variables are set in Netlify dashboard
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active

### Vercel
- [ ] Project is linked to Git repository
- [ ] Build settings are correct
- [ ] Environment variables are set
- [ ] Custom domain is configured (if applicable)

### Self-Hosted
- [ ] Server has Node.js 22+ installed
- [ ] PM2 or process manager is configured
- [ ] Reverse proxy (Nginx) is configured
- [ ] SSL certificate is installed (Let's Encrypt)
- [ ] Firewall rules are set
- [ ] Backup strategy is in place

## Post-Deployment

### Verification
- [ ] Site loads at production URL
- [ ] All pages/routes are accessible
- [ ] API endpoints respond correctly
- [ ] Contact form sends emails
- [ ] Mobile responsiveness works
- [ ] Browser compatibility is good

### Monitoring
- [ ] Error tracking is set up (optional)
- [ ] Analytics is configured (optional)
- [ ] Uptime monitoring is active (optional)
- [ ] Logs are accessible

### Documentation
- [ ] Deployment process is documented
- [ ] Environment variables are documented
- [ ] Rollback procedure is known

## Emergency Contacts

- Developer: [Your Name]
- Hosting Support: [Platform Support URL]
- Domain Registrar: [Registrar Contact]

## Rollback Procedure

If issues occur after deployment:

1. **Netlify/Vercel:**
   - Go to deployment history
   - Revert to previous deployment
   - Or rollback via Git

2. **Self-Hosted:**
   - Switch to previous build directory
   - Restart application
   - Or use Git to revert

3. **Always:**
   - Check logs for errors
   - Verify environment variables
   - Test locally before redeploying

---

**Remember:** Always test in a staging environment first if possible!

