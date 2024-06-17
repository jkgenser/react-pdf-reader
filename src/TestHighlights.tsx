import { RenderPageProps } from "./types";

const highlightData = [
  { top: 14.2, left: 12, height: 2.3, width: 7.5, pageIndex: 0 },
  { top: 1, left: 1, height: 1, width: 2, pageIndex: 1 },
];

const getRotatedProps = ({
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
  const defaultProps = {
    top: `${top}%`,
    left: `${left}%`,
    height: `${height}%`,
    width: `${width}%`,
  };

  switch (rotation) {
    case 0:
      return {
        top: `${top}%`,
        left: `${left}%`,
        height: `${height}%`,
        width: `${width}%`,
      };
    case 90:
      return {
        top: `${left}%`,
        right: `${top}%`,
        height: `${width}%`,
        width: `${height}%`,
      };
    case 180:
      return {
        top: `${100 - top - height}%`,
        left: `${100 - left - width}%`,
        height: `${height}%`,
        width: `${width}%`,
      };
    case 270:
      return {
        bottom: `${left}%`,
        left: `${top}%`,
        height: `${width}%`,
        width: `${height}%`,
      };
    default:
      return defaultProps;
  }
};

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
        ...getRotatedProps({ top, left, height, width, rotation }),
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
