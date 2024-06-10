import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { PageViewport } from "pdfjs-dist//types/src/display/display_utils";

import { useCallback, useEffect, useRef, useState } from "react";
import usePageObserver from "./usePageObserver";
import { useVirtualizer } from "@tanstack/react-virtual";

const EXTRA_HEIGHT = 30;
const RESERVE_WIDTH = 50; // used when calculating default scale

const determineScale = (parentElement: HTMLElement, width: number): number => {
  const scaleWidth = (parentElement.clientWidth - RESERVE_WIDTH) / width;
  return scaleWidth;
};

const useReader = ({
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
  const parentRef = useRef<HTMLDivElement | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [viewports, setPageViewports] = useState<Array<PageViewport>>([]);
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [scale, setScale] = useState<number | undefined>(initialScale);
  const [currentPage, setCurrentPage] = useState<number | null>(null);

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

  const { pageObserver } = usePageObserver({
    parentRef,
    setCurrentPage,
    numPages,
  });

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
  }, [pdf, initialScale, rotation]);

  useEffect(() => {
    virtualizer.measure();
  }, [virtualizer, viewports]);

  useEffect(() => {
    if (!currentPage) return;
    onPageChange && pdf && onPageChange({ currentPage, doc: pdf });
  }, [currentPage, pdf, onPageChange]);
};

export default useReader;
