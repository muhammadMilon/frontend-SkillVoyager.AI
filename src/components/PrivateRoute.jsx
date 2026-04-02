import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, adminOnly = false }) => {
    const { user, dbUser, loading } = useContext(AuthContext);

    if (loading) return <div className="flex justify-center items-center h-screen italic">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    // If adminOnly route and user is not admin, redirect to user dashboard
    if (adminOnly && dbUser?.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PrivateRoute;