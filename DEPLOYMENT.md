# Deployment Guide

This guide covers deployment options for the Portfolio Vault Experience project.

## Prerequisites

Before deploying, ensure you have:

- ✅ Completed a production build: `pnpm build`
- ✅ Set up all required environment variables (see [Environment Variables](#environment-variables))
- ✅ Tested the application locally with production build: `pnpm start`

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Server Configuration
PORT=3000
NODE_ENV=production

# API Configuration
PING_MESSAGE=ping

# Email/SMTP Configuration (Required for contact form)
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-email@example.com
SMTP_PASS=your-email-password
SMTP_SECURE=false
CONTACT_TO=your-contact-email@example.com
```

**Important:** Never commit `.env` files to version control. They are already in `.gitignore`.

## Deployment Options

### Option 1: Netlify (Recommended)

Netlify is configured for automatic deployments with serverless functions.

#### Setup Steps:

1. **Connect Repository:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect your Git repository

2. **Configure Build Settings:**
   - Build command: `pnpm install && pnpm run build:client`
   - Publish directory: `dist/spa`
   - Functions directory: `netlify/functions`

3. **Set Environment Variables:**
   - Go to Site settings → Environment variables
   - Add all variables from the `.env` file above

4. **Deploy:**
   - Netlify will automatically deploy on every push to your main branch
   - Or trigger a manual deploy from the dashboard

#### Netlify Configuration

The project includes `netlify.toml` with:
- ✅ Automatic SPA routing (all routes serve `index.html`)
- ✅ API routes redirected to serverless functions
- ✅ Node.js 22 runtime configuration

#### Custom Domain Setup:

1. Go to Site settings → Domain management
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

**Note:** Update the Open Graph and Twitter meta tags in `index.html` with your actual domain URL.

---

### Option 2: Vercel

Vercel provides excellent support for Vite projects with automatic optimizations.

#### Setup Steps:

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts to link your project.

3. **Set Environment Variables:**
   - Go to Project Settings → Environment Variables
   - Add all required variables

4. **Configure Project:**
   - The `vercel.json` file is already configured
   - Build command and output directory are set automatically

#### Vercel Features:

- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions for API routes
- ✅ Preview deployments for pull requests

**Note:** For API routes, you may need to create Vercel serverless functions. The current setup uses Express which works well with Netlify Functions.

---

### Option 3: Self-Hosted (Traditional Server)

Deploy to your own server (VPS, dedicated server, etc.).

#### Requirements:

- Node.js 22 or higher
- pnpm 10.14.0 or higher
- Process manager (PM2 recommended)

#### Setup Steps:

1. **Build the application:**
   ```bash
   pnpm install
   pnpm build
   ```

2. **Transfer files to server:**
   ```bash
   # Copy dist/ folder and package.json
   scp -r dist/ user@your-server:/var/www/portfolio-vault/
   scp package.json user@your-server:/var/www/portfolio-vault/
   ```

3. **Install production dependencies:**
   ```bash
   cd /var/www/portfolio-vault
   pnpm install --production
   ```

4. **Set environment variables:**
   ```bash
   # Create .env file
   nano .env
   # Add all required environment variables
   ```

5. **Start with PM2:**
   ```bash
   # Install PM2 globally
   npm install -g pm2
   
   # Start the application
   pm2 start dist/server/node-build.mjs --name portfolio-vault
   
   # Save PM2 configuration
   pm2 save
   
   # Setup PM2 to start on boot
   pm2 startup
   ```

6. **Configure reverse proxy (Nginx example):**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **Setup SSL with Let's Encrypt:**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 4: Docker Deployment

Deploy using Docker containers.

#### Create Dockerfile:

```dockerfile
FROM node:22-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build application
RUN pnpm build

# Production image
FROM node:22-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@10.14.0

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --production --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

# Start application
CMD ["node", "dist/server/node-build.mjs"]
```

#### Build and Run:

```bash
# Build image
docker build -t portfolio-vault .

# Run container
docker run -d \
  -p 3000:3000 \
  --name portfolio-vault \
  --env-file .env \
  portfolio-vault
```

#### Docker Compose (Recommended):

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  portfolio-vault:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--quiet", "--tries=1", "--spider", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with:
```bash
docker-compose up -d
```

---

## Pre-Deployment Checklist

- [ ] All environment variables are configured
- [ ] Production build completes successfully (`pnpm build`)
- [ ] Local production server runs correctly (`pnpm start`)
- [ ] All API endpoints are tested
- [ ] Contact form is tested with real SMTP credentials
- [ ] Meta tags in `index.html` are updated with your domain
- [ ] Favicon and images are optimized
- [ ] SEO meta tags are filled with actual content
- [ ] Error pages (404) work correctly
- [ ] Health check endpoint responds (`/api/health`)

## Post-Deployment Verification

After deployment, verify:

1. **Health Check:**
   ```bash
   curl https://your-domain.com/api/health
   ```

2. **Frontend Loads:**
   - Visit your domain
   - Check all routes work (React Router SPA)
   - Verify animations and interactions

3. **API Endpoints:**
   ```bash
   curl https://your-domain.com/api/ping
   curl https://your-domain.com/api/demo
   ```

4. **Contact Form:**
   - Submit a test message
   - Verify email is received

5. **Performance:**
   - Run Lighthouse audit
   - Check Core Web Vitals
   - Verify images are optimized

## Troubleshooting

### Build Fails

- **Error:** "Module not found"
  - Solution: Run `pnpm install` before building
  
- **Error:** "Type errors"
  - Solution: Run `pnpm typecheck` and fix TypeScript errors

### API Routes Not Working

- **Netlify:** Check function logs in dashboard
- **Vercel:** Check function logs in dashboard
- **Self-hosted:** Check server logs and ensure port is accessible

### Environment Variables Not Loading

- Verify variables are set in deployment platform
- Check variable names match exactly (case-sensitive)
- Restart the application after adding variables

### SPA Routing Issues

- Verify redirect rules are configured correctly
- Check that `index.html` is served for all non-API routes
- Test with browser dev tools Network tab

### Contact Form Not Working

- Verify SMTP credentials are correct
- Check SMTP port (587 for TLS, 465 for SSL)
- Set `SMTP_SECURE=true` for port 465
- Check email service logs/status

## Performance Optimization

### Already Implemented:

- ✅ Code splitting (vendor chunks)
- ✅ CSS minification
- ✅ Asset optimization
- ✅ Tree shaking

### Additional Recommendations:

1. **Image Optimization:**
   - Use WebP format where possible
   - Implement lazy loading
   - Use responsive images

2. **Caching:**
   - Set appropriate cache headers
   - Use CDN for static assets
   - Implement service worker for offline support

3. **Monitoring:**
   - Set up error tracking (Sentry, LogRocket)
   - Monitor API response times
   - Track Core Web Vitals

## Security Best Practices

- ✅ Environment variables are not committed
- ✅ HTTPS enforced (automatic on Netlify/Vercel)
- ✅ Security headers configured
- ✅ CORS configured appropriately
- ✅ Input validation on API endpoints

### Additional Recommendations:

1. **Rate Limiting:**
   - Implement rate limiting on API endpoints
   - Use services like Cloudflare or Upstash

2. **Content Security Policy:**
   - Add CSP headers for XSS protection
   - Restrict resource loading

3. **API Security:**
   - Validate all inputs
   - Sanitize user inputs
   - Use HTTPS for all requests

## Support

For deployment issues:

1. Check this guide first
2. Review platform-specific documentation
3. Check application logs
4. Open an issue on GitHub

## Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Docker Documentation](https://docs.docker.com/)

---

**Last Updated:** January 2025

