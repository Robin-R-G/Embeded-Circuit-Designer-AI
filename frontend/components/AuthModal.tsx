'use client';

import React, { useState } from 'react';
import { User, LogIn, UserPlus } from 'lucide-react';

export default function AuthModal({ onClose, onLogin }: { onClose: () => void, onLogin: (user: any) => void }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const endpoint = isLogin ? '/login' : '/register';

        try {
            const response = await fetch(`https://fluffy-lines-argue.loca.lt${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                if (isLogin) {
                    localStorage.setItem('token', data.token);
                    onLogin(data.user);
                    onClose();
                } else {
                    // After register, auto-login or switch to login
                    setIsLogin(true);
                    setError('Registration successful! Please login.');
                }
            } else {
                setError(data.error || 'Authentication failed');
            }
        } catch (err) {
            setError('Network error');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-xl w-96 border border-gray-700">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center">
                    {isLogin ? <LogIn className="mr-2" /> : <UserPlus className="mr-2" />}
                    {isLogin ? 'Login' : 'Register'}
                </h2>

                {error && <div className="bg-red-900/50 text-red-200 p-2 rounded mb-4 text-sm">{error}</div>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-gray-400 text-sm mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white focus:outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded p-2 font-medium"
                    >
                        {isLogin ? 'Login' : 'Register'}
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-400">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="text-blue-400 hover:underline"
                    >
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </div>

                <button onClick={onClose} className="mt-4 text-center w-full text-gray-500 text-xs hover:text-gray-300">
                    Cancel
                </button>
            </div>
        </div>
    );
}
