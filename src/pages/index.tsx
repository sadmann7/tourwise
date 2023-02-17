import { zodResolver } from "@hookform/resolvers/zod";
import { PREFERENCE, SEASON } from "@prisma/client";
import { motion } from "framer-motion";
import Head from "next/head";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import Balancer from "react-wrap-balancer";
import { z } from "zod";
import type { NextPageWithLayout } from "./_app";

// external imports
import Button from "@/components/Button";
import CountUp from "@/components/CountUp";
import SelectBox from "@/components/DropdownSelect";
import LikeButton from "@/components/LikeButton";
import ScrollingText from "@/components/ScrollingText";
import SearchableSelect from "@/components/SearchableSelect";
import rawCountries from "@/data/countries.json";
import Layout from "@/layouts/Layout";
import { api } from "@/utils/api";
import { revealContainer, revealItem } from "@/utils/constants";
import { FaWikipediaW } from "react-icons/fa";
import { FiMap } from "react-icons/fi";
import { FormattedPlace } from "@/types/globals";

const schema = z.object({
  country: z.string({ required_error: "Please select a country" }),
  preference: z.nativeEnum(PREFERENCE),
  season: z.nativeEnum(SEASON),
});

type Inputs = z.infer<typeof schema>;

const Home: NextPageWithLayout = () => {
  const apiUtils = api.useContext();
  const [preference, setPreference] = useState<PREFERENCE>(
    PREFERENCE.ADVENTURE
  );
  const [season, setSeason] = useState<SEASON>(SEASON.WINTER);
  const [country, setCountry] = useState<string>("Bangladesh");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDone, setIsDone] = useState<boolean>(false);
  const [generatedPlaces, setGeneratedPlaces] = useState<string>("");
  const [places, setPlaces] = useState<FormattedPlace[]>();
  const countries = rawCountries.map((country) => country.name);
  const generatedRef = useRef<HTMLDivElement>(null);

  // place counter query
  const placeCounterQuery = api.places.getCount.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  // increase place counter mutation
  const increasePlaceCounterMutation = api.places.increaseCount.useMutation({
    onSuccess: async () => {
      await apiUtils.places.getCount.invalidate();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // react-hook-form
  const { handleSubmit, control, formState } = useForm<Inputs>({
    resolver: zodResolver(schema),
  });
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const prompt = `Suggest 5 places to visit in ${data.country} during ${data.season} for someone who likes ${data.preference}. Make sure to include a very short description of each place within 20 words. You can use the following template: 1. Place name: Description of place. 
    For example: 1. Eiffel Tower: A famous landmark in Paris, France. It is a 324-meter tall iron tower that was built in 1889. It is one of the most visited places in the world. Make sure to suggest Sundarbans instead of Sundarban.`;

    setIsLoading(true);
    setGeneratedPlaces("");
    setPreference(data.preference);
    setSeason(data.season);
    setCountry(data.country);

    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });
    console.log("Edge function returned.");

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // This data is a ReadableStream
    const responseData = response.body;
    if (!responseData) return;

    const reader = responseData.getReader();
    const decoder = new TextDecoder();

    while (!isDone) {
      const { done, value } = await reader.read();
      if (done) {
        setIsDone(true);
        increasePlaceCounterMutation.mutate(5);
        break;
      }
      const decodedValue = decoder.decode(value);
      setGeneratedPlaces((prev) => prev + decodedValue);
    }

    setIsDone(false);
    setIsLoading(false);
  };

  // format places and memoize it
  useMemo(() => {
    if (!generatedPlaces.length) return;
    setPlaces(
      generatedPlaces
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
        )
    );
  }, [generatedPlaces]);

  // scroll to generated cities
  useEffect(() => {
    if (!generatedRef.current || generatedPlaces.length === 0) return;
    generatedRef.current.scrollIntoView({ behavior: "smooth" });
  }, [generatedPlaces.length, isLoading]);

  return (
    <>
      <Head>
        <title>Tourwise</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-28 mb-14 grid w-full max-w-4xl gap-10 px-4">
        <motion.div
          className="grid place-items-center gap-2 sm:gap-4"
          initial="initial"
          animate="animate"
          variants={revealContainer}
        >
          <motion.h1
            variants={revealItem}
            className="text-center text-3xl font-semibold text-white sm:text-6xl"
          >
            <Balancer>
              Generate your next <span className="text-indigo-500">tour</span>{" "}
              destination with AI
            </Balancer>
          </motion.h1>
          <motion.p
            variants={revealItem}
            className="text-center text-lg text-gray-400 sm:text-xl"
          >
            Total{" "}
            <CountUp
              className="text-indigo-400"
              end={placeCounterQuery.data ?? 0}
            />{" "}
            destinations generated so far
          </motion.p>
          <motion.div variants={revealItem}>
            <ScrollingText
              className="text-xl font-semibold text-indigo-400 sm:text-3xl"
              words={countries}
            />
          </motion.div>
          <form
            aria-label="generate city from"
            className="mx-auto grid w-full max-w-2xl gap-5"
            onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
          >
            <motion.fieldset variants={revealItem} className="grid gap-3">
              <label htmlFor="country" className="text-base text-white">
                <span className="rounded-full text-gray-400">1.</span> Select
                your country
              </label>
              <SearchableSelect
                name="country"
                control={control}
                options={countries}
              />
              {formState.errors.country ? (
                <span className="text-base text-red-500">
                  {formState.errors.country.message}
                </span>
              ) : null}
            </motion.fieldset>
            <motion.fieldset variants={revealItem} className="grid gap-3">
              <label htmlFor="preference" className="text-base text-white">
                <span className="rounded-full text-gray-400">2.</span> Select
                your tour preference
              </label>
              <SelectBox
                name="preference"
                control={control}
                options={Object.values(PREFERENCE)}
              />
              {formState.errors.preference ? (
                <span className="text-base text-red-500">
                  {formState.errors.preference.message}
                </span>
              ) : null}
            </motion.fieldset>
            <motion.fieldset className="grid gap-3" variants={revealItem}>
              <label htmlFor="season" className="text-base text-white">
                <span className="rounded-full text-gray-400">3.</span> Select
                your tour season
              </label>
              <SelectBox
                name="season"
                control={control}
                options={Object.values(SEASON)}
              />
              {formState.errors.season ? (
                <span className="text-base text-red-500">
                  {formState.errors.season.message}
                </span>
              ) : null}
            </motion.fieldset>
            <motion.div variants={revealItem}>
              <Button
                aria-label="generate your places"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? "Loading..." : "Generate your places"}
              </Button>
            </motion.div>
          </form>
          {places && !isLoading ? (
            <div
              className="mx-auto mt-5 grid w-full max-w-2xl gap-8"
              ref={generatedRef}
            >
              <motion.h2
                className="text-center text-3xl font-bold text-white sm:text-4xl"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.5 } }}
              >
                Your generated destinations
              </motion.h2>
              <div className="grid w-full gap-4">
                {places.map((place) => (
                  <motion.div
                    key={place.name}
                    variants={revealItem}
                    className="flex flex-col gap-2"
                  >
                    <PlaceCard
                      place={place}
                      country={country}
                      preference={preference}
                      season={season}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          ) : null}
        </motion.div>
      </main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <Layout>{page}</Layout>;

type PlaceCardProps = {
  place: {
    name?: string;
    description?: string;
  };
  country: string;
  preference: PREFERENCE;
  season: SEASON;
};

const PlaceCard = ({ place, country, preference, season }: PlaceCardProps) => {
  const apiUtils = api.useContext();
  const [isLiked, setIsLiked] = useState(false);

  // update like mutation for unique places
  const updateLikeMutation = api.places.updateLike.useMutation({
    onMutate: async () => {
      if (isLiked) {
        toast.error("Remove from Top Places");
      } else {
        toast.success("Added to Top Places");
      }
      await apiUtils.places.getPaginated.cancel();
      apiUtils.places.getPaginated.setInfiniteData({ limit: 10 }, (data) => {
        if (!data) {
          return {
            pages: [],
            pageParams: [],
          };
        }
        return {
          ...data,
          pages: data.pages.map((page) => {
            return {
              ...page,
              places: page.places.map((place) => {
                return {
                  ...place,
                  like: place.like + (isLiked ? -1 : 1),
                };
              }),
            };
          }),
        };
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <motion.div
      key={place.name}
      className="grid gap-4 rounded-md bg-neutral-800 p-4 shadow-md ring-1 ring-gray-400"
      variants={revealItem}
    >
      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-xl font-semibold text-white">{place.name}</h3>
          <LikeButton
            isLiked={isLiked}
            onClick={() => {
              setIsLiked(!isLiked);
              if (!place.name || !place.description) return;
              updateLikeMutation.mutate({
                name: place.name,
                like: isLiked ? -1 : 1,
                country: country,
                description: place.description,
                preference: preference,
                season: season,
              });
            }}
          />
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
