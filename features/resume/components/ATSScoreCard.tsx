"use client";

interface Props {
  score: number;
}

export default function ATSScoreCard({ score }: Props) {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 85) return "stroke-emerald-500 text-emerald-500";
    if (s >= 70) return "stroke-blue-500 text-blue-500";
    if (s >= 50) return "stroke-amber-500 text-amber-500";
    return "stroke-red-500 text-red-500";
  };

  const getLabel = (s: number) => {
    if (s >= 85) return "Excellent";
    if (s >= 70) return "Good";
    if (s >= 50) return "Needs Improvement";
    return "Needs Work";
  };

  const getBgColor = (s: number) => {
    if (s >= 85) return "from-emerald-500/10 to-emerald-600/5";
    if (s >= 70) return "from-blue-500/10 to-blue-600/5";
    if (s >= 50) return "from-amber-500/10 to-amber-600/5";
    return "from-red-500/10 to-red-600/5";
  };

  const colorClass = getColor(score);
  const bgGradient = getBgColor(score);

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 shadow-sm transition-all hover:shadow-md dark:border-zinc-800">
      {/* Background gradient */}
      <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-50`} />

      <div className="relative flex flex-col items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          ATS Score
        </h3>

        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <svg
            width="180"
            height="180"
            className="-rotate-90"
          >
            {/* Background circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              className="text-zinc-200 dark:text-zinc-700"
            />
            {/* Score circle */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className={`transition-all duration-1000 ease-out ${colorClass}`}
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-bold tracking-tight">{score}</span>
            <span className={`text-xs font-medium uppercase tracking-wider ${colorClass.split(" ")[1]}`}>
              {getLabel(score)}
            </span>
          </div>
        </div>

        <p className="mt-1 max-w-xs text-center text-sm text-muted-foreground">
          {score >= 85
            ? "Your resume is well-optimized for ATS systems."
            : score >= 70
              ? "Your resume is solid, but has room for improvement."
              : "Consider optimizing your resume for better ATS performance."}
        </p>
      </div>
    </div>
  );
}