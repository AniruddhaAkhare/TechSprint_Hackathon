import PropTypes from "prop-types";

export default function PopupMessage({
  title = "Confirm Action",
  message,
  type = "info",
  onOk,
  onCancel,
  showCancel = true,
}) {
  const typeColors = {
    success: "bg-green-100 text-green-800 border-green-400",
    error: "bg-red-100 text-red-800 border-red-400",
    info: "bg-blue-100 text-blue-800 border-blue-400",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-400",
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div
        className={`w-[90%] max-w-md rounded-lg shadow-lg p-6 border ${typeColors[type]} bg-white`}
      >
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          {showCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          )}
          <button
            onClick={onOk}
            className={`px-4 py-2 rounded text-white ${
              type === "error"
                ? "bg-red-600 hover:bg-red-700"
                : type === "success"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

PopupMessage.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(["success", "error", "info", "warning"]),
  onOk: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
  showCancel: PropTypes.bool,
};
