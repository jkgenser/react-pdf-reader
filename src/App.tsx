import "./App.css";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
import Reader from "./components/Reader";
import { useState } from "react";
import { PageChangeEvent } from "./types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const file = "./test-pdf.pdf";
const file = "./pdf-open-parameters.pdf";

// Change zoom
// Set default scale based on the container it's in
// Rotate
// jumptopage
// render highlights
// Be able to handle the horizontal width to support documents that have some landscape pages

function App() {
  const [pageNum, setPageNum] = useState<number | null>(null);

  const onPageChange = (e: PageChangeEvent) => {
    setPageNum(e.currentPage);
  };
  return (
    <div style={{ width: "700px", height: "600px" }}>
      <div>{pageNum}</div>
      <Reader file={file} onPageChange={onPageChange} />
    </div>
  );
}

export default App;
