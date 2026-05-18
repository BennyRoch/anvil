# Anvil

A workout tracker with AI-generated programs. Built with React + Vite + PWA.

## Quick Start

You need [Node.js](https://nodejs.org/) installed (version 18 or later). Check by running `node --version` in your terminal.

### 1. Install dependencies

Open a terminal inside this folder and run:

```bash
npm install
```

This downloads everything the project needs. It will take 1–2 minutes the first time and create a `node_modules` folder.

### 2. Run it locally

```bash
npm run dev
```

You'll see something like:

```
  VITE v5.4.10  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.42:5173/
```

Open `http://localhost:5173/` in your browser. The app is now running. Edit any file in `src/` and the page auto-reloads.

### 3. Test on your phone (same WiFi)

Use the **Network** URL (e.g. `http://192.168.1.42:5173/`) on your phone's browser. You'll see the app exactly as it'll appear when deployed.

### 4. Build for production

```bash
npm run build
```

This creates a `dist/` folder with everything optimized and ready to deploy.

## Deploying to Vercel (free, ~5 minutes)

1. Create a free account at [vercel.com](https://vercel.com)
2. Push this folder to a GitHub repository
3. On Vercel, click "Add New Project" and import your GitHub repo
4. Vercel auto-detects Vite — just click "Deploy"
5. You'll get a URL like `anvil-xyz.vercel.app`

Every push to GitHub auto-deploys updates.

## Installing as a phone app (PWA)

Once deployed:

**iOS (Safari):**
1. Open your Vercel URL in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add" — Anvil now appears as an app icon

**Android (Chrome):**
1. Open your Vercel URL in Chrome
2. Tap the three-dot menu
3. Tap "Install app" or "Add to Home Screen"

## Project structure

```
anvil/
├── public/              Static assets (icons, favicon)
├── src/
│   ├── App.jsx          Main application (all logic + UI)
│   ├── main.jsx         React entry point
│   └── index.css        Global styles
├── index.html           HTML shell
├── vite.config.js       Build + PWA config
└── package.json         Dependencies
```

## Customization

- **App name / colors:** edit `vite.config.js` (manifest section) and `index.html` (theme-color)
- **Icons:** replace files in `public/` with your own 192×192 and 512×512 PNGs
- **AI Coach:** uses the Anthropic API directly from the browser — works when deployed on your domain. For production, you'll want to move the API call to a backend (Vercel serverless functions) to keep your API key secure.

## Important note on the AI Coach

The current AI Coach calls the Anthropic API directly from the browser. This works fine for personal/demo use but exposes your API key in production. Before launching to real users, you should:

1. Add a Vercel serverless function (`api/generate-plan.js`) that proxies the API call
2. Store your Anthropic API key as a Vercel environment variable
3. Have the React app call your serverless function instead

Happy lifting.
