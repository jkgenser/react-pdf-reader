import "./App.css";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

import { pdfjs } from "react-pdf";
import Simple from "./components/Simple";
import Reader from "./components/Reader";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const file = "./test-pdf.pdf";

function App() {
  return <Reader file={file} />;
}

export default App;
