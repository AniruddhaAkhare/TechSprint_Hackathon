import { useState } from "react";

const EnrollmentDialog = ({ open, onClose, student, onSendMail }) => {
  const [sendLOE, setSendLOE] = useState(false);

  if (!open || !student) return null;

  const baseLink = `https://fireblazeaischool.in/enroll/${student.enquiryInfo.course}/${student.id}`;
  const link = `${baseLink}?sendLOE=${sendLOE}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    alert("Copied to clipboard!");
  };

  const handleSendMail = () => {
    // Your actual email logic here
    alert(`Enrollment link sent to ${student.email} with sendLOE=${sendLOE}`);
    if (onSendMail) onSendMail();
  };

  const handleCheckboxChange = (e) => {
    setSendLOE(e.target.checked);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md relative">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Send Enrollment Link</h2>

        {/* Show updated link */}
        <p className="text-sm text-gray-600 break-all mb-4">{link}</p>

        {/* Checkbox */}
        <label className="flex items-center space-x-2 mb-4">
          <input
            type="checkbox"
            checked={sendLOE}
            onChange={handleCheckboxChange}
            className="form-checkbox"
          />
          <span className="text-gray-700">Include LOE (sendLOE)</span>
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Copy Link
          </button>

          <button
            onClick={handleSendMail}
            className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
          >
            Send Mail
          </button>

          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnrollmentDialog;
