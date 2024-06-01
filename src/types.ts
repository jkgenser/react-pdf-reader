import {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";

export interface PageChangeEvent {
  currentPage: number;
  doc: PDFDocumentProxy;
}
