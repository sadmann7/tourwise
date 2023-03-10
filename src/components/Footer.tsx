const Footer = () => {
  return (
    <footer aria-label="footer">
      <div className="grid place-items-center py-4">
        <h1 className="text-base text-gray-300">
          Powred by{" "}
          <a
            aria-label="navigate to github repo"
            href="https://github.com/sadmann7"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-gray-200 transition-colors hover:text-white active:text-gray-100"
          >
            OpenAI
          </a>
          {" and "}
          <a
            aria-label="navigate to vercel"
            href="https://vercel.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-gray-200 transition-colors hover:text-white active:text-gray-100"
          >
            Vercel
          </a>
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
