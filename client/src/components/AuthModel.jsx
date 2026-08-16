import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useSelector } from "react-redux";
import { FaTimes } from "react-icons/fa";
import Auth from "../pages/Auth";

function AuthModel({ onClose }) {
  const { userData } = useSelector((state) => state.user);

  useEffect(() => {
    if (userData) onClose();
  }, [userData, onClose]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[999] overflow-y-auto bg-void/80 backdrop-blur-md"
    >
      <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md"
        >
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-10 w-9 h-9 rounded-xl bg-panel/90 border border-line text-ash hover:text-ember hover:border-ember transition-colors flex items-center justify-center"
          >
            <FaTimes size={15} />
          </button>
          <Auth isModel={true} />
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default AuthModel;
