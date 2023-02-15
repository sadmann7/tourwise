import { configuration } from "@/utils/openai";
import { Preference, Season } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const openaiRouter = createTRPCRouter({
  generatePlaces: publicProcedure
    .input(
      z.object({
        country: z.string(),
        preference: z.nativeEnum(Preference),
        season: z.nativeEnum(Season),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!configuration.apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message:
            "OpenAI API key not configured, please follow instructions in README.md",
        });
      }

      const prompt = `I want to go to a place in ${input.country} that is ${input.preference} and ${input.season}.\n\nHere are some places I like:\n\n- [Place 1](https://www.google.com)\n- [Place 2](https://www.google.com)\n- [Place 3](https://www.google.com)\n- [Place 4](https://www.google.com)\n- [Place 5](https://www.google.com)\n\nI want to go to a place that is ${input.preference} and ${input.season}.`;

      if (!prompt) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during your request.",
        });
      }

      const completion = await ctx.openai.createCompletion(
        {
          model: "text-davinci-003",
          prompt: prompt,
          temperature: 0.7,
          max_tokens: 200,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false,
          n: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!completion.data.choices) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during your request.",
        });
      }
      if (!completion.data.choices[0]?.text) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "An error occurred during your request.",
        });
      }
      return completion.data.choices[0]?.text;
    }),
});
