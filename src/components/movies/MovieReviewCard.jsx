import { formatDate } from '../../utils/format'
import Avatar from '../Avatar'
import FilmStripPhoto from '../FilmStripPhoto'
import ScoreTicket from '../ScoreTicket'

const DELETED_AUTHOR = 'Usuario eliminado'

const MovieReviewCard = ({ review, mine = false, children }) => {
  const { author } = review
  const authorName = author.name === DELETED_AUTHOR ? author.name : `@${author.name}`
  const wasEdited = review.updatedAt !== review.createdAt

  return (
    <article
      className={`movie-review ${mine ? 'movie-review--mine' : ''}`}
      aria-label={mine ? 'Tu reseña' : `Reseña de ${author.name}`}
    >
      <div className="movie-review__header">
        <Avatar user={author} />
        <div className="movie-review__author">
          <p className="movie-review__name">
            {authorName}
            {mine && <span className="movie-review__badge">Tu reseña</span>}
          </p>
          <p className="movie-review__date">
            {mine ? 'Publicada el ' : ''}
            {formatDate(review.createdAt)}
            {wasEdited && ` · Editada el ${formatDate(review.updatedAt)}`}
          </p>
        </div>
        <ScoreTicket points={review.points} />
      </div>

      <div className="movie-review__body">
        <p className="movie-review__description">{review.description}</p>
        {review.hasImage && (
          <FilmStripPhoto
            src={review.imageUrl}
            alt={mine ? 'tu foto' : `la foto de ${author.name}`}
          />
        )}
      </div>

      {children}
    </article>
  )
}

export default MovieReviewCard
