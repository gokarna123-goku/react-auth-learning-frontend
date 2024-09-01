import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';

const Home = () => {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [products, setProducts] = useState('');

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'));
    }, []);

    const navigate = useNavigate();

    const handleLogout = (e) => {
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('loggedInUser');
        setLoggedInUser(localStorage.getItem('loggedInUser'));
        handleSuccess('Logged out successfully');
        setTimeout(() => {
            navigate('/login');
        }, 1000);
    };

    const fetchProducts = async () => {
        try {
            const url = "http://localhost:8080/products";
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('jwtToken')
                }
            }
            const response = await fetch(url, headers);
            const result = await response.json();
            // console.log(result);
            setProducts(result);
        } catch (err) {
            handleError(err.message);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            <h1>Welcome, {loggedInUser}</h1>
            <button onClick={handleLogout}>Logout</button>
            <div>
                {
                    products && products.map((item, ind) => (
                        <ul key={ind}>
                            <li>{item.name}: {item.price}</li>
                        </ul>
                    ))
                }
            </div>
            <ToastContainer />
        </div>
    );
};

export default Home;
