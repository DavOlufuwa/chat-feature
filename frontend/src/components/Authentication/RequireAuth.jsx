import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const RequireAuth = () => {
  const { user } = useAuth()
  const location = useLocation();

  return user.accessToken ? <Outlet /> : 
  <Navigate to="/" state={{ from: location }} replace />
  // <Outlet />
}

export default RequireAuth