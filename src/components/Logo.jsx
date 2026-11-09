import { Link } from 'react-router'
import logoIcon from '../assets/logo-icon.png'
import { ROUTES } from '../config/constants'

const Logo = ({ to = ROUTES.HOME }) => {
  return (
    <Link to={to} className="logo" aria-label="CineReview, inicio">
      <img src={logoIcon} alt="" />
    </Link>
  )
}

export default Logo
