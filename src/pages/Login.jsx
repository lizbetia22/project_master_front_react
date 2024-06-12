import React, { useState } from 'react';
import { IoHomeOutline } from "react-icons/io5";
import { AiFillExclamationCircle } from "react-icons/ai";

const API_URL = process.env.REACT_APP_API_URL;

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(`${API_URL}/user/login`);
            console.log(email, password);

            const response = await fetch(`${API_URL}/user/login`, {
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin':'*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                console.log('Login correctly');
                const data = await response.json();
                localStorage.setItem('token', data.token);
            } else {
                const errorMessage = await response.text();
                setError(errorMessage || 'Login failed');
            }
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="mt-28 max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="mt-8 mb-8">
                <div className="space-y-2 text-center">
                    <div className="flex items-center justify-center space-x-2 text-center">
                        <h2 className="text-4xl font-bold">Login</h2>
                        <IoHomeOutline className="h-8 w-8" />
                    </div>
                    <p className="text-gray-500 text-xl md:text-lg lg:text-base xl:text-lg">
                        Atelier
                    </p>
                </div>
                <div className="p-6 md:p-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                                Email
                            </label>
                            <input
                                id="email_login"
                                type="email"
                                placeholder="example@gmail.com"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-400"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:border-gray-400"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <div className="flex items-center mt-3">
                                <AiFillExclamationCircle className="h-4 w-5 mr-1 text-gray-500" />
                                <a href="/" className="underline text-sm text-gray-500 hover:underline">
                                    Mot de passe oublié?
                                </a>
                            </div>
                        </div>
                        {error && <div className="text-red-500">{error}</div>}
                        <button
                            type="submit"
                            className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                        >
                            Connexion
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
