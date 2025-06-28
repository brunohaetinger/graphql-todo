import { gql, useMutation } from "@apollo/client";
import { useState } from 'react';

const REGISTER = gql`
    mutation($email: String!, $password: String!){
        register(email: $email, password: $password){
            accessToken
            refreshToken
            user {
                id
                email
            }
        }
    }
`;

export const Register = () => {
    const [form, setForm] = useState({email: '', password: ''});
    const [register] = useMutation(REGISTER, {
        onCompleted: (data) => {
            localStorage.setItem('accessToken', data.register.accessToken);
            // The refreshToken is expected to be set as an HTTP-only cookie by the server
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
