import { configuration } from "@/utils/openai";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const openaiRouter = createTRPCRouter({
  generatePlaces: publicProcedure
    .input(
      z.object({
        country: z.string(),
        budget: z.string(),
        duration: z.number(),
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

      const prompt = `I want to go to ${input.country} for ${input.duration} days and I want to spend ${input.budget}. Where should I go?`;

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
