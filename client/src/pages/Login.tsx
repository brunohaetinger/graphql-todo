import { gql, useMutation } from "@apollo/client";
import { useState } from 'react';

const LOGIN = gql`
    mutation($email: String!, $password: String!){
        login(email: $email, password: $password){
            accessToken
            refreshToken
            user {
                id
                email
            }
        }
    }
`;

export const Login = () => {
    const [form, setForm] = useState({email: '', password: ''});
    const [login] = useMutation(LOGIN, {
        onCompleted: (data) => {
            localStorage.setItem('accessToken', data.login.accessToken);
            // The refreshToken is expected to be set as an HTTP-only cookie by the server
            window.location.href = '/';
        },
        onError: (err) => alert(err.message)
    });

    return (
        <div>
            <h2>Login</h2>
            <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
            <input placeholder="Password" onChange={e => setForm({...form, password : e.target.value})}/>
            <button onClick={()=>login({variables: form})}>Confirm</button>
        </div>
    )
}
