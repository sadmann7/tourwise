import type {
  NextApiRequestWithBody,
  OpenAIStreamPayload,
} from "@/types/globals";
import { sanitize } from "@/utils/format";
import { configuration } from "@/utils/openai";
import type { NextApiResponse } from "next";
import { OpenAIApi } from "openai";

export const openai = new OpenAIApi(configuration);

type Data = {
  suggestions: string;
};

type Error = {
  error: {
    message: string;
  };
};

export default async function handler(
  req: NextApiRequestWithBody,
  res: NextApiResponse<Data | Error>
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const { country, buddget, duration } = req.body;
  const prompt = `Suggest 5 cities in js array format for ${country} that are good for ${duration} days with a budget of ${buddget}`;

  if (!prompt) {
    res.status(400).json({
      error: {
        message: "Prompt is missing",
      },
    });
    return;
  }

  const openaiPayload: OpenAIStreamPayload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.69,
    max_tokens: 69,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
    n: 1,
  };

  const completion = await openai.createCompletion(openaiPayload);
  if (!completion.data.choices) {
    res.status(500).json({
      error: {
        message: "OpenAI API error",
      },
    });
    return;
  } else if (completion.data.choices.length === 0) {
    res.status(500).json({
      error: {
        message: "OpenAI API error",
      },
    });
    return;
  }
  const suggestions = completion.data.choices[0]?.text;
  if (!suggestions) {
    res.status(500).json({
      error: {
        message: "OpenAI API error",
      },
    });
    return;
  }
  res.status(200).json({ suggestions: sanitize(suggestions) });
}
