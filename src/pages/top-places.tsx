import type { Place } from "@prisma/client";
import { motion } from "framer-motion";
import Head from "next/head";
import type { NextPageWithLayout } from "./_app";

// external imports
import LikeButton from "@/components/LikeButton";
import Layout from "@/layouts/Layout";
import ErrorScreen from "@/screens/ErrorScreen";
import LoadingScreen from "@/screens/LoadingScreen";
import { api } from "@/utils/api";
import { itemFadeDown, revealContainer, revealItem } from "@/utils/constants";
import { useEffect } from "react";
import { FaWikipediaW } from "react-icons/fa";
import { FiMap } from "react-icons/fi";
import { useInView } from "react-intersection-observer";

const TopPlaces: NextPageWithLayout = () => {
  const { ref, inView } = useInView();

  // places query
  const placesQuery = api.places.getPaginated.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => {
        if (!lastPage) return undefined;
        return lastPage.nextCursor;
      },
    }
  );

  useEffect(() => {
    if (!inView && placesQuery.hasNextPage) return;
    if (inView) {
      void placesQuery.fetchNextPage();
    }
  }, [inView, placesQuery]);

  if (placesQuery.isLoading) {
    return <LoadingScreen />;
  }

  if (placesQuery.isError) {
    return <ErrorScreen error={placesQuery.error} />;
  }

  return (
    <>
      <Head>
        <title>Top rated places | Tourwise</title>
      </Head>
      <main className="container mx-auto mt-24 mb-14 flex max-w-2xl flex-col gap-8 px-4">
        <motion.div
          className="grid gap-4"
          initial="hidden"
          animate="visible"
          variants={revealContainer}
        >
          {placesQuery.data.pages.map((page) =>
            page.places.map((place) => (
              <PlaceCard place={place} key={place.id} />
            ))
          )}
          <motion.button
            aria-label="load more places"
            className="rounded-md bg-neutral-700 px-4 py-2 font-semibold text-white shadow-md ring-1 ring-gray-400 transition enabled:hover:bg-neutral-800 enabled:active:bg-neutral-700 disabled:cursor-not-allowed"
            variants={revealItem}
            ref={ref}
            onClick={() => void placesQuery.fetchNextPage()}
            disabled={
              !placesQuery.hasNextPage || placesQuery.isFetchingNextPage
            }
          >
            {placesQuery.isFetchingNextPage ? (
              <div className="flex items-center justify-center gap-2">
                <div className="aspect-square w-4 animate-spin rounded-full border-2 border-solid border-gray-100 border-t-transparent" />
                <span className="text-white">Loading...</span>
              </div>
            ) : placesQuery.hasNextPage ? (
              "Load more places"
            ) : (
              "No more places"
            )}
          </motion.button>
        </motion.div>
      </main>
    </>
  );
};

export default TopPlaces;

TopPlaces.getLayout = (page) => <Layout>{page}</Layout>;

const PlaceCard = ({ place }: { place: Place }) => {
  return (
    <motion.div
      key={place.name}
      variants={itemFadeDown}
      className="grid gap-4 rounded-md bg-neutral-800 p-4 shadow-md ring-1 ring-gray-400"
    >
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold text-white">{place.name}</h3>
          <div className="flex items-center">
            <LikeButton isLiked={true} disabled={true} />
            <span className="text-base font-medium text-gray-300">
              {place.like}
            </span>
          </div>
        </div>
        <span className="text-base text-gray-300">{place.description}</span>
      </div>
      <div className="grid gap-2">
        <a
          aria-label="explore on google maps"
          href={`https://www.google.com/maps/search/?api=1&query=${
            place.name ?? ""
          }`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-md bg-gray-100 p-2 transition-colors hover:bg-gray-300 active:bg-gray-100"
        >
          <FiMap className="text-black" size={18} />
          <span className="text-sm font-medium">Explore on Google Maps</span>
        </a>
        <a
          aria-label="explore on wikipedia"
          href={`https://en.wikipedia.org/wiki/${place.name ?? ""}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 rounded-md bg-gray-100 p-2 transition-colors hover:bg-gray-300 active:bg-gray-100"
        >
          <FaWikipediaW className="text-black" size={18} />
          <span className="text-sm font-medium">Explore on Wikipedia</span>
        </a>
      </div>
    </motion.div>
  );
};
