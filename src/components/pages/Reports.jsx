import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import ExpensePieChart from "@/components/organisms/ExpensePieChart";
import TrendLineChart from "@/components/organisms/TrendLineChart";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { transactionService } from "@/services/api/transactionService";
import { getCurrentMonthKey, getMonthName, getLastSixMonths } from "@/utils/dateUtils";
import { formatCurrency } from "@/utils/formatCurrency";

const Reports = () => {
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthKey());
  const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0 });
  const [topCategories, setTopCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [selectedMonth]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const [summaryData, breakdown] = await Promise.all([
        transactionService.getSummaryByMonth(selectedMonth),
        transactionService.getCategoryBreakdown(selectedMonth),
      ]);
      
      setSummary(summaryData);
      setTopCategories(breakdown.sort((a, b) => b.amount - a.amount).slice(0, 5));
    } catch (err) {
      setError(err.message || "Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const getSavingsRate = () => {
    if (summary.income === 0) return 0;
    return ((summary.net / summary.income) * 100).toFixed(1);
  };

  const getSpendingRate = () => {
    if (summary.income === 0) return 0;
    return ((summary.expenses / summary.income) * 100).toFixed(1);
  };

  if (loading) return <Loading type="page" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const months = getLastSixMonths();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Analyze your financial patterns</p>
        </div>
        
        <div className="w-full sm:w-64">
          <Select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            {months.map((month) => (
              <option key={month.key} value={month.key}>
                {month.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ApperIcon name="TrendingUp" size={20} className="text-green-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Income</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.income)}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6 bg-gradient-to-br from-red-50 to-red-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ApperIcon name="TrendingDown" size={20} className="text-red-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Expenses</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(summary.expenses)}
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 bg-gradient-to-br from-primary-50 to-primary-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ApperIcon name="PiggyBank" size={20} className="text-primary-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Savings Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {getSavingsRate()}%
            </p>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-gradient-to-br from-accent-50 to-accent-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <ApperIcon name="Percent" size={20} className="text-accent-600" />
              </div>
              <h3 className="text-sm font-medium text-gray-600">Spending Rate</h3>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {getSpendingRate()}%
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ExpensePieChart monthKey={selectedMonth} />
        <TrendLineChart />
      </div>

      {/* Top Spending Categories */}
      {topCategories.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-accent-100 rounded-lg">
              <ApperIcon name="BarChart3" size={20} className="text-accent-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Top Spending Categories</h3>
          </div>

          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-gray-400">
                    #{index + 1}
                  </span>
                  <span className="font-medium text-gray-900">
                    {category.category}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrency(category.amount)}
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reports;