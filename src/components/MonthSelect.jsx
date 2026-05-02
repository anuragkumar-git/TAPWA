// components/MonthSelect.jsx
const GUJARATI_MONTHS = [
  { num: '1', name: 'જાન્યુઆરી' },
  { num: '2', name: 'ફેબ્રુઆરી' },
  { num: '3', name: 'માર્ચ' },
  { num: '4', name: 'એપ્રિલ' },
  { num: '5', name: 'મે' },
  { num: '6', name: 'જૂન' },
  { num: '7', name: 'જુલાઈ' },
  { num: '8', name: 'ઓગસ્ટ' },
  { num: '9', name: 'સપ્ટેમ્બર' },
  { num: '10', name: 'ઓક્ટોબર' },
  { num: '11', name: 'નવેમ્બર' },
  { num: '12', name: 'ડિસેમ્બર' },
];

export default function MonthSelect({
  label = "મહિનો",
  value,
  onChange,
  className = ""
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-gray-300 px-3 py-2 bg-white"
      >
        <option value="">મહિનો પસંદ કરો</option>
        {GUJARATI_MONTHS.map((m) => (
          <option key={m.num} value={m.num}>
            {m.name}
          </option>
        ))}
      </select>
    </div>
  );
}