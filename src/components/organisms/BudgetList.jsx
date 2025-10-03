import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/molecules/ProgressBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { budgetService } from "@/services/api/budgetService";
import { categoryService } from "@/services/api/categoryService";
import { transactionService } from "@/services/api/transactionService";

const BudgetList = ({ monthKey, onAddClick }) => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [monthKey]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [budgetData, categoryData, transactions] = await Promise.all([
        budgetService.getByMonth(monthKey),
        categoryService.getAll(),
        transactionService.getByMonth(monthKey),
      ]);
      
      const categorySpending = {};
      transactions
        .filter(t => t.type === "expense")
        .forEach(t => {
          categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
        });
      
      const enrichedBudgets = budgetData.map(budget => {
        const category = categoryData.find(c => c.Id === budget.categoryId);
        return {
          ...budget,
          categoryName: category?.name || "Unknown",
          categoryIcon: category?.icon || "Circle",
          spent: categorySpending[category?.name] || 0,
        };
      });
      
      setBudgets(enrichedBudgets);
      setCategories(categoryData);
    } catch (err) {
      setError(err.message || "Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    
    try {
      await budgetService.delete(id);
      toast.success("Budget deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete budget");
    }
  };

  const getStatusVariant = (spent, amount) => {
    const percentage = (spent / amount) * 100;
    if (percentage >= 100) return "danger";
    if (percentage >= 80) return "warning";
    return "success";
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (budgets.length === 0) {
    return (
      <Card className="p-8">
        <Empty
          icon="Target"
          title="No budgets set"
          message="Create your first budget to track spending by category"
          action={onAddClick}
          actionLabel="Add Budget"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent-100 rounded-lg">
            <ApperIcon name="Target" size={20} className="text-accent-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Category Budgets</h3>
        </div>
        
        {onAddClick && (
          <Button size="sm" onClick={onAddClick}>
            <ApperIcon name="Plus" size={16} />
            Add
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {budgets.map((budget) => (
          <div
            key={budget.Id}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <ApperIcon name={budget.categoryIcon} size={20} className="text-gray-700" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{budget.categoryName}</p>
                  <p className="text-sm text-gray-500">
                    ${budget.spent.toFixed(2)} of ${budget.amount.toFixed(2)}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => handleDelete(budget.Id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
            
            <ProgressBar
              current={budget.spent}
              total={budget.amount}
              showLabel={true}
            />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default BudgetList;