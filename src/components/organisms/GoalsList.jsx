import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import ProgressBar from "@/components/molecules/ProgressBar";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Modal from "@/components/molecules/Modal";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import { goalService } from "@/services/api/goalService";
import { formatDate } from "@/utils/dateUtils";
import { differenceInDays } from "date-fns";

const GoalsList = ({ onAddClick }) => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");
  const [showContributionModal, setShowContributionModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    
    try {
      const data = await goalService.getActive();
      setGoals(data);
    } catch (err) {
      setError(err.message || "Failed to load goals");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    
    try {
      await goalService.delete(id);
      toast.success("Goal deleted successfully!");
      loadData();
    } catch (error) {
      toast.error("Failed to delete goal");
    }
  };

  const handleAddContribution = (goal) => {
    setSelectedGoal(goal);
    setContributionAmount("");
    setShowContributionModal(true);
  };

  const handleSubmitContribution = async () => {
    if (!contributionAmount || parseFloat(contributionAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    try {
      await goalService.addContribution(selectedGoal.Id, parseFloat(contributionAmount));
      toast.success("Contribution added successfully!");
      setShowContributionModal(false);
      loadData();
    } catch (error) {
      toast.error("Failed to add contribution");
    }
  };

  const getDaysRemaining = (deadline) => {
    return differenceInDays(new Date(deadline), new Date());
  };

  const getStatusBadge = (goal) => {
    const percentage = (goal.currentAmount / goal.targetAmount) * 100;
    const daysLeft = getDaysRemaining(goal.deadline);
    
    if (percentage >= 100) {
      return <Badge variant="success">Completed</Badge>;
    }
    
    if (daysLeft < 0) {
      return <Badge variant="danger">Overdue</Badge>;
    }
    
    if (daysLeft < 30) {
      return <Badge variant="warning">{daysLeft} days left</Badge>;
    }
    
    return <Badge variant="info">{daysLeft} days left</Badge>;
  };

  if (loading) return <Loading type="card" />;
  if (error) return <Error message={error} onRetry={loadData} />;
  if (goals.length === 0) {
    return (
      <Card className="p-8">
        <Empty
          icon="Target"
          title="No savings goals"
          message="Set your first savings goal and start building your future"
          action={onAddClick}
          actionLabel="Add Goal"
        />
      </Card>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map((goal, index) => (
          <motion.div
            key={goal.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {goal.name}
                  </h3>
                  {getStatusBadge(goal)}
                </div>
                
                <button
                  onClick={() => handleDelete(goal.Id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <ApperIcon name="Trash2" size={16} />
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Target</span>
                  <span className="font-semibold text-gray-900">
                    ${goal.targetAmount.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Deadline</span>
                  <span className="font-medium text-gray-700">
                    {formatDate(goal.deadline)}
                  </span>
                </div>

                <ProgressBar
                  current={goal.currentAmount}
                  total={goal.targetAmount}
                  showLabel={true}
                  variant="goal"
                />

                <Button
                  variant="primary"
                  size="sm"
                  fullWidth
                  onClick={() => handleAddContribution(goal)}
                  disabled={goal.currentAmount >= goal.targetAmount}
                >
                  <ApperIcon name="Plus" size={16} />
                  Add Contribution
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={showContributionModal}
        onClose={() => setShowContributionModal(false)}
        title="Add Contribution"
        size="sm"
      >
        {selectedGoal && (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Goal</p>
              <p className="font-semibold text-gray-900">{selectedGoal.name}</p>
            </div>

            <FormField label="Contribution Amount" required>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <Input
                  type="number"
                  step="0.01"
                  value={contributionAmount}
                  onChange={(e) => setContributionAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </FormField>

            <Button
              variant="primary"
              fullWidth
              onClick={handleSubmitContribution}
            >
              <ApperIcon name="Check" size={18} />
              Add Contribution
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
};

export default GoalsList;