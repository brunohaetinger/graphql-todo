import { v4 as uuidv4 } from 'uuid';
import db from '../models/index.js';
import { pubsub, TASK_CREATED } from '../auth/pubsub.js';

export default {
  createTask: async (title, user) => {
    const task = await db.Task.create({ title, done: false, userId: user.id });
    pubsub.publish(TASK_CREATED, { taskCreated: task });
    return task;
  },

  getMyTasks: async(user) => await db.Task.findAll({where: {userId: user.id}}),

  deleteTask: async (id, user) => {
    const deleted = await db.Task.destroy({where: { id, userId: user.id }});
    return deleted > 0;
  },
};
