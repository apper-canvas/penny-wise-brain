import { toast } from "react-toastify";

export const transactionService = {
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };

      const response = await apperClient.getRecordById('transaction_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Transaction not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction ${id}:`, error);
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
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        where: [
          {"FieldName": "date_c", "Operator": "StartsWith", "Values": [monthKey]}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions by month:", error);
      return [];
    }
  },

  getByDateRange: async (startDate, endDate) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const startStr = startDate.toISOString().split('T')[0];
      const endStr = endDate.toISOString().split('T')[0];

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "category_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {
              "conditions": [
                {"fieldName": "date_c", "operator": "GreaterThanOrEqualTo", "values": [startStr]}
              ]
            },
            {
              "conditions": [
                {"fieldName": "date_c", "operator": "LessThanOrEqualTo", "values": [endStr]}
              ]
            }
          ]
        }],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      };

      const response = await apperClient.fetchRecords('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching transactions by date range:", error);
      return [];
    }
  },

  create: async (transactionData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const categoryResponse = await apperClient.fetchRecords('category_c', {
        fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "name_c"}}],
        where: [{"FieldName": "name_c", "Operator": "EqualTo", "Values": [transactionData.category]}]
      });

      let categoryId = null;
      if (categoryResponse.success && categoryResponse.data && categoryResponse.data.length > 0) {
        categoryId = categoryResponse.data[0].Id;
      }

      const params = {
        records: [{
          amount_c: parseFloat(transactionData.amount),
          type_c: transactionData.type,
          category_c: categoryId,
          date_c: transactionData.date,
          notes_c: transactionData.notes || "",
          created_at_c: new Date().toISOString()
        }]
      };

      const response = await apperClient.createRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create transaction");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create transaction");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  update: async (id, transactionData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const categoryResponse = await apperClient.fetchRecords('category_c', {
        fields: [{"field": {"Name": "Id"}}, {"field": {"Name": "name_c"}}],
        where: [{"FieldName": "name_c", "Operator": "EqualTo", "Values": [transactionData.category]}]
      });

      let categoryId = null;
      if (categoryResponse.success && categoryResponse.data && categoryResponse.data.length > 0) {
        categoryId = categoryResponse.data[0].Id;
      }

      const params = {
        records: [{
          Id: id,
          amount_c: parseFloat(transactionData.amount),
          type_c: transactionData.type,
          category_c: categoryId,
          date_c: transactionData.date,
          notes_c: transactionData.notes || ""
        }]
      };

      const response = await apperClient.updateRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update transaction");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update transaction");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating transaction:", error);
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

      const response = await apperClient.deleteRecord('transaction_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} transactions:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
      return false;
    }
  },

  getSummaryByMonth: async (monthKey) => {
    try {
      const transactions = await transactionService.getByMonth(monthKey);

      const income = transactions
        .filter(t => t.type_c === "income")
        .reduce((sum, t) => sum + t.amount_c, 0);

      const expenses = transactions
        .filter(t => t.type_c === "expense")
        .reduce((sum, t) => sum + t.amount_c, 0);

      return {
        income,
        expenses,
        net: income - expenses,
      };
    } catch (error) {
      console.error("Error getting summary by month:", error);
      return { income: 0, expenses: 0, net: 0 };
    }
  },

  getCategoryBreakdown: async (monthKey) => {
    try {
      const transactions = await transactionService.getByMonth(monthKey);
      const monthTransactions = transactions.filter(t => t.type_c === "expense");

      const breakdown = {};

      monthTransactions.forEach(t => {
        const categoryName = t.category_c?.Name || "Unknown";
        if (!breakdown[categoryName]) {
          breakdown[categoryName] = 0;
        }
        breakdown[categoryName] += t.amount_c;
      });

      return Object.entries(breakdown).map(([category, amount]) => ({
        category,
        amount,
      }));
    } catch (error) {
      console.error("Error getting category breakdown:", error);
      return [];
    }
  },
};