import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Select from "@/components/atoms/Select";
import Label from "@/components/atoms/Label";
import ApperIcon from "@/components/ApperIcon";
import { categoryService } from "@/services/api/categoryService";
import { transactionService } from "@/services/api/transactionService";

const TransactionForm = ({ onSuccess, onCancel, transaction = null }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    amount: transaction?.amount || "",
    type: transaction?.type || "expense",
    category: transaction?.category || "",
    date: transaction?.date?.split("T")[0] || new Date().toISOString().split("T")[0],
    notes: transaction?.notes || "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
  }, [formData.type]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getByType(formData.type);
      setCategories(data);
      
if (!formData.category && data.length > 0) {
        setFormData(prev => ({ ...prev, category: data[0].Name }));
      }
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Please enter a valid amount";
    }
    
    if (!formData.category) {
      newErrors.category = "Please select a category";
    }
    
    if (!formData.date) {
      newErrors.date = "Please select a date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const transactionData = {
        ...formData,
        amount: parseFloat(formData.amount),
        date: new Date(formData.date).toISOString(),
      };
      
      if (transaction) {
        await transactionService.update(transaction.Id, transactionData);
        toast.success("Transaction updated successfully!");
      } else {
        await transactionService.create(transactionData);
        toast.success("Transaction added successfully!");
      }
      
      onSuccess?.();
    } catch (error) {
      toast.error(error.message || "Failed to save transaction");
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
      <div className="grid grid-cols-2 gap-4">
        <button
          type="button"
          onClick={() => handleChange("type", "expense")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            formData.type === "expense"
              ? "border-red-500 bg-red-50 text-red-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <ApperIcon name="ArrowDownCircle" size={24} className="mx-auto mb-2" />
          <span className="font-medium">Expense</span>
        </button>
        
        <button
          type="button"
          onClick={() => handleChange("type", "income")}
          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
            formData.type === "income"
              ? "border-primary-500 bg-primary-50 text-primary-700"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
          }`}
        >
          <ApperIcon name="ArrowUpCircle" size={24} className="mx-auto mb-2" />
          <span className="font-medium">Income</span>
        </button>
      </div>

      <FormField
        label="Amount"
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

      <FormField label="Category" required error={errors.category}>
        <Select
          value={formData.category}
          onChange={(e) => handleChange("category", e.target.value)}
          error={errors.category}
        >
          <option value="">Select category</option>
{categories.map((cat) => (
            <option key={cat.Id} value={cat.Name}>
              {cat.Name}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label="Date"
        required
        error={errors.date}
      >
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          error={errors.date}
        />
      </FormField>

      <FormField label="Notes">
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          rows={3}
          placeholder="Add notes (optional)"
          className="w-full px-4 py-2.5 text-base border-2 border-gray-200 rounded-lg transition-colors duration-200 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 placeholder:text-gray-400 resize-none"
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
              {transaction ? "Update" : "Add"} Transaction
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

export default TransactionForm;