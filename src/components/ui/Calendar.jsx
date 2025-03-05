// Calendar.jsx
import { useState } from "react";

export const Calendar = ({ onChange }) => {
  const [date, setDate] = useState("");

  return (
    <input
      type="date"
      value={date}
      onChange={(e) => {
        setDate(e.target.value);
        if (onChange) onChange(e.target.value);
      }}
      className="w-full p-2 border rounded-md focus:outline-blue-500"
    />
  );
};