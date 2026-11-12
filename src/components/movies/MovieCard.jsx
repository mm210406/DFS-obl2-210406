import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'
import { formatScore, getYear } from '../../utils/format'
import Icon from '../Icon'
import ScoreTicket from '../ScoreTicket'

const MovieCard = ({ movie }) => {
  const { tmdbId, title, releaseDate, posterUrl, genres, score, reviewedByMe, myPoints } = movie
  const details = [getYear(releaseDate), genres.map((genre) => genre.name).join(', ')]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="movie-card">
      <div className="movie-card__poster">
        {posterUrl ? (
          <img src={posterUrl} alt="" loading="lazy" />
        ) : (
          <Icon name="film" size={40} strokeWidth={1.5} />
        )}
        {reviewedByMe && (
          <div className="movie-card__reviewed">
            <ScoreTicket
              points={myPoints}
              label="Reseñada"
              ariaLabel={`Reseñada, tu puntaje: ${myPoints} de 10`}
            />
          </div>
        )}
      </div>

      <div className="movie-card__body">
        <h3 className="movie-card__title">{title}</h3>
        {details && <p className="movie-card__details">{details}</p>}

        {score ? (
          <p className="movie-card__score">
            <span className="sr-only">Puntaje CineReview:</span>
            <span className="movie-card__average">{formatScore(score.average)}</span>
            <span className="movie-card__count">
              {score.count} {score.count === 1 ? 'reseña' : 'reseñas'}
            </span>
          </p>
        ) : (
          <p className="movie-card__count">Sin reseñas todavía</p>
        )}

        <Link
          to={`${ROUTES.MOVIES}/${tmdbId}`}
          className="movie-card__link"
          aria-label={`Ver más de ${title}`}
        >
          Ver más
        </Link>
      </div>
    </article>
  )
}

export default MovieCard
