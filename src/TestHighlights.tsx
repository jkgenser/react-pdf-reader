import { RenderPageProps } from "./types";
import { transformHighlightProps } from "./util";

const highlightData = [
  { top: 14.2, left: 12, height: 2.3, width: 7.5, pageIndex: 0 },
  { top: 1, left: 1, height: 1, width: 2, pageIndex: 1 },
];

const Highlight = ({
  top,
  left,
  height,
  width,
  rotation,
}: {
  top: number;
  left: number;
  height: number;
  width: number;
  rotation: number;
}) => {
  return (
    <div
      className="highlight-on-page"
      style={{
        zIndex: 5,
        ...transformHighlightProps({ top, left, height, width, rotation }),
        position: "absolute",
        backgroundColor: "yellow",
        opacity: 0.5,
      }}
    ></div>
  );
};

const TestHighlightsLayer = (props: RenderPageProps) => {
  const pageHighlights = highlightData.filter(
    (highlight) => highlight.pageIndex === props.pageIndex
  );
  return (
    <div className="text-highlights-layer">
      {pageHighlights.map((highlight, index) => (
        <Highlight key={index} {...highlight} rotation={props.rotate} />
      ))}
    </div>
  );
};

export default TestHighlightsLayer;
