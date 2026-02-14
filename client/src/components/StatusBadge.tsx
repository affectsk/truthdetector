import { clsx } from "clsx";

interface StatusBadgeProps {
  score: number;
}

export function StatusBadge({ score }: StatusBadgeProps) {
  let bgClass = "bg-green-100 text-green-700 border-green-200";
  let label = "Trustworthy";

  if (score < 50) {
    bgClass = "bg-red-100 text-red-700 border-red-200";
    label = "Propaganda Risk";
  } else if (score < 80) {
    bgClass = "bg-amber-100 text-amber-700 border-amber-200";
    label = "Verify Carefully";
  }

  return (
    <span className={clsx(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
      bgClass
    )}>
      {label}
    </span>
  );
}
