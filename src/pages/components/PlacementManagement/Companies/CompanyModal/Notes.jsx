const Notes = ({
    companyData,
    newNote,
    setNewNote,
    noteType,
    setNoteType,
    isEditing,
    handleAddNote,
    formatDateSafely,
    formatNoteType,
    canUpdate,
  }) => {
    return (
      <div>
        <h3 className="text-base sm:text-lg font-medium mb-2">Notes</h3>
        {isEditing && (
          <>
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Note Type</label>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value)}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="general">General Note</option>
                <option value="meeting">Meeting Note</option>
                <option value="call">Call Note</option>
              </select>
            </div>
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700">Note</label>
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Add your note here..."
                className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                rows="4"
              />
            </div>
            <div className="flex justify-end gap-2 mb-3 sm:mb-4">
              <button
                onClick={() => {
                  setNewNote("");
                  setNoteType("general");
                }}
                className="px-3 py-1 sm:px-4 sm:py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 text-sm"
              >
                Clear
              </button>
              <button
                onClick={handleAddNote}
                disabled={!canUpdate || !newNote?.trim()}
                className={`px-3 py-1 sm:px-4 sm:py-2 rounded-md text-sm ${!canUpdate || !newNote?.trim() ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                Add Note
              </button>
            </div>
          </>
        )}
        <div>
          {companyData.notes && companyData.notes.length > 0 ? (
            Object.entries(
              companyData.notes.reduce((acc, note) => {
                const noteDate = formatDateSafely(note.createdAt, "yyyy-MM-dd");
                if (!acc[noteDate]) {
                  acc[noteDate] = [];
                }
                acc[noteDate].push(note);
                return acc;
              }, {})
            )
              .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
              .map(([date, notes]) => (
                <div key={date} className="mb-6">
                  <div className="sticky top-0 bg-white py-2 z-10">
                    <h4 className="text-sm font-medium text-gray-700 border-b border-gray-200 pb-1">
                      {formatDateSafely(date, "MMMM d, yyyy")}
                    </h4>
                  </div>
                  <div className="space-y-3 sm:space-y-4 mt-2">
                    {notes
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((note, index) => (
                        <div key={index} className="border border-gray-200 rounded-md p-3 sm:p-4 bg-gray-50">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                            <p className="text-xs sm:text-sm font-medium text-gray-700">
                              {formatNoteType(note.type)}
                              <span className="text-xs text-gray-500 ml-2">
                                {formatDateSafely(note.createdAt, "h:mm a")}
                              </span>
                            </p>
                            <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-0">
                              by {note.addedBy}
                            </p>
                          </div>
                          <p className="text-xs sm:text-sm text-gray-900 mt-1">{note.content}</p>
                        </div>
                      ))}
                  </div>
                </div>
              ))
          ) : (
            <p className="text-xs sm:text-sm text-gray-500">No notes available.</p>
          )}
        </div>
      </div>
    );
  };
  
  export default Notes;