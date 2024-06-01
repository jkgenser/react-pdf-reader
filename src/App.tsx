import "./App.css";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
import Reader from "./components/Reader";
import { ChangeEvent, useState } from "react";
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
  const [scale, setScale] = useState<number | null>(1);

  const onPageChange = (e: PageChangeEvent) => {
    setPageNum(e.currentPage);
  };

  const handleScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setScale(isNaN(value) ? null : value);
  };

  return (
    <>
      <div>{pageNum}</div>
      <div>
        scale
        <input
          type="number"
          value={scale !== null ? scale : ""}
          onChange={handleScaleChange}
        />
      </div>
      <div
        style={{
          width: "700px",
          height: "500px",
          borderColor: "gray",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        {/* @ts-expect-error scale wrong type */}
        <Reader file={file} onPageChange={onPageChange} scale={scale} />
      </div>
    </>
  );
}

export default App;
