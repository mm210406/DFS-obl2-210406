import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'
import { formatScore } from '../../utils/format'
import { countReviews } from '../../utils/plan'
import Icon from '../Icon'
import RankTicket from './RankTicket'

const TopMovieCard = ({ movie }) => {
  return (
    <article className="top-card">
      <div className="top-card__image">
        {movie.posterUrl ? (
          <img src={movie.posterUrl} alt="" loading="lazy" />
        ) : (
          <Icon name="film" size={40} strokeWidth={1.5} />
        )}
        <RankTicket position={movie.position} />
      </div>
      <div className="top-card__body">
        <div className="top-card__info">
          <h3 className="top-card__title">{movie.title}</h3>
          <p className="top-card__score">
            <span className="top-card__average">{formatScore(movie.score.average)}</span> ·{' '}
            {countReviews(movie.score.count)}
          </p>
        </div>
        <Link
          to={`${ROUTES.MOVIES}/${movie.tmdbId}`}
          className="btn btn--outline btn--sm top-card__link"
          aria-label={`Ver más de ${movie.title}`}
        >
          Ver más
        </Link>
      </div>
    </article>
  )
}

export default TopMovieCard
