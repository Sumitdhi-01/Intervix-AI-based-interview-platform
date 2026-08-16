import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "motion/react";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import axios from "axios";
import AuthModel from "./AuthModel";
function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showAuth, setShowAuth] = useState(false);
  const handleLogout = async () => {
    try {
      await axios.get(serverUrl + "/api/auth/logout", {
        withCredentials: true,
      });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="sticky top-0 z-50 bg-canvas/70 backdrop-blur-xl ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full max-w-6xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center relative"
      >
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-9 h-9 rounded-xl bg-panel border border-line flex items-center justify-center text-ember group-hover:border-ember transition-colors">
            <BsRobot size={18} />
          </div>
          <div className="hidden md:flex flex-col leading-none">
            <h1 className="font-display font-semibold text-[17px] tracking-tight text-chalk">
              Intervix
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4 relative">
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowCreditPopup(!showCreditPopup);
                setShowUserPopup(false);
              }}
              className="flex items-center gap-2 border border-line bg-panel hover:border-ember hover:text-ember text-chalk px-3.5 sm:px-4 h-10 rounded-xl font-mono text-sm transition-colors"
            >
              <BsCoin size={16} className="text-ember" />
              {userData?.credits || 0}
            </button>
            {showCreditPopup && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-3 w-64 bg-panel border border-line rounded-2xl p-5 z-50 shadow-2xl shadow-void/60"
              >
                <div className="eyebrow mb-2">Credits</div>
                <p className="text-sm text-ash mb-4 leading-relaxed">
                  Need more credits to continue interviews?
                </p>
                <button
                  onClick={() => navigate("/pricing")}
                  className="w-full btn-ember py-2.5 rounded-xl text-sm"
                >
                  Buy more credits
                </button>
              </motion.div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={() => {
                if (!userData) {
                  setShowAuth(true);
                  return;
                }
                setShowUserPopup(!showUserPopup);
                setShowCreditPopup(false);
              }}
              className="w-10 h-10 bg-panel border border-line hover:border-ember text-chalk rounded-xl flex items-center justify-center font-display font-semibold transition-colors"
            >
              {userData ? (
                userData?.name.slice(0, 1).toUpperCase()
              ) : (
                <FaUserAstronaut size={16} />
              )}
            </button>
            {showUserPopup && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute right-0 mt-3 w-52 bg-panel border border-line rounded-2xl p-4 z-50 shadow-2xl shadow-void/60"
              >
                <p className="font-display text-[15px] font-semibold text-chalk mb-1">
                  {userData.name}
                </p>
                <div className="h-px bg-line my-3" />
                <button
                  onClick={() => navigate("/history")}
                  className="w-full text-left text-sm py-2 text-ash hover:text-ember transition-colors"
                >
                  Interview History
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-sm py-2 flex items-center gap-2 text-dim hover:text-ember transition-colors"
                >
                  <HiOutlineLogout size={16} /> Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </div>
  );
}

export default Navbar;
