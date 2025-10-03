import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { budgetService } from "@/services/api/budgetService";
import { getCurrentMonthKey } from "@/utils/dateUtils";

const BudgetForm = ({ onSuccess, onCancel, budget = null, monthKey }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    categoryId: budget?.categoryId || "",
    amount: budget?.amount || "",
    month: budget?.month || monthKey || getCurrentMonthKey(),
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getByType("expense");
      setCategories(data);
      
      if (!formData.categoryId && data.length > 0) {
        setFormData(prev => ({ ...prev, categoryId: data[0].Id }));
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid budget amount";
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const budgetData = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        amount: parseFloat(formData.amount),
      };
      
      if (budget) {
        await budgetService.update(budget.Id, budgetData);
        toast.success("Budget updated successfully!");
      } else {
        await budgetService.create(budgetData);
        toast.success("Budget created successfully!");
      }
      
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to save budget");
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
      <FormField label="Category" required error={errors.categoryId}>
        <Select
          value={formData.categoryId}
          onChange={(e) => handleChange("categoryId", e.target.value)}
          error={errors.categoryId}
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.Id} value={cat.Id}>
              {cat.name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Budget Amount"
        required
        error={errors.amount}
      >
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <Input
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="0.00"
            className="pl-8"
            error={errors.amount}
          />
        </div>
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
              {budget ? "Update" : "Create"} Budget
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

export default BudgetForm;