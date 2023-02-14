export const sanitize = (str: string) => {
  return str.replace(/[^a-zA-Z0-9 ]/g, "");
};
