import Link from "next/link";
import { useRouter } from "next/router";

// external imports
import { FaRegPaperPlane } from "react-icons/fa";

const Navbar = () => {
  const router = useRouter();

  return (
    <header
      aria-label="header"
      className="fixed top-0 left-0 z-20 flex w-full items-center gap-4 bg-neutral-900"
    >
      <nav className="container mx-auto flex max-w-5xl items-center justify-between border-b-2 border-b-gray-500 px-4 py-5">
        <Link
          aria-label="navigate to home page"
          href="/"
          className="flex items-center gap-2 text-base text-white transition-opacity hover:opacity-80 active:opacity-90"
        >
          <FaRegPaperPlane />
          <span className="font-mono">Next Tour</span>
        </Link>
        <div className="flex items-center gap-2.5">
          <a
            aria-label="navigate to github repo"
            href="https://github.com/sadmann7/next-tour"
            target="_blank"
            rel="noreferrer"
            className="rounded-md bg-transparent px-3 py-1 font-mono text-base text-white transition-colors hover:bg-neutral-700 active:bg-neutral-800"
          >
            Repository
          </a>
          <Link
            aria-label="navigate to favourited places page"
            href={"/favourited"}
            className={`rounded-md px-3 py-1 font-mono text-base text-white transition-colors hover:bg-neutral-700 active:bg-neutral-800 ${
              router.pathname === "/favourited"
                ? "bg-neutral-700"
                : "bg-transparent"
            }`}
          >
            Favourited
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;