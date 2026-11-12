import { useCallback, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { logout } from '../features/user.slice'
import { clearReviews } from '../features/reviews.slice'
import { clearMovies } from '../features/movies.slice'
import { clearSession } from '../utils/session'
import { ROUTES } from '../config/constants'
import useClickOutside from '../hooks/useClickOutside'
import Avatar from './Avatar'

const UserMenu = () => {
  const user = useSelector((state) => state.user.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const closeMenu = useCallback(() => setOpen(false), [])
  useClickOutside(menuRef, closeMenu, open)

  const closeSession = () => {
    clearSession()
    dispatch(logout())
    dispatch(clearReviews())
    dispatch(clearMovies())
    navigate(ROUTES.LOGIN)
  }

  return (
    <div className="user-menu" ref={menuRef}>
      <button
        type="button"
        className="user-menu__button"
        aria-label="Menú de usuario"
        aria-expanded={open}
        aria-controls="user-menu-list"
        onClick={() => setOpen(!open)}
      >
        <Avatar user={user} />
      </button>
      {open && (
        <div id="user-menu-list" className="user-menu__list">
          <p className="user-menu__name">@{user?.name}</p>
          <Link to={ROUTES.PROFILE} onClick={closeMenu}>Mi perfil</Link>
          <button type="button" className="user-menu__logout" onClick={closeSession}>
            Cerrar sesión
          </button>
        </div>
      )}
    </div>
  )
}

export default UserMenu
