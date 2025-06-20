// server/index.js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { makeServer } from 'graphql-ws';  // Corrigido

import { typeDefs, resolvers } from './schema/index.js';
import { getUserFromToken } from './auth/auth.js';

const startServer = async () => {
  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // 🔄 WebSocket Server com makeServer
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const server = makeServer({
    schema,
    context: async (ctx, msg, args) => {
      const token = ctx.connectionParams?.authToken;
      const user = getUserFromToken(token);
      return { user };
    },
  });

  wsServer.on('connection', (socket) => {
    server.onConnection(socket);
  });

  // 🚀 Apollo Server HTTP
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => {
      const token = req.headers.authorization || '';
      const user = getUserFromToken(token);
      return { user };
    },
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app });

  const PORT = 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 HTTP: http://localhost:${PORT}${apolloServer.graphqlPath}`);
    console.log(`📡 WS:   ws://localhost:${PORT}/graphql`);
  });
};

startServer();
