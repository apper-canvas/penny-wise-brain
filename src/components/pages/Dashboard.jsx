import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import MetricCard from "@/components/molecules/MetricCard";
import ExpensePieChart from "@/components/organisms/ExpensePieChart";
import TrendLineChart from "@/components/organisms/TrendLineChart";
import RecentTransactions from "@/components/organisms/RecentTransactions";
import BudgetList from "@/components/organisms/BudgetList";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import TransactionForm from "@/components/organisms/TransactionForm";
import ApperIcon from "@/components/ApperIcon";
import { transactionService } from "@/services/api/transactionService";
import { goalService } from "@/services/api/goalService";
import { getCurrentMonthKey, getMonthName } from "@/utils/dateUtils";

const Dashboard = () => {
  const [currentMonth, setCurrentMonth] = useState(getCurrentMonthKey());
  const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0 });
  const [goalsCount, setGoalsCount] = useState(0);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    loadSummary();
    loadGoals();
  }, [currentMonth, refreshKey]);

  const loadSummary = async () => {
    try {
      const data = await transactionService.getSummaryByMonth(currentMonth);
      setSummary(data);
    } catch (error) {
      console.error("Failed to load summary:", error);
    }
  };

  const loadGoals = async () => {
    try {
      const data = await goalService.getActive();
      setGoalsCount(data.length);
    } catch (error) {
      console.error("Failed to load goals:", error);
    }
  };

  const handleTransactionSuccess = () => {
    setShowTransactionModal(false);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">{getMonthName(currentMonth)}</p>
        </div>
        
        <Button onClick={() => setShowTransactionModal(true)}>
          <ApperIcon name="Plus" size={18} />
          Add Transaction
        </Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Income"
          value={summary.income}
          icon="TrendingUp"
          bgGradient="from-green-50 to-green-100"
          iconColor="text-green-600"
        />
        
        <MetricCard
          title="Total Expenses"
          value={summary.expenses}
          icon="TrendingDown"
          bgGradient="from-red-50 to-red-100"
          iconColor="text-red-600"
        />
        
        <MetricCard
          title="Net Savings"
          value={summary.net}
          icon="Wallet"
          bgGradient="from-primary-50 to-primary-100"
          iconColor="text-primary-600"
        />
        
        <MetricCard
          title="Active Goals"
          value={goalsCount}
          icon="Target"
          bgGradient="from-accent-50 to-accent-100"
          iconColor="text-accent-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart monthKey={currentMonth} key={`pie-${refreshKey}`} />
        <TrendLineChart key={`line-${refreshKey}`} />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentTransactions
          monthKey={currentMonth}
          onAddClick={() => setShowTransactionModal(true)}
          key={`transactions-${refreshKey}`}
        />
        <BudgetList
          monthKey={currentMonth}
          key={`budgets-${refreshKey}`}
        />
      </div>

      {/* Transaction Modal */}
      <Modal
        isOpen={showTransactionModal}
        onClose={() => setShowTransactionModal(false)}
        title="Add Transaction"
      >
        <TransactionForm
          onSuccess={handleTransactionSuccess}
          onCancel={() => setShowTransactionModal(false)}
        />
      </Modal>
    </div>
  );
};

export default Dashboard;