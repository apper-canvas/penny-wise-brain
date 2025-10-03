import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { transactionService } from "@/services/api/transactionService";
import { getCategoryColor } from "@/utils/categoryColors";

const ExpensePieChart = ({ monthKey }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, [monthKey]);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const breakdown = await transactionService.getCategoryBreakdown(monthKey);
      setData(breakdown);
    } catch (err) {
      setError(err.message || "Failed to load expense data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="chart" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (data.length === 0) {
    return (
      <Card className="p-8">
        <Empty
          icon="PieChart"
          title="No expenses yet"
          message="Add your first expense to see the breakdown"
        />
      </Card>
    );
  }

  const chartOptions = {
    chart: {
      type: "pie",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    labels: data.map(item => item.category),
    colors: data.map(item => getCategoryColor(item.category)),
    legend: {
      position: "bottom",
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
      offsetY: 10,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return val.toFixed(1) + "%";
      },
      style: {
        fontSize: "12px",
        fontWeight: 600,
      },
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val.toFixed(2);
        },
      },
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          height: 300,
        },
        legend: {
          position: "bottom",
        },
      },
    }],
  };

  const series = data.map(item => item.amount);

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-primary-100 rounded-lg">
          <ApperIcon name="PieChart" size={20} className="text-primary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Expense Breakdown</h3>
      </div>
      
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="pie"
        height={350}
      />
    </Card>
  );
};

export default ExpensePieChart;