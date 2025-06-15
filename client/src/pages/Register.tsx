import { gql, useMutation } from "@apollo/client";
import { useState } from 'react';
import { saveToken } from "../utils/auth";

const REGISTER = gql`
    mutation($email: String!, $password: String!){
        register(email: $email, password: $password){
            token
        }
    }
`;

export const Register = () => {
    const [form, setForm] = useState({email: '', password: ''});
    const [register] = useMutation(REGISTER, {
        onCompleted: (data) => {
            saveToken(data.register.token);
            window.location.href = '/';
        },
        onError: (err) => alert(err.message)
    });

    return (
        <div>
            <h2>Register</h2>
            <input placeholder="Email" onChange={e => setForm({...form, email: e.target.value})}/>
            <input placeholder="Password" onChange={e => setForm({...form, password : e.target.value})}/>
            <button onClick={()=>register({variables: form})}>Confirm</button>
        </div>
    )
}