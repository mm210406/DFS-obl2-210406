import { Link } from 'react-router'
import logoIcon from '../../assets/logo-icon.png'
import { ROUTES } from '../../config/constants'

const getMessage = (title, hasFilters) => {
  if (title && hasFilters) {
    return {
      heading: `No encontramos películas para “${title}” con estos filtros`,
      text: 'Probá sacando algún filtro o revisá cómo está escrito el título.',
    }
  }
  if (title) {
    return {
      heading: `No encontramos películas para “${title}”`,
      text: 'Revisá cómo está escrito el título o probá con otra palabra.',
    }
  }
  if (hasFilters) {
    return {
      heading: 'No encontramos películas con estos filtros',
      text: 'Probá sacando algún filtro o eligiendo otros.',
    }
  }
  return {
    heading: 'Todavía no hay películas para mostrar',
    text: 'Volvé a intentar en un rato.',
  }
}

const NoMovies = ({ title, hasFilters, onClear }) => {
  const { heading, text } = getMessage(title, hasFilters)

  return (
    <div className="catalog-state">
      <span className="catalog-state__ticket" aria-hidden="true">
        <img src={logoIcon} alt="" />
      </span>
      <h2 className="catalog-state__title">{heading}</h2>
      <p className="catalog-state__text">{text}</p>
      {(hasFilters || title) && (
        <div className="catalog-state__actions">
          {hasFilters && (
            <button type="button" className="btn btn--primary" onClick={onClear}>
              Limpiar filtros
            </button>
          )}
          {title && (
            <Link to={ROUTES.MOVIES} className="btn btn--outline">
              Ver el catálogo
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default NoMovies
