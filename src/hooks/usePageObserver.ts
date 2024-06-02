// Track how much of each page is inside the current viewport
// this way we can accurately track whenever the page is changed
// by the most amount of visibility

import React, { MutableRefObject, useEffect, useMemo } from "react";

const THRESHOLD = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const INDEX_ATTRIBUTE = "data-index";
const usePageObserver = ({
  parentRef,
  setCurrentPage,
}: {
  setCurrentPage: React.Dispatch<React.SetStateAction<number | null>>;
  parentRef: MutableRefObject<HTMLDivElement | null>;
}) => {
  const pageObserver = useMemo(() => {
    const io = new IntersectionObserver(
      (entries: IntersectionObserverEntry[]) => {
        let maxRatio = -1;
        let maxIndex: number | null = null;

        entries.forEach((entry) => {
          const ratio = entry.isIntersecting ? entry.intersectionRatio : -1;
          const target = entry.target;
          const indexAttribute = target.getAttribute(INDEX_ATTRIBUTE);

          if (!indexAttribute) {
            return;
          }

          const index = parseInt(indexAttribute, 10);

          if (ratio > maxRatio) {
            maxRatio = ratio;
            maxIndex = index;
          }
        });

        if (maxIndex !== null) {
          console.log("maxIndex", maxIndex);
          setCurrentPage(maxIndex + 1);
        }
      },
      {
        root: parentRef.current,
        threshold: THRESHOLD,
      }
    );
    return io;
  }, []);

  // cleanup
  useEffect(() => {
    return () => pageObserver?.disconnect();
  }, []);

  return { pageObserver };
};

export default usePageObserver;
