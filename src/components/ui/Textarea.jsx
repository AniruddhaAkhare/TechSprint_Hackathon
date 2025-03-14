import React from "react";

const Textarea = ({ placeholder, value, onChange }) => {
  return (
    <textarea
      className="w-full p-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
  );
};

export default Textarea;