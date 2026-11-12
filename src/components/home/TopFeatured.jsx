import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'
import { formatScore } from '../../utils/format'
import { countReviews } from '../../utils/plan'
import Icon from '../Icon'
import RankTicket from './RankTicket'

const TopFeatured = ({ movie }) => {
  const image = movie.backdropUrl || movie.posterUrl

  return (
    <article className="top-featured" aria-labelledby="top-featured-title">
      <div className="top-featured__image">
        {image ? <img src={image} alt="" /> : <Icon name="film" size={56} strokeWidth={1.5} />}
        <RankTicket position={movie.position} size="lg" />
      </div>
      <div className="top-featured__body">
        <p className="top-featured__eyebrow">La mejor puntuada del mes</p>
        <h3 id="top-featured-title" className="top-featured__title">
          {movie.title}
        </h3>
        <p className="top-featured__score">
          <span className="top-featured__average">{formatScore(movie.score.average)}</span>
          <span className="muted">· {countReviews(movie.score.count)}</span>
        </p>
        {movie.overview && <p className="top-featured__overview">{movie.overview}</p>}
        <Link
          to={`${ROUTES.MOVIES}/${movie.tmdbId}`}
          className="btn btn--primary btn--lg top-featured__link"
          aria-label={`Ver más de ${movie.title}`}
        >
          Ver más
        </Link>
      </div>
    </article>
  )
}

export default TopFeatured
