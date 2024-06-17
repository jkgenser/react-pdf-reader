const highlightData = [
  { top: 10, left: 10, height: 1, width: 3, pageIndex: 1 },
  { top: 1, left: 1, height: 1, width: 2, pageIndex: 2 },
];

const Highlight = ({
  top,
  left,
  height,
  width,
}: {
  top: number;
  left: number;
  height: number;
  width: number;
}) => {
  return (
    <div
      style={{
        top: `${top}%`,
        left: `${left}%`,
        height: `${height}%`,
        width: `${width}%`,
        position: "absolute",
        backgroundColor: "yellow",
        opacity: 0.5,
      }}
    ></div>
  );
};

const TestHighlightsLayer = () => {
  return (
    <div style={{ zIndex: 1 }}>
      {highlightData.map((highlight, index) => (
        <Highlight key={index} {...highlight} />
      ))}
    </div>
  );
};

export default TestHighlightsLayer;
