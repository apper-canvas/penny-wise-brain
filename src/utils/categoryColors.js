export const categoryColors = {
  Salary: "#10b981",
  "Other Income": "#22c55e",
  Food: "#f59e0b",
  Transport: "#3b82f6",
  Bills: "#8b5cf6",
  Entertainment: "#ec4899",
  Shopping: "#f97316",
  Healthcare: "#ef4444",
  Education: "#0891b2",
  Savings: "#14b8a6",
  Investments: "#6366f1",
  "Other Expense": "#64748b",
};

export const getCategoryColor = (categoryName) => {
  return categoryColors[categoryName] || "#64748b";
};