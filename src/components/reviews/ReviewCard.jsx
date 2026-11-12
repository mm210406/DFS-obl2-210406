import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'
import useReviewActions from '../../hooks/useReviewActions'
import { formatDate, getYear } from '../../utils/format'
import ScoreTicket from '../ScoreTicket'
import FilmStripPhoto from '../FilmStripPhoto'
import Icon from '../Icon'
import EditReviewForm from './EditReviewForm'
import EditReviewLoading from './EditReviewLoading'
import ReviewNotFound from './ReviewNotFound'
import ReviewActionButtons from './ReviewActionButtons'
import DeleteReviewConfirm from './DeleteReviewConfirm'

const ReviewCard = ({ review, onUpdated, onDeleted, onRefresh }) => {
  const actions = useReviewActions(review._id, () => onDeleted(review))

  const movieUrl = `${ROUTES.MOVIES}/${review.tmdbId}`
  const genres = review.genres.map((genre) => genre.name).join(' · ')
  const hasOwnPhoto = Boolean(review.imagePublicId)
  const wasEdited = review.updatedAt !== review.createdAt
  const confirmId = `delete-${review._id}`

  if (actions.mode === 'edit') {
    return (
      <EditReviewForm
        review={actions.freshReview}
        onCancel={actions.showReview}
        onSaved={(updatedReview) => {
          onUpdated(updatedReview)
          actions.showReview()
        }}
        onNotFound={actions.showNotFound}
      />
    )
  }

  if (actions.mode === 'loadingEdit') return <EditReviewLoading />

  if (actions.mode === 'notFound') return <ReviewNotFound onRefresh={onRefresh} />

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
        <ReviewActionButtons
          confirmId={confirmId}
          confirming={actions.confirming}
          deleting={actions.deleting}
          onEdit={actions.startEdit}
          onToggleDelete={actions.toggleConfirm}
        />
        <p className="review-card__date">
          Publicada el {formatDate(review.createdAt)}
          {wasEdited && ` · Editada el ${formatDate(review.updatedAt)}`}
        </p>
      </div>

      {actions.confirming && (
        <DeleteReviewConfirm
          id={confirmId}
          movieTitle={review.movieTitle}
          hasPhoto={hasOwnPhoto}
          deleting={actions.deleting}
          onCancel={actions.showReview}
          onConfirm={actions.deleteReview}
        />
      )}
    </article>
  )
}

export default ReviewCard
