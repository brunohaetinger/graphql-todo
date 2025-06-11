import { ApolloServer, gql } from "apollo-server";

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

// TODO: to be implemented
const getUserFromToken = (token) => {
    if(!token) return null;
    return {
        name: 'Steve Gates',
        age: '50',
    }
}

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