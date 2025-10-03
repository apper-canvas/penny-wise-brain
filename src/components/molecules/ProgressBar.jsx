import { cn } from "@/utils/cn";

const ProgressBar = ({ 
  current, 
  total, 
  showLabel = true,
  size = "md",
  variant = "default"
}) => {
  const percentage = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  
  const getColor = () => {
    if (variant === "goal") {
      return percentage >= 100 ? "bg-green-500" : "bg-primary-500";
    }
    
    if (percentage >= 100) return "bg-red-500";
    if (percentage >= 80) return "bg-amber-500";
    return "bg-primary-500";
  };
  
  const sizes = {
    sm: "h-1.5",
    md: "h-2.5",
    lg: "h-3.5",
  };
  
  return (
    <div className="w-full">
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", sizes[size])}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 animate-progress",
            getColor()
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="text-gray-600">{percentage.toFixed(0)}%</span>
          <span className="text-gray-500">
            ${current.toFixed(0)} / ${total.toFixed(0)}
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;