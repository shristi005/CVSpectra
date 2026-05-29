import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config()

const key = process.env.GEMINI_API_KEY
const groqKey = process.env.GROQ_API_KEY
export const model = process.env.MODEL_NAME

if (!key) {
    throw new Error("GEMINI_API_KEY is not set in environment variables")
}

if (!groqKey) throw new Error("GROQ_API_KEY is not set")

export const geminiai = new GoogleGenAI({
    apiKey: key,
});

export const openai = new OpenAI({
    apiKey: groqKey,
    baseURL: "https://api.groq.com/openai/v1"
});

