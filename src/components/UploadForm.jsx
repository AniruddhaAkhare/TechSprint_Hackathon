import React, { useState } from "react";

export default function UploadForm({ onSubmit, loading }) {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !subject) return alert("Please provide file and subject.");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("subject", subject);

    onSubmit(formData);
  };

  return (
    <form
      className="flex flex-col md:flex-row gap-4 items-center justify-center"
      onSubmit={handleSubmit}
    >
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files[0])}
        disabled={loading}
        className="border p-2 rounded w-full md:w-1/3"
      />
      <input
        type="text"
        placeholder="Subject Name"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        disabled={loading}
        className="border p-2 rounded w-full md:w-1/3"
      />
      <button
        type="submit"
        disabled={loading}
        className="bg-primary text-white px-6 py-2 rounded hover:bg-purple-700 transition"
      >
        {loading ? "Grading..." : "Submit"}
      </button>
    </form>
  );
}
