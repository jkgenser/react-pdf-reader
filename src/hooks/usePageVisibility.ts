// Track how much of each page is inside the current viewport
// this way we can accurately track whenever the page is changed
// by the most amount of visibility

import { Virtualizer } from "@tanstack/react-virtual";
import { MutableRefObject, useEffect } from "react";

const THRESHOLD = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];

const usePageVisibility = ({
  parentRef,
  virtualizer,
}: {
  parentRef: MutableRefObject<HTMLElement | null>;
  virtualizer: Virtualizer;
}) => {
  const pageObserver = new IntersectionObserver(
    (entries) => {
      console.log(entries);
    },
    {
      root: parentRef.current,
      threshold: THRESHOLD,
    }
  );

  // cleanup
  useEffect(() => {
    return () => {
      pageObserver.disconnect();
    };
  }, []);

  return { pageObserver };
};

export default usePageVisibility;
