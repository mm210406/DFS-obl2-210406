import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'

const EmptyReviews = ({ onNewReview }) => {
  return (
    <div className="panel empty-reviews">
      <span className="empty-reviews__ticket" aria-hidden="true">
        1
      </span>
      <h3 className="empty-reviews__title">Todavía no escribiste reseñas</h3>
      <p className="empty-reviews__text">
        Elegí una película que hayan visto en familia y contá qué les pareció. Tu primera reseña
        también activa las recomendaciones.
      </p>
      <div className="empty-reviews__actions">
        <button type="button" className="btn btn--primary" onClick={onNewReview}>
          Nueva reseña
        </button>
        <Link to={ROUTES.MOVIES} className="btn btn--outline">
          Ir al catálogo
        </Link>
      </div>
    </div>
  )
}

export default EmptyReviews
