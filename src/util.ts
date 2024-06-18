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
  const fromBottom180 = (itemHeight * (100 - top - height)) / 100;
  let extraOffset;
  switch (rotation) {
    case 0:
      extraOffset = (top * itemHeight) / 100;
      break;
    // return startOffset + (top * itemHeight) / 100;
    case 90:
      extraOffset = (left * itemHeight) / 100;
      break;
    // return startOffset + (left * itemHeight) / 100;
    case 180:
      extraOffset = ((100 - top) * itemHeight) / 100;
      // extraOffset = fromBottom180;
      break;
    // return startOffset + fromBottom180;
    case 270:
      extraOffset = fromBottom180 - (width * itemHeight) / 100;
      break;
    // return startOffset + (itemHeight * (100 - (left + 1.25 * width))) / 100;
    default:
      extraOffset = (top * itemHeight) / 100;
  }

  console.log({
    top,
    left,
    height,
    width,
    startOffset,
    extraOffset,
    rotation,
    itemHeight,
  });

  return startOffset + extraOffset;
};
