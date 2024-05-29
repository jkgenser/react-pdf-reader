import React, { useState, useRef } from "react";
import { Document, Page } from "react-pdf";
import { useVirtualizer } from "@tanstack/react-virtual";

const Reader = ({ file }: { file: string }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const parentRef = useRef<HTMLDivElement>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const rowVirtualizer = useVirtualizer({
    count: numPages || 0,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 1000, // Adjust the estimateSize to match your page height
    overscan: 2, // Adjust the overscan value if needed
  });

  return (
    <div
      ref={parentRef}
      style={{
        height: "500px",
        overflow: "auto",
        borderColor: "black",
        borderWidth: "4px",
        width: "750px",
        // width: "100%",
      }}
    >
      <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualItem) => (
            <div
              key={virtualItem.index}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <Page pageNumber={virtualItem.index + 1} />
            </div>
          ))}
        </div>
      </Document>
    </div>
  );
};

export default Reader;
