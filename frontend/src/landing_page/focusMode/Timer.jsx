
function Timer({ duration, timeLeft, isRunning, isComplete, onStart }) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = timeLeft / duration;
  const offset = circumference * (1 - progress);

  const formatTime = (seconds) => {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "36vh" }}>
      <div
        className="position-relative"
        style={{
          width: "200px",
          height: "200px",
          cursor: !isRunning && !isComplete ? "pointer" : "default",
        }}
        onClick={!isRunning && !isComplete ? onStart : undefined}
      >
        {/* SVG Circle Progress */}
        <svg width="200" height="200" style={{ transform: "rotate(-90deg)" }}>
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={isComplete ? "limegreen" : "orange"}
            strokeWidth="10"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition: "stroke-dashoffset 1s linear, stroke 0.5s ease",
            }}
          />
        </svg>

        {/* Center content */}
        <div
          className="position-absolute top-50 start-50 translate-middle"
          style={{ color: "white", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          {!isRunning && !isComplete ? (
            <i className="fa-solid fa-play" style={{ fontSize: "2rem" }}></i>
          ) : isComplete ? (
            <i className="fa-solid fa-check" style={{ fontSize: "2.5rem", color: "limegreen" }}></i>
          ) : (
            formatTime(timeLeft)
          )}
        </div>
      </div>
    </div>
  );
}

export default Timer;
