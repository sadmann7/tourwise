import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiGithub, FiHeart, FiSend } from "react-icons/fi";

const navLinks = [
  {
    name: "Github",
    icon: <FiGithub className="text-white" size={20} />,
    href: "https://github.com/sadmann7/tourwise.git",
    isExternal: true,
  },
  {
    name: "Top Places",
    icon: <FiHeart className="text-white" size={20} />,
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
          ? "bg-zinc-600/60 shadow-md backdrop-blur-md backdrop-filter transition-all duration-300 ease-in-out"
          : "bg-transparent"
      }`}
      onScroll={handleScroll}
    >
      <nav className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link
          aria-label="navigate to home page"
          href="/"
          className="flex items-center gap-1.5 text-gray-100 transition-colors hover:text-white active:text-gray-100"
        >
          <FiSend className="text-white" size={18} />
          <span className="font-mono">Tourwise</span>
        </Link>
        <div className="flex items-center gap-1">
          {navLinks.map((link, index) =>
            link.isExternal ? (
              <a
                aria-label={`navigate to ${link.name} page`}
                key={index}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="rounded-md bg-transparent p-1.5 font-mono text-base text-white transition-colors hover:bg-zinc-500 active:bg-zinc-400"
              >
                {link.icon}
              </a>
            ) : (
              <Link
                aria-label={`navigate to ${link.name} page`}
                key={index}
                href={link.href}
                className={`rounded-md p-1.5 font-mono text-base text-white transition-colors hover:bg-zinc-500 active:bg-zinc-400 ${
                  router.pathname === link.href
                    ? "bg-zinc-500"
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
