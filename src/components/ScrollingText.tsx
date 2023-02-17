type ScrollingTextProps = {
  className?: string;
  words: string[];
};

const ScrollingText = ({ className, words }: ScrollingTextProps) => {
  return (
    <div className="mt-5 h-6 overflow-hidden sm:h-8">
      <ul className="grid animate-scroll-up place-items-center gap-2">
        {words.map((word) => (
          <li key={word} className={className ?? ""}>
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScrollingText;
