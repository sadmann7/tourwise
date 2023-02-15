import type { NextApiRequest } from "next";

export type OpenAIStreamPayload = {
  model:
    | "text-davinci-003"
    | "text-curie-001"
    | "text-babbage-001"
    | "text-ada-001";
  prompt: string;
  temperature: number;
  max_tokens: number;
  top_p: number;
  frequency_penalty: number;
  presence_penalty: number;
  stream: boolean;
  n: number;
};

export interface NextApiRequestWithBody extends NextApiRequest {
  body: {
    country: string;
    budget: number;
    duration: number;
  };
}
