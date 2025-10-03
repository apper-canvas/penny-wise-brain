import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Select from "@/components/atoms/Select";
import Modal from "@/components/molecules/Modal";
import BudgetForm from "@/components/organisms/BudgetForm";
import ProgressBar from "@/components/molecules/ProgressBar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { budgetService } from "@/services/api/budgetService";
import { categoryService } from "@/services/api/categoryService";
import { transactionService } from "@/services/api/transactionService";
import { getCurrentMonthKey, getMonthName } from "@/utils/dateUtils";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());

  useEffect(() => {
    loadData();
  }, [currentMonth]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [budgetData, categoryData, transactions] = await Promise.all([
        budgetService.getByMonth(currentMonth),
        categoryService.getAll(),
        transactionService.getByMonth(currentMonth),
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

  const handleEdit = (budget) => {
    setSelectedBudget(budget);
    setShowModal(true);
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

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedBudget(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    loadData();
  };

  const getStatusBadge = (spent, amount) => {
    const percentage = (spent / amount) * 100;
    
    if (percentage >= 100) {
      return <Badge variant="danger">Over Budget</Badge>;
    }
    
    if (percentage >= 80) {
      return <Badge variant="warning">Near Limit</Badge>;
    }
    
    return <Badge variant="success">On Track</Badge>;
  };

  const getTotalBudget = () => {
    return budgets.reduce((sum, b) => sum + b.amount, 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((sum, b) => sum + b.spent, 0);
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budgets</h1>
          <p className="text-gray-600 mt-1">{getMonthName(currentMonth)}</p>
        </div>
        
        <Button onClick={() => setShowModal(true)}>
          <ApperIcon name="Plus" size={18} />
          Add Budget
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ApperIcon name="DollarSign" size={20} className="text-primary-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Budget</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${getTotalBudget().toFixed(2)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ApperIcon name="TrendingDown" size={20} className="text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Total Spent</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${getTotalSpent().toFixed(2)}
          </p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg shadow-sm">
              <ApperIcon name="Wallet" size={20} className="text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600">Remaining</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            ${(getTotalBudget() - getTotalSpent()).toFixed(2)}
          </p>
        </Card>
      </div>

      {/* Budgets List */}
      {budgets.length === 0 ? (
        <Card className="p-8">
          <Empty
            icon="Target"
            title="No budgets set"
            message="Create your first budget to track spending by category"
            action={() => setShowModal(true)}
            actionLabel="Add Budget"
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map((budget, index) => (
            <motion.div
              key={budget.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <ApperIcon name={budget.categoryIcon} size={24} className="text-gray-700" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {budget.categoryName}
                      </h3>
                      {getStatusBadge(budget.spent, budget.amount)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(budget)}
                      className="p-2 text-gray-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      <ApperIcon name="Pencil" size={18} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(budget.Id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                    >
                      <ApperIcon name="Trash2" size={18} />
                    </button>
                  </div>
                </div>

                <ProgressBar
                  current={budget.spent}
                  total={budget.amount}
                  showLabel={true}
                />
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Budget Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={selectedBudget ? "Edit Budget" : "Add Budget"}
      >
        <BudgetForm
          budget={selectedBudget}
          monthKey={currentMonth}
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Budgets;