import useReviewActions from '../../hooks/useReviewActions'
import EditReviewForm from '../reviews/EditReviewForm'
import EditReviewLoading from '../reviews/EditReviewLoading'
import ReviewNotFound from '../reviews/ReviewNotFound'
import ReviewActionButtons from '../reviews/ReviewActionButtons'
import DeleteReviewConfirm from '../reviews/DeleteReviewConfirm'
import MovieReviewCard from './MovieReviewCard'

const MyMovieReview = ({ review, movieTitle, onUpdated, onDeleted, onRefresh }) => {
  const actions = useReviewActions(review._id, onDeleted)
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
    <MovieReviewCard review={review} mine>
      <div className="movie-review__footer">
        <ReviewActionButtons
          confirmId={confirmId}
          confirming={actions.confirming}
          deleting={actions.deleting}
          onEdit={actions.startEdit}
          onToggleDelete={actions.toggleConfirm}
        />
      </div>
      {actions.confirming && (
        <DeleteReviewConfirm
          id={confirmId}
          movieTitle={movieTitle}
          hasPhoto={review.hasImage}
          deleting={actions.deleting}
          onCancel={actions.showReview}
          onConfirm={actions.deleteReview}
        />
      )}
    </MovieReviewCard>
  )
}

export default MyMovieReview
