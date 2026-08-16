import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  FaUserTie,
  FaBriefcase,
  FaFileUpload,
  FaMicrophoneAlt,
  FaChartLine,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";

function Step1Setup({ onStart }) {
  const { userData } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [role, setRole] = useState("");
  const [experience, setExperience] = useState("");
  const [mode, setMode] = useState("Technical");
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [resumeText, setResumeText] = useState("");
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const handleUploadResume = async () => {
    if (!resumeFile || analyzing) return;
    setAnalyzing(true);
    const formdata = new FormData();
    formdata.append("resume", resumeFile);

    try {
      const result = await axios.post(
        serverUrl + "/api/interview/resume",
        formdata,
        { withCredentials: true },
      );

      setRole(result.data.role || "");
      setExperience(result.data.experience || "");
      setProjects(result.data.projects || []);
      setSkills(result.data.skills || []);
      setResumeText(result.data.resumeText || "");
      setAnalysisDone(true);
      setAnalyzing(false);
    } catch (error) {
      console.log(error);
      setAnalyzing(false);
    }
  };

  const handleStart = async () => {
    if (userData?.credits <= 0) {
      alert(
        "You don't have enough interview credits. Please purchase a plan to continue.",
      );
      navigate("/pricing");
      return;
    }
    setLoading(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/interview/generate-questions",
        { role, experience, mode, resumeText, projects, skills },
        { withCredentials: true },
      );
      if (userData) {
        dispatch(
          setUserData({ ...userData, credits: result.data.creditsLeft }),
        );
      }
      setLoading(false);
      onStart(result.data);
    } catch (error) {
      setLoading(false);

      if (error.response?.status === 400) {
        navigate("/pricing");
      }
    }
  };

  const briefItems = [
    {
      icon: <FaUserTie className="text-ember text-lg" />,
      text: "Choose Role & Experience",
    },
    {
      icon: <FaMicrophoneAlt className="text-ember text-lg" />,
      text: "Smart Voice Interview",
    },
    {
      icon: <FaChartLine className="text-ember text-lg" />,
      text: "Performance Analytics",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-canvas grid-bg flex items-center justify-center px-4 py-12"
    >
      <div className="relative w-full max-w-6xl">
        <div className="halo absolute -top-24 left-0 right-0 h-64 pointer-events-none" />
        <div className="relative panel border border-line rounded-2xl grid md:grid-cols-2 overflow-hidden">
          {/* Left: brief panel */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="relative bg-void p-8 md:p-12 flex flex-col justify-center border-b md:border-b-0 md:border-r border-line"
          >
            <h2 className="display text-4xl md:text-5xl font-bold text-chalk mt-4 mb-6">
              Start Your <span className="text-grad-ember">AI Interview</span>
            </h2>
            <p className="text-ash mb-10 max-w-sm">
              Practice real interview scenarios powered by AI. Improve
              communication, technical skills, and confidence.
            </p>

            <div className="space-y-3 mb-10">
              {briefItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.15 }}
                  whileHover={{ y: -2 }}
                  className="panel panel-hover flex items-center space-x-4 p-4 rounded-xl border border-line"
                >
                  {item.icon}
                  <span className="text-chalk font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            <div className="border-t border-line pt-5">
              <span className="eyebrow block mb-3">Live Config</span>
              <div className="font-mono text-sm text-ash space-y-1.5">
                <div className="flex justify-between gap-4">
                  <span className="text-dim">role</span>
                  <span className="text-chalk truncate">{role || "—"}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-dim">experience</span>
                  <span className="text-chalk truncate">
                    {experience || "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-dim">mode</span>
                  <span className="text-ember">{mode}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-dim">resume</span>
                  <span className="text-chalk truncate max-w-[60%] text-right">
                    {resumeFile ? resumeFile.name : "none"}
                  </span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-dim">skills</span>
                  <span className="text-chalk">{skills.length}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-dim">projects</span>
                  <span className="text-chalk">{projects.length}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right: form panel */}
          <motion.div
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.7 }}
            className="p-8 md:p-12 bg-panel"
          >
            <h2 className="display text-2xl md:text-3xl font-bold text-chalk mt-3 mb-8">
              Interview Setup
            </h2>
            <div className="space-y-6">
              <div className="relative">
                <FaUserTie className="absolute top-1/2 -translate-y-1/2 left-4 text-dim" />
                <input
                  type="text"
                  placeholder="Enter role"
                  className="w-full pl-12 pr-4 py-3 bg-panel2 border border-line rounded-xl text-chalk placeholder:text-dim focus:outline-none focus:border-ember transition"
                  onChange={(e) => setRole(e.target.value)}
                  value={role}
                />
              </div>
              <div className="relative">
                <FaBriefcase className="absolute top-1/2 -translate-y-1/2 left-4 text-dim" />
                <input
                  type="text"
                  placeholder="Experience (e.g. 2 years)"
                  className="w-full pl-12 pr-4 py-3 bg-panel2 border border-line rounded-xl text-chalk placeholder:text-dim focus:outline-none focus:border-ember transition"
                  onChange={(e) => setExperience(e.target.value)}
                  value={experience}
                />
              </div>

              {/* Segmented mode selector - reuses exact setMode handler */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-panel2 border border-line rounded-xl">
                {["Technical", "HR"].map((m) => (
                  <button
                    type="button"
                    key={m}
                    onClick={() => setMode(m)}
                    className={`py-2.5 rounded-lg font-mono text-sm uppercase tracking-wide transition ${
                      mode === m ? "btn-ember" : "text-ash hover:text-chalk"
                    }`}
                  >
                    {m} Interview
                  </button>
                ))}
              </div>

              {!analysisDone && (
                <motion.div
                  whileHover={{ y: -2 }}
                  onClick={() =>
                    document.getElementById("resumeUpload").click()
                  }
                  className="border-2 border-dashed border-line rounded-xl p-8 text-center cursor-pointer hover:border-ember transition group"
                >
                  <FaFileUpload className="text-4xl mx-auto text-dim group-hover:text-ember transition mb-3" />
                  <input
                    type="file"
                    accept="application/pdf"
                    id="resumeUpload"
                    className="hidden"
                    onChange={(e) => setResumeFile(e.target.files[0])}
                  />
                  <p className="text-ash font-medium">
                    {resumeFile
                      ? resumeFile.name
                      : "Click to upload resume (Optional)"}
                  </p>
                  {resumeFile && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleUploadResume();
                      }}
                      className="mt-4 border border-line text-chalk px-5 py-2 rounded-lg hover:border-ember hover:text-ember transition"
                    >
                      {analyzing ? "Analyzing..." : "Analyze Resume"}
                    </motion.button>
                  )}
                </motion.div>
              )}

              {analysisDone && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-panel2 border border-line rounded-xl p-5 space-y-4"
                >
                  <h3 className="eyebrow text-sm !text-chalk">
                    Resume Analysis Result
                  </h3>
                  {projects.length > 0 && (
                    <div>
                      <p className="font-medium text-ash mb-1">Projects:</p>
                      <ul className="list-disc list-inside text-ash space-y-1">
                        {projects.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {skills.length > 0 && (
                    <div>
                      <p className="font-medium text-ash mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-2">
                        {skills.map((s, i) => (
                          <span
                            key={i}
                            className="border border-line text-ember px-3 py-1 rounded-full text-sm font-mono"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.button
                onClick={handleStart}
                disabled={!role || !experience || loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                className="w-full disabled:opacity-40 disabled:cursor-not-allowed btn-ember py-3.5 rounded-xl text-lg font-semibold transition duration-300"
              >
                {loading ? "Starting..." : "Start Interview"}
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}

export default Step1Setup;
