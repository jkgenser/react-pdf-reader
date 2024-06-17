import { Page as ReactPdfPage } from "react-pdf";
import { useEffect, useRef } from "react";
import { ReaderPageProps, RenderPage, RenderPageProps } from "../types";

const EXTRA_WIDTH = 10;

const Page = ({
  virtualItem,
  viewports,
  scale = 1,
  rotation,
  pageObserver,
  shouldRender,
  renderPage,
}: ReaderPageProps) => {
  const pageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    pageObserver && pageRef.current && pageObserver.observe(pageRef.current);
  }, [pageObserver]);

  const defaultPageRenderer: RenderPage = (props: RenderPageProps) => {
    return (
      <ReactPdfPage
        pageIndex={props.pageIndex}
        scale={props.scale}
        rotate={props.rotate}
      />
    );
  };

  const renderPageLayer = renderPage || defaultPageRenderer;

  return (
    <div
      ref={pageRef}
      id="page-outer-box"
      data-index={virtualItem.index}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: `${virtualItem.size}px`,
        transform: `translateY(${virtualItem.start}px)`,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        id="page-inner-box"
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          border: "1px solid lightgray",
          width: `${viewports[virtualItem.index].width + EXTRA_WIDTH}px`,
          borderRadius: "4px",
          padding: "0px",
          margin: "5px",
          backgroundColor: "white",
          display: "flex",
          justifyContent: "center",
        }}
      >
        {shouldRender && (
          <div className="page-wrapper" style={{ position: "relative" }}>
            {renderPageLayer({
              pageIndex: virtualItem.index,
              scale,
              rotate: rotation,
            })}
          </div>
        )}
        {/* {shouldRender &&
          renderPageLayer({
            pageIndex: virtualItem.index,
            scale,
            rotate: rotation,
          })} */}
      </div>
    </div>
  );
};

export default Page;
