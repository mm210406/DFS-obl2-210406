import { Outlet } from 'react-router'
import valance from '../../assets/valance.png'
import BrandTicket from '../BrandTicket'

// Fondo de telón cerrado con el toldo arriba; el logo y la tarjeta van delante
const AuthLayout = () => {
  return (
    <div className="auth">
      <img className="auth__valance" src={valance} alt="" />
      <div className="auth__content">
        <BrandTicket />
        {/* Reserva el alto del formulario más largo para que el fondo no cambie entre pantallas */}
        <div className="auth__form-slot">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
