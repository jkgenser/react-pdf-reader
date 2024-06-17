import { RenderPageProps } from "./types";

const highlightData = [
  { top: 14.2, left: 12, height: 2, width: 7.5, pageIndex: 0 },
  { top: 1, left: 1, height: 1, width: 2, pageIndex: 1 },
];

const Highlight = ({
  top,
  left,
  height,
  width,
}: //   rotation,
{
  top: number;
  left: number;
  height: number;
  width: number;
  //   rotation: number;
}) => {
  return (
    <div
      className="highlight-on-page"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        height: `${height}%`,
        width: `${width}%`,
        position: "absolute",
        backgroundColor: "yellow",
        opacity: 0.5,
        // rotate: `${rotation}deg`,
      }}
    ></div>
  );
};

const TestHighlightsLayer = (props: RenderPageProps) => {
  const pageHighlights = highlightData.filter(
    (highlight) => highlight.pageIndex === props.pageIndex
  );
  return (
    <div style={{ zIndex: 1 }}>
      {pageHighlights.map((highlight, index) => (
        <Highlight
          key={index}
          {...highlight}
          //  rotation={props.rotate}
        />
      ))}
    </div>
  );
};

export default TestHighlightsLayer;
