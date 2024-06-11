import { VirtualItem } from "@tanstack/react-virtual";
import { PDFDocumentProxy } from "pdfjs-dist/types/src/display/api";
import { PageViewport } from "pdfjs-dist//types/src/display/display_utils";

export interface PageChangeEvent {
  currentPage: number;
  doc: PDFDocumentProxy;
}

export interface ReaderProps {
  file: string;
  initialScale?: number;
  rotation?: number;
  onPageChange?: (e: PageChangeEvent) => void;
  setReaderAPI?: (readerAPI: ReaderAPI) => void;
  renderPage?: RenderPage;
}

export interface ReaderAPI {
  jumpToPage: (pageIndex: number) => void;
}

// height, left, top, width are 0-100% values
export interface HighlightArea {
  height: number;
  left: number;
  top: number;
  width: number;
  pageIndex: number;
}

export interface RenderPageProps {
  // annotationLayer: Slot;
  // canvasLayer: Slot;
  // Is the canvas layer rendered completely?
  // canvasLayerRendered: boolean;
  doc: PDFDocumentProxy;
  height: number;
  pageIndex: number;
  rotation: number;
  scale: number;
  // svgLayer: Slot;
  // textLayer: Slot;
  // Is the text layer rendered completely?
  textLayerRendered: boolean;
  width: number;
  // Mark as the page rendered completely
}

export type RenderPage = (props: RenderPageProps) => React.ReactNode;

export interface ReaderPageProps {
  virtualItem: VirtualItem;
  viewports: Array<PageViewport>;
  scale: number | undefined;
  rotation: number;
  pageObserver: IntersectionObserver | undefined;
  isScrollingFast: boolean;
}
