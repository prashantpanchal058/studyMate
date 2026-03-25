import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            navigate("/");
        }
    }, [navigate]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            const response = await fetch("https://studymate-p7sk.onrender.com/signin", {
            // const response = await fetch("http://localhost:8007/signin", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const json = await response.json()

            if(json.error){
                setError(json.error);
            }

            if (json.success) {
                localStorage.setItem('token', json.authtoken);
                navigate("/");
            }

        } catch (error) {
            console.error("Error in signin:", error);
            setError("Server error. Please try again later.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-blue-100 to-gray-200 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Welcome Back 👋</h1>
                    <p className="text-gray-500 text-sm">
                        Login to continue
                    </p>
                </div>

                {/* Error Box */}
                {error && (
                    <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                            placeholder="you@example.com"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                        </label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-2 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                                placeholder="••••••••"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? "👁️": "🙈"}
                            </button>
                        </div>
                    </div>

                    {/* Forgot password */}
                    <div className="text-right text-sm">
                        <a href="#" className="text-blue-600 hover:underline">
                            Forgot password?
                        </a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
                    >
                        Log In
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center my-5">
                    <div className="grow h-px bg-gray-300"></div>
                    <span className="px-2 text-gray-400 text-sm">or</span>
                    <div className="grow h-px bg-gray-300"></div>
                </div>

                {/* Social Login */}
                <div className="flex flex-col space-y-3">
                    <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            className="w-5 h-5"
                            alt="Google"
                        />
                        Continue with Google
                    </button>

                    <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition">
                        <img
                            src="https://www.svgrepo.com/show/394174/github.svg"
                            className="w-5 h-5"
                            alt="GitHub"
                        />
                        Continue with GitHub
                    </button>
                </div>

                {/* Signup */}
                <p className="text-center text-gray-600 text-sm mt-6">
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-blue-600 font-medium hover:underline">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;