import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebouncedCallback } from "use-debounce";
import { PageChangeEvent } from "../types";
import {
  PDFDocumentProxy,
  PDFPageProxy,
  PageViewport,
} from "pdfjs-dist/types/src/display/api";

// rotate... hook?
// jumptopage...  hook?
// on document loaded
// need to resize document to an appropriate amount when loading it in?

const EXTRA_HEIGHT = 30;
const EXTRA_WIDTH = 10;

const Reader = ({
  file,
  onPageChange,
}: {
  file: string;
  onPageChange?: (e: PageChangeEvent) => void;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [viewports, setPageViewports] = useState<Array<PageViewport>>([]);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);

  const onDocumentLoadSuccess = async (newPdf: PDFDocumentProxy) => {
    setPdf(newPdf);
    setNumPages(newPdf.numPages);
    const viewports = await Promise.all(
      Array.from({ length: newPdf.numPages }, async (_, index) => {
        const page = await newPdf.getPage(index + 1);
        const viewport = page.getViewport({ scale: 1 });
        return viewport;
      })
    );
    setPageViewports(viewports);
  };

  const estimateSize = useCallback(
    (index: number) => {
      if (!viewports) return 0;
      return viewports[index].height + EXTRA_HEIGHT;
    },
    [viewports]
  );

  const virtualizer = useVirtualizer({
    count: numPages || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: estimateSize,
    overscan: 0,
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
    console.log("Virtualizer initialized:", virtualizer);
  }, [virtualizer]);

  // Make sure virtualizer re-measures whenever pageHeights is done being set
  useEffect(() => {
    virtualizer.measure();
  }, [viewports, virtualizer]);

  // TODO: potentially figure out a better "on page change" functionality
  useEffect(() => {
    onPageChange && pdf && onPageChange({ currentPage, doc: pdf });
    console.log("currentPage", currentPage);
  }, [currentPage, pdf, onPageChange]);

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
                  display: "flex",
                  justifyContent: "center",
                  width: `${viewports[virtualItem.index].width + 15}px`,
                  borderRadius: "4px",
                  padding: "5px",
                  backgroundColor: "white",
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
