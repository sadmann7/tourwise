import Head from "next/head";

type MetaProps = {
  title?: string;
  description?: string;
  image?: string;
};

const Meta = ({
  title = "Tourwise",
  description = "Generate places to travel based on your preferences.",
  image = "https://tourwise.vercel.app/api/og",
}: MetaProps) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:site_name" content="Tourwise" />
      <meta property="og:description" content={description} />
      <meta property="og:title" content={title} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta property="og:image" content={image} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
};

export default Meta;
