import React, { useState } from "react";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const YEARS = ["2024", "2025", "2026", "2027"];

export default function Home() {
  const [screen, setScreen] = useState("entry"); // 'entry', 'editor', 'preview'

  // App State
  const [meta, setMeta] = useState({ month: "", year: "" });
  const [travelGroups, setTravelGroups] = useState([]);
  const [leaveEntries, setLeaveEntries] = useState([]);

  // --- Handlers ---
  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addTravelGroup = () => {
    setTravelGroups([
      ...travelGroups,
      { id: generateId(), reason: "", mode: "", distance: "", rows: [] },
    ]);
  };

  const updateTravelGroup = (id, field, value) => {
    setTravelGroups(
      travelGroups.map((g) => (g.id === id ? { ...g, [field]: value } : g)),
    );
  };

  const addTravelRow = (groupId) => {
    setTravelGroups(
      travelGroups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            rows: [
              ...g.rows,
              {
                id: generateId(),
                startDate: "",
                startTime: "",
                endDate: "",
                endTime: "",
                from: "",
                to: "",
              },
            ],
          };
        }
        return g;
      }),
    );
  };

  const updateTravelRow = (groupId, rowId, field, value) => {
    setTravelGroups(
      travelGroups.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            rows: g.rows.map((r) =>
              r.id === rowId ? { ...r, [field]: value } : r,
            ),
          };
        }
        return g;
      }),
    );
  };

  const addLeaveEntry = () => {
    setLeaveEntries([
      ...leaveEntries,
      { id: generateId(), date: "", location: "" },
    ]);
  };

  const updateLeaveEntry = (id, field, value) => {
    setLeaveEntries(
      leaveEntries.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to clear all data?")) {
      setMeta({ month: "", year: "" });
      setTravelGroups([]);
      setLeaveEntries([]);
    }
  };

  // --- Screens ---
  if (screen === "entry") {
    return (
      <div className="max-w-md mx-auto p-4 min-h-screen">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-8">
          My Diaries
        </h1>
        <button
          onClick={() => setScreen("editor")}
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-700 active:scale-95 transition-all mb-8"
        >
          + New Diary
        </button>

        <div>
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Old Diaries
          </h2>
          <ul className="space-y-3">
            {["March 2024 - Project Delta", "February 2024 - Annual Leave"].map(
              (diary, i) => (
                <li
                  key={i}
                  className="p-4 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
                >
                  <span className="text-gray-700 font-medium">{diary}</span>
                  <span className="text-gray-400">→</span>
                </li>
              ),
            )}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-4 pb-24 min-h-screen relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pt-4">
        <button
          onClick={() => setScreen("entry")}
          className="text-blue-600 font-medium"
        >
          ← Back
        </button>
        <h1 className="text-xl font-bold text-gray-800">
          {screen === "preview" ? "Preview" : "Editor"}
        </h1>
        <div className="w-10"></div> {/* Spacer for alignment */}
      </div>

      {screen === "preview" ? (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold mb-4">
            Diary: {meta.month} {meta.year}
          </h2>

          <h3 className="font-bold text-lg text-blue-600 mt-4 border-b pb-2">
            Travel Entries
          </h3>
          {travelGroups.length === 0 ? (
            <p className="text-gray-400 italic mt-2">No travel entries</p>
          ) : null}
          {travelGroups.map((g, i) => (
            <div
              key={g.id}
              className="mt-4 mb-6 border-l-2 border-blue-200 pl-3"
            >
              <p className="font-semibold text-gray-800">
                Group {i + 1}: {g.reason || "No Reason"}
              </p>
              <p className="text-sm text-gray-600">
                Mode: {g.mode} | Distance: {g.distance}km
              </p>
              <div className="mt-2 space-y-2">
                {g.rows.map((r, j) => (
                  <div key={r.id} className="bg-gray-50 p-3 rounded text-sm">
                    <p>
                      <b>From:</b> {r.from} <b>To:</b> {r.to}
                    </p>
                    <p>
                      <b>Start:</b> {r.startDate} {r.startTime} | <b>End:</b>{" "}
                      {r.endDate} {r.endTime}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <h3 className="font-bold text-lg text-purple-600 mt-6 border-b pb-2">
            Leave Entries
          </h3>
          {leaveEntries.length === 0 ? (
            <p className="text-gray-400 italic mt-2">No leave entries</p>
          ) : null}
          <ul className="mt-4 space-y-2">
            {leaveEntries.map((l) => (
              <li
                key={l.id}
                className="bg-purple-50 p-3 rounded text-sm text-purple-900 border border-purple-100"
              >
                <b>Date:</b> {l.date} | <b>Location:</b> {l.location}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Section A: Meta */}
          <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              Section A: Meta
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Month
                </label>
                <select
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  value={meta.month}
                  onChange={(e) => setMeta({ ...meta, month: e.target.value })}
                >
                  <option value="">Select...</option>
                  {MONTHS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">
                  Year
                </label>
                <select
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  value={meta.year}
                  onChange={(e) => setMeta({ ...meta, year: e.target.value })}
                >
                  <option value="">Select...</option>
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
          <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Section B: Travel
              </h2>
              <button
                onClick={addTravelGroup}
                className="text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full"
              >
                + Group
              </button>
            </div>

            <div className="space-y-6">
              {travelGroups.map((group, index) => (
                <div
                  key={group.id}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-xl relative"
                >
                  <span className="absolute -top-3 left-4 bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded">
                    Group {index + 1}
                  </span>

                  <div className="space-y-3 mt-2">
                    <textarea
                      placeholder="Reason for travel..."
                      className="w-full p-2 border rounded-lg text-sm"
                      value={group.reason}
                      onChange={(e) =>
                        updateTravelGroup(group.id, "reason", e.target.value)
                      }
                      rows="2"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Mode (e.g. Flight)"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={group.mode}
                        onChange={(e) =>
                          updateTravelGroup(group.id, "mode", e.target.value)
                        }
                      />
                      <input
                        type="number"
                        placeholder="Distance (km)"
                        className="w-full p-2 border rounded-lg text-sm"
                        value={group.distance}
                        onChange={(e) =>
                          updateTravelGroup(
                            group.id,
                            "distance",
                            e.target.value,
                          )
                        }
                      />
                    </div>

                    {/* Rows */}
                    <div className="mt-4">
                      <p className="text-xs font-bold text-gray-500 uppercase mb-2">
                        Rows
                      </p>
                      <div className="space-y-3">
                        {group.rows.map((row, rIndex) => (
                          <div
                            key={row.id}
                            className="p-3 bg-white border border-blue-100 rounded-lg shadow-sm space-y-2"
                          >
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-gray-400 uppercase">
                                  Start Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full p-1.5 border rounded text-xs"
                                  value={row.startDate}
                                  onChange={(e) =>
                                    updateTravelRow(
                                      group.id,
                                      row.id,
                                      "startDate",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 uppercase">
                                  Start Time
                                </label>
                                <input
                                  type="time"
                                  className="w-full p-1.5 border rounded text-xs"
                                  value={row.startTime}
                                  onChange={(e) =>
                                    updateTravelRow(
                                      group.id,
                                      row.id,
                                      "startTime",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-[10px] text-gray-400 uppercase">
                                  End Date
                                </label>
                                <input
                                  type="date"
                                  className="w-full p-1.5 border rounded text-xs"
                                  value={row.endDate}
                                  onChange={(e) =>
                                    updateTravelRow(
                                      group.id,
                                      row.id,
                                      "endDate",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <label className="text-[10px] text-gray-400 uppercase">
                                  End Time
                                </label>
                                <input
                                  type="time"
                                  className="w-full p-1.5 border rounded text-xs"
                                  value={row.endTime}
                                  onChange={(e) =>
                                    updateTravelRow(
                                      group.id,
                                      row.id,
                                      "endTime",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <input
                                type="text"
                                placeholder="From"
                                className="w-full p-1.5 border rounded text-xs"
                                value={row.from}
                                onChange={(e) =>
                                  updateTravelRow(
                                    group.id,
                                    row.id,
                                    "from",
                                    e.target.value,
                                  )
                                }
                              />
                              <input
                                type="text"
                                placeholder="To"
                                className="w-full p-1.5 border rounded text-xs"
                                value={row.to}
                                onChange={(e) =>
                                  updateTravelRow(
                                    group.id,
                                    row.id,
                                    "to",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addTravelRow(group.id)}
                        className="mt-3 w-full border-2 border-dashed border-gray-300 text-gray-500 text-sm font-semibold py-2 rounded-lg hover:bg-gray-100 transition"
                      >
                        + Add Row
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section C: Leave Diary */}
          <section className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">
                Section C: Leave
              </h2>
              <button
                onClick={addLeaveEntry}
                className="text-purple-600 text-sm font-semibold bg-purple-50 px-3 py-1 rounded-full"
              >
                + Entry
              </button>
            </div>

            <div className="space-y-3">
              {leaveEntries.map((leave, index) => (
                <div key={leave.id} className="flex gap-2 items-center">
                  <span className="text-xs font-bold text-gray-400 w-4">
                    {index + 1}.
                  </span>
                  <input
                    type="date"
                    className="w-1/3 p-2 border rounded-lg text-sm"
                    value={leave.date}
                    onChange={(e) =>
                      updateLeaveEntry(leave.id, "date", e.target.value)
                    }
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    className="w-2/3 p-2 border rounded-lg text-sm"
                    value={leave.location}
                    onChange={(e) =>
                      updateLeaveEntry(leave.id, "location", e.target.value)
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section D: Entered Data Summary */}
          <section className="bg-gray-800 text-white p-5 rounded-xl shadow-sm">
            <h2 className="text-lg font-bold mb-3">Section D: Entered Data</h2>
            <div className="text-sm space-y-2 text-gray-300">
              <p>
                <strong className="text-white">Travel Groups:</strong>{" "}
                {travelGroups.length} (Total Rows:{" "}
                {travelGroups.reduce((acc, g) => acc + g.rows.length, 0)})
              </p>
              {travelGroups.map((group, index) => (
                <>
                  {group.rows.map((row, rIndex) => (
                    <>
                      <div>
                        <div>
                          {row.startDate} |{row.endDate} |{row.from} |{row.to}
                        </div>
                        {row.startTime} |{row.endTime} |
                      </div>
                      {/* row.startDate, startTime, endDate, endTime, from, to */}
                    </>
                  ))}
                </>
              ))}
              <p>
                <strong className="text-white">Leave Entries:</strong>{" "}
                {leaveEntries.length}
              </p>
            </div>
          </section>
        </div>
      )}

      {/* Bottom Actions - Fixed to Bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] flex justify-center gap-3 z-10">
        <div className="max-w-md w-full flex gap-3">
          <button
            onClick={() => alert("Data Saved Successfully!")}
            className="flex-1 bg-green-600 text-white font-semibold py-3 rounded-xl shadow hover:bg-green-700 active:scale-95 transition-all"
          >
            Save
          </button>

          <button
            onClick={() =>
              setScreen(screen === "preview" ? "editor" : "preview")
            }
            className="flex-1 bg-blue-100 text-blue-700 font-semibold py-3 rounded-xl hover:bg-blue-200 active:scale-95 transition-all"
          >
            {screen === "preview" ? "Edit" : "Preview"}
          </button>

          <button
            onClick={handleReset}
            className="flex-1 bg-red-50 text-red-600 font-semibold py-3 rounded-xl hover:bg-red-100 active:scale-95 transition-all border border-red-100"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
