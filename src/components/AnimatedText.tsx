import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type AnimatedTextProps = {
  words: string[];
  defaultWord?: string;
} & React.HTMLAttributes<HTMLSpanElement>;

const AnimatedText = ({ className, words, defaultWord }: AnimatedTextProps) => {
  const [word, setWord] = useState<string>(defaultWord ?? "Word");
  const [replay, setReplay] = useState<boolean>(true);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomWord =
        words[Math.floor(Math.random() * words.length)] ?? "Another Word";
      setWord(randomWord);
      setReplay(!replay);
      setTimeout(() => {
        setReplay(true);
      }, 200);
    }, 4000);

    return () => clearInterval(interval);
  }, [words, replay]);

  // framer-motion
  const container = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.5,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.span
      className={className}
      variants={container}
      initial="hidden"
      animate={replay ? "visible" : "hidden"}
    >
      {word.split("").map((letter, index) => (
        <motion.span key={index} variants={item}>
          {letter}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default AnimatedText;
