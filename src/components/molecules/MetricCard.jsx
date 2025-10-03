import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { formatCurrency } from "@/utils/formatCurrency";
import { cn } from "@/utils/cn";

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  bgGradient = "from-primary-50 to-primary-100",
  iconColor = "text-primary-600"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-gradient-to-br p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200",
        bgGradient
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-3 rounded-lg bg-white shadow-sm", iconColor)}>
          <ApperIcon name={icon} size={24} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-sm font-medium",
            trend === "up" ? "text-green-600" : "text-red-600"
          )}>
            <ApperIcon 
              name={trend === "up" ? "TrendingUp" : "TrendingDown"} 
              size={16} 
              className="mr-1"
            />
            {trendValue}
          </div>
        )}
      </div>
      <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 animate-count">
        {typeof value === "number" ? formatCurrency(value) : value}
      </p>
    </motion.div>
  );
};

export default MetricCard;