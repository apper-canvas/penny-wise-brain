import budgetsData from "@/services/mockData/budgets.json";
import { transactionService } from "./transactionService";

let budgets = [...budgetsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const budgetService = {
  getAll: async () => {
    await delay(300);
    return [...budgets];
  },

  getById: async (id) => {
    await delay(200);
    const budget = budgets.find(b => b.Id === parseInt(id));
    if (!budget) throw new Error("Budget not found");
    return { ...budget };
  },

  getByMonth: async (monthKey) => {
    await delay(300);
    return budgets
      .filter(b => b.month === monthKey)
      .map(b => ({ ...b }));
  },

  create: async (budgetData) => {
    await delay(300);
    const maxId = Math.max(...budgets.map(b => b.Id), 0);
    const newBudget = {
      Id: maxId + 1,
      ...budgetData,
      spent: 0,
    };
    budgets.push(newBudget);
    return { ...newBudget };
  },

  update: async (id, budgetData) => {
    await delay(300);
    const index = budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) throw new Error("Budget not found");
    
    budgets[index] = {
      ...budgets[index],
      ...budgetData,
      Id: budgets[index].Id,
    };
    
    return { ...budgets[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = budgets.findIndex(b => b.Id === parseInt(id));
    if (index === -1) throw new Error("Budget not found");
    
    budgets.splice(index, 1);
    return true;
  },

  updateSpent: async (monthKey) => {
    await delay(300);
    const monthTransactions = await transactionService.getByMonth(monthKey);
    
    const categorySpending = {};
    monthTransactions
      .filter(t => t.type === "expense")
      .forEach(t => {
        categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
      });
    
    budgets.forEach(budget => {
      if (budget.month === monthKey) {
        // Need to get category name from categoryId
        const spent = Object.entries(categorySpending).find(
          ([category]) => category === budget.categoryId
        );
        budget.spent = spent ? spent[1] : 0;
      }
    });
    
    return [...budgets].filter(b => b.month === monthKey);
  },
};