import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation, useSearchParams } from 'react-router'
import { ROUTES } from '../config/constants'
import { isAdmin, homePath } from '../utils/session'
import useClickOutside from '../hooks/useClickOutside'
import Logo from './Logo'
import UserMenu from './UserMenu'
import Icon from './Icon'
import NavbarSearch from './NavbarSearch'

const clientLinks = [
  { to: ROUTES.HOME, label: 'Inicio', end: true },
  { to: ROUTES.MOVIES, label: 'Catálogo' },
  { to: ROUTES.MY_REVIEWS, label: 'Mis reseñas' },
]

const adminLinks = [{ to: ROUTES.ADMIN_GENRES, label: 'Géneros' }]

const Navbar = () => {
  const user = useSelector((state) => state.user.user)
  const admin = isAdmin(user)
  const links = admin ? adminLinks : clientLinks
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const searchedTitle = pathname === ROUTES.MOVIES ? (searchParams.get('title') ?? '') : ''

  // En pantallas chicas los links se esconden detrás del botón de menú
  const [menuOpen, setMenuOpen] = useState(false)
  const navRef = useRef(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  useClickOutside(navRef, closeMenu, menuOpen)

  return (
    <header className="navbar">
      <nav className="navbar__inner" ref={navRef} aria-label="Principal">
        <div className="navbar__brand">
          <Logo to={homePath(user)} />
          {admin && <span className="admin-pill">ADMIN</span>}
        </div>

        {!admin && <NavbarSearch key={searchedTitle} initialTitle={searchedTitle} />}

        <div className="navbar__end">
          <ul id="navbar-links" className={`navbar__links ${menuOpen ? 'is-open' : ''}`}>
            {links.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} end={link.end} onClick={closeMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="navbar__actions">
            <UserMenu />
            <button
              type="button"
              className="navbar__toggle"
              aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
              aria-expanded={menuOpen}
              aria-controls="navbar-links"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <Icon name={menuOpen ? 'close' : 'menu'} size={24} />
            </button>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
