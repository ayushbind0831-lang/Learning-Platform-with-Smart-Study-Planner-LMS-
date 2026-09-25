function ProgressBar({ progress = 0 }) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="progress-track" style={{ height: "12px", background: "rgba(255, 255, 255, 0.08)" }}>
      <div
        className="progress-fill"
        style={{
          width: `${clampedProgress}%`,
          background: "var(--accent-gradient)",
          boxShadow: clampedProgress > 0 ? "0 0 10px rgba(99, 102, 241, 0.5)" : "none",
        }}
      />
    </div>
  );
}

export default ProgressBar;