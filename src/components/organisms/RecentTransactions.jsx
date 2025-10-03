import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import CategoryPill from "@/components/molecules/CategoryPill";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";
import { categoryService } from "@/services/api/categoryService";
import { formatDate } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";

const RecentTransactions = ({ monthKey, limit = 5, onAddClick }) => {
  const [transactions, setTransactions] = useState([]);
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
      const [txData, catData] = await Promise.all([
        transactionService.getByMonth(monthKey),
        categoryService.getAll(),
      ]);
      
      setTransactions(txData.slice(0, limit));
      setCategories(catData);
    } catch (err) {
      setError(err.message || "Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (categoryName) => {
    const category = categories.find(c => c.name === categoryName);
    return category?.icon || "Circle";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    
    try {
      await transactionService.delete(id);
      toast.success("Transaction deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete transaction");
    }
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (transactions.length === 0) {
    return (
      <Card className="p-8">
        <Empty
          icon="Receipt"
          title="No transactions yet"
          message="Start tracking your finances by adding your first transaction"
          action={onAddClick}
          actionLabel="Add Transaction"
        />
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-secondary-100 rounded-lg">
            <ApperIcon name="Receipt" size={20} className="text-secondary-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
        </div>
        
        {onAddClick && (
          <Button size="sm" onClick={onAddClick}>
            <ApperIcon name="Plus" size={16} />
            Add
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <div
            key={transaction.Id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 rounded-lg ${
                transaction.type === "income" 
                  ? "bg-green-100 text-green-600" 
                  : "bg-red-100 text-red-600"
              }`}>
                <ApperIcon 
                  name={getCategoryIcon(transaction.category)} 
                  size={20} 
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {transaction.category}
                </p>
                <p className="text-sm text-gray-500">
                  {formatDate(transaction.date)}
                </p>
                {transaction.notes && (
                  <p className="text-sm text-gray-400 truncate mt-1">
                    {transaction.notes}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className={`text-lg font-semibold ${
                transaction.type === "income" 
                  ? "text-green-600" 
                  : "text-red-600"
              }`}>
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
              
              <button
                onClick={() => handleDelete(transaction.Id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
              >
                <ApperIcon name="Trash2" size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RecentTransactions;