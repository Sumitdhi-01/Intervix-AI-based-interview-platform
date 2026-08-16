import React from "react";
import { FaArrowLeft, FaDownload } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Step3Report({ report }) {
  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <p className="text-dim text-lg font-mono">Loading Report...</p>
      </div>
    );
  }

  const navigate = useNavigate();
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0,
  }));

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;

  const downloadPDF = () => {
    const doc = new jsPDF("p", "mm", "a4");

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;

    let currentY = 25;

    //  TITLE
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 90, 31);
    doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
      align: "center",
    });

    currentY += 5;

    // underline
    doc.setDrawColor(255, 90, 31);
    doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

    currentY += 15;

    //  FINAL SCORE BOX
    doc.setFillColor(255, 245, 235);
    doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text(`Final Score: ${finalScore}/10`, pageWidth / 2, currentY + 12, {
      align: "center",
    });

    currentY += 30;

    //  SKILLS BOX
    doc.setFillColor(249, 250, 251);
    doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

    doc.setFontSize(12);

    doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
    doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
    doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

    currentY += 45;

    // ADVICE
    let advice = "";

    if (finalScore >= 8) {
      advice =
        "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
    } else if (finalScore >= 5) {
      advice =
        "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
    } else {
      advice =
        "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(220);
    doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

    doc.setFont("helvetica", "bold");
    doc.text("Professional Advice", margin + 10, currentY + 10);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
    doc.text(splitAdvice, margin + 10, currentY + 20);

    currentY += 50;

    //  QUESTION TABLE
    autoTable(doc, {
      startY: currentY,
      margin: { left: margin, right: margin },
      head: [["#", "Question", "Score", "Feedback"]],
      body: questionWiseScore.map((q, i) => [
        `${i + 1}`,
        q.question,
        `${q.score}/10`,
        q.feedback,
      ]),
      styles: {
        fontSize: 9,
        cellPadding: 5,
        valign: "top",
      },
      headStyles: {
        fillColor: [255, 90, 31],
        textColor: 255,
        halign: "center",
      },
      columnStyles: {
        0: { cellWidth: 10, halign: "center" }, // index
        1: { cellWidth: 55 }, // question
        2: { cellWidth: 20, halign: "center" }, // score
        3: { cellWidth: "auto" }, // feedback
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save("AI_Interview_Report.pdf");
  };

  return (
    <div className="min-h-screen bg-canvas grid-bg px-4 sm:px-6 lg:px-10 py-8">
      <div className="halo pointer-events-none fixed top-0 left-0 right-0 h-72" />

      {/* Sticky header row */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 lg:-mx-10 px-4 sm:px-6 lg:px-10 py-4 mb-8 bg-canvas/80 backdrop-blur border-b border-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-4 flex-wrap">
          <button
            onClick={() => navigate("/history")}
            className="mt-1 p-3 rounded-xl border border-line text-chalk hover:border-ember hover:text-ember transition"
          >
            <FaArrowLeft />
          </button>

          <div>
            <h1 className="display text-2xl sm:text-3xl font-bold text-chalk">
              Interview <span className="text-grad-ember">Analytics</span>
            </h1>
            <p className="eyebrow mt-2 normal-case tracking-normal text-ash">
              AI-powered performance insights
            </p>
          </div>
        </div>
        <button
          onClick={downloadPDF}
          className="btn-ember flex items-center justify-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 text-sm sm:text-base text-nowrap"
        >
          <FaDownload /> Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 lg:gap-5">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="panel panel-hover lg:col-span-2 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-8"
        >
          <div className="relative w-32 h-32 sm:w-40 sm:h-40 shrink-0">
            <CircularProgressbar
              value={percentage}
              text={`${score}/10`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: "#ff5a1f",
                textColor: "#f5f5f4",
                trailColor: "#26262b",
                pathTransitionDuration: 1,
              })}
            />
          </div>
          <div className="text-center sm:text-left">
            <p className="eyebrow mb-2">Overall Performance</p>
            <p className="display text-6xl sm:text-7xl font-bold text-chalk leading-none">
              {score}
              <span className="text-2xl text-dim font-mono">/10</span>
            </p>
            <p className="font-semibold text-chalk mt-4">{performanceText}</p>
            <p className="text-ash text-sm mt-1">{shortTagline}</p>
          </div>
        </motion.div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {skills.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              className="panel panel-hover rounded-2xl p-5 flex flex-col justify-between"
            >
              <p className="eyebrow">{s.label}</p>
              <p className="font-mono text-3xl text-chalk mt-3">
                {s.value}
                <span className="text-dim text-base">/10</span>
              </p>
              <div className="bg-line h-1.5 rounded-full mt-4 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${s.value * 10}%`,
                    background:
                      "linear-gradient(90deg, var(--color-ember2), var(--color-ember))",
                  }}
                ></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance trend chart */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="panel panel-hover lg:col-span-4 rounded-2xl p-5 sm:p-8"
        >
          <h3 className="display text-lg sm:text-xl font-semibold text-chalk mb-4 sm:mb-6">
            Performance Trend
          </h3>
          <div className="h-64 sm:h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={questionScoreData}>
                <defs>
                  <linearGradient id="emberFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5a1f" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#ff5a1f" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#26262b" />
                <XAxis
                  dataKey="name"
                  stroke="#6e6e76"
                  tick={{ fill: "#6e6e76", fontSize: 12 }}
                />
                <YAxis
                  domain={[0, 10]}
                  stroke="#6e6e76"
                  tick={{ fill: "#6e6e76", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    background: "#141417",
                    border: "1px solid #26262b",
                    borderRadius: "0.75rem",
                    color: "#f5f5f4",
                  }}
                  labelStyle={{ color: "#a1a1a6" }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#ff5a1f"
                  fill="url(#emberFill)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Question breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="panel panel-hover lg:col-span-4 rounded-2xl p-5 sm:p-8"
        >
          <h3 className="display text-lg sm:text-xl font-semibold text-chalk mb-6">
            Question Breakdown
          </h3>
          <div className="divide-y divide-line">
            {questionWiseScore.map((q, i) => (
              <div key={i} className="py-5 first:pt-0 last:pb-0">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                  <div>
                    <p className="eyebrow mb-1">Question {i + 1}</p>
                    <p className="font-semibold text-chalk text-sm sm:text-base leading-relaxed">
                      {q.question || "Question not available"}
                    </p>
                  </div>
                  <div className="font-mono text-ember px-3 py-1 rounded-lg border border-line text-xs sm:text-sm w-fit">
                    {q.score ?? 0}/10
                  </div>
                </div>
                <div className="bg-panel2 border border-line p-4 rounded-xl">
                  <p className="eyebrow mb-1">AI Feedback</p>
                  <p className="text-sm text-ash leading-relaxed">
                    {q.feedback && q.feedback.trim() !== ""
                      ? q.feedback
                      : "No feedback available for this question."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default Step3Report;
