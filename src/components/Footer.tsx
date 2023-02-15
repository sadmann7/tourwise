// external imports
import { FaGithub } from "react-icons/fa";

const Footer = () => {
  return (
    <footer aria-label="footer" className="bg-black">
      <div className="container mx-auto flex w-full max-w-5xl items-center justify-between gap-4 border-t-2 border-t-gray-500 px-4 py-5">
        <h1 className="text-base text-white">
          Made with{" "}
          <a
            aria-label="navigate to openai overview page"
            href="https://platform.openai.com/overview"
            target="_blank"
            rel="noreferrer"
            className="text-white transition-opacity hover:text-opacity-80 active:text-opacity-100"
          >
            OpenAI
          </a>
        </h1>
        <a
          aria-label="navigate to github repo"
          href="https://github.com/sadmann7"
          target="_blank"
          rel="noreferrer"
          className="text-white transition-opacity hover:text-opacity-80 active:text-opacity-90"
        >
          <FaGithub
            className="text-gray-400 transition-colors hover:text-gray-200 active:text-gray-400"
            size={22}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
