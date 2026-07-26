const { Router } = require("express");
require("dotenv").config();
const { GoogleGenAI } = require("@google/genai");
const router = Router();

const Blog = require("../model/blog");
const genAI = new GoogleGenAI(process.env.GEMINI_API_KEY);

//Generate new summary
async function generateSummary(blog) {
     // Generate new summary
    const prompt = `
    You are a professional content editor.

    Read the blog post carefully and identify the language of the content.

    Generate a 5-6 sentence summary in the SAME language as the original blog.

    Do not mention explicitly in the blog about the language used.

    Guidelines:
    - Do not translate the language.
    - Keep the tone professional and clear.
    - Preserve the main idea and key insights.
    - Do not add new information.
    - Do not use introductory phrases like "Here is the summary".
    - Keep it under 120 words.
    - If there are some random or meaningless words like "bdchihuvhrv vbibrv" return "Summary can't be generated".

    Blog Content:
    ${blog.body}
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      generationConfig: {
        maxOutputTokens: 200,
        temperature: 0.3,
      },
    });
    // console.log("Gemini raw response:", response.text);
    return response.text;
}


// geminiService.js

async function classifyContent(content) {
  const prompt = `
Classify the following content into one of these categories:
SAFE, SPAM, HATE, VIOLENCE, OFFENSIVE, SEXUAL, ABUSIVE

Also return a confidence score (0 to 1).
Also return the category of blog content example sports, educational, traveling, finance, geopolitics, history, science ,etc 
You can add more category accordingly

Respond ONLY in JSON:
{
  "label": "...",
  "confidence": 0.0,
  "reason": "...",
  "category": "..."
}
The reason should be short and suitable to be mailed to the user.
Do not return anything extra except the prescribed response.

Content:
"""${content}"""
`;

  const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      generationConfig: {
        maxOutputTokens: 100,   // Enough for JSON + short reason
        temperature: 0.0,       // Make outputs deterministic (no randomness)
        topP: 0.8,              // Slight diversity control, but safe for classification
        topK: 40,               // Standard value, balances speed and quality
      }
    });
  
  // console.log("Gemini raw response:", response.text);

  const text = response.text.trim();

  const cleanedText = text
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

  // Extract JSON safely
  try {
    const result = JSON.parse(cleanedText);
    return result;
  } catch (err) {
    return {
      label: "UNKNOWN",
      confidence: 0,
      reason: "Gemini failed",
      category: "None",
      error: true,
    };
  }
}


module.exports = {
    generateSummary,
    classifyContent,
}