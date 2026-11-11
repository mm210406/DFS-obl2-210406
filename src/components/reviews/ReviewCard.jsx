import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'
import { formatDate, getYear } from '../../utils/format'

const ReviewCard = ({ review }) => {
  const movieUrl = `${ROUTES.MOVIES}/${review.tmdbId}`
  const genres = review.genres.map((genre) => genre.name).join(' · ')
  const hasOwnPhoto = Boolean(review.imagePublicId)
  const wasEdited = review.updatedAt !== review.createdAt

  return (
    <article className="review-card" aria-label={`Tu reseña de ${review.movieTitle}`}>
      <Link to={movieUrl} className="review-card__poster" aria-hidden="true" tabIndex={-1}>
        <img src={review.posterUrl} alt="" />
      </Link>

      <div className="review-card__header">
        <div>
          <h3 className="review-card__title">
            <Link to={movieUrl}>{review.movieTitle}</Link>{' '}
            <span className="review-card__year">{getYear(review.releaseDate)}</span>
          </h3>
          <p className="review-card__genres">{genres}</p>
        </div>
        <p className="review-card__points" aria-label={`Puntaje: ${review.points} de 10`}>
          {review.points}
        </p>
      </div>

      <div className="review-card__body">
        <p>{review.description}</p>
        {hasOwnPhoto && (
          <img
            className="review-card__photo"
            src={review.imageUrl}
            alt={`Tu foto de ${review.movieTitle}`}
          />
        )}
      </div>

      <p className="review-card__date">
        Publicada el {formatDate(review.createdAt)}
        {wasEdited && ` · Editada el ${formatDate(review.updatedAt)}`}
      </p>
    </article>
  )
}

export default ReviewCard
