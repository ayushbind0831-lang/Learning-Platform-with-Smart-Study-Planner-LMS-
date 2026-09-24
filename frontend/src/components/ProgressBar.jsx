function ProgressBar({ percentage }) {
  const barColor =
    percentage >= 75
      ? "bg-green-500"
      : percentage >= 40
      ? "bg-yellow-500"
      : "bg-red-500";

  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className={`h-3 rounded-full transition-all duration-500 ${barColor}`}
        style={{ width: `${Math.min(percentage, 100)}%` }}
      />
    </div>
  );
}

export default ProgressBar;