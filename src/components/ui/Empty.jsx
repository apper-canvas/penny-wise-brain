import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  title = "No data yet", 
  message = "Get started by adding your first item",
  icon = "Inbox",
  action,
  actionLabel = "Add Item"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center min-h-[400px] p-8"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary-50 to-primary-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} size={48} className="text-primary-500" />
      </div>
      
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      
      <p className="text-gray-600 text-center max-w-md mb-6">
        {message}
      </p>
      
      {action && (
        <Button onClick={action} variant="primary">
          <ApperIcon name="Plus" size={18} />
          {actionLabel}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;