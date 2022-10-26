import { useEffect, useMemo, useRef } from "react";

export const useDebounce = <T extends (...args: any[]) => void>(
  callback: T,
  timeout: number
) => {
  const timer = useRef<number>();

  useEffect(
    () => () => {
      timer.current && clearTimeout(timer.current);
    },
    []
  );

  const debounceCallback = useMemo(
    () =>
      ((...args) => {
        timer.current && clearTimeout(timer.current);

        timer.current = +setTimeout(() => {
          callback(...args);
        }, timeout);
      }) as T,
    [callback, timeout]
  );

  return debounceCallback;
};
