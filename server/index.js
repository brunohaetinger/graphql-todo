import { ApolloServer, gql } from "apollo-server";
import { getUserFromToken } from "./auth";
import resolvers from './resolvers';

const typeDefs = gql`
    type Query {
        hello: String
        secretCompanyProfit: String
    }
`;

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
