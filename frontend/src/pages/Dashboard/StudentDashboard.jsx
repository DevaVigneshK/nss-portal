import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function StudentDashboard() {
    const { user } = useContext(AuthContext);
    const [attendance, setAttendance] = useState([]);
    const [myEvents, setMyEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentStats = async () => {
            setLoading(true);
            try {
                // Fetch attendance logs
                const attRes = await axios.get("/attendance");
                setAttendance(attRes.data.filter(att => att.studentId?._id === user?.id || att.studentId === user?.id));

                // Fetch registered upcoming events
                const eventsRes = await axios.get("/events");
                const registered = eventsRes.data.filter((e) =>
                    e.registeredStudents?.some((s) => s._id === user?.id || s === user?.id)
                );
                setMyEvents(registered);
            } catch (err) {
                console.error("Failed to load student statistics:", err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStudentStats();
        }
    }, [user]);

    if (!user) return null;

    // NSS volunteer hour goals (Standard Indian College NSS goal is typically 120/240 hours over 2 years)
    const hourGoal = 120;
    const hoursEarned = user.volunteerHours || 0;
    const progressPercent = Math.min(100, Math.round((hoursEarned / hourGoal) * 100));

    return (
        <div className="space-y-8 text-left">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 !mb-0">Volunteer Dashboard</h2>
                <p className="text-sm text-slate-500">Track your service hours, check-ins, and scheduled camp operations</p>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Hours Meter Card */}
                <div className="md:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Service Hour Progress</p>
                            <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{hoursEarned} / {hourGoal} Hrs</h3>
                        </div>
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 font-bold text-indigo-700 text-lg">
                            ⚡
                        </span>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs text-slate-400 font-semibold">
                            <span>Goal: 120 Hours</span>
                            <span>{progressPercent}% Achieved</span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-650 to-violet-500 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            ></div>
                        </div>
                    </div>

                    <p className="text-xs text-slate-400 font-medium">Complete community drives and scan QR codes to increment your official record.</p>
                </div>

                {/* Performance Summary Card */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Drive Statistics</p>
                        <h4 className="text-sm font-semibold text-slate-850">Activity Engagements</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-4 py-3 border-t border-b border-slate-100">
                        <div>
                            <p className="text-2xl font-black text-slate-850">{myEvents.length}</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Enlisted</p>
                        </div>
                        <div>
                            <p className="text-2xl font-black text-indigo-650">{attendance.length}</p>
                            <p className="text-xs text-slate-400 font-semibold uppercase mt-0.5">Attended</p>
                        </div>
                    </div>

                    <Link to="/attendance/scan" className="block text-center rounded-xl bg-indigo-600 py-3.5 text-xs font-bold text-white shadow-md shadow-indigo-100 hover:bg-indigo-700 transition">
                        Quick Attendance Check-In
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Registered upcoming events list */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Your Scheduled Drives</h3>
                    {loading ? (
                        <div className="h-24 animate-pulse bg-slate-100 rounded-2xl"></div>
                    ) : myEvents.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-150 p-6 text-center text-slate-400 text-sm">
                            You haven't registered for any upcoming events yet. Go to <Link to="/" className="text-indigo-650 font-bold hover:underline">Activity Directory</Link> to join.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                            {myEvents.map((e) => (
                                <div key={e._id} className="flex items-center justify-between py-3">
                                    <div>
                                        <h4 className="font-bold text-slate-850 text-sm line-clamp-1">{e.title}</h4>
                                        <p className="text-xs text-slate-400 mt-0.5">📍 {e.venue} • 📅 {e.date}</p>
                                    </div>
                                    <Link to={`/events/${e._id}`} className="rounded bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
                                        Details
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Checked-in Attendance logs timeline */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Attendance Log Timeline</h3>
                    {loading ? (
                        <div className="h-24 animate-pulse bg-slate-100 rounded-2xl"></div>
                    ) : attendance.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-150 p-6 text-center text-slate-400 text-sm">
                            No attendance records logged yet. Check-ins will show up here.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                            {attendance.map((att) => (
                                <div key={att._id} className="flex items-center justify-between py-3">
                                    <div className="space-y-0.5">
                                        <h4 className="font-bold text-slate-850 text-sm line-clamp-1">{att.eventId?.title || "NSS Drive"}</h4>
                                        <p className="text-xs text-slate-400">📅 Checked in on: {new Date(att.checkInTime).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="inline-flex rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/10">
                                            Present
                                        </span>
                                        <p className="text-[10px] text-slate-400 mt-1 font-bold">⚡ +{att.hoursCredited || 3} Hours</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
