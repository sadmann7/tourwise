import { PREFERENCE, SEASON } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const placesRouter = createTRPCRouter({
  getPaginated: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const places = await ctx.prisma.place.findMany({
        take: input.limit + 1,
        where: {},
        cursor: input.cursor ? { id: input.cursor } : undefined,
        orderBy: {
          like: "desc",
        },
      });
      let nextCursor: typeof input.cursor | undefined = undefined;
      if (places.length > input.limit) {
        const nextItem = places.pop();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        nextCursor = nextItem!.id;
      }
      return {
        places,
        nextCursor,
      };
    }),

  getCount: publicProcedure.query(async ({ ctx }) => {
    const first = await ctx.prisma.placeCounter.findFirst();
    return first?.count;
  }),

  increaseCount: publicProcedure
    .input(z.number())
    .mutation(async ({ ctx, input }) => {
      const first = await ctx.prisma.placeCounter.findFirst();
      if (!first) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Counter not found",
        });
      }
      const updated = await ctx.prisma.placeCounter.update({
        where: {
          id: first.id,
        },
        data: {
          count: {
            increment: input,
          },
        },
      });
      return updated;
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
      const place = await ctx.prisma.place.findUnique({
        where: {
          name: input.name,
        },
      });
      if (!place) {
        const newPlace = await ctx.prisma.place.create({
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
      const updatedPlace = await ctx.prisma.place.update({
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
        await ctx.prisma.place.delete({
          where: {
            name: input.name,
          },
        });
      }
      return updatedPlace;
    }),
});
