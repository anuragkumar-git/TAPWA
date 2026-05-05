import Page1 from "./Page1";
import Page2 from "./Page2";

export default function PDFLayout({ data, mode = "both" }) {
  return (
    <>
      <div >
        {mode !== "leave" && <Page1 data={data} />}
        {mode === "both" && <div className="page-break" />}
        {mode !== "travel" && <Page2 data={data} />}
      </div>
    </>
  );
}
