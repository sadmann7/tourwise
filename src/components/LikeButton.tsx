import { motion } from "framer-motion";
import type { ButtonHTMLAttributes, ComponentProps } from "react";

// external imports
import { HeartIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartIconFilled } from "@heroicons/react/24/solid";

type LikeButtonProps = {
  isLiked: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement> &
  ComponentProps<typeof motion.button>;

const LikeButton = ({ isLiked, ...props }: LikeButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={props.className}
      animate={{ scale: isLiked ? 1.1 : 1 }}
      {...props}
    >
      {isLiked ? (
        <HeartIconFilled
          className="mr-1 mt-0.5 aspect-square w-5 text-red-500"
          aria-hidden="true"
        />
      ) : (
        <HeartIcon
          className="mr-1 aspect-square w-5 stroke-2 text-red-500"
          aria-hidden="true"
        />
      )}
    </motion.button>
  );
};

export default LikeButton;
