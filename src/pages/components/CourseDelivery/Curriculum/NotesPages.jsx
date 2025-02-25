import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Feedback from "./Feedback";
import Videos from "./Videos";
const NotesPage = () => {
    const { curriculumId, sectionId } = useParams();
    const [notes, setNotes] = useState([]);
    const [newNote, setNewNote] = useState("");

    useEffect(() => {
        const fetchNotes = async () => {
            const snapshot = await getDocs(collection(db, "curriculum", curriculumId, "sections", sectionId, "notes"));
            const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesData);
        };

        fetchNotes();
    }, [curriculumId, sectionId]);

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "notes"), {
            text: newNote,
            createdAt: new Date()
        });

        setNotes([...notes, { text: newNote }]);
        setNewNote("");
    };

    return (
        <div className="flez-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                <Videos />
                <h2 className="text-xl font-bold mb-4">Notes for Section</h2>
                <ul>
                    {notes.map((note, index) => (
                        <li key={index} className="p-2 border-b">{note.text}</li>
                    ))}
                </ul>
                <div className="mt-4">
                    <input
                        type="text"
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        placeholder="Enter a note"
                        className="p-2 border rounded w-full"
                    />
                    <button
                        onClick={handleAddNote}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Note
                    </button>
                    <Feedback />
                </div>
            </div>
        </div>
    );
};

export default NotesPage;
