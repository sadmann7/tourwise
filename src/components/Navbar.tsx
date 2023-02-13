import Link from "next/link";
import { FaRegPaperPlane } from "react-icons/fa";

const Navbar = () => {
  return (
    <header
      aria-label="navbar"
      className="flex w-full items-center gap-4 bg-neutral-900"
    >
      <nav className="container mx-auto flex max-w-6xl items-center justify-between border-b-2 border-b-gray-500 px-4 py-5">
        <Link
          aria-label="navigate to home page"
          href="/"
          className="flex items-center gap-2 text-base text-white transition-opacity hover:opacity-80 active:opacity-90"
        >
          <FaRegPaperPlane />
          <span className="font-mono">Next Tour</span>
        </Link>
        <div className="flex items-center gap-4">
          <a
            aria-label="navigate to github repo"
            href="https://github.com/sadmann7/age-tf"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 font-mono text-base text-white transition-opacity hover:opacity-80 active:opacity-90"
          >
            Repository
          </a>
          <Link
            aria-label="navigate to starred tours page"
            href={"/starred"}
            className="flex items-center gap-1.5 font-mono text-base text-white transition-opacity hover:opacity-80 active:opacity-90"
          >
            Starred places
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
