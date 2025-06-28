// server/index.js
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/use/ws';
import cookieParser from 'cookie-parser';

import { typeDefs, resolvers } from './schema/index.js';
import { getUserFromToken, refreshAccessToken } from './auth/auth.js';
import { pubsub } from './auth/pubsub.js';

const startServer = async () => {
  const app = express();
  app.use(cookieParser());
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  // 🔄 WebSocket Server com useServer
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer(
    {
      schema,
      context: async (ctx) => {
        let token = ctx.connectionParams?.authToken;
        let user = getUserFromToken(token);

        // For WebSocket connections, refresh token logic might be more complex
        // as there's no direct `res` object to set headers/cookies.
        // A common approach is to send both tokens on initial connection,
        // and handle refresh on the client side by re-establishing the connection
        // with a new access token obtained via a separate HTTP refresh endpoint.
        // For simplicity here, we'll just use the provided access token.
        return { user, pubsub };
      },
    },
    wsServer,
  );
  // 🚀 Apollo Server HTTP
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      let token = req.headers.authorization || '';
      let user = getUserFromToken(token);

      // If access token is expired, try to refresh
      if (!user && token) { // token exists but is invalid/expired
        const refreshToken = req.cookies['refresh-token']; // Assuming refresh token is in a cookie
        if (refreshToken) {
          const newAccessToken = refreshAccessToken(refreshToken);
          if (newAccessToken) {
            token = `Bearer ${newAccessToken}`;
            user = getUserFromToken(token);
            // Set new access token in header or cookie for the client
            res.set('Access-Control-Expose-Headers', 'x-access-token');
            res.set('x-access-token', newAccessToken);
          }
        }
      }
      return { user, pubsub };
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
