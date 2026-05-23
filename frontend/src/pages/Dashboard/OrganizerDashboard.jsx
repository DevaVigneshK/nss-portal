import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OrganizerDashboard() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrganizerStats = async () => {
        setLoading(true);
        try {
            // Get all events
            const eventsRes = await axios.get("/events");
            // Filter events organized by this user
            const myDrives = eventsRes.data.filter(e => e.organizer?._id === user?.id || e.organizer === user?.id);
            setEvents(myDrives);

            // Get attendance check-ins
            const attRes = await axios.get("/attendance");
            // Filter check-ins belonging to organizer's events
            const myEventIds = myDrives.map(e => e._id);
            const myCheckins = attRes.data.filter(att => myEventIds.includes(att.eventId?._id || att.eventId));
            setAttendanceList(myCheckins);
        } catch (err) {
            console.error("Failed to load organizer dashboard metrics:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchOrganizerStats();
        }
    }, [user]);

    const activeDrives = events.filter(e => e.status !== "Completed");
    const completedDrives = events.filter(e => e.status === "Completed");

    return (
        <div className="space-y-8 text-left">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 !mb-0">Staff Coordinator Console</h2>
                <p className="text-sm text-slate-500">Plan NSS campaigns, approve student volunteer registrations, and verify hours registers</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Scheduled Drives</p>
                    <p className="mt-2 text-2xl font-black text-slate-800">{activeDrives.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Concluded Drives</p>
                    <p className="mt-2 text-2xl font-black text-slate-800">{completedDrives.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Check-in Logs</p>
                    <p className="mt-2 text-2xl font-black text-indigo-650">{attendanceList.length}</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                    <p className="text-xs font-bold text-slate-450 uppercase tracking-wider">Assigned Volunteers</p>
                    <p className="mt-2 text-2xl font-black text-slate-800">
                        {events.reduce((acc, curr) => acc + (curr.registeredStudents?.length || 0), 0)}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Active drives checklist */}
                <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Active NSS Drives</h3>
                    {loading ? (
                        <div className="h-24 animate-pulse bg-slate-100 rounded-2xl"></div>
                    ) : activeDrives.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-150 p-12 text-center text-slate-400 text-sm">
                            No active or upcoming campaigns scheduled. Head over to the <Link to="/" className="text-indigo-650 font-bold hover:underline">Directory</Link> to create one.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
                                        <th className="py-3 px-2">Campaign Title</th>
                                        <th className="py-3 px-2">Date</th>
                                        <th className="py-3 px-2">Venue</th>
                                        <th className="py-3 px-2">Limit</th>
                                        <th className="py-3 px-2 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {activeDrives.map((e) => (
                                        <tr key={e._id} className="hover:bg-slate-50/50">
                                            <td className="py-3 px-2 font-semibold text-slate-850 line-clamp-1">{e.title}</td>
                                            <td className="py-3 px-2 text-slate-500 font-mono text-xs">{e.date}</td>
                                            <td className="py-3 px-2 text-slate-500 text-xs">📍 {e.venue}</td>
                                            <td className="py-3 px-2 text-slate-500 font-bold">{e.registeredStudents?.length || 0} / {e.participantLimit}</td>
                                            <td className="py-3 px-2 text-right">
                                                <Link to={`/events/${e._id}`} className="rounded bg-indigo-50 px-2.5 py-1.5 text-xs font-bold text-indigo-750 hover:bg-indigo-100">
                                                    Manage
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Live attendance logs checklist */}
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">Recent Check-In Logs</h3>
                    {loading ? (
                        <div className="h-24 animate-pulse bg-slate-100 rounded-2xl"></div>
                    ) : attendanceList.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-150 p-6 text-center text-slate-400 text-sm">
                            No student volunteer attendance registers logged yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                            {attendanceList.map((att) => (
                                <div key={att._id} className="flex items-center justify-between py-2 text-xs">
                                    <div>
                                        <p className="font-bold text-slate-800">{att.studentId?.name || "Student"}</p>
                                        <p className="text-[10px] text-slate-450 mt-0.5">{att.studentId?.rollNumber} • {att.eventId?.title}</p>
                                    </div>
                                    <span className="rounded bg-emerald-50 px-2 py-0.5 font-bold text-emerald-700">
                                        Present
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
