import { env } from "@/env.mjs";
import type { OpenAIStreamPayload } from "@/types/globals";
import { openaiStream } from "@/utils/openai";
import type { NextApiResponse } from "next";

if (!env.OPENAI_API_KEY) {
  throw new Error(
    "OpenAI API key is not defined. Please define it in the environment variable OPENAI_API_KEY"
  );
}

export const config = {
  runtime: "edge",
};

const handler = async (req: Request, res: NextApiResponse) => {
  const prompt = ((await req.json()) as { prompt: string }).prompt;

  if (!prompt) {
    res.status(400).json({ error: "No prompt provided" });
    return;
  }

  const openaiPayload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    max_tokens: 200,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const stream = await openaiStream(openaiPayload);
  return new Response(stream);
};

export default handler;
