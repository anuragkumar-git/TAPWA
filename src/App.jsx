import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import PDFLayout from "./components/pdf/PDFLayout";
import { dataPage3 } from "../data/sampleData";
import Home from "./pages/Home";
import Home2 from "./pages/Home2";
import TimePicker24hr from "./components/TimePicker24hr";

function App() {
  return (
    <>
      {/* <PDFLayout data = {dataPage3}></PDFLayout> */}
      {/* <PDFLayout></PDFLayout> */}
      {/* <PdfExporter></PdfExporter> */}
      {/* use leave entries.append add new entries to last
    <Home/> */}
      <Home2 />
    </>
  );
}

export default App;
