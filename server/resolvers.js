import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { PubSub } from 'graphql-subscriptions';
import {users, tasks} from './users.js';
import {generateToken} from './auth.js';

const pubsub = new PubSub();

const TASK_CREATED = 'TASK_CREATED';

const resolvers = {
    Query: {
        me: (_, __, {user}) => users.find(u => u.id === user?.id),
        myTasks: (_, __, {user}) => tasks.filter(t => t.userId === user?.id),
    },

    Mutation: {
        register: async (_, {email, password}) => {
            if(users.find(u => u.email === email)) throw new Error('User already exists');
            const hashed = await bcrypt.hash(password, 10); // Password hashed with salt
            const user = { id: uuidv4(), email, password: hashed};
            users.push(user);
            const token = generateToken(user);
            return { token, user };
        },
        login: async(_, {email, password}) => {
            const user = users.find(u => u.email === email);
            if(!user) throw new Error('User not found');
            const valid = await bcrypt.compare(password, user.password);
            if(!valid) throw new Error('Incorrect Password');
            const token = generateToken(user);
            return {token,user};
        },
        createTask: (_, {title}, {user}) => {
            if(!user) throw new Error('Not authenticated');
            const task = {id: uuidv4(), title, done: false, userId: user.id};
            tasks.push(task);
            pubsub.publish(TASK_CREATED, { taskCreated: task });
            return task;
        },
        deleteTask: (_, {id}, {user}) => {
            const index = tasks.findIndex(t => t.id === id && t.userId === user.id);
            if(index === -1) return false;
            tasks.splice(index, 1);
            return true;
        }
    },

    Subscription: {
        taskCreated: {
            subscribe: () => pubsub.asyncIterableIterator([TASK_CREATED])
        }
    }
};

export default resolvers;

