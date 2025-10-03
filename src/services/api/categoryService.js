import categoriesData from "@/services/mockData/categories.json";

let categories = [...categoriesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const categoryService = {
  getAll: async () => {
    await delay(300);
    return [...categories];
  },

  getById: async (id) => {
    await delay(200);
    const category = categories.find(c => c.Id === parseInt(id));
    if (!category) throw new Error("Category not found");
    return { ...category };
  },

  getByType: async (type) => {
    await delay(200);
    return categories.filter(c => c.type === type).map(c => ({ ...c }));
  },

  create: async (categoryData) => {
    await delay(300);
    const maxId = Math.max(...categories.map(c => c.Id), 0);
    const newCategory = {
      Id: maxId + 1,
      ...categoryData,
      isDefault: false,
    };
    categories.push(newCategory);
    return { ...newCategory };
  },

  update: async (id, categoryData) => {
    await delay(300);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Category not found");
    
    categories[index] = {
      ...categories[index],
      ...categoryData,
      Id: categories[index].Id,
    };
    
    return { ...categories[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = categories.findIndex(c => c.Id === parseInt(id));
    if (index === -1) throw new Error("Category not found");
    
    const category = categories[index];
    if (category.isDefault) {
      throw new Error("Cannot delete default category");
    }
    
    categories.splice(index, 1);
    return true;
  },
};