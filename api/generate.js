module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Gemini API key is not configured. Add GEMINI_API_KEY in Vercel Project Settings → Environment Variables, then redeploy."
    });
  }

  try {
    const body = req.body || {};
    const prompt = typeof body.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return res.status(400).json({ error: "A prompt is required." });
    }

    if (prompt.length > 100000) {
      return res.status(413).json({ error: "The assignment request is too large." });
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 12000
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data?.error?.message || "Gemini API request failed."
      });
    }

    const text = data?.candidates?.[0]?.content?.parts
      ?.map(part => part.text || "")
      .join("")
      .trim();

    if (!text) {
      return res.status(502).json({
        error: "Gemini returned no generated text."
      });
    }

    return res.status(200).json({ text });
  } catch (error) {
    console.error("Gemini generation error:", error);
    return res.status(500).json({
      error: "The assignment could not be generated right now. Please try again."
    });
  }
};
