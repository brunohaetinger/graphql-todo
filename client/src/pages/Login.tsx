import { gql, useMutation } from "@apollo/client";
import { useState } from 'react';
import { saveToken } from "../utils/auth";

const LOGIN = gql`
    mutation($email: String!, $password: String!){
        login(email: $email, password: $password){
            token
        }
    }
`;

export const Login = () => {
    const [form, setForm] = useState({email: '', password: ''});
    const [login] = useMutation(LOGIN, {
        onCompleted: (data) => {
            saveToken(data.login.token);
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