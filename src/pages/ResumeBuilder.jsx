import React, { useState, useRef } from "react";
import axios from "axios";
import { Loader2, Download, BarChart3, Brain } from "lucide-react";
import html2pdf from "html2pdf.js";

const ResumeBuilder = () => {
  const resumeRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    education: "",
    branch: "",
    experience: "",
    skills: "",
    projects: "",
    certifications: "",
    preferredRole: ""
  });

  const [resume, setResume] = useState(null);
  const [ats, setAts] = useState(null);
  const [skillGap, setSkillGap] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* ================= RESUME ================= */
  const buildResume = async () => {
    try {
      setLoading(true);
      const res = await axios.post("https://techsprint-hackathon-backend-demo.onrender.com/build-resume", form);
      setResume(res.data);
      setAts(null);
      setSkillGap(null);
    } catch {
      alert("Resume generation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= ATS ================= */
  const analyzeATS = async () => {
    try {
      setAnalyzing(true);
      const res = await axios.post("https://techsprint-hackathon-backend-demo.onrender.com/analyze-ats", {
        resume,
        preferredRole: form.preferredRole
      });
      setAts(res.data);
    } catch {
      alert("ATS analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  /* ================= SKILL GAP ================= */
  const analyzeSkillGap = async () => {
    try {
      setAnalyzing(true);
      const res = await axios.post("https://techsprint-hackathon-backend-demo.onrender.com/skill-gap", {
        skills: form.skills,
        preferredRole: form.preferredRole
      });
      setSkillGap(res.data);
    } catch {
      alert("Skill gap analysis failed");
    } finally {
      setAnalyzing(false);
    }
  };

  /* ================= PDF ================= */
  const exportPDF = () => {
    html2pdf(resumeRef.current, {
      margin: 0.5,
      filename: `${form.name}_Resume.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* ================= FORM ================= */}
        <div className="bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-indigo-600">
            AI Resume Builder
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <Input label="Full Name" name="name" onChange={handleChange} />
            <Input label="Education" name="education" onChange={handleChange} />
            <Input label="Branch / Specialization" name="branch" onChange={handleChange} />
            <Textarea label="Experience" name="experience" onChange={handleChange} />
            <Textarea label="Skills (comma separated)" name="skills" onChange={handleChange} />
            <Textarea label="Projects" name="projects" onChange={handleChange} />
            <Textarea label="Certifications" name="certifications" onChange={handleChange} />
            <Input label="Preferred Job Role" name="preferredRole" onChange={handleChange} />
          </div>

          <button
            onClick={buildResume}
            disabled={loading}
            className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg flex justify-center items-center gap-2 transition"
          >
            {loading && <Loader2 className="animate-spin" />}
            {loading ? "Building Resume..." : "Generate Resume"}
          </button>
        </div>

        {/* ================= RESUME ================= */}
        <div className="bg-white p-8 rounded-xl shadow-lg overflow-y-auto">
          {!resume ? (
            <p className="text-gray-500 text-center mt-20">
              Resume preview will appear here
            </p>
          ) : (
            <div ref={resumeRef} className="space-y-8 animate-fade-in">

              <div className="border-b pb-4">
                <h1 className="text-3xl font-bold">{form.name}</h1>
                <p className="text-gray-600">{form.preferredRole}</p>
              </div>

              <Section title="Professional Summary">
                <p>{resume.summary}</p>
              </Section>

              <Section title="Skills">
                <div className="flex flex-wrap gap-2">
                  {resume.skills.map((s, i) => (
                    <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm">
                      {s}
                    </span>
                  ))}
                </div>
              </Section>

              <Section title="Experience">
                {resume.experience.map((exp, i) => (
                  <div key={i} className="mb-4">
                    <h4 className="font-semibold">{exp.role} – {exp.company}</h4>
                    <p className="text-sm text-gray-500">{exp.duration}</p>
                    <p className="mt-1">{exp.description}</p>
                  </div>
                ))}
              </Section>

              <Section title="Projects">
                {resume.projects.map((p, i) => (
                  <div key={i} className="mb-3">
                    <h4 className="font-semibold">{p.title}</h4>
                    <p>{p.description}</p>
                  </div>
                ))}
              </Section>

              <Section title="Education">
                <p className="font-medium">{resume.education.degree}</p>
                <p className="text-gray-600">{resume.education.institution}</p>
              </Section>

            </div>
          )}

          {/* ================= ACTIONS ================= */}
          {resume && (
            <div className="mt-8 flex flex-wrap gap-4">
              <ActionBtn icon={<Download />} text="Export PDF" onClick={exportPDF} />
              <ActionBtn icon={<BarChart3 />} text="ATS Score" onClick={analyzeATS} />
              <ActionBtn icon={<Brain />} text="Skill Gap" onClick={analyzeSkillGap} />
            </div>
          )}

          {/* ================= ATS RESULT ================= */}
          {ats && (
            <ResultCard title="ATS Analysis">
              <p className="text-2xl font-bold text-indigo-600">
                Score: {ats.ats_score}/100
              </p>
              <List title="Strengths" items={ats.strengths} />
              <List title="Weaknesses" items={ats.weaknesses} />
            </ResultCard>
          )}

          {/* ================= SKILL GAP ================= */}
          {skillGap && (
            <ResultCard title="Skill Gap Analysis">
              <List title="Missing Skills" items={skillGap.missing_skills} />
              <List title="Recommended Skills" items={skillGap.recommended_skills} />
              <List title="Learning Suggestions" items={skillGap.learning_suggestions} />
            </ResultCard>
          )}
        </div>
      </div>
    </div>
  );
};

/* ================= UI COMPONENTS ================= */

const Input = ({ label, name, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      name={name}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const Textarea = ({ label, name, onChange }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <textarea
      name={name}
      rows={3}
      onChange={onChange}
      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
    />
  </div>
);

const Section = ({ title, children }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2 border-b pb-1">{title}</h3>
    {children}
  </div>
);

const ActionBtn = ({ icon, text, onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition"
  >
    {icon}
    {text}
  </button>
);

const ResultCard = ({ title, children }) => (
  <div className="mt-8 bg-indigo-50 p-6 rounded-xl shadow-inner">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const List = ({ title, items }) => (
  <>
    <h4 className="font-semibold mt-4">{title}</h4>
    <ul className="list-disc list-inside text-gray-700">
      {items.map((i, idx) => <li key={idx}>{i}</li>)}
    </ul>
  </>
);

export default ResumeBuilder;
