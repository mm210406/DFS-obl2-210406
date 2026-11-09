import { NavLink } from 'react-router'
import { ROUTES } from '../../config/constants'

const AuthTabs = () => {
  return (
    <nav className="auth-tabs" aria-label="Ingresar o crear cuenta">
      <NavLink to={ROUTES.LOGIN}>Ingresar</NavLink>
      <NavLink to={ROUTES.REGISTER}>Crear cuenta</NavLink>
    </nav>
  )
}

export default AuthTabs
