const Footer = () => {
  return (
    <footer aria-label="footer">
      <div className="grid place-items-center bg-zinc-600/60 py-4 text-gray-300 shadow-md backdrop-blur-md backdrop-filter">
        <h1>
          Powred by{" "}
          <a
            aria-label="navigate to vercel"
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white active:text-gray-100"
          >
            Vercel
          </a>
          {" and "}
          <a
            aria-label="navigate to github repo"
            href="https://github.com/sadmann7"
            target="_blank"
            rel="noreferrer"
            className="transition-colors hover:text-white active:text-gray-100"
          >
            OpenAI
          </a>
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
