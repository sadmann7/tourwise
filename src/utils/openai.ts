import { env } from "@/env.mjs";
import { Configuration } from "openai";

export const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});
