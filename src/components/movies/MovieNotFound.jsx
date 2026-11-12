import { Link } from 'react-router'
import logoIcon from '../../assets/logo-icon.png'
import { ROUTES } from '../../config/constants'

const MovieNotFound = () => {
  return (
    <section className="container section">
      <div className="catalog-state">
        <span className="catalog-state__ticket" aria-hidden="true">
          <img src={logoIcon} alt="" />
        </span>
        <h1 className="catalog-state__title">No encontramos esta película</h1>
        <p className="catalog-state__text">
          Puede que no exista o que no esté disponible para ver en familia.
        </p>
        <div className="catalog-state__actions">
          <Link to={ROUTES.MOVIES} className="btn btn--primary">
            Ir al catálogo
          </Link>
        </div>
      </div>
    </section>
  )
}

export default MovieNotFound
