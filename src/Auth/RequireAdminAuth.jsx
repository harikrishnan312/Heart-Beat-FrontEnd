import { useLocation, Navigate, Outlet } from 'react-router-dom';


function RequireAdminAuth({ logged }) {
  const admin = localStorage.getItem('adminToken')
  const location = useLocation();
  return (
    logged ? (
      admin ? <Outlet />
        : <Navigate to='/admin/login' state={{ from: location }} replace />
    ) : (
      admin ? <Navigate to='/admin/home' state={{ from: location }} replace /> : <Outlet />
    )
  );
}

export default RequireAdminAuth
