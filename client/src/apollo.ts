import {ApolloClient, HttpLink, InMemoryCache, split} from '@apollo/client';
import {setContext} from '@apollo/client/link/context';
import {onError} from '@apollo/client/link/error';
import {GraphQLWsLink} from '@apollo/client/link/subscriptions';
import {createClient} from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

const httpLink = new HttpLink({uri: 'http://localhost:4000/graphql'})

const wsClient = createClient({
    url: 'ws://localhost:4000/graphql',
    connectionParams: () => {
        return {
            authToken: localStorage.getItem('accessToken'),
        };
    },
});

const wsLink = new GraphQLWsLink(wsClient);

const authLink = setContext((_, {headers}) => {
    const accessToken = localStorage.getItem('accessToken');
    return {
        headers: {
            ...headers,
            authorization: accessToken ? `Bearer ${accessToken}` : '',
        }
    }
});

const errorLink = onError(({graphQLErrors, networkError, operation, forward}) => {
    if (graphQLErrors) {
        for (let err of graphQLErrors) {
            if (err.extensions && err.extensions.code) {
                switch (err.extensions.code) {
                    case 'UNAUTHENTICATED':
                    // attempt to renew token
                    // This part is tricky with HTTP-only cookies.
                    // The server will attempt to refresh and send a new access token in 'x-access-token' header.
                    // We need to capture that header and update localStorage.
                    // For now, we'll rely on the server to send the new token.
                    // If the server sends a new access token, it will be caught by the afterware link.
                    break;
                }
            }
        }
    }
    if (networkError) console.log(`[Network error]: ${networkError}`);
});

const afterwareLink = new HttpLink({
    uri: 'http://localhost:4000/graphql',
    fetch: async (uri, options) => {
        const response = await fetch(uri, options);
        const newAccessToken = response.headers.get('x-access-token');
        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
        }
        return response;
    }
});

// Route to ws or http depending on the operation
const splitLink = split(
    ({query}) => {
        const def = getMainDefinition(query);
        return def.kind === 'OperationDefinition' && def.operation === 'subscription';
    },
    wsLink,
    authLink.concat(errorLink).concat(afterwareLink),
);

export const client = new ApolloClient({
    link: splitLink,
    cache: new InMemoryCache(),
})
