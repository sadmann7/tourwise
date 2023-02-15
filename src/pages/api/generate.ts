import type { NextApiRequestWithBody } from "@/types/globals";
import { configuration, openai } from "@/utils/openai";
import type { NextApiResponse } from "next";

type Data = {
  result: string;
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

  const { budget, country, duration } = req.body;
  const prompt = `Suggest 5 cities to travel in js array format for ${country} that are good for ${duration} days with a budget of ${budget}`;

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0.7,
      max_tokens: 200,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      n: 1,
    });
    res
      .status(200)
      .json({ result: completion.data.choices[0]?.text as string });
  } catch (error) {
    console.error(`Error with OpenAI API request: ${error as string}}`);
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}
