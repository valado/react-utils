import { useEffect } from "react";

export const useDebounce = <T,>(
  input: T,
  callback: (debouncedValue: T) => void,
  delay = 500
) => {
  useEffect(() => {
    const handler = setTimeout(() => {
      callback(input);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [input, delay, callback]);
};
