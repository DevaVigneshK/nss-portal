import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
    const { user, updateProfile } = useContext(AuthContext);
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [department, setDepartment] = useState("");
    const [rollNumber, setRollNumber] = useState("");
    
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setPhone(user.phone || "");
            setDepartment(user.department || "");
            setRollNumber(user.rollNumber || "");
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSuccess("");
        setError("");
        setLoading(true);
        try {
            await updateProfile({
                name,
                phone,
                department,
                rollNumber: user.role === "student" ? rollNumber : ""
            });
            setSuccess("Profile updated successfully!");
        } catch (err) {
            setError(err.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 !mb-0">Profile Management</h2>
                <p className="text-sm text-slate-500">Manage your credentials, role settings, and department metadata</p>
            </div>

            {success && (
                <div className="rounded-xl bg-emerald-50 p-4 text-sm font-semibold text-emerald-800 text-left">
                    ✓ {success}
                </div>
            )}

            {error && (
                <div className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-800 text-left">
                    ⚠️ {error}
                </div>
            )}

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                <div className="flex flex-col items-center gap-4 border-b border-slate-100 pb-6 text-center sm:flex-row sm:text-left">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-3xl font-bold text-white shadow-lg shadow-indigo-150">
                        {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">{user.name}</h3>
                        <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>
                        <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-750 ring-1 ring-inset ring-indigo-600/10 capitalize">
                                Role: {user.role}
                            </span>
                            <span className="inline-flex items-center rounded-md bg-slate-50 px-2 py-0.5 text-xs font-semibold text-slate-650 ring-1 ring-inset ring-slate-600/10">
                                {user.department || "General Division"}
                            </span>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSave} className="mt-6 space-y-4 text-left">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                        <input
                            required
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Mobile Number</label>
                            <input
                                required
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase">Department</label>
                            <select
                                required
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
                            >
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics & Comm">Electronics & Comm</option>
                                <option value="Electrical & Electronics">Electrical & Electronics</option>
                                <option value="Mechanical Eng">Mechanical Eng</option>
                                <option value="Civil Eng">Civil Eng</option>
                            </select>
                        </div>
                    </div>

                    {user.role === "student" && (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Roll Number</label>
                                <input
                                    required
                                    type="text"
                                    value={rollNumber}
                                    onChange={(e) => setRollNumber(e.target.value)}
                                    className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-400 uppercase">Total Volunteer Hours</label>
                                <input
                                    disabled
                                    type="text"
                                    value={`${user.volunteerHours || 0} Hours Earned`}
                                    className="mt-1 w-full rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-500 font-bold"
                                />
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 transition"
                    >
                        {loading ? "Saving Changes..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
