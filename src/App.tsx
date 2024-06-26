import "./App.css";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
import Reader from "./components/Reader";
import { ChangeEvent, useState } from "react";
import { PageChangeEvent, ReaderAPI, RenderPageProps } from "./types";
import { Page } from "react-pdf";
import TestHighlightsLayer from "./TestHighlights";
import { highlightData } from "./highlightData";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function App() {
  const [pageNum, setPageNum] = useState<number | null>(null);
  const [scale, setScale] = useState<number | null>(0.75);
  const [rotation, setRotation] = useState<number>(0);
  const [file, setFile] = useState<string>("pdf-open-parameters.pdf");
  const [wantPage, setWantPage] = useState<number | null>(null);
  const [readerAPI, setReaderAPI] = useState<ReaderAPI | null>(null);
  const [offset, setOffset] = useState<number | null>(null);

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

  const handleOffsetChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setOffset(isNaN(value) ? null : value);
  };

  const renderPage = (props: RenderPageProps) => {
    return (
      <>
        <Page {...props}>
          <TestHighlightsLayer {...props} />
        </Page>
      </>
    );
  };

  return (
    <div style={{ display: "flex" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
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
            readerAPI &&
              wantPage !== null &&
              readerAPI.jumpToPage(wantPage - 1);
          }}
        >
          jump to page
        </button>
        <input
          type="number"
          value={wantPage !== null ? wantPage : ""}
          onChange={handleWantPageChange}
        />
        <button
          onClick={() => {
            readerAPI && readerAPI.jumpToHighlightArea(highlightData[0]);
          }}
        >
          jump to highlight
        </button>
        <input
          type="number"
          value={offset !== null ? offset : ""}
          onChange={handleOffsetChange}
        />
        <button
          onClick={() => {
            readerAPI && offset !== null && readerAPI.jumpToOffset(offset);
          }}
        >
          jump to offset
        </button>
      </div>
      <div
        style={{
          width: "800px",
          height: "800px",
          borderColor: "gray",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <Reader
          file={file}
          onPageChange={onPageChange}
          initialScale={scale || undefined}
          rotation={rotation || 0}
          setReaderAPI={(api: ReaderAPI) => setReaderAPI(api)}
          renderPage={renderPage}
        />
      </div>
    </div>
  );
}

export default App;
