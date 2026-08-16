import React from "react";
import { BsRobot } from "react-icons/bs";
function Footer() {
  return (
    <div className="border-t border-line bg-void">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-panel border border-line flex items-center justify-center text-ember">
              <BsRobot size={16} />
            </div>
            <h2 className="font-display font-semibold text-lg tracking-tight text-chalk">
              Intervix
            </h2>
          </div>
          <p className="text-ash text-sm max-w-xl leading-relaxed">
            AI-powered interview preparation platform designed to improve
            communication skills, technical depth and professional confidence.
          </p>
        </div>
        <div className="eyebrow md:text-right">
          <span className="text-ember">●</span> Intervix
        </div>
      </div>
    </div>
  );
}

export default Footer;
