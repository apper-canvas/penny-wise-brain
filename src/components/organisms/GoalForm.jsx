import { useState } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { goalService } from "@/services/api/goalService";

const GoalForm = ({ onSuccess, onCancel, goal = null }) => {
  const [formData, setFormData] = useState({
    name: goal?.name || "",
    targetAmount: goal?.targetAmount || "",
    currentAmount: goal?.currentAmount || "",
    deadline: goal?.deadline?.split("T")[0] || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Please enter a goal name";
    }
    
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Please enter a valid target amount";
    }
    
    if (formData.currentAmount && parseFloat(formData.currentAmount) < 0) {
      newErrors.currentAmount = "Current amount cannot be negative";
    }
    
    if (!formData.deadline) {
      newErrors.deadline = "Please select a deadline";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const goalData = {
        name: formData.name.trim(),
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        deadline: new Date(formData.deadline).toISOString(),
      };
      
      if (goal) {
        await goalService.update(goal.Id, goalData);
        toast.success("Goal updated successfully!");
      } else {
        await goalService.create(goalData);
        toast.success("Goal created successfully!");
      }
      
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to save goal");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormField
        label="Goal Name"
        required
        error={errors.name}
      >
        <Input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          placeholder="e.g., Emergency Fund, Vacation"
          error={errors.name}
        />
      </FormField>

      <FormField
        label="Target Amount"
        required
        error={errors.targetAmount}
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            type="number"
            step="0.01"
            value={formData.targetAmount}
            onChange={(e) => handleChange("targetAmount", e.target.value)}
            placeholder="0.00"
            className="pl-8"
            error={errors.targetAmount}
          />
        </div>
      </FormField>

      <FormField
        label="Current Amount"
        error={errors.currentAmount}
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            type="number"
            step="0.01"
            value={formData.currentAmount}
            onChange={(e) => handleChange("currentAmount", e.target.value)}
            placeholder="0.00"
            className="pl-8"
            error={errors.currentAmount}
          />
        </div>
      </FormField>

      <FormField
        label="Target Date"
        required
        error={errors.deadline}
      >
        <Input
          type="date"
          value={formData.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
          min={new Date().toISOString().split("T")[0]}
          error={errors.deadline}
        />
      </FormField>

      <div className="flex gap-3 pt-4">
        <Button
          type="submit"
          variant="primary"
          fullWidth
          disabled={loading}
        >
          {loading ? (
            <>
              <ApperIcon name="Loader2" size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <ApperIcon name="Check" size={18} />
              {goal ? "Update" : "Create"} Goal
            </>
          )}
        </Button>
        
        {onCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default GoalForm;