import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const { login, errorMessage } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100">
                <div className="text-center space-y-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-lg shadow-indigo-150">
                        NSS
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Welcome Back</h2>
                    <p className="text-sm text-slate-500">Sign in to access your NSS volunteer dashboard</p>
                </div>

                {(error || errorMessage) && (
                    <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 text-left">
                        ⚠️ {error || errorMessage}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                        <input
                            required
                            type="email"
                            placeholder="you@college.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                        />
                    </div>

                    <div className="space-y-1 text-left">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                            <a href="#" className="text-xs font-medium text-indigo-600 hover:underline">Forgot password?</a>
                        </div>
                        <input
                            required
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg shadow-indigo-150 hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="border-t border-slate-100 pt-6 text-center text-sm">
                    <p className="text-slate-500">
                        New volunteer?{" "}
                        <Link to="/register" className="font-semibold text-indigo-600 hover:underline">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
