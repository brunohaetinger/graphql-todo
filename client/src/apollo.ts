import {ApolloClient, HttpLink, InMemoryCache, split} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({uri: 'http://localhost:4000/graphql'})

const wsClient = createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
        return {
            authToken: localStorage.getItem('token'),
        };
    },
});

const wsLink = new GraphQLWsLink(wsClient);

const authLink = setContext((_, {headers}) => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        }
    }
});

// Route to ws or http depending on the operation
const splitLink = split(
    ({query}) => {
        const def = getMainDefinition(query);
        return def.kind === 'OperationDefinition' && def.operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
})
