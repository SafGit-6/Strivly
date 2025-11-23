import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Timer from "./Timer";
import ExitConfirm from "./ExitConfirm";


function FocusHero() {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task;

  // Timer state (moved here)
  const duration = 25 * 60; // 25 minutes
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Modal state
  const [showExitPrompt, setShowExitPrompt] = useState(false);

  // Timer effect
  useEffect(() => {
    let timer;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      setIsComplete(true);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // Start timer
  const handleStart = () => {
    if (!isRunning && !isComplete) {
      setIsRunning(true);
    }
  };

  // Exit button click
  const handleExitClick = () => {
    if (isRunning) {
      setShowExitPrompt(true);
    } else {
      navigate("/focusMode");
    }
  };

  if (!task) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="focus-hero-container position-relative">
      {/* Main content, blurred when modal is open */}
      <div className={showExitPrompt ? "blurred" : ""}>
        {/* Exit button */}
        <button
          onClick={handleExitClick}
          className="btn btn-dark position-absolute"
          style={{ top: "100px", right: "30px", borderRadius: "50%" }}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <p className="text-center" style={{ color: "lightGray" }}>
          Eliminate distractions and maximize productivity
        </p>

        <div
          className="container my-4 simpleDarkGreyCard text-center p-3"
          style={{ width: "60%" }}
        >
          <h5 style={{ color: "var(--textColor)" }}>Currently Focusing On</h5>
          <div className="mt-3">
            <span style={{ color: "var(--orange)" }}>{task.name}</span>
            <span className="taskBtnGoal py-1 px-2">{task.goal}</span>
          </div>
        </div>

        {/* Timer component */}
        <Timer
          duration={duration}
          timeLeft={timeLeft}
          isRunning={isRunning}
          isComplete={isComplete}
          onStart={handleStart}
        />

        <div
          className="d-grid gap-2 container my-4 simpleDarkGreyCard p-3"
          style={{ width: "60%" }}
        >
          <h5 style={{ color: "var(--textColor)" }}>Focus Notes</h5>
          <textarea
            className="focusTextArea"
            placeholder="Jot down insights or thoughts while focusing"
          ></textarea>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitPrompt && (
        <ExitConfirm showExitPrompt={showExitPrompt} setShowExitPrompt={setShowExitPrompt}/>
      )}
    </div>
  );
}

export default FocusHero;
