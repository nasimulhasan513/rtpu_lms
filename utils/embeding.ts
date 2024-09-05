import { embed } from "ai";
import { openai } from "@ai-sdk/openai";

export const getEmbedingResult = async (data: string) => {
  try {
    const { embedding } = await embed({
      model: openai.embedding("text-embedding-3-small"),
      value: data,
    });

    return embedding;
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
  }
};
