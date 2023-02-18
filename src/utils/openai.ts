import { env } from "@/env.mjs";
import type { OpenAIStreamPayload } from "@/types/globals";
import type { ParsedEvent, ReconnectInterval } from "eventsource-parser";
import { createParser } from "eventsource-parser";
import { Configuration, OpenAIApi } from "openai";

export const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

export const openai = new OpenAIApi(configuration);

export const openaiStream = async (payload: OpenAIStreamPayload) => {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;

  const response = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.OPENAI_API_KEY ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const stream = new ReadableStream({
    async start(controller) {
      // callback
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data) as {
              choices: { text: string }[];
            };
            const text = json.choices[0]?.text;
            if (counter < 2 && (text?.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      };

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      // https://web.dev/streams/#asynchronous-iteration
      for await (const chunk of response.body as ReadableStream &
        AsyncIterable<Uint8Array>) {
        // find type of res.body
        parser.feed(decoder.decode(chunk));
      }
    },
  });

  return stream;
};
