import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const Login = () => {
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginInfo(prevLoginInfo => ({
            ...prevLoginInfo,
            [name]: value
        }));
    };

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        const { email, password } = loginInfo;
        if (!email || !password) {
            return handleError('All fields are required');
        }
        try {
            const url = 'http://localhost:8080/auth/login';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });

            const data = await response.json();
            const { success, message, jwtToken, name, error } = data;
            if (success) {
                handleSuccess(message);
                localStorage.setItem('jwtToken', jwtToken);
                localStorage.setItem('loggedInUser', name);
                setTimeout(() => {
                    navigate('/home');
                }, 1000);
            } else if (error) {
                const details = error?.details[0].message;
                handleError(details);
            } else if (!success) {
                handleError(message);
            }
        } catch (err) {
            handleError(err.message);
        }
    };

    return (
        <div className='container'>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        onChange={handleChange}
                        type="email"
                        id="email"
                        name="email"
                        placeholder='Enter your email'
                        value={loginInfo.email}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        onChange={handleChange}
                        type="password"
                        id="password"
                        name="password"
                        placeholder='Enter password'
                        value={loginInfo.password}
                    />
                </div>
                <button type="submit">Login</button>
                <span>Don't have an account?</span>
                <Link to="/signup">signup</Link>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Login;
