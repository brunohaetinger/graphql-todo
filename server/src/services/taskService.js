import { v4 as uuidv4 } from 'uuid';
import taskModel from '../models/taskModel.js';
import { pubsub, TASK_CREATED } from '../auth/pubsub.js';

export default {
  createTask: (title, user) => {
    const task = { id: uuidv4(), title, done: false, userId: user.id };
    taskModel.addTask(task);
    pubsub.publish(TASK_CREATED, { taskCreated: task });
    return task;
  },

  getMyTasks: (user) => taskModel.getTasksByUser(user.id),

  deleteTask: (id, user) => taskModel.deleteTaskById(id, user.id)
};
