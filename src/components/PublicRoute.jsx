import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router'
import { homePath } from '../utils/session'

const PublicRoute = () => {
  const { token, user } = useSelector((state) => state.user)

  if (token) return <Navigate to={homePath(user)} replace />

  return <Outlet />
}

export default PublicRoute
