import React from "react";
import {dataPage1} from "../../../data/sampleData";

// export default function Page1({ data }) {
export default function Page1() {
    const { month, year, user, travelEntries, reason, mode } = dataPage1;
    
//   const month = "૦૪";
//   const year = "૨૦૨૬";
//   const user = {
//     name: "રમેશભાઈ અભેસિંહ પટેલ",
//     role: "AHC",
//     badgeNo: "૧૩૫",
//   };
//   const travelEntries = [
//     {
//       startDate: "૧/૪/૨૦૨૬",
//       startTime: null,
//       endDate: "૮/૪/૨૦૨૬",
//       endTime: null,
//       from: "ગાંધીનગર",
//       to: "મુકામ",
//     },
//     {
//       startDate: "૯/૪/૨૦૨૬",
//       startTime: "૧૪:૩૦",
//       endDate: "૯/૪/૨૦૨૬",
//       endTime: "૧૭:૧૫",
//       from: "ગાંધીનગર",
//       to: "હાલોલ",
//     },
//     {
//       startDate: "૧૦/૪/૨૦૨૬",
//       startTime: null,
//       endDate: "૧૩/૪/૨૦૨૬",
//       endTime: null,
//       from: "હાલોલ",
//       to: "મુકામ",
//     },
//     {
//       startDate: "૧૪/૪/૨૦૨૬",
//       startTime: "૦૭:૦૦",
//       endDate: "૧૪/૪/૨૦૨૬",
//       endTime: "૧૧:૦૦",
//       from: "હાલોલ",
//       to: "ગાંધીનગર",
//     },
//     {
//       startDate: "૧૫/૪/૨૦૨૬",
//       startTime: null,
//       endDate: "૨૦/૪/૨૦૨૬",
//       endTime: null,
//       from: "ગાંધીનગર",
//       to: "મુકામ",
//     },
//     {
//       startDate: "૨૧/૪/૨૦૨૬",
//       startTime: "૦૬:૦૦",
//       endDate: "૨૧/૪/૨૦૨૬",
//       endTime: "૧૦:૫૦",
//       from: "ગાંધીનગર",
//       to: "હાલોલ",
//     },
//     {
//       startDate: "૨૨/૪/૨૦૨૬",
//       startTime: null,
//       endDate: "૩૦/૪/૨૦૨૬ ",
//       endTime: null,
//       from: "હાલોલ",
//       to: "મુકામ",
//     },
//   ];
//   const reason = `
//   મા. માજી
// મંત્રી શ્રી
// જયદ્રથસિંહ
// પરમાર
// સાહેબના
// અંગરક્ષક
// તરીકે ફરજ`;
//   const mode = `સરકારી
// વાહન`;
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
        વિષય:- માહે {month}/{year} મુસાફરી ડાયરી
      </div>

      <div className="user-info">
        <span>નામ:- {user.name}</span>
        <span>હોદ્દો:- {user.role}</span>
        <span>બ. નં.- {user.badgeNo}</span>
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
          {/* <tr>
              <td>૧/૪/૨૦૨૬</td>
              <td>૮/૪/૨૦૨૬</td>
              <td>ગાંધીનગર</td>
              <td>મુકામ</td>
              <td rowspan="4">
                મા. માજી <br />મંત્રી શ્રી <br />જયદ્રથસિંહ <br />પરમાર <br />
                સાહેબના <br />અંગરક્ષક <br />તરીકે ફરજ
              </td>
              <td rowspan="1">
                સરકારી <br />
                વાહન
              </td>
              <td rowspan="4"></td>
            </tr>
            <tr>
              <td>
                ૯/૪/૨૦૨૬ <br />
                ૧૪:૩૦
              </td>
              <td>૯/૪/૨૦૨૬ <br />૧૭:૧૫</td>
              <td>ગાંધીનગર</td>
              <td>હાલોલ</td>
              <td></td>
              <td></td>
              <td></td>
            </tr> */}
          {travelEntries.map((entry, index) => (
            <tr key={index}>
              <td>
                {entry?.startDate}
                <br />
                {entry?.startTime}
              </td>
              <td>
                {entry?.endDate}
                <br />
                {entry?.endTime}
              </td>
              <td>{entry?.from}</td>
              <td>{entry?.to}</td>
              {index > 0 ? (
                <>
                  <td></td>
                  <td></td>
                </>
              ) : (
                <>
                  {/* conditional randering */}
                  <td rowSpan="4">{reason}</td>
                  <td>{mode}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="footer">
        <p>આપનો વિશ્વાસુ</p>
        <p className="signature">- {user.name}</p>
      </div>
    </div>
  );
}
