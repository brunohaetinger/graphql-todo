import { ApolloProvider } from '@apollo/client';
import './App.css'
import { client } from './apollo';
import { isAuthenticated } from './utils/auth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Tasks } from './pages/Tasks';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={isAuthenticated() ? <Tasks/> : <Navigate to='/login'/>}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
