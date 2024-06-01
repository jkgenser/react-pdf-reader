import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page } from "react-pdf";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useDebouncedCallback } from "use-debounce";
import { PageChangeEvent } from "../types";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { PageViewport } from "pdfjs-dist//types/src/display/display_utils";

const EXTRA_HEIGHT = 30;
const RESERVE_WIDTH = 100; // used when calculating default scale
// const EXTRA_WIDTH = 10;

const determineScale = (parentElement: HTMLElement, width: number): number => {
  const scaleWidth = (parentElement.clientWidth - RESERVE_WIDTH) / width;
  return scaleWidth;
};

const Reader = ({
  file,
  initialScale = undefined,
  rotation = 0,
  onPageChange,
}: {
  file: string;
  initialScale?: number;
  rotation?: number;
  onPageChange?: (e: PageChangeEvent) => void;
}) => {
  const parentRef = useRef<HTMLDivElement>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [viewports, setPageViewports] = useState<Array<PageViewport>>([]);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [scale, setScale] = useState<number | undefined>(initialScale);

  const onDocumentLoadSuccess = async (newPdf: PDFDocumentProxy) => {
    setPdf(newPdf);
    setNumPages(newPdf.numPages);
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
    const calculateViewports = async () => {
      if (!pdf) return;

      const viewports = await Promise.all(
        Array.from({ length: pdf.numPages }, async (_, index) => {
          const page = await pdf.getPage(index + 1);
          const viewport = page.getViewport({
            scale: scale as number,
            rotation,
          });
          return viewport;
        })
      );

      setPageViewports(viewports);
    };

    calculateViewports();
  }, [pdf, scale, rotation]);

  useEffect(() => {
    if (!pdf) return;
    if (initialScale) {
      setScale(initialScale);
      return;
    }
    const fetchPageAndSetScale = async () => {
      const firstPage = await pdf.getPage(1);
      const firstViewPort = firstPage.getViewport({ scale: 1, rotation });
      const newScale = determineScale(parentRef.current!, firstViewPort.width);
      setScale(newScale);
    };

    fetchPageAndSetScale();
  }, [pdf, initialScale, scale, rotation]);

  useEffect(() => {
    virtualizer.measure();
  }, [virtualizer, pdf, scale, viewports]);

  // TODO:  figure out a better "on page change" functionality
  useEffect(() => {
    onPageChange && pdf && onPageChange({ currentPage, doc: pdf });
    console.log("currentPage", currentPage);
  }, [currentPage, pdf, onPageChange]);

  console.log("scale", scale);

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
                <Page
                  pageNumber={virtualItem.index + 1}
                  scale={scale}
                  rotate={rotation}
                />
              </div>
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
};

export default Reader;
