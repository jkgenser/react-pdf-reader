import "./App.css";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
import Reader from "./components/Reader";
import { ChangeEvent, useState } from "react";
import { PageChangeEvent } from "./types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

// const file = "./test-pdf.pdf";

// Change zoom
// Set default scale based on the container it's in
// Rotate
// jumptopage
// render highlights
// Be able to handle the horizontal width to support documents that have some landscape pages

function App() {
  const [pageNum, setPageNum] = useState<number | null>(null);
  const [scale, setScale] = useState<number | null>(1);
  const [rotate, setRotate] = useState<number>(0);
  const [file, setFile] = useState<string>("pdf-open-parameters.pdf");

  const onPageChange = (e: PageChangeEvent) => {
    setPageNum(e.currentPage);
  };

  const handleScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setScale(isNaN(value) ? null : value);
  };
  const handleRotationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRotate(parseInt(e.target.value, 10));
  };

  const handleFileChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFile(e.target.value);
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <div>Page: {pageNum}</div>
        <div>
          scale
          <input
            type="number"
            value={scale !== null ? scale : ""}
            onChange={handleScaleChange}
          />
        </div>
        <div>
          Rotation
          <select value={rotate} onChange={handleRotationChange}>
            <option value={0}>0</option>
            <option value={90}>90</option>
            <option value={180}>180</option>
            <option value={270}>270</option>
          </select>
        </div>
        <div>
          File
          <select value={file} onChange={handleFileChange}>
            <option value="pdf-open-parameters.pdf">
              pdf-open-parameters.pdf
            </option>
            <option value="test-pdf.pdf">test-pdf.pdf</option>
          </select>
        </div>
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
        <Reader
          file={file}
          onPageChange={onPageChange}
          scale={scale || 0}
          rotate={rotate || 0}
        />
      </div>
    </>
  );
}

export default App;
