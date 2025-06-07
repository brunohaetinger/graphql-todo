import './App.css'

import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery } from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:4000/',
  cache: new InMemoryCache()
});

const HELLO_QUERY = gql`
  query {
    hello
  }
`;

function Hello() {
  const { data, loading } = useQuery(HELLO_QUERY);
  if (loading) return <p>Carregando...</p>;
  return <p>{data.hello}</p>;
}

function App() {
  return (
    <ApolloProvider client={client}>
      <Hello />
    </ApolloProvider>
  );
}

export default App;
