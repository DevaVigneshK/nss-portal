import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Leaderboard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await axios.get("/analytics/stats");
                setLeaderboard(res.data.leaderboard || []);
            } catch (err) {
                console.error("Failed to fetch leaderboard:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
                <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-700 ring-1 ring-inset ring-amber-600/10">
                    🏆 NSS Honor Roll
                </span>
                <h2 className="text-3xl font-extrabold text-slate-800 !mb-0">Volunteer Leaderboard</h2>
                <p className="text-slate-500">Celebrating our top student leaders dedicated to community service</p>
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1, 2, 3, 4].map((n) => (
                        <div key={n} className="h-16 animate-pulse rounded-2xl bg-slate-100"></div>
                    ))}
                </div>
            ) : leaderboard.length === 0 ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-12 text-center text-slate-500">
                    No active student volunteer records available.
                </div>
            ) : (
                <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-100/50">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                                    <th className="px-6 py-4">Rank</th>
                                    <th className="px-6 py-4">Volunteer Name</th>
                                    <th className="px-6 py-4">Roll Number</th>
                                    <th className="px-6 py-4">Department</th>
                                    <th className="px-6 py-4 text-right">Hours Completed</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 text-sm">
                                {leaderboard.map((student, index) => {
                                    const rank = index + 1;
                                    let badgeColor = "bg-slate-100 text-slate-700";
                                    let badgeSymbol = `#${rank}`;

                                    if (rank === 1) {
                                        badgeColor = "bg-amber-100 text-amber-800 border-amber-200 ring-amber-500/20";
                                        badgeSymbol = "🥇 Gold";
                                    } else if (rank === 2) {
                                        badgeColor = "bg-slate-200 text-slate-800 border-slate-300 ring-slate-500/20";
                                        badgeSymbol = "🥈 Silver";
                                    } else if (rank === 3) {
                                        badgeColor = "bg-orange-100 text-orange-850 border-orange-200 ring-orange-500/20";
                                        badgeSymbol = "🥉 Bronze";
                                    }

                                    return (
                                        <tr key={student._id} className="transition hover:bg-slate-50/50">
                                            <td className="px-6 py-4 font-bold">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ring-1 ring-inset ${badgeColor}`}>
                                                    {badgeSymbol}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-slate-800">{student.name}</td>
                                            <td className="px-6 py-4 text-slate-500 font-mono">{student.rollNumber}</td>
                                            <td className="px-6 py-4 text-slate-500">{student.department}</td>
                                            <td className="px-6 py-4 text-right font-extrabold text-indigo-650">{student.volunteerHours || 0} Hrs</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
