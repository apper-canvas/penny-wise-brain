import { useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { transactionService } from "@/services/api/transactionService";
import { getLastSixMonths } from "@/utils/dateUtils";

const TrendLineChart = () => {
  const [data, setData] = useState({ income: [], expenses: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const months = getLastSixMonths();
      const incomeData = [];
      const expenseData = [];
      
      for (const month of months) {
        const summary = await transactionService.getSummaryByMonth(month.key);
        incomeData.push(summary.income);
        expenseData.push(summary.expenses);
      }
      
      setData({ income: incomeData, expenses: expenseData });
    } catch (err) {
      setError(err.message || "Failed to load trend data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading type="chart" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const months = getLastSixMonths();

  const chartOptions = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    xaxis: {
      categories: months.map(m => m.short),
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontFamily: "Inter, sans-serif",
        },
        formatter: function (val) {
          return "$" + val.toFixed(0);
        },
      },
    },
    colors: ["#10b981", "#ef4444"],
    legend: {
      position: "top",
      horizontalAlign: "right",
      fontSize: "14px",
      fontFamily: "Inter, sans-serif",
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return "$" + val.toFixed(2);
        },
      },
    },
  };

  const series = [
    {
      name: "Income",
      data: data.income,
    },
    {
      name: "Expenses",
      data: data.expenses,
    },
  ];

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-secondary-100 rounded-lg">
          <ApperIcon name="TrendingUp" size={20} className="text-secondary-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Income vs Expenses Trend</h3>
      </div>
      
      <ReactApexChart
        options={chartOptions}
        series={series}
        type="line"
        height={350}
      />
    </Card>
  );
};

export default TrendLineChart;