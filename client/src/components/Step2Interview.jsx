import React, { useState, useRef, useEffect } from "react";
import { HiSpeakerWave } from "react-icons/hi2";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../App";
import { BsArrowRight } from "react-icons/bs";

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeLeft, setTimeLeft] = useState(questions[0]?.timeLimit || 60);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      const preferredVoice =
        voices.find((v) => v.lang.startsWith("en")) || voices[0];

      setSelectedVoice(preferredVoice);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  const startMic = () => {
    if (recognitionRef.current && !isAIPlaying && !isRecognizingRef.current) {
      try {
        recognitionRef.current.start();
        isRecognizingRef.current = true;
      } catch (error) {
        // Prevent unhandled state errors
        if (error.name !== "InvalidStateError") {
          console.error(error);
        }
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current && isRecognizingRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error(error);
      } finally {
        isRecognizingRef.current = false;
      }
    }
  };

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text.replace(/,/g, ", ... ").replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      utterance.onstart = () => {
        setIsAIPlaying(true);
        stopMic();
      };

      utterance.onend = () => {
        setIsAIPlaying(false);

        if (isMicOn) {
          startMic();
        }

        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };

      utterance.onerror = () => {
        setIsAIPlaying(false);
        resolve();
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  useEffect(() => {
    if (!selectedVoice) return;

    const runIntro = async () => {
      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`,
        );

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.",
        );

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        setIsTimerRunning(false);
        await new Promise((r) => setTimeout(r, 800));

        if (currentIndex === questions.length - 1) {
          await speakText("This one might be a bit more challenging.");
        }

        await speakText(currentQuestion.question);
        setIsTimerRunning(true);
      }
    };

    runIntro();
  }, [selectedVoice, isIntroPhase, currentIndex]);

  useEffect(() => {
    if (isIntroPhase || !currentQuestion || !isTimerRunning) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex, isTimerRunning]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeLeft(currentQuestion.timeLimit || 60);
    }
  }, [currentIndex]);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      setAnswer((prev) => prev + " " + transcript);
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      isRecognizingRef.current = false;
    };

    recognitionRef.current = recognition;
  }, []);

  const submitAnswer = async () => {
    if (isSubmitting) return;
    stopMic();
    setIsSubmitting(true);
    try {
      const result = await axios.post(
        serverUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken: currentQuestion.timeLimit - timeLeft,
        },
        { withCredentials: true },
      );

      setFeedback(result.data.feedback);
      speakText(result.data.feedback);
      setIsSubmitting(false);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    setIsTimerRunning(false);
    setAnswer("");
    setFeedback("");

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex((prev) => prev + 1);

    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);
  };

  const finishInterview = async () => {
    window.speechSynthesis.cancel();
    stopMic();
    setIsMicOn(false);
    try {
      const result = await axios.post(
        serverUrl + "/api/interview/finish",
        { interviewId },
        { withCredentials: true },
      );
      onFinish(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer();
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch (e) {}
      }
      window.speechSynthesis.cancel();
    };
  }, []);

  return (
    <div className="min-h-screen bg-canvas grid-bg relative flex flex-col">
      <div className="halo absolute inset-x-0 top-0 h-[420px] pointer-events-none" />

      {/* Top status bar */}
      <div className="relative z-10 border-b border-line px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-[11px] uppercase tracking-widest text-dim">
        <div className="flex items-center gap-4 flex-wrap">
          <span className="text-chalk">Intervix</span>
          <span className="hidden sm:inline">·</span>
          <span>
            Question{" "}
            <span className="text-ember">
              {String(currentIndex + 1).padStart(2, "0")}
            </span>{" "}
            / {String(questions.length).padStart(2, "0")}
          </span>
          <span className="hidden sm:inline">·</span>
          <span>
            {isIntroPhase
              ? "Intro Mode"
              : isAIPlaying
                ? "AI Speaking"
                : "Listening"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isAIPlaying ? "bg-ember pulse-ring" : "bg-dim"
            }`}
          />
          <span>{isTimerRunning ? `${timeLeft}s` : "--"}</span>
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className="relative z-10 flex w-full h-[3px] bg-panel">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`flex-1 mx-[1px] ${
              i <= currentIndex ? "bg-ember" : "bg-line"
            }`}
          />
        ))}
      </div>

      <div className="relative z-10 flex-1 w-full max-w-350 mx-auto flex flex-col lg:flex-row gap-6 p-4 sm:p-6 md:p-8 pb-32">
        {/* Video / Avatar panel */}
        <div className="w-full lg:w-[38%] flex flex-col gap-6">
          <div className="relative panel rounded-2xl overflow-hidden h-72 sm:h-80 flex flex-col items-center justify-center">
            {/* Corner ticks */}
            <span className="absolute top-3 left-3 w-3 h-3 border-t border-l border-line2" />
            <span className="absolute top-3 right-3 w-3 h-3 border-t border-r border-line2" />
            <span className="absolute bottom-3 left-3 w-3 h-3 border-b border-l border-line2" />
            <span className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-line2" />
            {/* Recording dot */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 eyebrow">
              <span
                className={`w-2 h-2 rounded-full bg-ember ${
                  isAIPlaying ? "pulse-ring" : ""
                }`}
              />
              {isAIPlaying ? "on air" : "standby"}
            </div>
            {/* Ripple animation */}
            {isAIPlaying && (
              <>
                <div className="absolute w-44 h-44 rounded-full border border-ember/30 animate-ping"></div>
                <div
                  className="absolute w-60 h-60 rounded-full border border-ember/20 animate-ping"
                  style={{ animationDelay: "0.4s" }}
                ></div>
                <div
                  className="absolute w-80 h-80 rounded-full border border-ember/10 animate-ping"
                  style={{ animationDelay: "0.8s" }}
                ></div>
              </>
            )}
            {/* Speaker */}
            <div
              className={`relative z-10 flex items-center justify-center w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-panel2 border border-line2 shadow-2xl transition-all duration-300 ${
                isAIPlaying ? "scale-110 border-ember" : ""
              }`}
            >
              <HiSpeakerWave size={52} className="text-ember" />
            </div>
            {/* Equalizer */}
            <div className="relative z-10 flex items-end gap-2 mt-8 h-14">
              {[32, 20, 44, 26, 38, 24, 34].map((height, index) => (
                <div
                  key={index}
                  className={`w-1.5 rounded-full bg-ember/80 ${
                    isAIPlaying ? "animate-bounce" : ""
                  }`}
                  style={{
                    height: `${height}px`,
                    animationDelay: `${index * 0.08}s`,
                  }}
                />
              ))}
            </div>
            <p className="relative z-10 mt-6 font-mono text-xs uppercase tracking-widest text-dim">
              {isAIPlaying ? "AI is Speaking..." : "Waiting..."}
            </p>
          </div>

          {/* Subtitle */}
          {subtitle && (
            <div className="panel2 border border-line rounded-2xl p-4">
              <p className="text-ash text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          {/* Timer / Meta area */}
          <div className="panel rounded-2xl p-6 space-y-5">
            <div className="flex justify-between items-center eyebrow">
              <span>Interview Status</span>
              {isAIPlaying && <span className="text-ember">AI Speaking</span>}
            </div>
            <div className="h-px bg-line"></div>
            <div className="flex justify-center">
              <Timer
                timeLeft={timeLeft}
                totalTime={currentQuestion?.timeLimit || 60}
              />
            </div>
            <div className="h-px bg-line"></div>
            <div className="grid grid-cols-2 gap-6 text-center font-mono">
              <div>
                <div className="text-2xl font-bold text-ember">
                  {currentIndex + 1}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-dim">
                  Current
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-ember">
                  {questions.length}
                </div>
                <div className="text-[11px] uppercase tracking-widest text-dim">
                  Total
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text section */}
        <div className="flex-1 flex flex-col relative">
          <div className="eyebrow mb-2">Live Session</div>
          <h2 className="text-2xl sm:text-3xl font-display font-semibold text-chalk mb-6">
            AI Smart <span className="text-grad-ember">Interview</span>
          </h2>

          {!isIntroPhase && (
            <div className="relative mb-6 panel2 border border-line rounded-2xl p-4 sm:p-6">
              <p className="eyebrow mb-2">
                Question {String(currentIndex + 1).padStart(2, "0")} /{" "}
                {String(questions.length).padStart(2, "0")}
              </p>
              <div className="display text-lg sm:text-2xl font-medium text-chalk leading-snug">
                {currentQuestion?.question}
              </div>
            </div>
          )}

          <div className="flex-1 flex flex-col panel2 border border-line rounded-2xl overflow-hidden">
            <div className="eyebrow px-4 sm:px-6 pt-4">Transcript / Answer</div>
            <textarea
              placeholder="Type your answer here...."
              onChange={(e) => setAnswer(e.target.value)}
              value={answer}
              className="flex-1 min-h-40 bg-transparent p-4 sm:p-6 resize-none outline-none text-chalk placeholder:text-dim font-sans transition"
            />
          </div>

          {/* Floating bottom control bar */}
          {!feedback ? (
            <div className="mt-6 lg:sticky lg:bottom-6 flex flex-wrap items-center gap-4 panel border border-line rounded-2xl p-3">
              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-xl btn-ember shrink-0 ${
                  isAIPlaying ? "pulse-ring" : ""
                }`}
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>
              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="flex-1 min-w-40 border border-line text-chalk hover:border-ember hover:text-ember rounded-xl py-3 transition font-semibold disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </motion.button>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 lg:sticky lg:bottom-6 panel border border-line rounded-2xl p-5"
            >
              <p className="text-ash font-medium mb-4">{feedback}</p>
              <button
                onClick={
                  currentIndex === questions.length - 1
                    ? finishInterview
                    : handleNext
                }
                className="w-full btn-ember py-3 rounded-xl transition flex items-center justify-center gap-1"
              >
                {currentIndex === questions.length - 1 ? (
                  "Finish Interview"
                ) : (
                  <>
                    Next Question <BsArrowRight size={18} />
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Step2Interview;
