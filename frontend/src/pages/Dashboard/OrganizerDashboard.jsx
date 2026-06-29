import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { Link } from "react-router-dom";

export default function OrganizerDashboard() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [attendanceList, setAttendanceList] = useState([]);
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const userId = user?.id || user?._id;

    const groupByDepartment = (list) => {
        return list.reduce((groups, item) => {
            const department = item.department || "General";
            if (!groups[department]) groups[department] = [];
            groups[department].push(item);
            return groups;
        }, {});
    };

    const fetchOrganizerStats = async () => {
        setLoading(true);
        try {
            // Get all events
            const eventsRes = await axios.get("/events");
            // Filter events organized by this user
            const myDrives = eventsRes.data.filter((e) => {
                const organizerId = e.organizer?._id || e.organizer;
                return organizerId?.toString() === userId?.toString();
            });
            setEvents(myDrives);

            const studentsRes = await axios.get("/auth/users?role=student");
            setStudents(studentsRes.data);

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
    }, [user, userId]);

    const activeDrives = events.filter(e => e.status !== "Completed");
    const completedDrives = events.filter(e => e.status === "Completed");
    const studentsByDepartment = groupByDepartment(students);
    const registeredStudents = events.flatMap((event) => event.registeredStudents || []);
    const registeredByDepartment = groupByDepartment(registeredStudents);

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

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Department-wise Students</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Open a department to view student volunteers</p>
                    </div>
                    {loading ? (
                        <div className="h-24 animate-pulse bg-slate-100 rounded-2xl"></div>
                    ) : students.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-150 p-6 text-center text-slate-400 text-sm">
                            No student volunteers found.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                            {Object.entries(studentsByDepartment).map(([department, deptStudents]) => (
                                <details key={department} className="group">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{department}</p>
                                            <p className="text-xs text-slate-400">Student volunteers</p>
                                        </div>
                                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                                            {deptStudents.length}
                                        </span>
                                    </summary>
                                    <div className="max-h-56 overflow-y-auto border-t border-slate-100 bg-slate-50 px-4 py-2">
                                        <table className="w-full text-left text-xs">
                                            <thead className="text-slate-400">
                                                <tr>
                                                    <th className="py-2 font-bold uppercase">Name</th>
                                                    <th className="py-2 font-bold uppercase">Roll No</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {deptStudents.map((student) => (
                                                    <tr key={student._id}>
                                                        <td className="py-2 font-semibold text-slate-700">{student.name}</td>
                                                        <td className="py-2 font-mono text-slate-500">{student.rollNumber || "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
                </div>

                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800">Registered Volunteers by Department</h3>
                        <p className="text-xs text-slate-400 mt-0.5">Open a department to view registered students</p>
                    </div>
                    {loading ? (
                        <div className="h-24 animate-pulse bg-slate-100 rounded-2xl"></div>
                    ) : registeredStudents.length === 0 ? (
                        <div className="rounded-2xl border-2 border-dashed border-slate-150 p-6 text-center text-slate-400 text-sm">
                            No students have registered for your drives yet.
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                            {Object.entries(registeredByDepartment).map(([department, deptStudents]) => (
                                <details key={department} className="group">
                                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50">
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{department}</p>
                                            <p className="text-xs text-slate-400">{deptStudents.length} registered</p>
                                        </div>
                                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                                            {Math.round((deptStudents.length / registeredStudents.length) * 100)}%
                                        </span>
                                    </summary>
                                    <div className="max-h-56 overflow-y-auto border-t border-slate-100 bg-slate-50 px-4 py-2">
                                        <table className="w-full text-left text-xs">
                                            <thead className="text-slate-400">
                                                <tr>
                                                    <th className="py-2 font-bold uppercase">Name</th>
                                                    <th className="py-2 font-bold uppercase">Roll No</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-100">
                                                {deptStudents.map((student) => (
                                                    <tr key={`${department}-${student._id}`}>
                                                        <td className="py-2 font-semibold text-slate-700">{student.name}</td>
                                                        <td className="py-2 font-mono text-slate-500">{student.rollNumber || "-"}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </details>
                            ))}
                        </div>
                    )}
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
