import ApperIcon from "@/components/ApperIcon";
import { getCategoryColor } from "@/utils/categoryColors";

const CategoryPill = ({ categoryName, iconName }) => {
  const color = getCategoryColor(categoryName);
  
  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-sm"
      style={{ backgroundColor: color }}
    >
      <ApperIcon name={iconName} size={16} />
      <span>{categoryName}</span>
    </div>
  );
};

export default CategoryPill;