import { GoogleGenerativeAI } from "@google/generative-ai"
import { tmdb } from "./api"

const GEMINI_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!GEMINI_KEY) {
  console.warn("VITE_GEMINI_API_KEY is not set. AI features will be disabled.")
}

const genAI = new GoogleGenerativeAI(GEMINI_KEY || "")

export async function askAI(prompt: string, context: any[] = []) {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash-8b", 
      systemInstruction: `You are the SnapStream AI, a movie and TV expert. 
      Your goal is to help users find the perfect content.
      When suggesting a movie or show, ALWAYS include the title and the TMDB ID in brackets like [ID: 12345].
      Analyze ratings and descriptions to explain WHY you chose that specific recommendation.`
    })

    // Fetch trending data for context
    const trending = await tmdb.trending(1)

    const chatContext = [
      { role: "user", parts: [{ text: "Context: Trending now: " + JSON.stringify(trending.results.slice(0, 10)) }] },
      { role: "model", parts: [{ text: "Understood. I have the latest trending data. How can I help?" }] },
      ...context,
      { role: "user", parts: [{ text: prompt }] }
    ]

    const result = await model.generateContent({
      contents: chatContext as any,
    })

    return result.response.text()
  } catch (err) {
    console.error("AI Error:", err)
    return "I'm having trouble connecting to my neural network. Please check your API key."
  }
}
