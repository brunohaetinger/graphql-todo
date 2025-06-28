import db from '../models/index.js';
import userService from '../services/userService.js';
import taskService from '../services/taskService.js';
import { pubsub, TASK_CREATED } from '../auth/pubsub.js';
import { refreshAccessToken } from '../auth/auth.js';

export default {
  Query: {
    me: async (_, __, { user }) => await db.User.findOne({where: {userId: user?.id}}),
    myTasks: (_, __, { user }) => taskService.getMyTasks(user)
  },

  Mutation: {
    register: async (_, { email, password }) => {
      const { accessToken, refreshToken, user } = await userService.register(email, password);
      return { accessToken, refreshToken, user };
    },
    login: async (_, { email, password }) => {
      const { accessToken, refreshToken, user } = await userService.login(email, password);
      return { accessToken, refreshToken, user };
    },
    refreshToken: (_, { refreshToken: oldRefreshToken }) => {
      const newAccessToken = refreshAccessToken(oldRefreshToken);
      if (!newAccessToken) throw new Error('Invalid or expired refresh token');
      return { accessToken: newAccessToken };
    },
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
