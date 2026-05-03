import Page1 from "./Page1";
import Page2 from "./Page2";

export default function PDFLayout({ data }) {
  return (
    <>
      <div id="pdf-root">
        <Page1 data={data} />
        <div className="page-break" />
        <Page2 data={data} />
      </div>
    </>
  );
}
