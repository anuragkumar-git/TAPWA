import { useRef } from "react";
import { useReactToPrint } from "react-to-print"; // 1. Import this
import Page1 from "./Page1";
import Page2 from "./Page2";
import Page3 from "./Page3";

export default function PDFLayout({ data }) {
//   const contentRef = useRef(null);
// const customName = " customnaem"
  // 2. Configure the print function
  // const handlePrint = useReactToPrint({
  //   contentRef: contentRef,
  //   documentTitle: `${customName}`,
  // });

  return (
    <>
      {/* This area will be printed */}
      {/* <div ref={contentRef} id="pdf-root"> */}
      <div id="pdf-root">
        <Page3 data = {data}/>
        <div className="page-break" />
        <Page2 data={data} />
      </div>

      {/* This button stays on the screen and isn't printed */}
      {/* <button onClick={handlePrint}>Download High Quality PDF</button> */}
    </>
  );
}