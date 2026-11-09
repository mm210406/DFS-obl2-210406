import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import { ROUTES } from '../config/constants'
import { homePath } from '../utils/session'

// role: si se indica, solo deja pasar a usuarios con ese rol
const ProtectedRoute = ({ role }) => {
  const { token, user } = useSelector((state) => state.user)

  if (!token) return <Navigate to={ROUTES.LOGIN} replace />
  if (role && user?.role !== role) return <Navigate to={homePath(user)} replace />

  return <Outlet />
}

export default ProtectedRoute
