import React from "react";
import { dataPage3 } from "../../../data/sampleData";
import { toGujarati } from "../../../utils/numbers";
import { formatDate_ddMMyyyy, getGujaratiDay } from "../../../utils/dateFormat";
// export default function Page1({ data }) {
export default function Page2({data}) {
  // const { month, year, user, leaveEntries } = dataPage3;
  // const { month, year, user, leaveEntries } = data;
  const { meta, user, leaveEntries } = data;

  return (
    <div className="page">
      {/* <div className="header"> */}
      <div>
        <p>પ્રતિ,</p>
        <p>સી કંપની કમા. સાહેબ શ્રી,</p>
        <p>રા. અ. પો. દળ જૂથ ૫,</p>
        <p>ગોધરા.</p>
      </div>

      <div className="subject">
        વિષય:- માહે {toGujarati(meta?.month)}/{toGujarati(meta?.year)} ની રજા ડાયરી બાબત.
        {/* વિષય:- માહે {toGujarati(meta?.month)}/{toGujarati(meta?.year)} ની રજા ડાયરી બાબત. */}
      </div>

      <div className="user-info">
        <span>નામ:- {user?.name}</span>
        <span>હોદ્દો:- {user?.role}</span>
        <span>બ. નં.- {user?.badgeNo}</span>
      </div>
      <table className="leave-table">
         <thead>
            <tr>
              <th>અ. નં</th>
              <th>તારીખ</th>
              <th>વાર</th>
              <th>ફરજ સ્થળ</th>
              <th>રીમાર્કસ</th>
            </tr>
          </thead>
        <tbody>
          {leaveEntries.map((entry, index) => (
            // group.rows.map((row, rIndex) => (
            <tr key={index}>
              <td>{toGujarati(index+1)}</td>
              <td>{toGujarati(formatDate_ddMMyyyy(entry?.date))}</td>
              <td>{getGujaratiDay(entry?.date)}</td>
              <td>{entry?.location}</td>
              <td>{entry?.remarks}</td>
            </tr>
          ))}
          <tr>
              <td colSpan="2">કુલ દિવસો</td>
              <td>{toGujarati(leaveEntries?.length)}</td>
              <td></td>
              <td></td>
            </tr>
        </tbody>
      </table>

      <div className="footer mt-2">
        <p>આપનો વિશ્વાસુ</p>
        <p className="signature">- {user?.name}</p>
      </div>
    </div>
  );
}
//
