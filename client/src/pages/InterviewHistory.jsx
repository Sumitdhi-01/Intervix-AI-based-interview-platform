import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "motion/react";
function InterviewHistory() {
  const [interviews, setInterviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const getMyInterviews = async () => {
      try {
        const result = await axios.get(
          serverUrl + "/api/interview/get-interview",
          { withCredentials: true },
        );

        setInterviews(result.data);
      } catch (error) {
        console.log(error);
      }
    };
    getMyInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-canvas grid-bg py-10">
      <div className="halo pointer-events-none fixed top-0 left-0 right-0 h-72" />

      {/* Header */}
      <div className="w-full px-6 lg:px-12 mb-10">
        <div className="flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate("/")}
            className="mt-1 p-3 rounded-xl border border-line text-chalk hover:border-ember hover:text-ember transition"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="display text-2xl sm:text-3xl font-bold text-chalk">
              Interview <span className="text-grad-ember">History</span>
            </h1>
            <p className="eyebrow mt-2 normal-case tracking-normal text-ash">
              Track your past interviews and performance reports
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="w-[90vw] lg:w-[70vw] max-w-[90%] mx-auto">
        {interviews.length === 0 ? (
          <div className="panel rounded-2xl p-10 text-center">
            <p className="eyebrow mb-2">No records</p>
            <p className="text-ash">
              No interviews found. Start your first Interview.
            </p>
          </div>
        ) : (
          <div className="panel rounded-2xl overflow-hidden">
            {/* column labels — hidden on mobile */}
            <div className="hidden md:grid grid-cols-[3rem_1fr_10rem_8rem_8rem] gap-4 px-6 py-3 border-b border-line eyebrow">
              <span>#</span>
              <span>Role</span>
              <span>Date</span>
              <span className="text-right">Score</span>
              <span className="text-right">Status</span>
            </div>

            <div className="divide-y divide-line">
              {interviews.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(index * 0.04, 0.4) }}
                  onClick={() => navigate(`/report/${item._id}`)}
                  className="group grid grid-cols-1 md:grid-cols-[3rem_1fr_10rem_8rem_8rem] gap-2 md:gap-4 items-center px-6 py-5 cursor-pointer transition-colors hover:bg-panel2"
                >
                  <span className="hidden md:block font-mono text-dim group-hover:text-ember transition-colors">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div>
                    <h3 className="text-base font-semibold text-chalk group-hover:text-ember transition-colors">
                      {item.role}
                    </h3>
                    <p className="text-ash text-sm mt-0.5">
                      {item.experience} · {item.mode}
                    </p>
                  </div>

                  <p className="font-mono text-xs sm:text-sm text-dim">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </p>

                  <div className="md:text-right">
                    <p className="font-mono text-lg text-ember">
                      {item.finalScore || 0}
                      <span className="text-dim text-sm">/10</span>
                    </p>
                  </div>

                  <div className="md:text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-xs font-mono border ${
                        item.status === "Completed"
                          ? "border-ember/40 text-ember"
                          : "border-line2 text-dim"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default InterviewHistory;
