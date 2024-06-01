export interface ZoomPlugin {
  zoomTo: (scale: number) => void;
}

const zoomPlugin = (): ZoomPlugin => {
  return {
    zoomTo: (scale: number) => {
      console.log("scale", scale);
    },
  };
};

export default zoomPlugin;
