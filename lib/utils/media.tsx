import { supportsPassiveEvents } from "detect-it";
import { useEffect, useState, useMemo, useCallback } from "react";

export const useIsMobile = (mobileWidth = 1023) => {
  const isMobileMediaQuery = useMemo(
    () => window.matchMedia(`(max-width: ${mobileWidth}px)`),
    [mobileWidth]
  );

  const [matches, setMatches] = useState(isMobileMediaQuery.matches);

  const updateMatches = useCallback(
    (e: MediaQueryListEvent) => setMatches(e.matches),
    [setMatches]
  );

  useEffect(() => {
    isMobileMediaQuery.addEventListener("change", updateMatches);
    return () =>
      isMobileMediaQuery.removeEventListener("change", updateMatches);
  }, [isMobileMediaQuery, updateMatches]);
  return matches;
};

export enum SCROLL_DIRECTION {
  Y,
  X,
}

export const useScroll = (
  targetNode: Window | HTMLElement | null,
  direction?: SCROLL_DIRECTION
) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const scrollDirection = direction || SCROLL_DIRECTION.Y;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const onScroll = (event: any) => {
      const currentTarget = event.currentTarget;
      if (currentTarget) {
        // handle both scrollY (when window is passed as targetNode) and scrollTop (when HTMLElement is passed as targetNode)
        const scrollY = currentTarget.scrollY || currentTarget.scrollTop;
        const scrollX = currentTarget.scrollX || currentTarget.scrollLeft;
        const scrollProgressUpdate =
          SCROLL_DIRECTION.Y === scrollDirection ? scrollY : scrollX;
        if (scrollProgressUpdate != undefined) {
          setScrollProgress(scrollProgressUpdate);
        }
      }
    };

    if (targetNode) {
      targetNode.addEventListener(
        "scroll",
        onScroll,
        supportsPassiveEvents ? { passive: true, capture: false } : false
      );
    }
    return () => {
      if (targetNode) {
        targetNode.removeEventListener("scroll", onScroll);
      }
    };
  }, [targetNode, direction]);
  return scrollProgress;
};

export const scrollTo = (el: HTMLElement) => {
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  /*
  const headerOffset = 100;
  const elPosition = el.getBoundingClientRect().top;
  const offsetPosition = elPosition - headerOffset;

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  });
  */
};
