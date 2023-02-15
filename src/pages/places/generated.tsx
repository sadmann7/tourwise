import Head from "next/head";
import type { NextPageWithLayout } from "../_app";

// external imports
import Layout from "@/layouts/Layout";

const GeneratedPlaces: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Generated Places | Next Tour</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="container mx-auto mt-24 mb-14 min-h-screen max-w-5xl px-4">
        <p className="text-base text-white">Generated Places</p>
      </main>
    </>
  );
};

export default GeneratedPlaces;

GeneratedPlaces.getLayout = (page) => <Layout>{page}</Layout>;