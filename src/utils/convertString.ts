export const convertString = <T>(
  string: string | null | undefined
): T | undefined => {
  if (typeof string !== "string") {
    return;
  }

  if (string === "true") {
    return true as T;
  }

  if (string === "false") {
    return false as T;
  }

  const number = parseFloat(string);

  if (!isNaN(number)) {
    return number as T;
  }
};
