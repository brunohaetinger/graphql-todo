const tasks = [];

export default {
  getTasksByUser: (userId) => tasks.filter(t => t.userId === userId),
  addTask: (task) => tasks.push(task),
  deleteTaskById: (id, userId) => {
    const index = tasks.findIndex(t => t.id === id && t.userId === userId);
    if (index !== -1) tasks.splice(index, 1);
    return index !== -1;
  }
};
