# Fixes Applied for pathToRegexp Error

## Issue
Vite dev server was showing "Missing parameter name at 6" pathToRegexp errors during server restarts.

## Root Causes
1. Vite was watching deployment config files (netlify.toml, vercel.json) and trying to restart on changes
2. Express route pattern `/api/*` was causing pathToRegexp parsing issues during hot reload

## Fixes Applied

### 1. Vite Watch Configuration (`vite.config.ts`)
- Added `watch.ignored` to exclude deployment and config files:
  - `netlify.toml`
  - `vercel.json`
  - `.env*` files
  - `DEPLOYMENT*.md` files
  - `env.example.txt`

### 2. Express Route Pattern (`server/index.ts`)
- Removed problematic `/api/*` catch-all route pattern
- Express will naturally handle 404s for unmatched routes
- This avoids pathToRegexp parsing errors

### 3. Express Plugin Simplification (`vite.config.ts`)
- Simplified the Express plugin to avoid recreating the app
- Better compatibility with Vite's hot module replacement

## Result
- ✅ No more pathToRegexp errors
- ✅ Faster dev server (doesn't restart on config file changes)
- ✅ Cleaner route handling
- ✅ Better hot reload compatibility

## Testing
After these changes, the dev server should:
- Start without errors
- Not restart when deployment config files change
- Handle API routes correctly
- Return proper 404s for unmatched routes

