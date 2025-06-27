import userModel from '../models/userModel.js';
import userService from '../services/userService.js';
import taskService from '../services/taskService.js';
import { pubsub, TASK_CREATED } from '../auth/pubsub.js';

export default {
  Query: {
    me: (_, __, { user }) => userModel.getUserById(user?.id),
    myTasks: (_, __, { user }) => taskService.getMyTasks(user)
  },

  Mutation: {
    register: (_, { email, password }) => userService.register(email, password),
    login: (_, { email, password }) => userService.login(email, password),
    createTask: (_, { title }, { user }) => {
      pubsub.publish(TASK_CREATED)
      taskService.createTask(title, user)
    },
    deleteTask: (_, { id }, { user }) => taskService.deleteTask(id, user)
  },

  Subscription: {
    taskCreated: {
      subscribe: () => pubsub.asyncIterator([TASK_CREATED])
    }
  }
};
