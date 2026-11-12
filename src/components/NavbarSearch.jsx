import { useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router'
import { ROUTES } from '../config/constants'
import Icon from './Icon'

const TITLE_MAX_LENGTH = 100

const NavbarSearch = ({ initialTitle }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [searchParams] = useSearchParams()
  const [title, setTitle] = useState(initialTitle)

  const search = (e) => {
    e.preventDefault()

    const params = new URLSearchParams(pathname === ROUTES.MOVIES ? searchParams : undefined)
    const trimmedTitle = title.trim()
    params.delete('page')
    if (trimmedTitle) {
      params.set('title', trimmedTitle)
    } else {
      params.delete('title')
    }

    navigate({ pathname: ROUTES.MOVIES, search: params.toString() })
  }

  return (
    <form role="search" className="navbar-search" onSubmit={search}>
      <Icon name="search" size={20} strokeWidth={2.6} className="navbar-search__icon" />
      <label htmlFor="navbar-search-input" className="sr-only">
        Buscar películas
      </label>
      <input
        id="navbar-search-input"
        type="search"
        className="navbar-search__input"
        placeholder="Buscar..."
        maxLength={TITLE_MAX_LENGTH}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button type="submit" className="navbar-search__button">
        Buscar
      </button>
    </form>
  )
}

export default NavbarSearch
