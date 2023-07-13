import { useLocation, Navigate, Outlet } from 'react-router-dom';


function RequireUserAuth({ logged }) {
  const user = localStorage.getItem('token')
  const location = useLocation();
  return (
    logged ? (
      user ? <Outlet />
        : <Navigate to='/login' state={{ from: location }} replace />
    ) : (
      user ? <Navigate to='/home' state={{ from: location }} replace /> : <Outlet />
    )
  );
}

export default RequireUserAuth
