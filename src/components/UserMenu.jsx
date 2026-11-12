import { useCallback, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { ROUTES } from '../config/constants'
import useClickOutside from '../hooks/useClickOutside'
import useLogout from '../hooks/useLogout'
import Avatar from './Avatar'

const UserMenu = () => {
  const user = useSelector((state) => state.user.user)
  const closeSession = useLogout()
  const [open, setOpen] = useState(false)
  const menuRef = useRef(null)

  const closeMenu = useCallback(() => setOpen(false), [])
  useClickOutside(menuRef, closeMenu, open)

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
