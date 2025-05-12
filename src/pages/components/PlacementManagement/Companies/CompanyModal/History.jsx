const History = ({ companyData, formatDateSafely, canDisplay }) => {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-medium">History</h3>
        {canDisplay && companyData.history && companyData.history.length > 0 ? (
          <div className="space-y-3 sm:space-y-4">
            {companyData.history
              .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
              .map((entry, index) => (
                <div key={index} className="rounded-md">
                  <p className="text-sm text-gray-900">
                    {entry.action} by {entry.performedBy} on{" "}
                    {formatDateSafely(entry.timestamp, "MMM d, yyyy h:mm a")}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No history available</p>
        )}
      </div>
    );
  };
  
  export default History;