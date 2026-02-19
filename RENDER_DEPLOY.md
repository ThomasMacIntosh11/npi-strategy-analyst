# Deploying NPI Strategy Analyst to Render

## Quick Setup (SQLite - Ephemeral)

This guide uses SQLite which will reset on each deployment. For a 2-day workshop, this is acceptable. Chats will persist during the workshop but be lost on redeployment.

### Step 1: Create New Web Service on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository: `ThomasMacIntosh11/npi-strategy-analyst`
4. Click **"Connect"**

### Step 2: Configure Service

**Basic Settings:**
- **Name:** `npi-strategy-analyst` (or your choice)
- **Region:** Choose closest to your location
- **Branch:** `main`
- **Root Directory:** (leave empty)
- **Runtime:** `Node`

**Build & Deploy:**
- **Build Command:** `npm run render:build`
- **Start Command:** `npm run render:start`

**Instance Type:**
- Select **"Free"** for testing or **"Starter"** for production

### Step 3: Environment Variables

Click **"Advanced"** and add these environment variables:

| Key | Value |
|-----|-------|
| `OPENAI_API_KEY` | `your-openai-api-key-here` |
| `OPENAI_MODEL` | `gpt-4o-mini` |
| `OPENAI_EMBED_MODEL` | `text-embedding-3-small` |
| `WORKSHOP_ACCESS_CODE` | `NPI2030Vision` |
| `SESSION_SECRET` | `random-32-char-string-here` |
| `DATABASE_URL` | `file:./dev.db` |
| `NODE_ENV` | `production` |

**Generate a secure SESSION_SECRET:**
```bash
openssl rand -base64 32
```

### Step 4: Deploy

1. Click **"Create Web Service"**
2. Render will automatically deploy
3. Wait 5-10 minutes for first deployment
4. Your app will be live at `https://npi-strategy-analyst.onrender.com`

### Step 5: Ingest Knowledge

After deployment:
1. Visit your app URL
2. Login with access code: `NPI2030Vision`
3. Navigate to `/knowledge` (type in browser: `https://your-app.onrender.com/knowledge`)
4. Click **"Ingest Knowledge"** button

### Important Notes

⚠️ **Database Resets:**
- SQLite database resets on each deployment
- Chats are lost when you redeploy
- Fine for workshop use, but not for long-term production

⚠️ **First Request Delay:**
- Free tier: App "spins down" after 15 minutes of inactivity
- First request after sleep: ~30-60 seconds to wake up
- Starter tier ($7/month): Always active

⚠️ **API Key Security:**
- After deployment, consider rotating your OpenAI API key
- Never commit `.env` file to GitHub (already in `.gitignore`)

### Troubleshooting

**Build Fails:**
- Check build logs in Render dashboard
- Verify all environment variables are set
- Ensure `OPENAI_API_KEY` is valid

**Database Errors:**
- Database auto-creates on first start
- If errors persist, trigger a manual deploy

**Slow Performance:**
- Upgrade to Starter tier for better performance
- Free tier has limited resources

**Knowledge Ingestion Fails:**
- Files in `/data` folder are deployed with the app
- Check logs for OpenAI API errors
- Verify API key has sufficient credits

### Monitoring

- **Logs:** Dashboard → Your Service → Logs tab
- **Metrics:** Dashboard → Your Service → Metrics tab
- **Events:** Dashboard → Your Service → Events tab

### For Production Use

To make this production-ready:
1. Switch to PostgreSQL (see main README.md)
2. Use Starter tier or higher
3. Set up custom domain
4. Enable auto-deploy on GitHub pushes
5. Set up monitoring and alerts

---

**Need help?** Check the main README.md or contact support.
