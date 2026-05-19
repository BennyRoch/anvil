// Vercel serverless function: proxies AI plan generation requests to Anthropic
// without exposing the API key to the browser.
//
// Lives at: /api/generate-plan
// Receives: { prompt: "..." } in the request body
// Returns:  { text: "..." } with Claude's response
//
// Set ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables

// In-memory rate limiter (per-deployment, resets on cold start)
// For production with many users, swap for Upstash Redis or Vercel KV
const rateLimits = new Map();
const RATE_LIMIT_MAX = 10;          // max requests
const RATE_LIMIT_WINDOW = 86400000; // per 24 hours (ms)

function checkRateLimit(identifier) {
  const now = Date.now();
  const userLimits = rateLimits.get(identifier) || [];
  // Remove timestamps outside the window
  const recent = userLimits.filter(t => now - t < RATE_LIMIT_WINDOW);
  if (recent.length >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 };
  }
  recent.push(now);
  rateLimits.set(identifier, recent);
  return { allowed: true, remaining: RATE_LIMIT_MAX - recent.length };
}

export default async function handler(req, res) {
  // CORS — allow your own domain to call this
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  // Verify the API key is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY not configured");
    return res.status(500).json({ error: "Server configuration error" });
  }

  // Rate limit by IP — basic protection against abuse
  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
             req.headers["x-real-ip"] ||
             "unknown";
  const limit = checkRateLimit(ip);
  if (!limit.allowed) {
    return res.status(429).json({
      error: "Rate limit exceeded. Try again tomorrow.",
      remaining: 0,
    });
  }

  // Validate request
  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Missing or invalid 'prompt' field" });
  }
  if (prompt.length > 10000) {
    return res.status(400).json({ error: "Prompt too long" });
  }

  // Call Anthropic
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Anthropic API error:", response.status, errText);
      return res.status(502).json({ error: `Upstream API error: ${response.status}` });
    }

    const data = await response.json();
    const textBlock = data.content?.find(b => b.type === "text");
    if (!textBlock) {
      return res.status(502).json({ error: "Empty response from AI" });
    }

    return res.status(200).json({
      text: textBlock.text,
      remaining: limit.remaining,
    });
  } catch (err) {
    console.error("Generate plan error:", err);
    return res.status(500).json({ error: "Failed to generate plan" });
  }
}
