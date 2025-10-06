import { toast } from "react-toastify";

export const goalService = {
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "status_c"}}
        ],
        orderBy: [{"fieldName": "deadline_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching goals:", error);
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
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "status_c"}}
        ]
      };

      const response = await apperClient.getRecordById('goal_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Goal not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching goal ${id}:`, error);
      throw error;
    }
  },

  getActive: async () => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "target_amount_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "deadline_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "status_c"}}
        ],
        where: [
          {"FieldName": "status_c", "Operator": "EqualTo", "Values": ["active"]}
        ],
        orderBy: [{"fieldName": "deadline_c", "sorttype": "ASC"}]
      };

      const response = await apperClient.fetchRecords('goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching active goals:", error);
      return [];
    }
  },

  create: async (goalData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name_c: goalData.name,
          target_amount_c: parseFloat(goalData.targetAmount),
          current_amount_c: parseFloat(goalData.currentAmount || 0),
          deadline_c: goalData.deadline,
          created_at_c: new Date().toISOString(),
          status_c: "active"
        }]
      };

      const response = await apperClient.createRecord('goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create goal");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create goal");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating goal:", error);
      throw error;
    }
  },

  update: async (id, goalData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const currentAmount = parseFloat(goalData.currentAmount);
      const targetAmount = parseFloat(goalData.targetAmount);
      const status = currentAmount >= targetAmount ? "completed" : "active";

      const params = {
        records: [{
          Id: id,
          name_c: goalData.name,
          target_amount_c: targetAmount,
          current_amount_c: currentAmount,
          deadline_c: goalData.deadline,
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord('goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update goal");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update goal");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating goal:", error);
      throw error;
    }
  },

  addContribution: async (id, amount) => {
    try {
      const goal = await goalService.getById(id);
      const newCurrentAmount = goal.current_amount_c + amount;
      const status = newCurrentAmount >= goal.target_amount_c ? "completed" : "active";

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          current_amount_c: newCurrentAmount,
          status_c: status
        }]
      };

      const response = await apperClient.updateRecord('goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to add contribution");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to add contribution to ${failed.length} goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to add contribution");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error adding contribution:", error);
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

      const response = await apperClient.deleteRecord('goal_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} goals:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
      return false;
    }
  },
};