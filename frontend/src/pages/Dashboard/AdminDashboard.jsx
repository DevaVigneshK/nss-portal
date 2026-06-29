import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("analytics");
    const [actionLoading, setActionLoading] = useState(false);
    const [staffForm, setStaffForm] = useState({
        name: "",
        email: "",
        password: "",
        department: "",
        phone: ""
    });
    const [staffMessage, setStaffMessage] = useState("");

    const fetchAdminStatsAndUsers = async () => {
        setLoading(true);
        try {
            const statsRes = await axios.get("/analytics/stats");
            setStats(statsRes.data);

            const usersRes = await axios.get("/auth/users");
            setUsers(usersRes.data);
        } catch (err) {
            console.error("Failed to load admin stats & user lists:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAdminStatsAndUsers();
    }, []);

    const handleUpdateStatus = async (userId, newStatus) => {
        if (!window.confirm(`Are you sure you want to update this user status to ${newStatus}?`)) return;
        setActionLoading(true);
        try {
            await axios.put(`/auth/users/${userId}`, { status: newStatus });
            fetchAdminStatsAndUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update user status");
        } finally {
            setActionLoading(false);
        }
    };

    const handleElevateRole = async (userId, newRole) => {
        if (!window.confirm(`Are you sure you want to change this user role to ${newRole}?`)) return;
        setActionLoading(true);
        try {
            await axios.put(`/auth/users/${userId}`, { role: newRole });
            fetchAdminStatsAndUsers();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to update user role");
        } finally {
            setActionLoading(false);
        }
    };

    const handleStaffInputChange = (e) => {
        const { name, value } = e.target;
        setStaffForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateStaff = async (e) => {
        e.preventDefault();
        setActionLoading(true);
        setStaffMessage("");
        try {
            await axios.post("/auth/staff", staffForm);
            setStaffForm({
                name: "",
                email: "",
                password: "",
                department: "",
                phone: ""
            });
            setStaffMessage("Staff coordinator created successfully.");
            fetchAdminStatsAndUsers();
        } catch (err) {
            setStaffMessage(err.response?.data?.message || "Failed to create staff coordinator.");
        } finally {
            setActionLoading(false);
        }
    };

    if (loading || !stats) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    const { metrics, deptStats, categoryStats } = stats;

    return (
        <div className="space-y-8 text-left">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 !mb-0">Admin ERP Control Centre</h2>
                    <p className="text-sm text-slate-500">Global college dashboard for analytics reporting, certificates, and organizer enforcements</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 border">
                    <button
                        onClick={() => setActiveTab("analytics")}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeTab === "analytics"
                                ? "bg-white text-slate-800 shadow"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Analytics Report
                    </button>
                    <button
                        onClick={() => setActiveTab("users")}
                        className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
                            activeTab === "users"
                                ? "bg-white text-slate-800 shadow"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        Users & Staff ({users.length})
                    </button>
                </div>
            </div>

            {/* Quick Global Metrics Cards */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Total Volunteers</p>
                    <p className="mt-2 text-2xl font-black text-slate-850">{metrics.totalVolunteers}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Staff Coordinators</p>
                    <p className="mt-2 text-2xl font-black text-slate-850">{metrics.totalOrganizers}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Campaigns Run</p>
                    <p className="mt-2 text-2xl font-black text-slate-850">{metrics.totalEvents}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Hours Contributed</p>
                    <p className="mt-2 text-2xl font-black text-indigo-650">⚡ {metrics.totalHours} Hrs</p>
                </div>
            </div>

            {activeTab === "analytics" ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* SVG Department-wise stats bar chart */}
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">Department Participation Rates</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Distribution of volunteers by department division</p>
                        </div>
                        <div className="space-y-4">
                            {deptStats.length === 0 ? (
                                <p className="text-xs text-slate-400">No data logged yet.</p>
                            ) : (
                                deptStats.map((dept) => {
                                    const percentage = Math.min(100, Math.round((dept.count / metrics.totalVolunteers) * 100));
                                    return (
                                        <div key={dept._id} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-slate-650">{dept._id || "General"}</span>
                                                <span className="text-slate-500">{dept.count} Volunteers ({percentage}%)</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full"
                                                    style={{ width: `${percentage}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Category-wise Distributions */}
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-800">NSS Activity Category Metrics</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Summary of scheduled campaigns by drive classifications</p>
                        </div>
                        <div className="space-y-4">
                            {categoryStats.length === 0 ? (
                                <p className="text-xs text-slate-400">No campaigns scheduled.</p>
                            ) : (
                                categoryStats.map((cat) => {
                                    const percent = Math.min(100, Math.round((cat.count / metrics.totalEvents) * 100));
                                    return (
                                        <div key={cat._id} className="space-y-1">
                                            <div className="flex justify-between text-xs font-semibold">
                                                <span className="text-slate-650">{cat._id}</span>
                                                <span className="text-slate-500">{cat.count} Drives ({percent}%)</span>
                                            </div>
                                            <div className="h-3 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                                <div
                                                    className="h-full bg-gradient-to-r from-violet-650 to-violet-400 rounded-full"
                                                    style={{ width: `${percent}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <form onSubmit={handleCreateStaff} className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
                        <div className="mb-5">
                            <h3 className="text-lg font-bold text-slate-800">Add NSS Staff Coordinator</h3>
                            <p className="text-xs text-slate-400 mt-0.5">Only admins can create NSS staff coordinator accounts.</p>
                        </div>

                        {staffMessage && (
                            <div className={`mb-4 rounded-xl p-3 text-sm font-semibold ${
                                staffMessage.includes("successfully")
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-rose-50 text-rose-700"
                            }`}>
                                {staffMessage}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <input
                                required
                                name="name"
                                value={staffForm.name}
                                onChange={handleStaffInputChange}
                                placeholder="Full name"
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                            <input
                                required
                                type="email"
                                name="email"
                                value={staffForm.email}
                                onChange={handleStaffInputChange}
                                placeholder="staff@college.edu"
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                            <input
                                required
                                type="password"
                                name="password"
                                value={staffForm.password}
                                onChange={handleStaffInputChange}
                                placeholder="Temporary password"
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                            <select
                                name="department"
                                value={staffForm.department}
                                onChange={handleStaffInputChange}
                                className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-600"
                            >
                                <option value="">NSS Office</option>
                                <option value="Computer Science">Computer Science</option>
                                <option value="Information Technology">Information Technology</option>
                                <option value="Electronics & Comm">Electronics & Comm</option>
                                <option value="Electrical & Electronics">Electrical & Electronics</option>
                                <option value="Mechanical Eng">Mechanical Eng</option>
                                <option value="Civil Eng">Civil Eng</option>
                            </select>
                            <input
                                name="phone"
                                value={staffForm.phone}
                                onChange={handleStaffInputChange}
                                placeholder="Phone number"
                                className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600"
                            />
                            <button
                                type="submit"
                                disabled={actionLoading}
                                className="rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
                            >
                                {actionLoading ? "Creating..." : "Create NSS Staff Coordinator"}
                            </button>
                        </div>
                    </form>

                    {/* User Directory Control Table */}
                    <div className="rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/50 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <th className="px-6 py-4">Name / Roll Number</th>
                                        <th className="px-6 py-4">Email</th>
                                        <th className="px-6 py-4">Department / Division</th>
                                        <th className="px-6 py-4">Role</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((u) => (
                                        <tr key={u._id} className="hover:bg-slate-50/50">
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-850">{u.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{u.rollNumber || "Coordinator"}</p>
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-mono text-xs">{u.email}</td>
                                            <td className="px-6 py-4 text-slate-500">{u.department || "NSS Office"}</td>
                                            <td className="px-6 py-4 capitalize font-semibold text-slate-700">
                                                {u.role === "organizer" ? "NSS Staff Coordinator" : u.role}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                                    u.status === "Active"
                                                        ? "bg-emerald-50 text-emerald-700"
                                                        : u.status === "Suspended"
                                                        ? "bg-rose-50 text-rose-700"
                                                        : "bg-amber-50 text-amber-700"
                                                }`}>
                                                    {u.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2">
                                                {u.role !== "admin" && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(u._id, u.status === "Active" ? "Suspended" : "Active")}
                                                            disabled={actionLoading}
                                                            className={`rounded px-2.5 py-1 text-xs font-bold transition ${
                                                                u.status === "Active"
                                                                    ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                                                                    : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                            }`}
                                                        >
                                                            {u.status === "Active" ? "Suspend" : "Activate"}
                                                        </button>
                                                        {u.role === "student" && (
                                                            <button
                                                                onClick={() => handleElevateRole(u._id, "organizer")}
                                                                disabled={actionLoading}
                                                                className="rounded bg-indigo-50 px-2.5 py-1 text-xs font-bold text-indigo-750 hover:bg-indigo-100"
                                                            >
                                                                Promote
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
