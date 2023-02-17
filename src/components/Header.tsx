import { GithubIcon, HeartIcon, SendIcon, Triangle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const navLinks = [
  {
    name: "Vercel",
    icon: <Triangle className="aspect-square w-6 text-white" />,
    href: "https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app",
    isExternal: true,
  },

  {
    name: "Github",
    icon: <GithubIcon className="aspect-square w-6 text-white" />,
    href: "https://github.com/sadmann7/tourwise.git",
    isExternal: true,
  },
  {
    name: "Top Places",
    icon: <HeartIcon className="aspect-square w-6 text-white" />,
    href: "/top-places",
    isExternal: false,
  },
];

const Header = () => {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      aria-label="header"
      className={`fixed top-0 left-0 z-20 flex w-full items-center gap-4 ${
        isScrolled
          ? "bg-gradient-to-r from-zinc-700 via-gray-600 to-gray-800 shadow-md backdrop-blur-sm backdrop-filter"
          : "bg-transparent"
      }`}
      onScroll={handleScroll}
    >
      <nav className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          aria-label="navigate to home page"
          href="/"
          className="flex items-center gap-1.5 text-white transition-opacity hover:text-opacity-80 active:text-opacity-100"
        >
          <SendIcon className="aspect-square w-4 text-white" />
          <span className="hidden font-mono sm:block">Tourwise</span>
        </Link>
        <div className="flex items-center gap-0.5">
          {navLinks.map((link, index) =>
            link.isExternal ? (
              <a
                aria-label={`navigate to ${link.name} page`}
                key={index}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-transparent p-1.5 font-mono text-base text-white transition-colors hover:bg-zinc-600 active:bg-zinc-700"
              >
                {link.icon}
              </a>
            ) : (
              <Link
                aria-label={`navigate to ${link.name} page`}
                key={index}
                href={link.href}
                className={`rounded-md bg-transparent p-1.5 font-mono text-base text-white transition-colors hover:bg-zinc-600 active:bg-zinc-700 ${
                  router.pathname === link.href
                    ? "bg-neutral-700"
                    : "bg-transparent"
                }`}
              >
                {link.icon}
              </Link>
            )
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
