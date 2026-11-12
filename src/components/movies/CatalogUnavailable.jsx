import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'

const BrokenStrip = ({ side }) => (
  <div className={`broken-film__strip broken-film__strip--${side}`}>
    <div className="broken-film__holes" />
    <div className="broken-film__frames" />
    <div className="broken-film__holes" />
  </div>
)

const CatalogUnavailable = ({ onRetry }) => {
  return (
    <div className="catalog-state" role="alert">
      <div className="broken-film" aria-hidden="true">
        <BrokenStrip side="left" />
        <BrokenStrip side="right" />
      </div>
      <h2 className="catalog-state__title">Las películas no están disponibles en este momento</h2>
      <p className="catalog-state__text">
        El servicio que nos da la información de las películas no responde. Tus reseñas siguen
        guardadas.
      </p>
      <div className="catalog-state__actions">
        <button type="button" className="btn btn--primary" onClick={onRetry}>
          Reintentar
        </button>
        <Link to={ROUTES.MY_REVIEWS} className="btn btn--outline">
          Ir a Mis reseñas
        </Link>
      </div>
    </div>
  )
}

export default CatalogUnavailable
