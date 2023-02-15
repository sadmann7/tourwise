export const sanitize = (str: string) => {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
};

export const saniziteString = (str: string) => {
  return str.replaceAll("\n\n", "").replaceAll("'", '"');
};
