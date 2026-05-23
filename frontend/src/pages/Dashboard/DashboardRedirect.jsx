import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import StudentDashboard from "./StudentDashboard";
import OrganizerDashboard from "./OrganizerDashboard";
import AdminDashboard from "./AdminDashboard";

export default function DashboardRedirect() {
    const { user } = useContext(AuthContext);

    if (!user) return null;

    if (user.role === "admin") {
        return <AdminDashboard />;
    } else if (user.role === "organizer") {
        return <OrganizerDashboard />;
    } else {
        return <StudentDashboard />;
    }
}
