import goalsData from "@/services/mockData/goals.json";

let goals = [...goalsData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const goalService = {
  getAll: async () => {
    await delay(300);
    return [...goals].sort((a, b) => 
      new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    );
  },

  getById: async (id) => {
    await delay(200);
    const goal = goals.find(g => g.Id === parseInt(id));
    if (!goal) throw new Error("Goal not found");
    return { ...goal };
  },

  getActive: async () => {
    await delay(300);
    return goals
      .filter(g => g.status === "active")
      .map(g => ({ ...g }))
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  },

  create: async (goalData) => {
    await delay(300);
    const maxId = Math.max(...goals.map(g => g.Id), 0);
    const newGoal = {
      Id: maxId + 1,
      ...goalData,
      currentAmount: goalData.currentAmount || 0,
      createdAt: new Date().toISOString(),
      status: "active",
    };
    goals.push(newGoal);
    return { ...newGoal };
  },

  update: async (id, goalData) => {
    await delay(300);
    const index = goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Goal not found");
    
    const updatedGoal = {
      ...goals[index],
      ...goalData,
      Id: goals[index].Id,
      createdAt: goals[index].createdAt,
    };
    
    if (updatedGoal.currentAmount >= updatedGoal.targetAmount) {
      updatedGoal.status = "completed";
    }
    
    goals[index] = updatedGoal;
    return { ...updatedGoal };
  },

  addContribution: async (id, amount) => {
    await delay(300);
    const index = goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Goal not found");
    
    goals[index].currentAmount += amount;
    
    if (goals[index].currentAmount >= goals[index].targetAmount) {
      goals[index].status = "completed";
    }
    
    return { ...goals[index] };
  },

  delete: async (id) => {
    await delay(300);
    const index = goals.findIndex(g => g.Id === parseInt(id));
    if (index === -1) throw new Error("Goal not found");
    
    goals.splice(index, 1);
    return true;
  },
};