import { toast } from "react-toastify";

export const categoryService = {
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "is_default_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      };

      const response = await apperClient.fetchRecords('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories:", error);
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "is_default_c"}},
          {"field": {"Name": "icon_c"}}
        ]
      };

      const response = await apperClient.getRecordById('category_c', id, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Category not found");
      }

      return response.data;
    } catch (error) {
      console.error(`Error fetching category ${id}:`, error);
      throw error;
    }
  },

  getByType: async (type) => {
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
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "color_c"}},
          {"field": {"Name": "is_default_c"}},
          {"field": {"Name": "icon_c"}}
        ],
        where: [
          {"FieldName": "type_c", "Operator": "EqualTo", "Values": [type]}
        ]
      };

      const response = await apperClient.fetchRecords('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching categories by type:", error);
      return [];
    }
  },

  create: async (categoryData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          name_c: categoryData.name_c,
          type_c: categoryData.type_c,
          color_c: categoryData.color_c,
          is_default_c: categoryData.is_default_c || false,
          icon_c: categoryData.icon_c
        }]
      };

      const response = await apperClient.createRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to create category");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to create category");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  update: async (id, categoryData) => {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const params = {
        records: [{
          Id: id,
          name_c: categoryData.name_c,
          type_c: categoryData.type_c,
          color_c: categoryData.color_c,
          is_default_c: categoryData.is_default_c,
          icon_c: categoryData.icon_c
        }]
      };

      const response = await apperClient.updateRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error("Failed to update category");
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          throw new Error("Failed to update category");
        }

        return successful[0]?.data;
      }
    } catch (error) {
      console.error("Error updating category:", error);
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

      const response = await apperClient.deleteRecord('category_c', params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to delete ${failed.length} categories:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
          return false;
        }

        return true;
      }
    } catch (error) {
      console.error("Error deleting category:", error);
      return false;
    }
  },
};