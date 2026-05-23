import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <Link to="/" className="flex items-center gap-2">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-md shadow-indigo-200">
                        NSS
                    </span>
                    <span className="hidden font-bold tracking-tight text-slate-800 sm:block md:text-lg">
                        NSS Management Portal
                    </span>
                </Link>
            </div>

            {user ? (
                <div className="flex items-center gap-4">
                    <div className="hidden text-right sm:block">
                        <p className="text-sm font-semibold text-slate-800">{user.name}</p>
                        <p className="text-xs capitalize text-indigo-600 font-medium">
                            {user.role} • {user.department || "General"}
                        </p>
                    </div>

                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-100 to-violet-100 font-bold text-indigo-700">
                        {user.name.charAt(0).toUpperCase()}
                    </div>

                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-rose-600 transition"
                        title="Logout"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <Link
                        to="/login"
                        className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600"
                    >
                        Sign In
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 shadow-md shadow-indigo-100 transition"
                    >
                        Sign Up
                    </Link>
                </div>
            )}
        </header>
    );
}
