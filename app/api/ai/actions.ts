"use server";

import { generateAIResponse } from "@/lib/ai/utils";
import { models } from "@/lib/ai/config";
import type { GenerateTextOptions } from "@/types/ai";

/**
 * Server action to generate AI responses
 */
export async function generateResponse(options: GenerateTextOptions) {
  if (!process.env.OPENAI_API_KEY) {
    return {
      text: null,
      error: "OpenAI API key is not configured",
    };
  }

  return generateAIResponse(options);
}

/**
 * Get available AI models
 */
export async function getAvailableModels() {
  return Object.keys(models);
}
