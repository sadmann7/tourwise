import Head from "next/head";
import { useForm, type SubmitHandler } from "react-hook-form";
import type { NextPageWithLayout } from "./_app";

// external imports
import SearchableSelect from "@/components/SearchableSelect";
import rawCountries from "@/data/countries.json";
import Layout from "@/layouts/Layout";

type Inputs = {
  country: string;
  budget: string;
  duration: number;
};

const Home: NextPageWithLayout = () => {
  const countries = rawCountries.map((country) => country.name);

  // react-hook-form
  const { register, handleSubmit, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = (data) => {
    console.log(data);
  };

  return (
    <>
      <Head>
        <title>Next Tour</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-28 mb-14 grid max-w-5xl place-items-center gap-10 px-4">
        <div className="text-center text-5xl font-bold text-white">
          <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Next Tour
          </span>
        </div>
        <form
          aria-label="generate city from"
          className="grid w-full max-w-2xl gap-5"
          onSubmit={(...args) => void handleSubmit(onSubmit)(...args)}
        >
          <fieldset className="grid gap-3">
            <label htmlFor="country" className="text-base text-white">
              1. Select your country
            </label>
            <SearchableSelect
              id="country"
              name="country"
              control={control}
              options={countries}
            />
          </fieldset>
          <fieldset className="grid gap-3">
            <label htmlFor="budget" className="text-base text-white">
              <span className="rounded-full text-gray-400">2.</span> Input your
              budget with the currency
            </label>
            <input
              id="budget"
              type="text"
              className="w-full rounded-md border-gray-400 bg-neutral-800 py-2.5 px-4 text-white placeholder:text-gray-400"
              placeholder="e.g. 6969 BDT"
              {...register("budget", { required: true })}
            />
          </fieldset>
          <fieldset className="grid gap-3">
            <label htmlFor="duration" className="text-base text-white">
              <span className="rounded-full text-gray-400">3.</span> Input your
              tour duration (days)
            </label>
            <input
              id="duration"
              type="number"
              className="w-full rounded-md border-gray-400 bg-neutral-800 py-2.5 px-4 text-white placeholder:text-gray-400"
              placeholder="e.g. 10"
              inputMode="numeric"
              {...register("duration", { required: true, valueAsNumber: true })}
            />
          </fieldset>
          <button
            aria-label="generate cities"
            className="mt-1.5 w-full rounded-md bg-gray-100 px-4 py-2 text-base font-medium transition-colors enabled:hover:bg-gray-300 enabled:active:bg-gray-100 disabled:cursor-not-allowed"
          >
            Generate Cities
          </button>
        </form>
      </main>
    </>
  );
};

export default Home;

Home.getLayout = (page) => <Layout>{page}</Layout>;
