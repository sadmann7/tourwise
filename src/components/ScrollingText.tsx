const ScrollingText = ({ words }: { words: string[] }) => {
  return (
    <div className="mt-5 h-6 overflow-hidden sm:h-8">
      <ul className="grid animate-scroll-up place-items-center gap-2">
        {words.map((word) => (
          <li
            key={word}
            className="text-center text-xl font-semibold text-indigo-500 sm:text-3xl"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScrollingText;
