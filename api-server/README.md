# Arsenal API - Render Deployment

This is a standalone API for the arsenal feature, deployed on Render to bypass Vercel's 60-second timeout limit.

## Deploy to Render

1. Go to https://dashboard.render.com
2. Click "New" → "Web Service"
3. Connect to your GitHub repo
4. Set:
   - **Name**: `arsenal-api`
   - **Root Directory**: `venture-analyst/api-server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variable:
   - `ANTHROPIC_API_KEY` = your Anthropic API key
6. Click "Create Web Service"

## After Deploy

Your API will be available at: `https://arsenal-api.onrender.com`

Update the frontend environment variable:
```
NEXT_PUBLIC_ARSENAL_API_URL=https://arsenal-api.onrender.com
```

## Local Development

```bash
cd api-server
npm install
ANTHROPIC_API_KEY=your-key npm start
```

API runs on http://localhost:4001
