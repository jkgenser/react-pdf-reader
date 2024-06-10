import "./App.css";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
import Reader, { ReaderRef } from "./components/Reader";
import { ChangeEvent, useRef, useState } from "react";
import { PageChangeEvent } from "./types";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

function App() {
  const [pageNum, setPageNum] = useState<number | null>(null);
  const [scale, setScale] = useState<number | null>(0.75);
  const [rotation, setRotation] = useState<number>(0);
  const [file, setFile] = useState<string>("pdf-open-parameters.pdf");
  const [wantPage, setWantPage] = useState<number | null>(null);
  const readerRef = useRef<ReaderRef | null>(null);
  // const [pageIndex, setPageIndex] = useState<number>(0);

  const onPageChange = (e: PageChangeEvent) => {
    setPageNum(e.currentPage);
  };

  const handleScaleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setScale(isNaN(value) ? null : value);
  };
  const handleRotationChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setRotation(parseInt(e.target.value, 10));
  };

  const handleFileChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFile(e.target.value);
  };

  const handleWantPageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setWantPage(isNaN(value) ? null : value);
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
          <select value={rotation} onChange={handleRotationChange}>
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
            <option value="rai.pdf">rai.pdf</option>
          </select>
        </div>
        <button
          onClick={() => {
            readerRef.current &&
              wantPage &&
              readerRef.current.jumpToPage(wantPage);
          }}
        >
          jump to page
        </button>
        <input
          type="number"
          value={wantPage !== null ? wantPage : ""}
          onChange={handleWantPageChange}
        />
      </div>
      <div
        style={{
          width: "800px",
          height: "500px",
          borderColor: "gray",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <Reader
          ref={readerRef}
          file={file}
          onPageChange={onPageChange}
          initialScale={scale || undefined}
          rotation={rotation || 0}
        />
      </div>
    </>
  );
}

export default App;
