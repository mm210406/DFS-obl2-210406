import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'
import { formatDate, getYear } from '../../utils/format'
import ScoreTicket from '../ScoreTicket'
import FilmStripPhoto from '../FilmStripPhoto'
import Icon from '../Icon'

const ReviewCard = ({ review }) => {
  const movieUrl = `${ROUTES.MOVIES}/${review.tmdbId}`
  const genres = review.genres.map((genre) => genre.name).join(' · ')
  const hasOwnPhoto = Boolean(review.imagePublicId)
  const wasEdited = review.updatedAt !== review.createdAt

  return (
    <article className="review-card" aria-label={`Tu reseña de ${review.movieTitle}`}>
      <Link to={movieUrl} className="review-card__poster" aria-hidden="true" tabIndex={-1}>
        {review.posterUrl ? <img src={review.posterUrl} alt="" /> : <Icon name="film" size={28} />}
      </Link>

      <div className="review-card__header">
        <div className="review-card__heading">
          <h3 className="review-card__title">
            <Link to={movieUrl}>{review.movieTitle}</Link>{' '}
            <span className="review-card__year">{getYear(review.releaseDate)}</span>
          </h3>
          <p className="review-card__genres">{genres}</p>
        </div>
        <ScoreTicket points={review.points} />
      </div>

      <div className="review-card__body">
        <p className="review-card__description">{review.description}</p>
        {hasOwnPhoto && (
          <FilmStripPhoto src={review.imageUrl} alt={`tu foto de ${review.movieTitle}`} />
        )}
      </div>

      <div className="review-card__footer">
        <p className="review-card__date">
          Publicada el {formatDate(review.createdAt)}
          {wasEdited && ` · Editada el ${formatDate(review.updatedAt)}`}
        </p>
      </div>
    </article>
  )
}

export default ReviewCard
