import {
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist/types/src/display/api";

const calculatePageSize = (doc: PDFDocumentProxy) => {};

// why cache the outline ref
//

export const getPage = (
  doc: PDFDocumentProxy,
  pageIndex: number
): Promise<PDFPageProxy> => {
  if (!doc) {
    return Promise.reject("The document is not loaded yet");
  }

  const pageKey = `${doc.loadingTask.docId}___${pageIndex}`;
  const page = pagesMap.get(pageKey);
  if (page) {
    return Promise.resolve(page);
  }

  return new Promise((resolve, _) => {
    doc.getPage(pageIndex + 1).then((page) => {
      pagesMap.set(pageKey, page);
      if (page.ref) {
        cacheOutlineRef(doc, page.ref, pageIndex);
      }
      resolve(page);
    });
  });
};
