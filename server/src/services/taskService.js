import db from '../models/index.js';
import { pubsub, TASK_CREATED } from '../auth/pubsub.js';

export default {
  createTask: async (title, user) => {
    const task = await db.Task.create({ title, done: false, userId: user.id });
    pubsub.publish(TASK_CREATED, { taskCreated: task });
    return task;
  },

  getMyTasks: async(user) => {
    if (!user || !user.id) {
      throw new Error('Authentication required to fetch tasks.');
    }
    return await db.Task.findAll({where: {userId: user.id}});
  },

  deleteTask: async (id, user) => {
    const deleted = await db.Task.destroy({where: { id, userId: user.id }});
    return deleted > 0;
  },
};
