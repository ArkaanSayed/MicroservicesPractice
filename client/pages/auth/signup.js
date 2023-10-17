import { useState } from "react";
import Router from 'next/router';
import useRequest from '../../hooks/use-request';

const SignUp = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { doRequest, errors } = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => {
            Router.push('/');
        }
    })
    // Storing the default value if a string then useState(''), if an array then useState([]), if an object then useState({})

    const onSubmit = async (event) => {
        event.preventDefault();
        doRequest();

        // try {
        //     const response = await axios.post('/api/users/signup', {
        //         email, password
        //     });
        //     setEmail('');
        //     setPassword('');
        //     setErrors([]);
        //     console.log(response.data);
        // } catch (err) {
        //     console.log(err.response.data);
        //     setErrors(err.response.data.errors);
        // }

    }


    return <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
            <label>Email Address</label>
            <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="form-control" />
        </div>
        <div className="form-group">
            <label>Password</label>
            <input
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                className="form-control" />

        </div>

        {errors}

        <button className="btn btn-primary">Sign Up</button>
    </form>;
}

export default SignUp;



