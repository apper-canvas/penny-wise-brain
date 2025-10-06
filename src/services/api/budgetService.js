import { toast } from "react-toastify";

export const budgetService = {
  getAll: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "spent_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets:", error);
      return [];
    }
  },

  getById: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "spent_c"}}
        ]
      };

      const response = await apperClient.getRecordById('budget_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Budget not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching budget ${id}:`, error);
      throw error;
    }
  },

  getByMonth: async (monthKey) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "category_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "month_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "spent_c"}}
        ],
        where: [
          {"FieldName": "month_c", "Operator": "EqualTo", "Values": [monthKey]}
        ]
      };

      const response = await apperClient.fetchRecords('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching budgets by month:", error);
      return [];
    }
  },

  create: async (budgetData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          category_id_c: parseInt(budgetData.categoryId),
          month_c: budgetData.month,
          amount_c: parseFloat(budgetData.amount),
          spent_c: 0
        }]
      };

      const response = await apperClient.createRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create budget");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create budget");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating budget:", error);
      throw error;
    }
  },

  update: async (id, budgetData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          category_id_c: parseInt(budgetData.categoryId),
          month_c: budgetData.month,
          amount_c: parseFloat(budgetData.amount),
          spent_c: parseFloat(budgetData.spent || 0)
        }]
      };

      const response = await apperClient.updateRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update budget");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update budget");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        RecordIds: [id]
      };

      const response = await apperClient.deleteRecord('budget_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} budgets:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      return false;
    }
  },

  updateSpent: async (monthKey) => {
    try {
      const budgets = await budgetService.getByMonth(monthKey);
      return budgets;
    } catch (error) {
      console.error("Error updating spent amounts:", error);
      return [];
    }
  },
};