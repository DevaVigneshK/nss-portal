import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

export default function EventDetails() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [regSuccess, setRegSuccess] = useState("");
    const [error, setError] = useState("");
    const [markingAttendance, setMarkingAttendance] = useState(false);
    const [studentList, setStudentList] = useState([]);
    const [attendanceCode, setAttendanceCode] = useState(null);
    const [generatingCode, setGeneratingCode] = useState(false);
    const navigate = useNavigate();
    const userId = user?.id || user?._id;

    const groupByDepartment = (list) => {
        return list.reduce((groups, item) => {
            const department = item.department || "General";
            if (!groups[department]) groups[department] = [];
            groups[department].push(item);
            return groups;
        }, {});
    };

    const fetchEventDetails = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/events/${id}`);
            setEvent(res.data);
            // Fetch students for marking attendance if Coordinator/Admin
            if (user && (user.role === "organizer" || user.role === "admin")) {
                const stdRes = await axios.get("/auth/users?role=student");
                setStudentList(stdRes.data);
            }
        } catch (err) {
            console.error("Failed to load event details:", err);
            setError("Failed to load event details.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEventDetails();
    }, [id]);

    const handleRegister = async () => {
        setRegSuccess("");
        setError("");
        try {
            await axios.post(`/events/${id}/register`);
            setRegSuccess("You are successfully registered for this NSS activity!");
            fetchEventDetails();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to register for event");
        }
    };

    const handleMarkAttendance = async (studentId) => {
        try {
            await axios.post("/attendance", {
                studentId,
                eventId: event._id,
                status: "Present"
            });
            alert("Attendance logged! Credit hours updated for volunteer.");
            fetchEventDetails();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to log attendance");
        }
    };

    const handleCompleteEvent = async () => {
        if (!window.confirm("Are you sure you want to mark this event as completed?")) return;
        try {
            await axios.put(`/events/${event._id}`, { status: "Completed" });
            fetchEventDetails();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to complete event");
        }
    };

    const handleGenerateAttendanceCode = async () => {
        setGeneratingCode(true);
        setError("");
        try {
            const res = await axios.post("/attendance/generate-qr", {
                eventId: event._id
            });
            setAttendanceCode(res.data.qrData);
            fetchEventDetails();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to generate attendance code");
        } finally {
            setGeneratingCode(false);
        }
    };

    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
            </div>
        );
    }

    if (error && !event) {
        return <div className="rounded-2xl bg-rose-50 p-6 text-center text-rose-600 font-semibold">{error}</div>;
    }

    const isRegistered = event.registeredStudents?.some((s) => {
        const studentId = s?._id || s;
        return studentId?.toString() === userId?.toString();
    });
    const isStaff = user && (user.role === "organizer" || user.role === "admin");
    const isLimitReached = event.registeredStudents?.length >= event.participantLimit;
    const registeredStudents = event.registeredStudents || [];
    const registeredByDepartment = groupByDepartment(registeredStudents);

    return (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Left detail card */}
            <div className="lg:col-span-2 space-y-6">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                        <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                            {event.category}
                        </span>
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                            event.status === "Completed"
                                ? "bg-slate-100 text-slate-700"
                                : "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                        }`}>
                            {event.status}
                        </span>
                    </div>

                    <div className="space-y-3">
                        <h2 className="text-3xl font-extrabold text-slate-800 !mb-0">{event.title}</h2>
                        <p className="text-slate-500 text-base leading-relaxed whitespace-pre-wrap">{event.description}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-400 uppercase">Coordinator/Organizer</p>
                            <p className="text-sm font-semibold text-slate-700">{event.organizer?.name || "NSS Core Office"}</p>
                            <p className="text-xs text-slate-400">{event.organizer?.email}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-400 uppercase">Venue & Meeting Point</p>
                            <p className="text-sm font-semibold text-slate-700">📍 {event.venue}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-6">
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-400 uppercase">Drive Schedule Date</p>
                            <p className="text-sm font-semibold text-slate-700">📅 {event.date} at {event.time || "TBD"}</p>
                        </div>
                        <div className="space-y-0.5">
                            <p className="text-xs font-bold text-slate-400 uppercase">Volunteer Hours Credited</p>
                            <p className="text-sm font-extrabold text-indigo-650">⚡ {event.hoursCredited} Hours</p>
                        </div>
                    </div>

                    {event.volunteerRequirements && (
                        <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-left">
                            <p className="text-xs font-bold text-slate-500 uppercase">Special Instructions</p>
                            <p className="text-sm text-slate-650 mt-1">⚠️ {event.volunteerRequirements}</p>
                        </div>
                    )}
                </div>

                {/* Staff Attendance Coordinator Section */}
                {isStaff && (
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-800">Coordinator Admin Operations</h3>
                            <button
                                onClick={handleCompleteEvent}
                                disabled={event.status === "Completed"}
                                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-rose-700 disabled:opacity-50"
                            >
                                Complete Event
                            </button>
                        </div>

                        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">Registered Students by Department</h4>
                                    <p className="text-xs text-slate-400">Open a department to view registered students</p>
                                </div>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-indigo-700">
                                    {registeredStudents.length} total
                                </span>
                            </div>

                            {registeredStudents.length === 0 ? (
                                <div className="rounded-xl border border-dashed border-slate-200 bg-white p-4 text-center text-sm text-slate-400">
                                    No students registered for this event yet.
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100 overflow-hidden rounded-xl border border-slate-100 bg-white">
                                    {Object.entries(registeredByDepartment).map(([department, students]) => (
                                        <details key={department} className="group">
                                            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-4 py-3 hover:bg-slate-50">
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{department}</p>
                                                    <p className="text-xs text-slate-400">Registered students</p>
                                                </div>
                                                <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
                                                    {students.length}
                                                </span>
                                            </summary>
                                            <div className="max-h-56 overflow-y-auto border-t border-slate-100 bg-slate-50 px-4 py-2">
                                                <table className="w-full text-left text-xs">
                                                    <thead className="text-slate-400">
                                                        <tr>
                                                            <th className="py-2 font-bold uppercase">Name</th>
                                                            <th className="py-2 font-bold uppercase">Roll No</th>
                                                            <th className="py-2 font-bold uppercase">Email</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-100">
                                                        {students.map((student) => (
                                                            <tr key={student._id}>
                                                                <td className="py-2 font-semibold text-slate-700">{student.name}</td>
                                                                <td className="py-2 font-mono text-slate-500">{student.rollNumber || "-"}</td>
                                                                <td className="py-2 font-mono text-slate-500">{student.email}</td>
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

                        <div className="flex gap-4">
                            <button
                                onClick={() => setMarkingAttendance(!markingAttendance)}
                                className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 text-center"
                            >
                                {markingAttendance ? "Hide Attendance Logger" : "Log Attendance Manually"}
                            </button>
                        </div>

                        {markingAttendance && (
                            <div className="space-y-3 pt-3 border-t border-slate-100">
                                <h4 className="text-sm font-bold text-slate-500 uppercase">Student Directory</h4>
                                <div className="max-h-60 overflow-y-auto divide-y divide-slate-50 border rounded-xl">
                                    {studentList.map((std) => (
                                        <div key={std._id} className="flex items-center justify-between p-3 text-sm">
                                            <div>
                                                <p className="font-semibold text-slate-800">{std.name}</p>
                                                <p className="text-xs text-slate-400 font-mono">{std.rollNumber} • {std.department}</p>
                                            </div>
                                            <button
                                                onClick={() => handleMarkAttendance(std._id)}
                                                className="rounded-lg bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-750 hover:bg-indigo-100"
                                            >
                                                Mark Present
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Right Status Sidebar */}
            <div className="space-y-6">
                <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-slate-800">Registration Status</h3>
                    
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-400 font-medium">Volunteers Enlisted</span>
                            <span className="font-bold text-slate-700">{event.registeredStudents?.length || 0} / {event.participantLimit}</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-650 to-violet-500 rounded-full"
                                style={{ width: `${Math.min(100, ((event.registeredStudents?.length || 0) / event.participantLimit) * 100)}%` }}
                            ></div>
                        </div>
                    </div>

                    {regSuccess && (
                        <div className="rounded-xl bg-emerald-50 p-4 text-xs font-semibold text-emerald-800">
                            {regSuccess}
                        </div>
                    )}

                    {user?.role === "student" && (
                        <div className="space-y-3 pt-4 border-t border-slate-100">
                            {isRegistered ? (
                                <button disabled className="w-full rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-400">
                                    ✓ Already Registered
                                </button>
                            ) : isLimitReached ? (
                                <button disabled className="w-full rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-400">
                                    ⚠️ Event Limit Reached
                                </button>
                            ) : event.status === "Completed" ? (
                                <button disabled className="w-full rounded-xl bg-slate-100 py-3.5 text-sm font-bold text-slate-400">
                                    Drive Concluded
                                </button>
                            ) : (
                                <button
                                    onClick={handleRegister}
                                    className="w-full rounded-xl bg-indigo-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-150 hover:bg-indigo-700 transition"
                                >
                                    Register for Drive
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Event Attendance QR code helper for coordinators */}
                {isStaff && (
                    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-4 text-center">
                        <h3 className="text-lg font-bold text-slate-800">Attendance Code</h3>
                        <div className="rounded-2xl bg-indigo-50/50 p-5 border border-indigo-100">
                            <p className="text-3xl font-extrabold text-indigo-700 tracking-wider font-mono">
                                {attendanceCode?.passcode || event.attendanceCode || "------"}
                            </p>
                            <p className="text-xs text-indigo-500 mt-2 font-medium">
                                {attendanceCode?.expiresAt || event.attendanceCodeExpiresAt
                                    ? `Expires at ${new Date(attendanceCode?.expiresAt || event.attendanceCodeExpiresAt).toLocaleTimeString()}`
                                    : "Generate a code before taking student attendance"}
                            </p>
                        </div>
                        <button
                            onClick={handleGenerateAttendanceCode}
                            disabled={generatingCode || event.status === "Completed"}
                            className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {generatingCode ? "Generating..." : "Generate Attendance Code"}
                        </button>
                        <p className="text-xs text-slate-400">
                            Students must enter this code from their attendance page to check in.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
