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
