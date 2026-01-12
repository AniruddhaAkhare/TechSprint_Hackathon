import React, { useState } from "react";
import UploadForm from "../components/UploadForm";
import OverallResult from "../components/OverallResult";
import QuestionCard from "../components/QuestionCard";
import axios from "axios";
import { motion } from "framer-motion";
import { FileText, Loader2 } from "lucide-react";

function AssignmentGrader() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await axios.post(
        "http://localhost:5000/evaluate",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* ================= HEADER ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center">
            <FileText className="text-teal-600 w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              AI Assignment Grader
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Upload assignments and get detailed AI-based evaluation instantly
            </p>
          </div>
        </div>
      </div>

      {/* ================= UPLOAD SECTION ================= */}
      <div className="bg-white rounded-2xl shadow-sm border p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Upload Assignment
        </h2>

        <UploadForm onSubmit={handleSubmit} loading={loading} />

        {loading && (
          <div className="mt-6 flex items-center justify-center gap-2 text-teal-600 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" />
            Evaluating assignment...
          </div>
        )}

        {error && (
          <p className="mt-4 text-center text-red-600 font-medium">
            {error}
          </p>
        )}
      </div>

      {/* ================= RESULTS SECTION ================= */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-6"
        >
          {/* Overall Result */}
          <OverallResult
            overall={{
              overall_score: result.overall_score,
              result: result.result,
            }}
          />

          {/* Question Breakdown */}
          <div className="bg-white rounded-2xl shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Question-wise Evaluation
            </h2>

            <div className="grid grid-cols-1 gap-4">
              {result.questions.map((q, idx) => (
                <QuestionCard
                  key={idx}
                  question={q}
                  index={idx + 1}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default AssignmentGrader;
