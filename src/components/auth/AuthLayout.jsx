import { Outlet } from 'react-router'
import valance from '../../assets/valance.png'
import BrandTicket from '../BrandTicket'

const AuthLayout = () => {
  return (
    <div className="auth">
      <img className="auth__valance" src={valance} alt="" />
      <div className="auth__content">
        <BrandTicket />
        <div className="auth__form-slot">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
