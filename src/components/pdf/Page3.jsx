import React from "react";
import { dataPage3 } from "../../../data/sampleData";
import { toGujarati } from "../../../utils/numbers";
import { formatDate_ddMMyyyy } from "../../../utils/dateFormat";

// export default function Page1({ data }) {
export default function Page3({data}) {
  console.log('data:', data)
  // const { month, year, user, travelEntries, reason, mode } = data;
  const { meta, user, travelEntries } = data;

  // const { month, year, user, travelEntries, reason, mode } = dataPage3;

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
        વિષય:- માહે {toGujarati(meta?.month)}/{toGujarati(meta?.year)} મુસાફરી ડાયરી
      </div>

      <div className="user-info">
        <span>નામ:- {user?.name}</span>
        <span>હોદ્દો:- {user?.role}</span>
        <span>બ. નં.- {toGujarati(user?.badgeNo)}</span>
      </div>
      <table className="travel-table">
        <thead>
          <tr>
            <th rowSpan="2">
              મુસાફરી શરુ <br />
              કર્યાનો વખત <br />
              તથા તેની <br />
              તારીખ
            </th>
            <th rowSpan="2">
              મુસાફરી પુરી <br />
              કર્યાનો વખત
              <br />
              તથા તેની
              <br />
              તારીખ
            </th>
            <th colSpan="2">મુસાફરી</th>
            <th rowSpan="2">
              મુસાફરીનું <br />
              કારણ
            </th>
            <th rowSpan="2">
              રેલગાડી થી <br />
              કે પગ રસ્તે
            </th>
            <th rowSpan="2">કેટલા માઈલ</th>
          </tr>
          <tr>
            <th>ક્યાંથી</th>
            <th>ક્યાં સુધી</th>
          </tr>
          <tr>
            <th>૧</th>
            <th>૨</th>
            <th>૩</th>
            <th>૪</th>
            <th>૫</th>
            <th>૬</th>
            <th>૭</th>
          </tr>
        </thead>
        <tbody>
          {travelEntries.map((group, gIndex) =>
            group.rows.map((row, rIndex) => (
              <tr key={`${gIndex - rIndex}`}>
                <td>
                  {toGujarati(formatDate_ddMMyyyy(row?.startDate))}
                  <br />
                  {toGujarati(row?.startTime)}
                </td>
                <td>
                  {toGujarati(formatDate_ddMMyyyy(row?.endDate))}
                  <br />
                  {toGujarati(row?.endTime)}
                </td>
                <td>{row?.from}</td>
                <td>{row?.to}</td>
                {rIndex === 0 && (
                  <>
                    <td rowSpan={group?.rows?.length}>{group?.groupedReason}</td>
                    <td rowSpan={group?.rows?.length}>{group?.groupMode}</td>
                    <td rowSpan={group?.rows?.length}>{group?.groupDistance}</td>
                  </>
                )}
              </tr>
            )),
          )}
        </tbody>
      </table>

      <div className="footer mt-2">
        <p>આપનો વિશ્વાસુ</p>
        <p className="signature">- {user?.name}</p>
      </div>
    </div>
  );
}
 
