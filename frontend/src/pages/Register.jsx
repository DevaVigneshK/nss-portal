import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Register() {
    const { register } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await register({
                name,
                email,
                password,
                department,
                rollNumber,
                phone
            });
            navigate("/login");
        } catch (err) {
            setError(err.message || "Registration failed. Please check inputs.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg space-y-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl shadow-slate-100">
                <div className="text-center space-y-3">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 font-bold text-white shadow-lg shadow-indigo-150">
                        NSS
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">Volunteer Enlistment</h2>
                    <p className="text-sm text-slate-500">Register as a student volunteer</p>
                </div>

                {error && (
                    <div className="rounded-xl bg-rose-50 p-4 text-sm font-medium text-rose-600 text-left">
                        ⚠️ {error}
                    </div>
                )}

                <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                        <input
                            required
                            type="text"
                            placeholder="John Doe"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                            <input
                                required
                                type="email"
                                placeholder="john@college.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                            />
                        </div>
                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-slate-400 uppercase">Phone Number</label>
                            <input
                                required
                                type="tel"
                                placeholder="9876543210"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-slate-400 uppercase">Department</label>
                            <select
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition bg-white"
                            >
                                <option value="">Select Dept</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics & Comm">Electronics & Comm</option>
                                <option value="Electrical & Electronics">Electrical & Electronics</option>
                                <option value="Mechanical Eng">Mechanical Eng</option>
                                <option value="Civil Eng">Civil Eng</option>
                            </select>
                        </div>

                        <div className="space-y-1 text-left">
                            <label className="text-xs font-bold text-slate-400 uppercase">Roll Number</label>
                            <input
                                required
                                type="text"
                                placeholder="e.g. 21CS042"
                                value={rollNumber}
                                onChange={(e) => setRollNumber(e.target.value)}
                                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition"
                            />
                        </div>
                    </div>

                    <div className="space-y-1 text-left">
                        <label className="text-xs font-bold text-slate-400 uppercase">Password</label>
                        <input
                            required
                            type="password"
                            placeholder="Min 6 characters"
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
                        {loading ? "Registering..." : "Submit Registration"}
                    </button>
                </form>

                <div className="border-t border-slate-100 pt-6 text-center text-sm">
                    <p className="text-slate-500">
                        Already have an account?{" "}
                        <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
