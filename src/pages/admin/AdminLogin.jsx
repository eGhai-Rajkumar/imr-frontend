import React, { useState } from 'react';
import { Mail, Lock, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './css/AdminLogin.css'; // Import the dedicated CSS

// --- API SIGN-IN ENDPOINT ---
const API_SIGNIN_ENDPOINT = 'https://api.yaadigo.com/public/api/users/signin';

// --- MOCK API CLIENT WRAPPER (Mimics APIBaseUrl structure for direct fetch) ---
const APIBaseUrl = {
    post: async (endpoint, payload) => {
        // Standard fetch call configured for the POST endpoint
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        // Handle HTTP errors (4xx or 5xx status codes)
        if (!response.ok) {
            // Attempt to read the error body, falling back to a generic message
            const errorData = await response.json().catch(() => ({ message: 'Network error or bad credentials.' }));
            throw new Error(errorData.message || 'Authentication failed due to network status.');
        }
        
        // Return the JSON body for successful (2xx) responses
        return response.json();
    }
};
// -----------------------

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                email: email,
                password: password
            };

            const data = await APIBaseUrl.post(API_SIGNIN_ENDPOINT, payload);

            if (data && data.success === true && data.data && data.data.api_key) {
                // Success: Store the API key (or JWT) for subsequent authenticated calls
                localStorage.setItem('admin_api_key', data.data.api_key);
                console.log('Login successful. API Key received and stored.');
                
                // Redirects to the dashboard base route
                navigate('/admin/dashboard/overview'); 
            } else {
                // Handle cases where API returns 200 OK but 'success: false'
                setError(data.message || 'Authentication failed. Please check credentials.');
            }

        } catch (apiError) {
            // Display any error thrown (from network issue or API rejection)
            setError(apiError.message || 'An unexpected error occurred during sign-in.');
        }
    };

    // Toggles the specific login background class on the body
    React.useEffect(() => {
        document.body.className = '';
        document.body.classList.add('admin-login-body');
        return () => {
            document.body.classList.remove('admin-login-body');
        };
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="login-card">
                <div className="flex items-center justify-center mb-6">
                    <img 
                        src="/holidaysplanners-logo.png" 
                        alt="Holidays Planners Logo" 
                        className="h-16 w-auto" 
                    />
                </div>
                <h1 className="login-title text-center">Admin Access</h1>
                <p className="login-subtitle text-center">Sign in to manage your travel business</p>
                
                {error && (
                    <div className="bg-red-900/50 text-red-300 p-3 rounded-lg mb-4 border border-red-700/50 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="login-input w-full pl-12"
                            required
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="login-input w-full pl-12"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="login-button w-full flex items-center justify-center gap-2"
                    >
                        <LogIn className="h-5 w-5" />
                        Secure Sign In
                    </button>
                </form>
            </div>
        </div>
    );
}