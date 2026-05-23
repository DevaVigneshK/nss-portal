import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AttendancePage() {
    const [events, setEvents] = useState([]);
    const [selectedEventId, setSelectedEventId] = useState("");
    const [passcode, setPasscode] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchMyEvents = async () => {
            try {
                // Fetch upcoming/active events so the student can check-in
                const res = await axios.get("/events");
                setEvents(res.data.filter(e => e.status !== "Completed"));
            } catch (err) {
                console.error("Failed to fetch events:", err);
            }
        };
        fetchMyEvents();
    }, []);

    const handleCheckIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setSuccess(false);
        try {
            const res = await axios.post("/attendance/check-in", {
                eventId: selectedEventId,
                passcode
            });
            setMessage(res.data.message || "Checked in successfully!");
            setSuccess(true);
            setPasscode("");
        } catch (err) {
            setMessage(err.response?.data?.message || "Check-in failed. Invalid passcode or event.");
            setSuccess(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto space-y-6">
            <div className="text-center space-y-2">
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-700">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-4v-4m-2 4h4m-4 0v4m8-12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </span>
                <h2 className="text-2xl font-bold text-slate-800 !mb-0">Secure Self Check-In</h2>
                <p className="text-sm text-slate-500">Scan QR codes or enter the coordinator's event passcode</p>
            </div>

            {message && (
                <div className={`rounded-xl p-4 text-sm font-semibold text-left ${
                    success ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
                }`}>
                    {success ? "✓" : "⚠️"} {message}
                </div>
            )}

            <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
                <form onSubmit={handleCheckIn} className="space-y-4 text-left">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Select Active NSS Drive</label>
                        <select
                            required
                            value={selectedEventId}
                            onChange={(e) => setSelectedEventId(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 bg-white"
                        >
                            <option value="">Choose Active Event</option>
                            {events.map((e) => (
                                <option key={e._id} value={e._id}>
                                    {e.title} ({e.date})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase">Coordinator's Passcode / QR Token</label>
                        <input
                            required
                            type="text"
                            placeholder="e.g. NSS-A4C89D"
                            value={passcode}
                            onChange={(e) => setPasscode(e.target.value)}
                            className="mt-1 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 tracking-wider text-center font-mono"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !selectedEventId}
                        className="w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white shadow-lg hover:bg-indigo-700 transition disabled:opacity-50"
                    >
                        {loading ? "Checking In..." : "Check In & Claim Hours"}
                    </button>
                </form>
            </div>
        </div>
    );
}
