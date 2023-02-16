import { env } from "@/env.mjs";
import { configuration } from "@/utils/openai";
import { PREFERENCE, SEASON } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const openaiRouter = createTRPCRouter({
  generatePlaces: publicProcedure
    .input(
      z.object({
        country: z.string(),
        preference: z.nativeEnum(PREFERENCE),
        season: z.nativeEnum(SEASON),
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

      const prompt = `Suggest 5 places to visit in ${input.country} during ${input.season} for someone who likes ${input.preference}. Make sure to include a very short description of each place within 20 words. You can use the following template: 1. Place name: Description of place. 
                      For example: 1. Eiffel Tower: A famous landmark in Paris, France. It is a 324-meter tall iron tower that was built in 1889. It is one of the most visited places in the world. Make sure to suggest Sundarbans instead of Sundarban.`;

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
          max_tokens: 250,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0,
          stream: false,
          n: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.OPENAI_API_KEY ?? ""}`,
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

      const places = completion.data.choices[0].text
        .split(".")
        .filter((place) => place !== "")
        .map((place) => {
          const [name, description] = place.split(":");
          return {
            name: name?.trim(),
            description: description?.trim(),
          };
        })
        .filter(
          (place) => place.name !== undefined && place.description !== undefined
        );

      await ctx.prisma.tour.create({
        data: {
          country: input.country,
          preference: input.preference,
          season: input.season,
          places: {
            createMany: {
              data: places.map((place) => {
                return {
                  name: place.name as string,
                  description: place.description as string,
                };
              }),
              skipDuplicates: true,
            },
          },
        },
      });

      return places;
    }),
});
