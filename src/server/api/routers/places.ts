import { PREFERENCE, SEASON } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const placesRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    const places = await ctx.prisma.place.findMany();
    return places;
  }),

  getTotal: publicProcedure.query(async ({ ctx }) => {
    const totalPlaces = (await ctx.prisma.place.findMany()).length;
    return totalPlaces;
  }),

  updateLike: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        country: z.string(),
        preference: z.nativeEnum(PREFERENCE),
        season: z.nativeEnum(SEASON),
        like: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const place = await ctx.prisma.uniquePlace.findUnique({
        where: {
          name: input.name,
        },
      });
      if (!place) {
        const newPlace = await ctx.prisma.uniquePlace.create({
          data: {
            name: input.name,
            description: input.description,
            country: input.country,
            preference: input.preference,
            season: input.season,
            like: input.like,
          },
        });
        return newPlace;
      }
      const updatedPlace = await ctx.prisma.uniquePlace.update({
        where: {
          name: input.name,
        },
        data: {
          like: place.like + input.like,
        },
      });
      if (!updatedPlace) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Place not found",
        });
      }
      if (updatedPlace.like < 0) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Like cannot be less than 0",
        });
      }
      if (updatedPlace.like === 0) {
        await ctx.prisma.uniquePlace.delete({
          where: {
            name: input.name,
          },
        });
      }
      return updatedPlace;
    }),
});
