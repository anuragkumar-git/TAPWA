import { useState, useEffect, useRef } from "react";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useReactToPrint } from "react-to-print";
import PDFLayout from "../components/pdf/PDFLayout";
import TimePicker24hr from "../components/TimePicker24hr";
import MonthSelect from "../components/MonthSelect";
// --- Database Setup ---
const db = new Dexie("DiaryDatabase");
db.version(1).stores({
  diaries: "++id, month, year", // Indexed fields. Data like travelEntries is stored but doesn't need indexing here.
});

const YEARS = ["2026", "2027", "2028", "2029", "2030", "2031", "2032"];

const appShellClass = "min-h-screen bg-slate-50 text-slate-800";
const pageContainerClass = "mx-auto max-w-2xl px-4 pb-28 pt-5";
const sectionClass =
  "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm";
const iconButtonClass =
  "grid h-10 w-10 place-items-center text-red-500 text-xl transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 active:scale-95";
const primaryButtonClass =
  "rounded-xl bg-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 active:scale-95";
const secondaryButtonClass =
  "rounded-xl px-4 py-3 text-sm font-semibold text-teal-800 transition hover:bg-teal-100 active:scale-95";
const dangerButtonClass =
  "text-lg px-3  text-sm font-semibold text-red-600 transition  active:scale-95";

const emptyRow = {
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  from: "",
  to: "",
};

const defaultPreferences = {
  user: {
    name: "રમેશભાઈ અભેસિંહ પટેલ",
    role: "AHC",
    badgeNo: "૧૩૫",
  },
  travelDefaults: {
    groupedReason:
      "મા. માજી મંત્રી શ્રી જયદ્રથસિંહ પરમાર સાહેબના અંગરક્ષક તરીકે ફરજ",
    groupMode: "સરકારી વાહન",
    groupDistance: "",
  },
};

const getDiaryPayload = (diary) => ({
  month: diary?.month || "",
  year: diary?.year || "",
  user: diary?.user || defaultPreferences.user,
  travelEntries: diary?.travelEntries || [],
  leaveEntries: diary?.leaveEntries || [],
});

export default function Home() {
  const [screen, setScreen] = useState("entry"); // 'entry', 'editor', 'preview'
  const [currentId, setCurrentId] = useState(null); // Tracks if we are editing an existing diary

  // Fetch all diaries from Dexie
  const savedDiaries = useLiveQuery(() => db.diaries.toArray()) || [];

  // App State
  const [meta, setMeta] = useState({ month: "", year: "" });
  const [travelEntries, setTravelEntries] = useState([]);
  const [leaveEntries, setLeaveEntries] = useState([]);
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [currentUser, setCurrentUser] = useState(defaultPreferences.user);
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");
  const [exportText, setExportText] = useState("");
  const [exportMessage, setExportMessage] = useState("");
  const [importMessage, setImportMessage] = useState("");
  const [printMode, setPrintMode] = useState("both");

  const contentRef = useRef(null);
  const leaveEndRef = useRef(null);
  const previousTitleRef = useRef(document.title);
  const getPrintTitle = () =>
    `Diary_${meta.month || "Month"}_${meta.year || "Year"}_${printMode}`;

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: getPrintTitle,
    bodyClass: "print-frame",
    pageStyle: `
      @page { size: A4; margin: 0; }
      html, body { margin: 0 !important; padding: 0 !important; background: #fff !important; }
      .page { width: 210mm; height: 297mm; box-sizing: border-box; }
      .page-break { break-before: page; page-break-before: always; }
      .no-print { display: none !important; }
    `,
    onBeforePrint: async () => {
      previousTitleRef.current = document.title;
      document.title = getPrintTitle();
      document.body.classList.add("is-printing");
    },
    onAfterPrint: () => {
      document.title = previousTitleRef.current || "TAPWA";
      document.body.classList.remove("is-printing");
      setPrintMode("both");
    },
  });

  // Set Default Month/Year
  const setDefaultMeta = () => {
    const now = new Date();
    setMeta({
      // month: MONTHS[now.getMonth()],
      month: now.getMonth() + 1,
      year: now.getFullYear().toString(),
    });
  };

  // Run once on load to set defaults
  useEffect(() => {
    const storedPreferences = localStorage.getItem("tapwaPreferences");
    if (storedPreferences) {
      try {
        const parsed = JSON.parse(storedPreferences);
        const merged = {
          user: { ...defaultPreferences.user, ...(parsed.user || {}) },
          travelDefaults: {
            ...defaultPreferences.travelDefaults,
            ...(parsed.travelDefaults || {}),
          },
        };
        setPreferences(merged);
        setCurrentUser(merged.user);
      } catch {
        localStorage.removeItem("tapwaPreferences");
      }
    }
    setDefaultMeta();
  }, []);

  // --- Handlers ---
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const handleNewDiary = () => {
    setCurrentId(null);
    setDefaultMeta();
    setCurrentUser(preferences.user);
    setTravelEntries([]);
    setLeaveEntries([]);
    setScreen("editor");
  };

  const handleEditDiary = (diary) => {
    setCurrentId(diary.id);
    setMeta({ month: diary.month, year: diary.year });
    setCurrentUser(diary.user || preferences.user);
    setTravelEntries(diary.travelEntries || []);
    setLeaveEntries(diary.leaveEntries || []);
    setScreen("editor");
  };

  const handleDeleteDiary = async (event, diaryId) => {
    event.stopPropagation();
    const shouldDelete = window.confirm("Delete this diary?");
    if (!shouldDelete) return;

    await db.diaries.delete(diaryId);
    if (currentId === diaryId) {
      setCurrentId(null);
      setDefaultMeta();
      setCurrentUser(preferences.user);
      setTravelEntries([]);
      setLeaveEntries([]);
    }
  };

  const updatePreference = (section, field, value) => {
    setPreferences((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [field]: value,
      },
    }));

    if (section === "user") {
      setCurrentUser((current) => ({ ...current, [field]: value }));
    }
  };

  const savePreferences = () => {
    localStorage.setItem("tapwaPreferences", JSON.stringify(preferences));
    setCurrentUser(preferences.user);
    setIsPreferencesOpen(false);
  };

  const writeClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  };

  const handleExportDiary = async (event, diary) => {
    event.stopPropagation();
    const text = JSON.stringify(getDiaryPayload(diary), null, 2);
    setExportText(text);
    setExportMessage("");

    try {
      const copied = await writeClipboard(text);
      setExportMessage(
        copied ? "Copied to clipboard." : "Copy manually from below.",
      );
    } catch {
      setExportMessage("Copy manually from below.");
    }
  };

  const handleCopyExportText = async () => {
    try {
      const copied = await writeClipboard(exportText);
      setExportMessage(
        copied ? "Copied to clipboard." : "Copy manually from below.",
      );
    } catch {
      setExportMessage("Copy manually from below.");
    }
  };

  const handleImportDiary = async () => {
    setImportMessage("");
    try {
      const parsed = JSON.parse(importText);
      const diaryData = getDiaryPayload(parsed);

      if (!diaryData.month || !diaryData.year) {
        setImportMessage("Import data must include month and year.");
        return;
      }

      const newId = await db.diaries.add(diaryData);
      setCurrentId(newId);
      setMeta({ month: diaryData.month, year: diaryData.year });
      setCurrentUser(diaryData.user || preferences.user);
      setTravelEntries(diaryData.travelEntries || []);
      setLeaveEntries(diaryData.leaveEntries || []);
      setImportText("");
      setIsImportOpen(false);
      setScreen("editor");
    } catch {
      setImportMessage("Invalid JSON. Please paste exported diary data.");
    }
  };

  const handleRequestPrint = (mode) => {
    setPrintMode(mode);
    requestAnimationFrame(() => {
      setTimeout(() => handlePrint(), 0);
    });
  };

  const handleSave = async () => {
    const diaryData = {
      // month: toGujarati(meta.month),
      month: meta.month,
      year: meta.year,
      user: currentUser,
      travelEntries,
      leaveEntries,
    };

    if (currentId) {
      await db.diaries.update(currentId, diaryData);
    } else {
      await db.diaries.add(diaryData);
    }

    setScreen("entry");
  };

  // --- Travel Group Logic ---
  const addTravelGroup = () => {
    setTravelEntries([
      ...travelEntries,
      {
        id: generateId(),
        defaultGroupedReason:
          "àª®àª¾. àª®àª¾àªœà«€ àª®àª‚àª¤à«àª°à«€ àª¶à«àª°à«€ àªœàª¯àª¦à«àª°àª¥àª¸àª¿àª‚àª¹ àªªàª°àª®àª¾àª° àª¸àª¾àª¹à«‡àª¬àª¨àª¾ àª…àª‚àª—àª°àª•à«àª·àª• àª¤àª°à«€àª•à«‡ àª«àª°àªœ",
        defaultGroupMode: "àª¸àª°àª•àª¾àª°à«€ àªµàª¾àª¹àª¨",
        defaultGroupDistance: null,
        groupedReason: preferences.travelDefaults.groupedReason,
        groupMode: preferences.travelDefaults.groupMode,
        groupDistance: preferences.travelDefaults.groupDistance,
        rows: [],
        pendingRow: { ...emptyRow },
      },
    ]);
  };

  const updateTravelGroup = (id, field, value) => {
    setTravelEntries(
      travelEntries.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    );
  };

  const updatePendingRow = (groupId, field, value) => {
    setTravelEntries(
      travelEntries.map((g) => {
        if (g.id === groupId)
          return { ...g, pendingRow: { ...g.pendingRow, [field]: value } };
        return g;
      }),
    );
  };

  const commitRow = (groupId) => {
    setTravelEntries(
      travelEntries.map((g) => {
        if (g.id === groupId) {
          // Only add if at least 'from' or 'to' has some data, to prevent blank accidental clicks
          if (!g.pendingRow.from && !g.pendingRow.to) return g;
          return {
            ...g,
            rows: [...g.rows, { ...g.pendingRow, id: generateId() }],
            pendingRow: { ...emptyRow }, // Reset the form card
          };
        }
        return g;
      }),
    );
  };

  const removeTravelRow = (groupId, rowId) => {
    setTravelEntries(
      travelEntries.map((g) => {
        if (g.id === groupId)
          return { ...g, rows: g.rows.filter((r) => r.id !== rowId) };
        return g;
      }),
    );
  };

  // --- Leave Logic ---
  const addLeaveEntry = () => {
    setLeaveEntries([
      ...leaveEntries,
      { id: generateId(), date: "", location: "" },
    ]);

    requestAnimationFrame(() => {
      leaveEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
  };

  const updateLeaveEntry = (id, field, value) => {
    setLeaveEntries(
      leaveEntries.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  const removeLeaveEntry = (id) => {
    setLeaveEntries(leaveEntries.filter((l) => l.id !== id));
  };

  // --- Screens ---

  // Home page
  if (screen === "entry") {
    return (
      <div className={appShellClass}>
        <main className={pageContainerClass}>
          <div className="mb-6 flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={() => setIsPreferencesOpen(true)}
              className=" h-9 w-9 pt-1 place-items-center rounded-xl bg-white text-2xl text-slate-700 "
              aria-label="Open preferences"
            >
              ≡
            </button>
            {/* <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            TAPWA
          </p> */}
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              My Diaries
            </h1>
          </div>
          <button
            onClick={handleNewDiary}
            className={`${primaryButtonClass} mb-8 w-full`}
          >
            + New Diary
          </button>

          <div>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
              Old Diaries
            </h2>
            {savedDiaries.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
                No diaries saved yet. Create your first one!
              </p>
            ) : (
              <ul className="space-y-3">
                {savedDiaries.map((diary) => (
                  <li
                    key={diary.id}
                    onClick={() => handleEditDiary(diary)}
                    className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-1 shadow-sm transition hover:border-teal-200 hover:bg-teal-50/40 active:scale-[0.98]"
                  >
                    <span className="flex-1 font-semibold text-slate-800">
                      {diary.month} - {diary.year}
                    </span>
                    <button
                      type="button"
                      onClick={(event) => handleExportDiary(event, diary)}
                      className="text-sm font-semibold text-teal-700"
                      aria-label="Export diary"
                    >
                      Export
                    </button>
                    <button
                      type="button"
                      onClick={(event) => handleDeleteDiary(event, diary.id)}
                      className={`${iconButtonClass} order-3`}
                      aria-label="Delete diary"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-red-600 hover:text-red-800 cursor-pointer">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
                    </button>
                    {/* <span className="text-gray-400">→</span> */}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
        {isPreferencesOpen && (
          <div className="no-print fixed inset-0 z-20 bg-slate-900/40">
            <div className="h-full w-[min(92vw,380px)] overflow-y-auto bg-white p-5 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="text-xl font-bold text-slate-900">
                  Preferences
                </h2>
                <button
                  type="button"
                  onClick={() => setIsPreferencesOpen(false)}
                  // className={dangerButtonClass }
                  className={`${dangerButtonClass} hover:rounded-md hover:mt-1` }
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <section className="space-y-3">
                  <h3 className="font-semibold text-slate-800">User Details</h3>
                  <div>
                    <label className="app-label">નામ</label>
                    <input
                      className="app-input"
                      value={preferences.user.name}
                      onChange={(e) =>
                        updatePreference("user", "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="app-label">હોદ્દો</label>
                      <input
                        className="app-input"
                        value={preferences.user.role}
                        onChange={(e) =>
                          updatePreference("user", "role", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="app-label">બ. નં.</label>
                      <input
                        className="app-input"
                        value={preferences.user.badgeNo}
                        onChange={(e) =>
                          updatePreference("user", "badgeNo", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-3">
                  <h3 className="font-semibold text-slate-800">
                    Travel Defaults
                  </h3>
                  <div>
                    <label className="app-label">મુસાફરીનું
કારણ</label>
                    <textarea
                      className="app-input min-h-24"
                      value={preferences.travelDefaults.groupedReason}
                      onChange={(e) =>
                        updatePreference(
                          "travelDefaults",
                          "groupedReason",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="app-label">રેલગાડી થી
કે પગ રસ્તે</label>
                      <input
                        className="app-input"
                        value={preferences.travelDefaults.groupMode}
                        onChange={(e) =>
                          updatePreference(
                            "travelDefaults",
                            "groupMode",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="app-label">કેટલા માઈલ</label>
                      <input
                        className="app-input"
                        value={preferences.travelDefaults.groupDistance}
                        onChange={(e) =>
                          updatePreference(
                            "travelDefaults",
                            "groupDistance",
                            e.target.value,
                          )
                        }
                      />
                    </div>
                  </div>
                </section>

                <button
                  type="button"
                  onClick={savePreferences}
                  className={`${primaryButtonClass} w-full`}
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {exportText && (
          <div className="no-print fixed inset-0 z-20 grid place-items-center bg-slate-900/40 p-4">
            <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Export Diary
                  </h2>
                  <p className="text-sm text-slate-500">{exportMessage}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setExportText("")}
                  className={dangerButtonClass}
                >
                   ⨉
                </button>
              </div>
              <pre className="max-h-[55vh] overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-50">
                {exportText}
              </pre>
              <button
                type="button"
                onClick={handleCopyExportText}
                className={`${primaryButtonClass} mt-3 w-full`}
              >
                Copy JSON
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={appShellClass}>
      <main
        className={screen === "preview" ? "pb-28 pt-4" : pageContainerClass}
      >
        {/* Header */}
        <div className="mb-6 flex items-center justify-between pt-1">
          {screen === "editor" && (
            <>
              <button
                onClick={() => setScreen("entry")}
                className="font-medium text-teal-700"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-slate-900 ">
                {screen === "preview" ? "Preview" : "Editor"}
              </h1>
              <button
                type="button"
                onClick={() => setIsImportOpen(true)}
                className="text-sm font-semibold text-teal-700"
              >
                Import
              </button>
            </>
          )}
          {screen !== "editor" && <div className="w-10"></div>}
        </div>

        {screen === "preview" ? (
          // <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          //   <h2 className="text-2xl font-bold mb-4">
          //     Diary: {meta.month} {meta.year}
          //   </h2>

          //   <h3 className="font-bold text-lg text-blue-600 mt-4 border-b pb-2">
          //     Travel Entries
          //   </h3>
          //   {travelEntries.length === 0 ? (
          //     <p className="text-gray-400 italic mt-2">No travel entries</p>
          //   ) : null}
          //   {travelEntries.map((g, i) => (
          //     <div
          //       key={g.id}
          //       className="mt-4 mb-6 border-l-2 border-blue-200 pl-3"
          //     >
          //       <p className="font-semibold text-gray-800">
          //         Group {i + 1}: {g.groupedReason || "No groupedReason"}
          //       </p>
          //       <p className="text-sm text-gray-600">
          //         Mode: {g?.groupMode} | groupDistance: {g?.groupDistance}km
          //       </p>
          //       <div className="mt-2 space-y-2">
          //         {g.rows.map((r) => (
          //           <div key={r.id} className="bg-gray-50 p-3 rounded text-sm">
          //             <p>
          //               <b>From:</b> {r.from} <b>To:</b> {r.to}
          //             </p>
          //             <p>
          //               <b>Start:</b> {r.startDate} {r.startTime} | <b>End:</b>{" "}
          //               {r.endDate} {r.endTime}
          //             </p>
          //           </div>
          //         ))}
          //       </div>
          //     </div>
          //   ))}

          //   <h3 className="font-bold text-lg text-purple-600 mt-6 border-b pb-2">
          //     Leave Entries
          //   </h3>
          //   {leaveEntries.length === 0 ? (
          //     <p className="text-gray-400 italic mt-2">No leave entries</p>
          //   ) : null}
          //   <ul className="mt-4 space-y-2">
          //     {leaveEntries.map((l) => (
          //       <li
          //         key={l.id}
          //         className="bg-purple-50 p-3 rounded text-sm text-purple-900 border border-purple-100"
          //       >
          //         <b>Date:</b> {l.date} | <b>Location:</b> {l.location}
          //       </li>
          //     ))}
          //   </ul>
          // </div>
          <>
            <div className="pdf-preview-shell">
              <div ref={contentRef} className="pdf-print-area">
                {/* We pass all current data down to your PDFLayout component */}
                <PDFLayout
                  data={{
                    meta,
                    user: currentUser,
                    travelEntries,
                    leaveEntries,
                  }}
                  mode={printMode}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-5">
              {/* Section A: Meta */}
              <section className={sectionClass}>
                {/* <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"> */}
                {/* <h2 className="text-lg font-bold text-gray-800 mb-4">
              Section A: Meta
            </h2> */}
                {/* <label htmlFor="start">Select month and year:</label> */}
                {/* <input type="month" id="start" name="start"  onChange={(e) => alert(e.target.value) } defaultValue={`${meta.year}-${meta.month}`} /> */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    {/* <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Month
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg bg-gray-50"
                    value={meta.month}
                    onChange={(e) =>
                      setMeta({ ...meta, month: e.target.value })
                    }
                  >
                    {MONTHS.map((m) => (
                      <option key={m} value={m}>
                        {m}
                      </option>
                    ))}
                  </select> */}
                    <MonthSelect
                      label="Month"
                      value={meta.month} // stores "5"
                      onChange={
                        (monthStr) => setMeta({ ...meta, month: monthStr })
                        // updatePendingRow(group.id, "month", monthStr)
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="start" className="app-label">
                      Year
                    </label>
                    {/* <input type="Year" id="start" name="start"  onChange={(e) => alert(e.target.value) } value={`${meta.year}`} /> */}
                    <select
                      className="app-input"
                      value={meta.year}
                      onChange={(e) =>
                        setMeta({ ...meta, year: e.target.value })
                      }
                    >
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Section B: Travel Entries */}
              {/* <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"> */}
              <section className={sectionClass}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    {/* Section B:  */}
                    Travel
                  </h2>
                  {/* <button
                onClick={addTravelGroup}
                className="text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full"
              >
                + Group
              </button> */}
                  <button
                    onClick={addTravelGroup}
                    className={secondaryButtonClass}
                  >
                    + Entry
                  </button>
                </div>

                <div className="space-y-6">
                  {travelEntries.map((group, index) => (
                    <div
                      key={group.id}
                      // className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative"
                    >
                      {/* <span className="absolute -top-3 left-4 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                    Group {index + 1}
                  </span> */}

                      <div className="space-y-3 mt-2">
                        {/* <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                          <div>
                            <label className="app-label">Grouped Reason</label>
                            <textarea
                              className="app-input min-h-20 text-sm"
                              value={group.groupedReason || ""}
                              onChange={(e) =>
                                updateTravelGroup(
                                  group.id,
                                  "groupedReason",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="app-label">Mode</label>
                              <input
                                type="text"
                                className="app-input text-sm"
                                value={group.groupMode || ""}
                                onChange={(e) =>
                                  updateTravelGroup(
                                    group.id,
                                    "groupMode",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="app-label">Distance</label>
                              <input
                                type="text"
                                className="app-input text-sm"
                                value={group.groupDistance || ""}
                                onChange={(e) =>
                                  updateTravelGroup(
                                    group.id,
                                    "groupDistance",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                        </div> */}
                        {/* <textarea
                      placeholder="groupedReason for travel..."
                      className="w-full p-2 border rounded-lg text-sm"
                      value={group.groupedReason}
                      onChange={(e) =>
                        updateTravelGroup(group.id, "groupedReason", e.target.value)
                      }
                      rows="2"
                    /> */}
                        {/* <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Mode (e.g. Flight)"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={group.groupMode}
                        onChange={(e) =>
                          updateTravelGroup(group.id, "groupMode", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="groupDistance (km)"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={group.groupDistance}
                        onChange={(e) =>
                          updateTravelGroup(
                            group.id,
                            "groupDistance",
                            e.target.value,
                          )
                        }
                      />
                    </div> */}

                        {/* Saved Rows List */}
                        {group.rows.length > 0 && (
                          <div className="mt-4 space-y-2">
                            <p className="text-xs font-bold uppercase text-slate-500">
                              Saved Rows
                            </p>
                            {group.rows.map((row, rIndex) => (
                              <div
                                key={row.id}
                                className="flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50/50 p-3 text-xs shadow-sm"
                              >
                                <div>
                                  <p className="font-semibold text-slate-700">
                                    {row?.from || "N/A"} → {row?.to || "N/A"}
                                  </p>
                                  <p className="text-slate-500">
                                    {row?.startDate} - {row?.endDate}
                                    {row?.startTime} {row?.endTime}
                                  </p>
                                </div>
                                <button
                                  onClick={() =>
                                    removeTravelRow(group.id, row.id)
                                  }
                                  className={dangerButtonClass}
                                >
                               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-red-600 hover:text-red-800 cursor-pointer">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* New Row Input Card (Always Open) */}
                        <div className="relative mt-4 space-y-3 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 shadow-sm">
                          <div className="absolute left-0 top-0 h-full w-1 bg-teal-600"></div>
                          <p className="ml-2 text-xs font-bold uppercase text-teal-700">
                            New Row Entry
                          </p>

                          {/* Start/End Date */}
                          <div className="grid grid-cols-2 gap-2 ml-2">
                            <div>
                              <label className="app-label">Start Date</label>
                              <input
                                type="date"
                                className="app-input text-xs"
                                value={group.pendingRow.startDate}
                                onChange={(e) =>
                                  updatePendingRow(
                                    group.id,
                                    "startDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="app-label">End Date</label>
                              <input
                                type="date"
                                className="app-input text-xs"
                                value={group.pendingRow.endDate}
                                onChange={(e) =>
                                  updatePendingRow(
                                    group.id,
                                    "endDate",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          {/* Start/End Time */}
                          <div className="grid grid-cols-2 gap-2 ml-2">
                            <div>
                              {/* <label className="text-[10px] text-gray-400 uppercase">
                              Start Time Gujarati
                            </label>
                            <input
                              lang="gu-IN"
                              type="time"
                              className="w-full p-2 border rounded-md text-xs bg-gray-50"
                              value={group.pendingRow.startTime}
                              onChange={
                                updatePendingRow(
                                  group.id,
                                  "startTime",
                                  e.target.value,
                                )
                              }
                            /> */}
                              <TimePicker24hr
                                className="text-xs"
                                label="Start Time"
                                value={group.pendingRow.startTime}
                                onChange={(timeString) =>
                                  updatePendingRow(
                                    group.id,
                                    "startTime",
                                    timeString,
                                  )
                                }
                              />
                            </div>
                            <div>
                              {/* <label className="text-[10px] text-gray-400 uppercase">
                              End Time
                            </label> */}
                              <TimePicker24hr
                                className="text-xs bg-gray-50"
                                label="End Time"
                                value={group.pendingRow.endTime}
                                onChange={(timeString) =>
                                  updatePendingRow(
                                    group.id,
                                    "endTime",
                                    timeString,
                                  )
                                }
                              />
                              {/* <input
                            type="time"
                            value={group.pendingRow.endTime}
                            onChange={(e) =>
                              updatePendingRow(
                                group.id,
                                "endTime",
                                e.target.value,
                              )
                            }
                          /> */}
                            </div>
                          </div>

                          {/* From/To */}
                          <div className="grid grid-cols-2 gap-2 ml-2">
                            <div>
                              <label className="app-label">From</label>
                              <input
                                type="text"
                                placeholder="City A"
                                className="app-input text-xs"
                                value={group.pendingRow.from}
                                onChange={(e) =>
                                  updatePendingRow(
                                    group.id,
                                    "from",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <label className="app-label">To</label>
                              <input
                                type="text"
                                placeholder="City B"
                                className="app-input text-xs"
                                value={group.pendingRow.to}
                                onChange={(e) =>
                                  updatePendingRow(
                                    group.id,
                                    "to",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>

                          <button
                            onClick={() => commitRow(group.id)}
                            className={`${secondaryButtonClass} ml-2 mt-2 w-[calc(100%-8px)] border border-teal-200 bg-teal-200`}
                          >
                            + Add Row Data
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section C: Leave Diary */}
              {/* <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100"> */}
              <section className={sectionClass}>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-900">
                    {/* Section C: */}
                    Leave
                  </h2>
                  <button
                    onClick={addLeaveEntry}
                    className={secondaryButtonClass}
                  >
                    + Entry
                  </button>
                </div>

                <div className="space-y-3">
                  {leaveEntries.map((leave, index) => (
                    <div
                      key={leave.id}
                      className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                    >
                      <span className="text-xs font-bold text-slate-500">
                        {index + 1}.
                      </span>
                      <input
                        type="date"
                        className=" flex-[0_0_38%] text-sm border-none"
                        value={leave.date}
                        onChange={(e) =>
                          updateLeaveEntry(leave.id, "date", e.target.value)
                        }
                      />
                      <input
                        type="text"
                        placeholder="Location"
                        className="min-w-0 flex-1 text-sm text-center"
                        value={leave.location}
                        onChange={(e) =>
                          updateLeaveEntry(leave.id, "location", e.target.value)
                        }
                      />
                      <button
                        type="button"
                        onClick={() => removeLeaveEntry(leave.id)}
                        className={dangerButtonClass}
                        aria-label="Delete leave entry"
                      >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-red-600 hover:text-red-800 cursor-pointer">
  <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
</svg>
                      </button>
                    </div>
                  ))}
                  <div ref={leaveEndRef} />
                </div>
              </section>
            </div>
          </>
        )}
      </main>

      {/* Bottom Actions - Fixed */}
      {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-center gap-3 z-10">
        <div className="max-w-md w-full flex gap-3">
          {screen !== "preview" && (
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-green-700 active:scale-95 transition-all"
            >
              Save
            </button>
          )}

          <button
            onClick={() =>
              setScreen(screen === "preview" ? "editor" : "preview")
            }
            className="flex-1 bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-200 active:scale-95 transition-all"
          >
            {screen === "preview" ? "Back to Edit" : "Preview"}
          </button>
        </div>
      </div> */}
      {/* Bottom Actions - Fixed */}
      <div className="no-print fixed bottom-0 left-0 right-0 z-10 flex justify-center gap-3 border-t border-slate-200 bg-white/95 p-4 shadow-[0_-4px_12px_rgba(15,23,42,0.08)] backdrop-blur">
        <div className="max-w-md w-full flex gap-3">
          {screen !== "preview" ? (
            <>
              <button
                onClick={handleSave}
                className={`${primaryButtonClass} flex-1`}
              >
                Save
              </button>
              <button
                onClick={() => setScreen("preview")}
                className={`${secondaryButtonClass}  border border-teal-200 bg-teal-200 flex-1 hover:text-white hover:bg-teal-700`}
              >
                Preview
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setScreen("editor")}
                className={`dborder border-teal-200 bg-teal-200 ${secondaryButtonClass} flex-1`}
              >
                Back to Edit
              </button>
              <button
                onClick={() => handleRequestPrint("travel")}
                className={`${secondaryButtonClass} flex-1 border border-teal-200 bg-teal-50`}
              >
                Travel
              </button>
              <button
                onClick={() => handleRequestPrint("leave")}
                className={`${secondaryButtonClass} flex-1 border border-teal-200 bg-teal-50`}
              >
                Leave
              </button>
              <button
                onClick={() => handleRequestPrint("both")}
                className={`${primaryButtonClass} flex-1`}
              >
                Both
              </button>
            </>
          )}
        </div>
      </div>

      {isPreferencesOpen && (
        <div className="no-print fixed inset-0 z-20 bg-slate-900/40">
          <div className="h-full w-[min(92vw,380px)] overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Preferences</h2>
              <button
                type="button"
                onClick={() => setIsPreferencesOpen(false)}
                className={dangerButtonClass}
              >
                ⨉
              </button>
            </div>

            <div className="space-y-4">
              <section className="space-y-3">
                <h3 className="font-semibold text-slate-800">User Details</h3>
                <div>
                  <label className="app-label">Name</label>
                  <input
                    className="app-input"
                    value={preferences.user.name}
                    onChange={(e) =>
                      updatePreference("user", "name", e.target.value)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="app-label">Role</label>
                    <input
                      className="app-input"
                      value={preferences.user.role}
                      onChange={(e) =>
                        updatePreference("user", "role", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="app-label">Badge No</label>
                    <input
                      className="app-input"
                      value={preferences.user.badgeNo}
                      onChange={(e) =>
                        updatePreference("user", "badgeNo", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <h3 className="font-semibold text-slate-800">
                  Travel Defaults
                </h3>
                <div>
                  <label className="app-label">Grouped Reason</label>
                  <textarea
                    className="app-input min-h-24"
                    value={preferences.travelDefaults.groupedReason}
                    onChange={(e) =>
                      updatePreference(
                        "travelDefaults",
                        "groupedReason",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="app-label">Mode</label>
                    <input
                      className="app-input"
                      value={preferences.travelDefaults.groupMode}
                      onChange={(e) =>
                        updatePreference(
                          "travelDefaults",
                          "groupMode",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                  <div>
                    <label className="app-label">Distance</label>
                    <input
                      className="app-input"
                      value={preferences.travelDefaults.groupDistance}
                      onChange={(e) =>
                        updatePreference(
                          "travelDefaults",
                          "groupDistance",
                          e.target.value,
                        )
                      }
                    />
                  </div>
                </div>
              </section>

              <button
                type="button"
                onClick={savePreferences}
                className={`${primaryButtonClass} w-full`}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {exportText && (
        <div className="no-print fixed inset-0 z-20 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Export Diary
                </h2>
                <p className="text-sm text-slate-500">{exportMessage}</p>
              </div>
              <button
                type="button"
                onClick={() => setExportText("")}
                className={dangerButtonClass}
              >
                ⨉
              </button>
            </div>
            <pre className="max-h-[55vh] overflow-auto rounded-xl bg-slate-950 p-3 text-xs text-slate-50">
              {exportText}
            </pre>
            <button
              type="button"
              onClick={handleCopyExportText}
              className={`${primaryButtonClass} mt-3 w-full`}
            >
              Copy JSON
            </button>
          </div>
        </div>
      )}

      {isImportOpen && (
        <div className="no-print fixed inset-0 z-20 grid place-items-center bg-slate-900/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Import Diary
                </h2>
                <p className="text-sm text-slate-500">
                  Paste exported diary JSON below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsImportOpen(false)}
                className={dangerButtonClass}
              >
                ⨉
              </button>
            </div>
            <textarea
              className="app-input min-h-64 font-mono text-xs"
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              placeholder='{"month":"5","year":"2026",...}'
            />
            {importMessage && (
              <p className="mt-2 text-sm font-semibold text-red-600">
                {importMessage}
              </p>
            )}
            <button
              type="button"
              onClick={handleImportDiary}
              className={`${primaryButtonClass} mt-3 w-full`}
            >
              Create Diary From JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
