import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  isLoading?: boolean;
};

const Button = ({
  variant = "primary",
  isLoading = false,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${
        variant === "primary"
          ? "bg-indigo-500 enabled:hover:bg-indigo-600 enabled:active:bg-indigo-500"
          : "bg-gray-500 enabled:hover:bg-gray-600 enabled:active:bg-gray-500"
      } flex w-full items-center justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-indigo-100 disabled:cursor-not-allowed ${
        props.className ?? ""
      }`}
      {...props}
    >
      {isLoading ? (
        <div className="mr-2 aspect-square w-4 animate-spin rounded-full border-2 border-solid border-gray-100 border-t-transparent" />
      ) : null}
      {props.children}
    </button>
  );
};

export default Button;
