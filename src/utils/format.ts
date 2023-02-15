export const titleCase = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const sanitize = (str: string) => {
  return str.replace(/[^a-zA-Z ]/g, "");
};
