import { ApolloServer, gql } from "apollo-server";
import auth from "./auth";

const typeDefs = gql`
    type Query {
        hello: String
        secretCompanyProfit: String
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello GraphQL !",
        secretCompanyProfit: (_,__,context) => {
            if(!context.user) throw new Error('Not Authorized');
            return '$ 999.999';
        }
    },
};

const server = new ApolloServer({
    typeDefs, 
    resolvers,
    context: (({req})=> {
        const token = req.headers.authorization || '';
        const user = auth.getUserFromToken(token);
        return {user};
    }),
});

server.listen().then(({url}) => {
    console.log(`🚀 Server ready at ${url}`);
})
