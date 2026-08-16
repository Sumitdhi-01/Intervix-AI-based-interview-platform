import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import AuthModel from "../components/AuthModel";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";
import interviewImg from "../assets/interview.png";

function Home() {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const go = (path) => {
    if (!userData) return setShowAuth(true);
    navigate(path);
  };

  const steps = [
    {
      icon: <BsRobot size={20} />,
      step: "STEP 1",
      title: "Role & Experience Selection",
      desc: "AI adjusts difficulty based on selected job role.",
    },
    {
      icon: <BsMic size={20} />,
      step: "STEP 2",
      title: "Smart Voice Interview",
      desc: "Dynamic follow-up questions based on your answers.",
    },
    {
      icon: <BsClock size={20} />,
      step: "STEP 3",
      title: "Timer Based Simulation",
      desc: "Real interview pressure with time tracking.",
    },
  ];

  const capabilities = [
    {
      image: evalImg,
      icon: <BsBarChart size={18} />,
      title: "AI Answer Evaluation",
      desc: "Scores communication, technical accuracy and confidence.",
    },
    {
      image: resumeImg,
      icon: <BsFileEarmarkText size={18} />,
      title: "Resume Based Interview",
      desc: "Project-specific questions based on uploaded resume.",
    },
    {
      image: pdfImg,
      icon: <BsFileEarmarkText size={18} />,
      title: "Downloadable PDF Report",
      desc: "Detailed strengths, weaknesses and improvement insights.",
    },
    {
      image: analyticsImg,
      icon: <BsBarChart size={18} />,
      title: "History & Analytics",
      desc: "Track progress with performance graphs and topic analysis.",
    },
  ];

  const modes = [
    {
      img: hrImg,
      title: "HR Interview Mode",
      desc: "Behavioral and communication based evaluation.",
    },
    {
      img: techImg,
      title: "Technical Mode",
      desc: "Deep technical questioning based on selected role.",
    },
  ];

  const ticker = [
    "Adaptive difficulty",
    "Voice interview",
    "Resume parsing",
    "Confidence scoring",
    "PDF debrief",
    "Progress analytics",
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col ">
      <Navbar />

      {/* HERO */}
      <section className="relative grid-bg border-b border-line overflow-hidden ">
        <div className="absolute inset-0 halo pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-16 pb-16 sm:pt-24 sm:pb-24">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-14 items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="display text-[2.6rem] sm:text-6xl lg:text-[4.2rem] leading-[1.04] font-semibold text-chalk"
              >
                Practice Interviews
                <br />
                with <span className="text-grad-ember">AI Intelligence</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="text-ash mt-7 max-w-lg text-base sm:text-lg leading-relaxed"
              >
                Role-based mock interviews with smart follow-ups, adaptive
                difficulty and real-time performance evaluation.
              </motion.p>

              <div className="flex flex-wrap gap-3 sm:gap-4 mt-10">
                <motion.button
                  onClick={() => go("/interview")}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-ember h-12 px-8 rounded-xl glow-ember"
                >
                  Start Interview
                </motion.button>
                <motion.button
                  onClick={() => go("/history")}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.98 }}
                  className="h-12 px-8 rounded-xl border border-line text-chalk hover:border-ember hover:text-ember transition-colors"
                >
                  View History
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-9 text-xs text-ash">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                  No setup required
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                  Voice or text
                </span>
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-ember" />
                  Instant scored report
                </span>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative flex items-center justify-center lg:justify-end"
            >
              <div className="absolute inset-[-18%] pointer-events-none" />

              <motion.img
                src={interviewImg}
                alt="Candidate giving an AI mock interview on a laptop"
                className="relative w-full max-w-[520px] object-contain opacity-95 saturate-125 select-none"
                draggable={false}
                animate={{ y: [0, -8, 0] }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </div>
        </div>

        {/* marquee */}
        <div className="border-t border-line overflow-hidden">
          <div className="flex marquee-track w-max">
            {[...ticker, ...ticker].map((t, i) => (
              <span
                key={i}
                className="eyebrow py-3 px-8 whitespace-nowrap border-r border-line"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      <div className="flex-1">
        {/* HOW IT WORKS */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5 mb-10">
            <h2 className="display text-3xl sm:text-4xl font-semibold text-chalk">
              How it <span className="text-grad-ember">works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-px bg-line border border-line rounded-2xl overflow-hidden">
            {steps.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="bg-panel panel-hover p-8 sm:p-10 relative group"
              >
                <span className="absolute top-6 right-7 font-display text-5xl font-semibold text-line2 group-hover:text-ember/30 transition-colors">
                  0{index + 1}
                </span>
                <div className="w-11 h-11 rounded-xl bg-panel2 border border-line text-ember flex items-center justify-center mb-8 group-hover:border-ember/40 transition-colors">
                  {item.icon}
                </div>
                <div className="eyebrow mb-3">{item.step}</div>
                <h3 className="font-display text-lg font-semibold text-chalk mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-ash leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CAPABILITIES */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5 mb-8">
            <h2 className="display text-3xl sm:text-4xl font-semibold text-chalk">
              Advanced AI <span className="text-grad-ember">Capabilities</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {capabilities.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
                whileHover={{ y: -4 }}
                className="panel panel-hover rounded-2xl p-6 sm:p-7 h-[210px] flex flex-col justify-between group"
              >
                {/* Top */}
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-xl bg-panel2 border border-line text-ember flex items-center justify-center group-hover:border-ember/40 transition-colors">
                    {item.icon}
                  </div>

                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-contain opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Bottom */}
                <div className="max-w-[85%]">
                  <h3 className="font-display text-lg sm:text-xl font-semibold text-chalk mb-2">
                    {item.title}
                  </h3>

                  <p className="text-ash text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* MODES */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 sm:pb-32">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5 mb-10">
            <h2 className="display text-3xl sm:text-4xl font-semibold text-chalk">
              Multiple interview <span className="text-grad-ember">Modes</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-5">
            {modes.map((mode, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="panel panel-hover rounded-2xl p-8 flex items-center justify-between gap-6 group"
              >
                <div>
                  <h3 className="font-display text-xl font-semibold text-chalk mb-3">
                    {mode.title}
                  </h3>
                  <p className="text-ash text-sm leading-relaxed">
                    {mode.desc}
                  </p>
                </div>
                <img
                  src={mode.img}
                  alt={mode.title}
                  className="w-24 h-24 sm:w-28 sm:h-28 object-contain shrink-0 opacity-85 group-hover:opacity-100 transition-opacity"
                />
              </motion.div>
            ))}
          </div>

          <div className="mt-6 panel rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-6 justify-between">
            <div className="flex items-center gap-5">
              <img
                src={confidenceImg}
                alt="confidence"
                className="w-16 h-16 object-contain"
              />
              <div>
                <div className="eyebrow mb-2">Ready when you are</div>
                <p className="font-display text-xl font-semibold text-chalk">
                  Build interview confidence, one session at a time.
                </p>
              </div>
            </div>
            <motion.button
              onClick={() => go("/interview")}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="btn-ember h-12 px-8 rounded-xl shrink-0 glow-ember"
            >
              Start Interview
            </motion.button>
          </div>
        </section>
      </div>

      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
      <Footer />
    </div>
  );
}

export default Home;
