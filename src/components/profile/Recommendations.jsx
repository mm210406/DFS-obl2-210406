import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'
import { formatDate } from '../../utils/format'
import Icon from '../Icon'

const Recommendations = ({ recommendations, updatedAt, hasReviews }) => {
  const hasRecommendations = recommendations.length > 0

  return (
    <section className="panel recommendations" aria-labelledby="recommendations-title">
      <div>
        <div className="recommendations__heading">
          <Icon name="sparkles" size={22} filled className="recommendations__icon" />
          <h2 id="recommendations-title" className="recommendations__title">
            Recomendadas para vos
          </h2>
        </div>
        <p className="panel__note recommendations__note">
          {hasRecommendations && updatedAt
            ? `Generadas con IA a partir de tus reseñas · Actualizadas el ${formatDate(updatedAt)}`
            : 'Se generan con IA a partir de tus reseñas.'}
        </p>
      </div>

      {hasRecommendations ? (
        <ul className="recommendations__list">
          {recommendations.map((movie) => (
            <li key={movie.tmdbId} className="recommendation">
              <div className="recommendation__poster">
                {movie.posterUrl ? (
                  <img src={movie.posterUrl} alt="" loading="lazy" />
                ) : (
                  <Icon name="film" size={32} strokeWidth={1.5} />
                )}
              </div>
              <div className="recommendation__body">
                <h3 className="recommendation__title">{movie.title}</h3>
                {movie.reason && <p className="recommendation__reason">{movie.reason}</p>}
                <Link
                  to={`${ROUTES.MOVIES}/${movie.tmdbId}`}
                  className="recommendation__link"
                  aria-label={`Ver la película ${movie.title}`}
                >
                  Ver película →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="recommendations__empty">
          <p className="recommendations__empty-title">Todavía no tenemos recomendaciones para vos</p>
          <p className="muted">
            {hasReviews
              ? 'Se actualizan cada vez que publicás una reseña, según lo que les gustó en familia.'
              : 'Escribí tu primera reseña y te sugerimos películas según lo que les gustó en familia.'}
          </p>
          <Link to={ROUTES.MOVIES} className="btn btn--primary">
            Ir al catálogo
          </Link>
        </div>
      )}
    </section>
  )
}

export default Recommendations
