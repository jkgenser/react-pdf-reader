import { useState, useRef, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebouncedCallback } from "use-debounce";
import { PageChangeEvent } from "../types";
import {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";

// consider using useCallBack to not re-render pages?
// https://chatgpt.com/c/0fd80b49-412c-4399-ace3-56f1a8e00754

// rotate... hook?
// jumptopage...  hook?
// on document loaded
// need to resize document to an appropriate amount when loading it in?

const EXTRA_HEIGHT = 30;
const EXTRA_WIDTH = 45;

const Reader = ({
  file,
  onPageChange,
}: {
  file: string;
  onPageChange?: (e: PageChangeEvent) => void;
}) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageHeights, setPageHeights] = useState<Array<number>>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);

  const onDocumentLoadSuccess = (pdf: PDFDocumentProxy) => {
    setPdf(pdf);
    setNumPages(pdf.numPages);
  };

  const virtualizer = useVirtualizer({
    count: numPages || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: useMemo(
      () => (index) =>
        pageHeights && pageHeights[index]
          ? pageHeights[index] + EXTRA_HEIGHT
          : 0,
      [pageHeights]
    ),

    overscan: 0, // may or may not need overscan
  });
  const currentPage = virtualizer.getVirtualItems()[0]?.index + 1 || -1;

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

  useEffect(() => {
    onPageChange && pdf && onPageChange({ currentPage, doc: pdf });
    console.log("currentPage", currentPage);
  }, [currentPage]);

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
              // ref={virtualizer.measureElement}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <div
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  border: "1px solid lightgray",
                  borderRadius: "4px", // Optional: for rounded corners
                  padding: "16px", // Optional: for some spacing around the Page
                  backgroundColor: "white", // Ensure the background is white if you want a consistent look
                  // display: "flex",
                  // flexDirection: "column",
                  // justifyContent: "center",
                }}
              >
                <Page pageNumber={virtualItem.index + 1} />
              </div>
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
};

export default Reader;
