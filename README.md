# Anagkazo Student Assistant

A Vercel-ready Anagkazo assignment generator.

## Deployment

1. Import this GitHub repository into Vercel.
2. Use the repository root as the project root.
3. In **Project Settings → Environment Variables**, add:
   - **Name:** GEMINI_API_KEY
   - **Value:** your Gemini API key
   - **Environments:** Production and Preview
4. Deploy the project.
5. After changing the environment variable, redeploy.

The browser calls `/api/generate`. The Gemini API key is never included in the frontend source code; the Vercel Function reads it from `process.env.GEMINI_API_KEY`.

## Important

Do not put the Gemini API key in `index.html` or commit it to GitHub.
