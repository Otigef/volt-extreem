# Troubleshooting GitHub Push

If you're getting "Repository not found" error, try these steps:

## Option 1: Verify Repository Name

The repository name might have a typo. Please check:
- Did you type: `otigefvoult-porfolio`?
- Or did you mean: `otigefvault-portfolio`?

## Option 2: Check Repository URL

1. Go to your repository on GitHub
2. Click the green "Code" button
3. Copy the HTTPS URL
4. Share it with me so I can update the remote

## Option 3: Authentication Issue

If the repository exists but you're getting authentication errors:

1. **Use Personal Access Token** (not password):
   - Go to: https://github.com/settings/tokens
   - Generate new token (classic)
   - Select scope: `repo` (full control)
   - Copy the token
   - Use it as password when prompted

2. **Or use SSH** (more secure):
   - Change remote to SSH: `git remote set-url origin git@github.com:Otigef/REPO-NAME.git`
   - Requires SSH keys set up

## Option 4: Manual Push

Try pushing manually with authentication:

```bash
git push -u origin main
```

When prompted:
- Username: `Otigef`
- Password: Your Personal Access Token (not GitHub password)

## Quick Fix Commands

If repository name is different, update it:

```bash
git remote set-url origin https://github.com/Otigef/ACTUAL-REPO-NAME.git
git push -u origin main
```

