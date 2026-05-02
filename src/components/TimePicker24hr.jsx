// components/TimePicker24hr.jsx
import { useState } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import dayjs from "dayjs";
import "dayjs/locale/gu"; // Gujarati locale

dayjs.locale("gu"); // Sets Gujarati month/day names if you use date pickers too

export default function TimePicker24hr({
  label = "End Time",
  value,
  onChange,
  error = false,
  helperText = "",
  className = "",
}) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <TimePicker
        label={label}
        value={value ? dayjs(value, "HH:mm") : null}
        onChange={(newValue) => {
          // newValue is dayjs object. Convert to "HH:mm" for storage
          const timeString = newValue ? newValue.format("HH:mm") : "";
          // alert(timeString)
          onChange(timeString); // Returns "14:30" English - safe for IndexedDB
        }}
        ampm={false} // This forces 24hr format + double ring clock
        views={["hours", "minutes"]}
        format="HH:mm"
        slotProps={{
          textField: {
            className: `w-full ${className}`,
            sx: {
              // Override MUI styles to match Tailwind
              "& .MuiOutlinedInput-root": {
                borderRadius: "0.5rem",
              },
            },
          },
          // This is the clock face popup
          desktopPaper: {
            sx: {
              ".MuiClockNumber-root": {
                fontFamily: '"Noto Sans Gujarati", sans-serif',
       
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
}
