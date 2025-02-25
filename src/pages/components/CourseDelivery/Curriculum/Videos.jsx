import React, { useState, useEffect } from "react";
import { db } from "../../../../config/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { useParams } from "react-router-dom";
import Feedback from "./Feedback";

const Videos = () => {
    const { curriculumId, sectionId } = useParams();
    const [videos, setVideos] = useState([]);
    const [newVideo, setNewVideo] = useState("");

    useEffect(() => {
        const fetchVideos = async () => {
            const snapshot = await getDocs(collection(db, "curriculum", curriculumId, "sections", sectionId, "videos"));
            const videosData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setVideos(videosData);
        };

        fetchVideos();
    }, [curriculumId, sectionId]);

    const handleAddVideo = async () => {
        if (!newVideo.trim()) return;

        await addDoc(collection(db, "curriculum", curriculumId, "sections", sectionId, "videos"), {
            text: newVideo,
            createdAt: new Date()
        });

        setVideos([...videos, { text: newVideo }]);
        setNewVideo("");
    };

    return (
        <div className="flez-col w-screen ml-80 p-4">
            <div className="justify-between items-center p-4 mb-4">
                {/* <div className="p-4"> */}
                <h2 className="text-xl font-bold mb-4">Videos for Section</h2>
                <ul>
                    {videos.map((video, index) => (
                      <a>  <li key={index} className="p-2 border-b">{video.text}</li></a>
                    ))}
                </ul>
                <div className="mt-4">
                    <input
                        type="text"
                        value={newVideo}
                        onChange={(e) => setNewVideo(e.target.value)}
                        placeholder="Enter a video link"
                        className="p-2 border rounded w-full"
                    />
                    <button
                        onClick={handleAddVideo}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add video
                    </button>
                    <Feedback />
                </div>
            </div>
        </div>
    );
};

export default Videos;
