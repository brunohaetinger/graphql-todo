import db from '../models/index.js';
import userService from '../services/userService.js';
import taskService from '../services/taskService.js';
import { pubsub, TASK_CREATED } from '../auth/pubsub.js';

export default {
  Query: {
    me: async (_, __, { user }) => await db.User.findOne({where: {userId: user?.id}}),
    myTasks: (_, __, { user }) => taskService.getMyTasks(user)
  },

  Mutation: {
    register: (_, { email, password }) => userService.register(email, password),
    login: (_, { email, password }) => userService.login(email, password),
    createTask: async (_, { title }, { user }) => {
      const task = await taskService.createTask(title, user);
      pubsub.publish(TASK_CREATED, { taskCreated: task });
      return task;
    },
    deleteTask: (_, { id }, { user }) => taskService.deleteTask(id, user)
  },

  Subscription: {
    taskCreated: {
      subscribe: () => pubsub.asyncIterator([TASK_CREATED])
    }
  }
};
