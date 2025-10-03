import { useState } from "react";
import Button from "@/components/atoms/Button";
import Modal from "@/components/molecules/Modal";
import GoalForm from "@/components/organisms/GoalForm";
import GoalsList from "@/components/organisms/GoalsList";
import ApperIcon from "@/components/ApperIcon";

const Goals = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedGoal(null);
  };

  const handleSuccess = () => {
    handleModalClose();
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Savings Goals</h1>
          <p className="text-gray-600 mt-1">Track your progress towards financial goals</p>
        </div>
        
        <Button onClick={() => setShowModal(true)}>
          <ApperIcon name="Plus" size={18} />
          Add Goal
        </Button>
      </div>

      <GoalsList 
        onAddClick={() => setShowModal(true)} 
        key={refreshKey}
      />

      {/* Goal Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleModalClose}
        title={selectedGoal ? "Edit Goal" : "Add Goal"}
      >
        <GoalForm
          goal={selectedGoal}
          onSuccess={handleSuccess}
          onCancel={handleModalClose}
        />
      </Modal>
    </div>
  );
};

export default Goals;