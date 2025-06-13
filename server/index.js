import { ApolloServer, gql } from "apollo-server";
import { getUserFromToken } from "./auth.js";
import resolvers from './resolvers.js';
import typeDefs from './schema.js';

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: (({req})=> {
        const token = req.headers.authorization || '';
        const user = getUserFromToken(token);
        return {user};
    }),
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
})
