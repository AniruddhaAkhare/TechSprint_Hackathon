import React, { useState, useEffect } from 'react';
import { db, auth } from '../../../../config/firebase';
import { collection, addDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { s3Client, debugS3Config } from '../../../../config/aws-config';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import AddMCQModal from './AddMCQModal.jsx';
import QuestionBankModal from '../../QuestionBank/QuestionBank.jsx';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../../config/firebase'; // Ensure storage is exported from firebase config
import { serverTimestamp } from 'firebase/firestore'; // Import serverTimestamp
import { useAuth } from '../../../../context/AuthContext.jsx';

const AddMaterial = () => {
  const { curriculumId, sectionId, sessionId } = useParams();
  const [youtubeLink, setYoutubeLink] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [isMCQModalOpen, setIsMCQModalOpen] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isQuestionBankOpen, setIsQuestionBankOpen] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [state, setState] = useState('draft');
  const [scheduledAt, setScheduledAt] = useState('');
  const {user, rolePermissions} = useAuth();
  const navigate = useNavigate();

  const canView = rolePermissions?.curriculums?.display || false;

  // Check user authentication and role
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'Users', user.uid)); // Use getDoc instead of .get()
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'unknown'); // Assuming role is stored directly in users collection
          } else {
            // //console.error("User document not found");
            navigate('/login');
          }
        } catch (error) {
          // //console.error("Error fetching user role:", error);
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Log activity to Firestore (aligned with Curriculum and Courses)
  const logActivity = async (action, details) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await addDoc(collection(db, 'activityLogs'), {
        userId: user.uid,
        userEmail: user.email,
        action,
        details,
        timestamp: serverTimestamp(),
        curriculumId,
        sectionId,
        sessionId: sessionId || null,
      });
    } catch (error) {
      // //console.error("Error logging activity:", error.message);
    }
  };

  // Handle file upload to Firebase Storage (PDFs and Videos)
  const handleFileUploadToStorage = async (file, type) => {
    if (!file) return;
    if (!canView) {
      alert("You don't have permission to upload files");
      return;
    }

    try {
      const fileRef = ref(storage, `sections/${sectionId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const fileURL = await getDownloadURL(fileRef);

      const sectionRef = doc(db, 'curriculum', curriculumId, 'sections', sectionId);
      await updateDoc(sectionRef, {
        [type]: arrayUnion(fileURL),
      });

      await logActivity(
        `${type} uploaded`,
        `Uploaded ${file.name} to section ${sectionId}`
      );

      alert(`${type === 'pdfs' ? 'PDF' : 'Video'} uploaded successfully!`);
      navigate(`/curriculum/${curriculumId}/section/${sectionId}`);
    } catch (error) {
      // //console.error("Upload error:", error);
      // await logActivity('Upload_error', `Failed to upload ${file.name}: ${error.message}`);
      setUploadError(`Failed to upload ${type}: ${error.message}`);
    }
  };

  // Handle file upload to S3 (PDFs and Videos)
  const handleFileUpload = async (file, type) => {
    if (!file) return;
    if (!canView) {
      alert("You don't have permission to upload files");
      return;
    }

    try {
      debugS3Config();
      setUploadError(null);
      const bucketName = import.meta.env.VITE_S3_BUCKET_NAME;
      const region = import.meta.env.VITE_AWS_REGION;
      if (!bucketName || !region) {
        throw new Error('Missing AWS config: Check VITE_S3_BUCKET_NAME and VITE_AWS_REGION');
      }

      const fileKey = sessionId
        ? `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
        : `curriculums/${curriculumId}/sections/${sectionId}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const fileBuffer = await file.arrayBuffer();
      const params = {
        Bucket: bucketName,
        Key: fileKey,
        Body: new Uint8Array(fileBuffer),
        ContentType: file.type,
      };

      const uploadResult = await s3Client.send(new PutObjectCommand(params));

      const fileURL = `https://${bucketName}.s3.${region}.amazonaws.com/${fileKey}`;

      const collectionPath = sessionId
        ? `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/materials`
        : `curriculums/${curriculumId}/sections/${sectionId}/materials`;

      await addDoc(collection(db, collectionPath), {
        type,
        url: fileURL,
        state,
        scheduledAt: state === 'scheduled' ? new Date(scheduledAt).toISOString() : null,
        createdAt: new Date(),
      });

      await logActivity(
        `${type} uploaded`,
        `Uploaded ${file.name} to ${sessionId ? 'session' : 'section'} ${sessionId || sectionId}`
      );

      alert(`${type === 'pdfs' ? 'PDF' : 'Video'} uploaded successfully!`);
      navigate(sessionId
        ? `/curriculum/${curriculumId}/section/${sectionId}/session/${sessionId}`
        : `/curriculum/${curriculumId}/section/${sectionId}`);
    } catch (error) {
      // //console.error(`Error uploading ${type}:`, error);
      // await logActivity('upload Error', `Failed to upload ${file.name}: ${error.message}`);
      setUploadError(`Failed to upload ${type}: ${error.message}`);
    }
  };

  // Handle adding YouTube link or feedback text
  const handleAddTextContent = async (type, content) => {
    if (!content.trim()) return alert(`Please provide a ${type === 'youtubeLinks' ? 'URL' : 'text'}`);
    if (!canView) {
      alert("You don't have permission to add content");
      return;
    }

    try {
      const collectionPath = sessionId
        ? `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/materials`
        : `curriculums/${curriculumId}/sections/${sectionId}/materials`;

      await addDoc(collection(db, collectionPath), {
        type,
        url: content,
        state,
        scheduledAt: state === 'scheduled' ? new Date(scheduledAt).toISOString() : null,
        createdAt: new Date(),
      });

      await logActivity(
        `${type} added`,
        `Added ${type} content: ${content} to ${sessionId ? 'session' : 'section'} ${sessionId || sectionId}`
      );

      if (type === 'youtubeLinks') setYoutubeLink('');
      if (type === 'feedback') setFeedbackText('');
      alert(`${type === 'youtubeLinks' ? 'YouTube link' : 'Feedback'} added!`);
      navigate(sessionId
        ? `/curriculum/${curriculumId}/section/${sectionId}/session/${sessionId}`
        : `/curriculum/${curriculumId}/section/${sectionId}`);
    } catch (error) {
      // //console.error(`Error adding ${type}:`, error);
      // await logActivity(`add_${type}_error`, `Failed to add ${type}: ${error.message}`);
      setUploadError(`Failed to add ${type}: ${error.message}`);
    }
  };

  // Handle adding quiz from QuestionBankModal
  const handleAddQuiz = async (selectedQuestions) => {
    if (!canView) {
      alert("You don't have permission to add quizzes");
      return;
    }

    try {
      const collectionPath = sessionId
        ? `curriculums/${curriculumId}/sections/${sectionId}/sessions/${sessionId}/materials`
        : `curriculums/${curriculumId}/sections/${sectionId}/materials`;

      await addDoc(collection(db, collectionPath), {
        type: 'quiz',
        questions: selectedQuestions,
        state,
        scheduledAt: state === 'scheduled' ? new Date(scheduledAt).toISOString() : null,
        createdAt: new Date(),
      });

      await logActivity(
        'Quiz added',
        `Added quiz with ${selectedQuestions.length} questions to ${sessionId ? 'session' : 'section'} ${sessionId || sectionId}`
      );

      alert('Quiz added successfully!');
      navigate(sessionId
        ? `/curriculum/${curriculumId}/section/${sectionId}/session/${sessionId}`
        : `/curriculum/${curriculumId}/section/${sectionId}`);
    } catch (error) {
      // //console.error('Error adding quiz:', error);
      // await logActivity('add_quiz_error', `Failed to add quiz: ${error.message}`);
      setUploadError(`Failed to add quiz: ${error.message}`);
    }
  };

  // Permission check
  const hasPermission = () => {
    return userRole === 'admin' || userRole === 'instructor';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen p-4 fixed inset-0 left-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full p-4 md:ml-80">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <h2 className="text-xl sm:text-2xl font-bold">
          Add Material {sessionId ? 'to Session' : 'to Section'}
        </h2>
        <button
          onClick={() =>
            navigate(
              sessionId
                ? `/curriculum/${curriculumId}/section/${sectionId}/session/${sessionId}`
                : `/curriculum/${curriculumId}/section/${sectionId}`
            )
          }
          className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
        >
          ← Back
        </button>
      </div>

      {canView ? (
        <div className="space-y-4">
          <div>
            <label>State:</label>
            <select
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="ml-2 p-1 border rounded"
            >
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
            </select>
            {state === 'scheduled' && (
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                className="ml-2 p-1 border rounded"
              />
            )}
          </div>

          <div>
            <button
              className="w-full sm:w-auto bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition duration-200"
              onClick={() => setIsMCQModalOpen(true)}
            >
              Add MCQs
            </button>
          </div>

          <div>
            <input
              type="file"
              id="pdfUpload"
              hidden
              accept=".pdf"
              onChange={(e) => handleFileUpload(e.target.files[0], 'pdfs')}
            />
            <button
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              onClick={() => document.getElementById('pdfUpload').click()}
            >
              Upload PDF
            </button>
          </div>

          <div>
            <input
              type="file"
              id="videoUpload"
              hidden
              accept="video/*"
              onChange={(e) => handleFileUpload(e.target.files[0], 'videos')}
            />
            <button
              className="w-full sm:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200"
              onClick={() => document.getElementById('videoUpload').click()}
            >
              Upload Video
            </button>
          </div>

          <div>
            <button
              className="w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-200"
              onClick={() => setIsQuestionBankOpen(true)}
            >
              Add Quiz from Question Bank
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              placeholder="Enter YouTube URL"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              className="w-full sm:w-auto bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
              onClick={() => handleAddTextContent('youtubeLinks', youtubeLink)}
            >
              Add YouTube Link
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Enter feedback text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
            />
            <button
              className="w-full sm:w-auto bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition duration-200"
              onClick={() => handleAddTextContent('feedback', feedbackText)}
            >
              Add Feedback
            </button>
          </div>

          {uploadError && <p className="text-red-600 text-sm mt-2">{uploadError}</p>}
        </div>
      ) : (
        <div className="text-red-500">
          You don't have permission to add materials. Contact an administrator.
        </div>
      )}

      {isMCQModalOpen && (
        <AddMCQModal
          curriculumId={curriculumId}
          sectionId={sectionId}
          sessionId={sessionId}
          onClose={() => setIsMCQModalOpen(false)}
        />
      )}

      {isQuestionBankOpen && (
        <QuestionBankModal
          onClose={() => setIsQuestionBankOpen(false)}
          onAddQuiz={handleAddQuiz}
        />
      )}
    </div>
  );
};

export default AddMaterial;

async function getDoc(docRef) {
  const docSnap = await import('firebase/firestore').then(({ getDoc }) => getDoc(docRef));
  return docSnap;
}