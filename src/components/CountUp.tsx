import { useEffect, useState } from "react";

type CountUpProps = {
  end: number;
  duration?: number;
  delay?: number;
  className?: string;
};

const CountUp = ({
  end,
  duration = 1000,
  delay = 0,
  className,
}: CountUpProps) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => {
        const next = prev + end / (duration / 10);
        if (next >= end) {
          clearInterval(interval);
          return end;
        }
        return next;
      });
    }, 10);
    return () => clearInterval(interval);
  }, [end, duration]);

  return (
    <div
      aria-label="count up from 0 to actual number"
      className={className}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {count.toFixed(0)}
    </div>
  );
};

export default CountUp;
