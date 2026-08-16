import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

function Timer({ timeLeft, totalTime }) {
  const percentage = (timeLeft / totalTime) * 100;
  return (
    <div className="relative w-20 h-20">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "22px",
          pathColor: "#ff5a1f",
          textColor: "#f5f5f4",
          trailColor: "#26262b",
          pathTransitionDuration: 0.5,
        })}
      />
      <div className="pointer-events-none absolute inset-0 rounded-full" style={{ boxShadow: "0 0 0 1px rgba(255,90,31,0.25)" }} />
    </div>
  );
}

export default Timer;
