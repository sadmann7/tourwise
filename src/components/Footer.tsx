// external imports

const Footer = () => {
  return (
    <footer aria-label="footer">
      <div className="grid place-items-center py-2">
        <h1>
          Powred by
          <a
            aria-label="navigate to github repo"
            href="https://github.com/sadmann7"
            target="_blank"
            rel="noreferrer"
            className="transition-opacity hover:text-opacity-80 active:text-opacity-90"
          >
            OpenAI
          </a>
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
