export const transformHighlightProps = ({
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
        bottom: `${top}%`,
        right: `${left}%`,
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

export const getOffsetForHighlight = ({
  top,
  left,
  height,
  width,
  itemHeight,
  rotation,
  startOffset,
}: {
  top: number;
  left: number;
  height: number;
  width: number;
  rotation: number;
  itemHeight: number;
  startOffset: number;
}) => {
  const fromBottom180 = (top + 1.25 * height) / 100;
  const fromTop270 = (100 - left + 1.25 * width) / 100;
  switch (rotation) {
    case 0:
      return startOffset + (top * itemHeight) / 100;
    case 90:
      return startOffset + (left * itemHeight) / 100;
    case 180:
      return startOffset + itemHeight - itemHeight * fromBottom180;
    case 270:
      return startOffset + (itemHeight * (100 - (left + 1.25 * width))) / 100;
    default:
      return startOffset + (top * itemHeight) / 100;
  }
};
