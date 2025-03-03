import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../store/AuthContext";

const PrivateRoutes = () => {
    const { user } = useAuth();

    return user ? <Outlet /> : <Navigate to="/login" />

}

export default PrivateRoutes;