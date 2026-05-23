import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CertificatePage() {
    const [certificates, setCertificates] = useState([]);
    const [eligibleEvents, setEligibleEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCertificate, setActiveCertificate] = useState(null);

    const fetchCertificatesAndEligibility = async () => {
        setLoading(true);
        try {
            // Get already generated certificates
            const certsRes = await axios.get("/certificates/my");
            setCertificates(certsRes.data);

            // Get events attended to see if eligible for a new certificate
            const attendanceRes = await axios.get("/attendance");
            // Find completed events attended by the student
            const attended = attendanceRes.data.filter(att => att.status === "Present" && att.eventId?.status === "Completed");
            
            // Filter out events that already have a certificate generated
            const alreadyGeneratedEventIds = certsRes.data.map(c => c.eventId?._id);
            const eligible = attended.filter(att => !alreadyGeneratedEventIds.includes(att.eventId?._id));
            
            setEligibleEvents(eligible);
        } catch (err) {
            console.error("Failed to load certificate dashboard:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCertificatesAndEligibility();
    }, []);

    const handleClaimCertificate = async (eventId) => {
        try {
            await axios.post("/certificates/generate", { eventId });
            alert("Congratulations! Your NSS Service Certificate has been generated.");
            fetchCertificatesAndEligibility();
        } catch (err) {
            alert(err.response?.data?.message || "Failed to generate certificate");
        }
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 !mb-0">NSS Credential Center</h2>
                <p className="text-sm text-slate-500">Claim, view, and verify your official NSS service certificates</p>
            </div>

            {/* Claims section */}
            {!loading && eligibleEvents.length > 0 && (
                <div className="rounded-3xl border border-indigo-100 bg-indigo-50/50 p-6 space-y-4 text-left">
                    <div className="flex items-center gap-2">
                        <span className="text-xl">🎖️</span>
                        <h3 className="text-lg font-bold text-indigo-900">Unclaimed Service Certificates Available</h3>
                    </div>
                    <p className="text-sm text-indigo-700">You completed hours in these concluded NSS events. Claim your digital certificate now:</p>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {eligibleEvents.map((att) => (
                            <div key={att._id} className="flex items-center justify-between rounded-2xl bg-white border border-indigo-100 p-4 shadow-sm">
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{att.eventId?.title}</h4>
                                    <p className="text-xs text-slate-400 mt-1">Concluded on: {att.eventId?.date}</p>
                                </div>
                                <button
                                    onClick={() => handleClaimCertificate(att.eventId?._id)}
                                    className="rounded-xl bg-indigo-650 px-4 py-2 text-xs font-bold text-white shadow hover:bg-indigo-700 transition"
                                >
                                    Claim Certificate
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Generated Certificates List */}
            {loading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {[1, 2].map((n) => (
                        <div key={n} className="h-48 animate-pulse rounded-2xl bg-slate-100"></div>
                    ))}
                </div>
            ) : certificates.length === 0 ? (
                <div className="rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-500 max-w-lg mx-auto">
                    <p className="text-lg font-medium">No certificates issued yet.</p>
                    <p className="text-sm text-slate-400 mt-1">Complete NSS events, log present status, and coordinator-verify to earn awards.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {certificates.map((cert) => (
                        <div key={cert._id} className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-lg transition">
                            <div className="space-y-3 text-left">
                                <span className="text-3xl">📜</span>
                                <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{cert.eventId?.title}</h3>
                                <p className="text-xs text-slate-400">Issued On: {new Date(cert.issuedAt).toLocaleDateString()}</p>
                                <div className="rounded bg-slate-50 p-2 border border-slate-100 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                                    Hash: {cert.certificateHash}
                                </div>
                            </div>
                            <div className="mt-6 border-t border-slate-50 pt-4 flex items-center justify-between">
                                <span className="text-xs font-bold text-indigo-600">⚡ {cert.hoursCredited} Hours</span>
                                <button
                                    onClick={() => setActiveCertificate(cert)}
                                    className="rounded-lg bg-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 transition shadow-md shadow-indigo-100"
                                >
                                    View Award
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Certificate Interactive Print/Preview Modal */}
            {activeCertificate && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm print:bg-white print:p-0">
                    <div className="w-full max-w-3xl rounded-3xl bg-white p-8 shadow-2xl space-y-6 print:shadow-none print:max-w-none print:w-full print:p-0">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 print:hidden">
                            <h3 className="text-lg font-bold text-slate-800">Certificate of Commendation</h3>
                            <div className="flex items-center gap-2">
                                <button onClick={handlePrint} className="rounded-lg border px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50">
                                    Print / Save PDF
                                </button>
                                <button onClick={() => setActiveCertificate(null)} className="text-slate-400 hover:text-slate-600 font-bold px-2">
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Certificate Body Container */}
                        <div id="nss-certificate-print" className="relative border-8 border-indigo-700 bg-slate-50/50 p-12 text-center space-y-6 rounded-2xl print:border-8 print:p-8">
                            {/* Ornament corner borders */}
                            <div className="absolute top-2 left-2 border-t-2 border-l-2 border-indigo-700 h-6 w-6"></div>
                            <div className="absolute top-2 right-2 border-t-2 border-r-2 border-indigo-700 h-6 w-6"></div>
                            <div className="absolute bottom-2 left-2 border-b-2 border-l-2 border-indigo-700 h-6 w-6"></div>
                            <div className="absolute bottom-2 right-2 border-b-2 border-r-2 border-indigo-700 h-6 w-6"></div>

                            <div className="space-y-2">
                                <h4 className="font-extrabold tracking-widest text-indigo-700 uppercase text-xs">National Service Scheme</h4>
                                <h1 className="text-4xl font-serif font-black tracking-tight text-slate-800">Certificate of Merit</h1>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">NOT ME BUT YOU</p>
                            </div>

                            <p className="font-serif italic text-slate-500 text-lg">This is to officially certify that</p>

                            <div className="border-b-2 border-dashed border-indigo-700/30 max-w-md mx-auto pb-1 mt-4">
                                <h2 className="text-3xl font-extrabold text-indigo-900 font-serif tracking-tight">{activeCertificate.studentId?.name || "Student Volunteer"}</h2>
                            </div>

                            <p className="max-w-xl mx-auto text-sm text-slate-650 leading-relaxed font-serif">
                                has actively participated as a volunteer in the scheduled NSS activity namely <strong className="text-slate-850 font-bold">"{activeCertificate.eventId?.title}"</strong> conducted at <strong className="text-slate-850 font-bold">"{activeCertificate.eventId?.venue}"</strong> on <strong className="text-slate-850 font-bold">"{activeCertificate.eventId?.date}"</strong>, completing <strong className="text-indigo-700 font-extrabold">{activeCertificate.hoursCredited} hours</strong> of dedicated community social service.
                            </p>

                            <div className="grid grid-cols-2 gap-8 border-t border-slate-100 pt-8 mt-8">
                                <div className="space-y-1">
                                    <div className="h-10 flex items-end justify-center">
                                        <span className="font-serif italic text-slate-450 border-b border-slate-200 w-24">Coordinator</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">NSS Coordinator</p>
                                </div>
                                <div className="space-y-1">
                                    <div className="h-10 flex items-end justify-center">
                                        <span className="font-serif italic text-slate-450 border-b border-slate-200 w-24">Principal</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Institution Principal</p>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100 text-[10px] text-slate-400 space-y-1">
                                <p className="font-mono">VERIFICATION HASH: {activeCertificate.certificateHash}</p>
                                <p className="font-sans">Authenticity verified online via NSS Portal. Generated Digitally.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
