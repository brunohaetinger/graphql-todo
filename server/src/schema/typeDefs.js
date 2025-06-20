// server/schema.js
import { gql } from 'apollo-server';

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
  }

  type Task {
    id: ID!
    title: String!
    done: Boolean!
    userId: ID!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    me: User
    myTasks: [Task!]!
  }

  type Mutation {
    register(email: String!, password: String!): AuthPayload
    login(email: String!, password: String!): AuthPayload
    createTask(title: String!): Task!
    deleteTask(id: ID!): Boolean!
  }

  type Subscription {
    taskCreated: Task!
  }
`;

export default typeDefs;
