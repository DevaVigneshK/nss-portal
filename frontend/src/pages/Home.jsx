import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Home() {
    const { user } = useContext(AuthContext);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [error, setError] = useState("");

    // Create Event Form state
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [venue, setVenue] = useState("");
    const [category, setCategory] = useState("Tree Plantation");
    const [limit, setLimit] = useState(50);
    const [hours, setHours] = useState(3);
    const [reqs, setReqs] = useState("");

    const fetchEvents = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/events");
            setEvents(res.data);
        } catch (err) {
            console.error("Failed to load events:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleCreateEvent = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await axios.post("/events", {
                title,
                description,
                date,
                time,
                venue,
                category,
                participantLimit: Number(limit),
                hoursCredited: Number(hours),
                volunteerRequirements: reqs
            });
            setShowCreateModal(false);
            fetchEvents();
            // Reset form
            setTitle("");
            setDescription("");
            setDate("");
            setTime("");
            setVenue("");
            setReqs("");
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create event");
        }
    };

    const isStaff = user && (user.role === "organizer" || user.role === "admin");

    return (
        <div className="space-y-8">
            {/* Banner Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-violet-500 p-8 text-white shadow-xl shadow-indigo-100">
                <div className="relative z-10 max-w-2xl space-y-4">
                    <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
                        NSS Objective: NOT ME BUT YOU
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl !my-0 leading-tight">
                        Empowering Youth for Community Service
                    </h1>
                    <p className="text-indigo-100 md:text-lg">
                        Welcome to the NSS Activity Management Portal. Manage NSS enrollments, track volunteer hours, register for campus drives, and generate authentic service certificates.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
                <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-sm font-semibold text-slate-400 uppercase">Tree Planted</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">1,250+</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-sm font-semibold text-slate-400 uppercase">Blood Units</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">480+</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-sm font-semibold text-slate-400 uppercase">Camps Done</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">18</p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md">
                    <p className="text-sm font-semibold text-slate-400 uppercase">Active Hours</p>
                    <p className="mt-2 text-2xl font-bold text-slate-800">3,400+</p>
                </div>
            </div>

            {/* Heading Section */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 !mb-0">NSS Activity Directory</h2>
                    <p className="text-sm text-slate-500">Explore, register, and coordinate community events</p>
                </div>
                {isStaff && (
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-150 hover:bg-indigo-700 transition"
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-4v-4m-2 4h4m-4 0v4m8-12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Schedule NSS Event
                    </button>
                )}
            </div>

            {/* Events Directory */}
            {loading ? (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((n) => (
                        <div key={n} className="h-64 animate-pulse rounded-2xl bg-slate-100"></div>
                    ))}
                </div>
            ) : events.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center">
                    <p className="text-lg font-medium text-slate-500">No scheduled NSS activities found.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {events.map((event) => (
                        <div key={event._id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/15">
                                        {event.category}
                                    </span>
                                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                                        event.status === "Completed"
                                            ? "bg-slate-100 text-slate-700"
                                            : event.status === "Active"
                                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20"
                                            : "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-650/20"
                                    }`}>
                                        {event.status}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 line-clamp-1">{event.title}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{event.description}</p>
                            </div>

                            <div className="mt-6 border-t border-slate-100 pt-4 space-y-2">
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <span>📍 {event.venue}</span>
                                    <span>📅 {event.date}</span>
                                </div>
                                <div className="flex items-center justify-between mt-3">
                                    <span className="text-xs font-bold text-indigo-600">⚡ {event.hoursCredited} Credit Hours</span>
                                    <Link
                                        to={`/events/${event._id}`}
                                        className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 hover:text-indigo-600"
                                    >
                                        Details
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Create Event Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl space-y-4 overflow-y-auto max-h-[90vh]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <h3 className="text-xl font-bold text-slate-800">Schedule NSS Drive</h3>
                            <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                                ✕
                            </button>
                        </div>

                        {error && <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-600">{error}</div>}

                        <form onSubmit={handleCreateEvent} className="space-y-4 text-left">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Event Title</label>
                                <input required type="text" placeholder="e.g. Blood Donation Camp" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Description</label>
                                <textarea required rows="3" placeholder="Explain the drive's goals and instructions" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600"></textarea>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Date</label>
                                    <input required type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Time</label>
                                    <input type="text" placeholder="10:00 AM" value={time} onChange={(e) => setTime(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Venue</label>
                                <input required type="text" placeholder="e.g. Campus Seminar Hall" value={venue} onChange={(e) => setVenue(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Category</label>
                                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600">
                                        <option value="Blood Donation">Blood Donation</option>
                                        <option value="Tree Plantation">Tree Plantation</option>
                                        <option value="Awareness Rally">Awareness Rally</option>
                                        <option value="Cleaning Campaign">Cleaning Campaign</option>
                                        <option value="Social Service">Social Service</option>
                                        <option value="Medical Camp">Medical Camp</option>
                                        <option value="Educational">Educational</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Limit</label>
                                    <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Credit Hours</label>
                                    <input type="number" value={hours} onChange={(e) => setHours(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase">Poster Image Link</label>
                                    <input type="text" placeholder="Cloudinary or web URL" className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none" disabled value="Cloudinary / Auto integration" />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase">Special Requirements</label>
                                <input type="text" placeholder="Active participation, bring gloves etc." value={reqs} onChange={(e) => setReqs(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600" />
                            </div>

                            <button type="submit" className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white shadow-lg hover:bg-indigo-700 transition">
                                Create Event
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
