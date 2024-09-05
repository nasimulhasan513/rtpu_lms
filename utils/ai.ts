import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const generateAIReply = async (prompt: string) => {
  // Use the dynamically generated prompt to generate text
  const { text: aiResponse } = await generateText({
    model: google("gemini-1.5-pro-latest"),
    prompt: prompt,
  });

  return aiResponse;
};
