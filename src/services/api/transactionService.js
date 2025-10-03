import transactionsData from "@/services/mockData/transactions.json";

let transactions = [...transactionsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const transactionService = {
  getAll: async () => {
    await delay(300);
    return [...transactions].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },

  getById: async (id) => {
    await delay(200);
    const transaction = transactions.find(t => t.Id === parseInt(id));
    if (!transaction) throw new Error("Transaction not found");
    return { ...transaction };
  },

  getByMonth: async (monthKey) => {
    await delay(300);
    return transactions
      .filter(t => t.date.startsWith(monthKey))
      .map(t => ({ ...t }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  getByDateRange: async (startDate, endDate) => {
    await delay(300);
    return transactions
      .filter(t => {
        const date = new Date(t.date);
        return date >= startDate && date <= endDate;
      })
      .map(t => ({ ...t }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  create: async (transactionData) => {
    await delay(300);
    const maxId = Math.max(...transactions.map(t => t.Id), 0);
    const newTransaction = {
      Id: maxId + 1,
      ...transactionData,
      createdAt: new Date().toISOString(),
    };
    transactions.push(newTransaction);
    return { ...newTransaction };
  },

  update: async (id, transactionData) => {
    await delay(300);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Transaction not found");
    
    transactions[index] = {
      ...transactions[index],
      ...transactionData,
      Id: transactions[index].Id,
      createdAt: transactions[index].createdAt,
    };
    
    return { ...transactions[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = transactions.findIndex(t => t.Id === parseInt(id));
    if (index === -1) throw new Error("Transaction not found");
    
    transactions.splice(index, 1);
    return true;
  },

  getSummaryByMonth: async (monthKey) => {
    await delay(300);
    const monthTransactions = transactions.filter(t => t.date.startsWith(monthKey));
    
    const income = monthTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = monthTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      income,
      expenses,
      net: income - expenses,
    };
  },

  getCategoryBreakdown: async (monthKey) => {
    await delay(300);
    const monthTransactions = transactions
      .filter(t => t.date.startsWith(monthKey) && t.type === "expense");
    
    const breakdown = {};
    
    monthTransactions.forEach(t => {
      if (!breakdown[t.category]) {
        breakdown[t.category] = 0;
      }
      breakdown[t.category] += t.amount;
    });
    
    return Object.entries(breakdown).map(([category, amount]) => ({
      category,
      amount,
    }));
  },
};