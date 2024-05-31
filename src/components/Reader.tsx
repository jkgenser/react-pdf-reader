import { useState, useRef, useEffect } from "react";
import { Document, Page } from "react-pdf";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebouncedCallback } from "use-debounce";

// consider using useCallBack to not re-render pages?
// https://chatgpt.com/c/0fd80b49-412c-4399-ace3-56f1a8e00754

// rotate... hook?
// jumptopage...  hook?
// current page number
// on document loaded
// on page changed
// also consider a version that doesn't use tanstack?

const Reader = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const virtualizer = useVirtualizer({
    count: numPages || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 750,
    overscan: 1,
  });

  const handleScroll = useDebouncedCallback(() => {
    if (!parentRef.current) return;
    virtualizer.scrollToOffset(parentRef.current.scrollTop);
  }, 400);

  useEffect(() => {
    const scrollElement = parentRef.current;
    if (!scrollElement) return;
    scrollElement.addEventListener("scroll", handleScroll);
    return () => {
      if (scrollElement) {
        scrollElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [handleScroll]);

  const currentPage = virtualizer.getVirtualItems()[0]?.index + 1 || 0;
  console.log("currentPage", currentPage);

  return (
    <div
      ref={parentRef}
      style={{
        height: "100%",
        overflow: "auto",
        width: "100%",
      }}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {virtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.key}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <>
                <Page pageNumber={virtualItem.index + 1} />
              </>
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
};

export default Reader;
