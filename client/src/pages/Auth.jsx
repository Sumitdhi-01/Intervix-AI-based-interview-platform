import React from "react";
import { BsRobot } from "react-icons/bs";
import { IoSparklesSharp } from "react-icons/io5";
import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        serverUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      dispatch(setUserData(null));
    }
  };

  return (
    <div
      className={`w-full ${
        isModel
          ? ""
          : "min-h-screen bg-canvas grid-bg flex items-center justify-center px-4 sm:px-6 py-16 relative"
      }`}
    >
      {!isModel && (
        <div className="absolute inset-0 halo pointer-events-none" />
      )}
      <motion.div
        initial={{
          opacity: 0,
          y: isModel ? 12 : 24,
          scale: isModel ? 0.98 : 1,
        }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className={`relative w-full bg-panel border border-line rounded-2xl overflow-hidden ${
          isModel ? "max-w-md shadow-2xl shadow-black/50" : "max-w-lg"
        }`}
      >
        <div className="flex items-center justify-between px-6 sm:px-8 h-14 border-b border-line">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-panel2 border border-line flex items-center justify-center text-ember">
              <BsRobot size={16} />
            </div>
            <h2 className="font-display font-semibold tracking-tight text-chalk">
              Intervix
            </h2>
          </div>
          {!isModel && (
            <span className="eyebrow hidden sm:block">Secure Access</span>
          )}
        </div>

        <div className={isModel ? "p-7" : "p-8 sm:p-10"}>
          <h1 className="display text-3xl sm:text-4xl font-semibold text-chalk mb-5">
            Continue with{" "}
            <span className="text-grad-ember inline-flex items-center gap-2">
              <IoSparklesSharp size={20} className="text-ember" />
              AI Smart Interview
            </span>
          </h1>
          <p className="text-ash text-sm leading-relaxed mb-8">
            Sign in to start AI-powered mock interviews, track your progress,
            and unlock detailed performance insights.
          </p>
          <motion.button
            onClick={handleGoogleAuth}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-3 h-12 btn-ember rounded-xl glow-ember"
          >
            <FcGoogle size={20} />
            Continue with Google
          </motion.button>
          <div className="mt-6 flex items-center justify-between eyebrow">
            <span>Google OAuth</span>
            <span className="text-ember">●</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Auth;
