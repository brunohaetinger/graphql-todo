import { PubSub } from 'graphql-subscriptions';
const pubsub = new PubSub();

const TASK_CREATED = 'TASK_CREATED';

export { pubsub, TASK_CREATED };
