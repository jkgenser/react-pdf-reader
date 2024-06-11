import { Page as ReactPdfPage } from "react-pdf";
import { useEffect, useRef } from "react";
import { ReaderPageProps } from "../types";

const EXTRA_WIDTH = 10;

const Page = ({
  virtualItem,
  viewports,
  scale,
  rotation,
  pageObserver,
  isScrollingFast,
}: ReaderPageProps) => {
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pageObserver && pageRef.current && pageObserver.observe(pageRef.current);
  }, [pageObserver]);

  return (
    <div
      ref={pageRef}
      id="page-wrapper-wrapper"
      data-index={virtualItem.index}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        id="page-wrapper"
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid lightgray",
          width: `${viewports[virtualItem.index].width + EXTRA_WIDTH}px`,
          borderRadius: "4px",
          padding: "0px",
          margin: "5px",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {!isScrollingFast && (
          <ReactPdfPage
            pageNumber={virtualItem.index + 1}
            scale={scale}
            rotate={rotation}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
