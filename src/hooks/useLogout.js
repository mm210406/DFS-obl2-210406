import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router'
import { ROUTES } from '../config/constants'
import { logout } from '../features/user.slice'
import { clearSession } from '../utils/session'

const useLogout = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  return () => {
    clearSession()
    dispatch(logout())
    navigate(ROUTES.LOGIN)
  }
}

export default useLogout
