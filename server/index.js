import { ApolloServer } from "apollo-server-express";
import express from 'express';
import cors from 'cors';
import {createServer} from 'http';
import {makeServer} from 'graphql-ws';
import { WebSocketServer } from 'ws';
import {makeExecutableSchema } from '@graphql-tools/schema';

import { getUserFromToken } from "./auth.js";
import resolvers from './resolvers.js';
import typeDefs from './schema.js';

const app = express();
app.use(cors());
const httpServer = createServer(app);

const schema = makeExecutableSchema({typeDefs, resolvers})

const wsServer = new WebSocketServer({server: httpServer, path: '/graphql'});
makeServer({schema}, wsServer);

const server = new ApolloServer({
    schema,
    context: (({req})=> {
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token);
        return {user};
    }),
});

(async ()=> {
    await server.start();
    server.applyMiddleware({app});

    const PORT = 4000;
    httpServer.listen(PORT, ()=> {
        console.log(`🚀 Server HTTP: http://localhost:${PORT}${server.graphqlPath}`);
        console.log(`📡 Subscriptions WebSocket: ws://localhost:${PORT}/graphql`);
    })
})();
