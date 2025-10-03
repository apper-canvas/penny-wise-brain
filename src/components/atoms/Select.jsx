import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className,
  children,
  error,
  ...props 
}, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full px-4 py-2.5 text-base border-2 border-gray-200 rounded-lg transition-colors duration-200",
        "focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100",
        "disabled:bg-gray-50 disabled:cursor-not-allowed",
        "bg-white",
        error && "border-red-500 focus:border-red-500 focus:ring-red-100",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;