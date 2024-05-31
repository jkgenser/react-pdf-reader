import { useState, useRef, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
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
  const [pageHeights, setPageHeights] = useState<Array<number>>([]);

  const parentRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const virtualizer = useVirtualizer({
    count: numPages || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: useMemo(
      () => (index) =>
        pageHeights && pageHeights[index] ? pageHeights[index] + 45 : 0,
      [pageHeights]
    ),

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

  useEffect(() => {
    (async () => {
      const loadingTask = pdfjs.getDocument(file);
      const pdf = await loadingTask.promise;

      const heights = await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, index) => {
          const page = await pdf.getPage(index + 1);
          const viewport = page.getViewport({ scale: 1 });
          return viewport.height;
        })
      );

      setPageHeights(heights);
    })();
  }, [file]);

  const currentPage = virtualizer.getVirtualItems()[0]?.index + 1 || 0;
  console.log("currentPage", currentPage);
  console.log("pageHeights", pageHeights);

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
