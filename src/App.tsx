import "./App.css";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
import Reader from "./components/Reader";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const file = "./pdf-open-parameters.pdf";

function App() {
  return (
    <div style={{ width: "700px", height: "600px" }}>
      <Reader file={file} />
    </div>
  );
}

export default App;
