import { time } from "console";

export const debounce = <T extends (...args: any[]) => void>(
  callback: T,
  timeout: number
) => {
  const timeoutId = setTimeout(() => {}, timeout);
};
