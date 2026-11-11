import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../../config/api.config'
import { ROUTES } from '../../config/constants'
import { formatDate, getYear } from '../../utils/format'
import ScoreTicket from '../ScoreTicket'
import FilmStripPhoto from '../FilmStripPhoto'
import Icon from '../Icon'
import EditReviewForm from './EditReviewForm'

const ReviewCard = ({ review, onDeleted, onRefresh }) => {
  const [mode, setMode] = useState('view')
  const [freshReview, setFreshReview] = useState(null)

  const movieUrl = `${ROUTES.MOVIES}/${review.tmdbId}`
  const genres = review.genres.map((genre) => genre.name).join(' · ')
  const hasOwnPhoto = Boolean(review.imagePublicId)
  const wasEdited = review.updatedAt !== review.createdAt
  const confirmId = `delete-${review._id}`

  const startEdit = () => {
    setMode('loadingEdit')
    api
      .get(`/reviews/${review._id}`)
      .then((res) => {
        setFreshReview(res.data)
        setMode('edit')
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setMode('notFound')
          return
        }
        toast.error(getErrorMessage(error, 'No pudimos abrir tu reseña para editarla'))
        setMode('view')
      })
  }

  const deleteReview = () => {
    setMode('deleting')
    api
      .delete(`/reviews/${review._id}`)
      .then(() => onDeleted(review))
      .catch((error) => {
        if (error.response?.status === 404) {
          setMode('notFound')
          return
        }
        toast.error(getErrorMessage(error, 'No pudimos eliminar tu reseña'))
        setMode('confirmDelete')
      })
  }

  if (mode === 'edit') {
    return (
      <EditReviewForm
        review={freshReview}
        onCancel={() => setMode('view')}
        onSaved={() => setMode('view')}
        onNotFound={() => setMode('notFound')}
      />
    )
  }

  if (mode === 'loadingEdit') {
    return (
      <div className="new-review edit-review" aria-busy="true">
        <p className="edit-review__loading" role="status">
          <span className="spinner spinner--light" aria-hidden="true" />
          Cargando tu reseña…
        </p>
        <div className="edit-review__skeleton" aria-hidden="true">
          <div className="edit-review__skeleton-column">
            <span className="skeleton edit-review__bar edit-review__bar--short" />
            <span className="skeleton edit-review__bar edit-review__bar--field" />
            <span className="skeleton edit-review__bar edit-review__bar--short" />
            <span className="skeleton edit-review__bar edit-review__bar--area" />
          </div>
          <div className="edit-review__skeleton-column">
            <span className="skeleton edit-review__bar edit-review__bar--short" />
            <span className="skeleton edit-review__bar edit-review__bar--photo" />
          </div>
        </div>
      </div>
    )
  }

  if (mode === 'notFound') {
    return (
      <div className="review-missing" role="alert">
        <Icon name="alert" className="review-missing__icon" />
        <div className="review-missing__text">
          <p className="review-missing__title">Esta reseña ya no existe</p>
          <p>Puede que la hayas borrado desde otra pestaña.</p>
        </div>
        <button type="button" className="btn btn--outline btn--sm" onClick={onRefresh}>
          <Icon name="refresh" size={16} />
          Actualizar reseñas
        </button>
      </div>
    )
  }

  const confirming = mode === 'confirmDelete' || mode === 'deleting'
  const deleting = mode === 'deleting'

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
        <button type="button" className="btn btn--outline btn--sm" onClick={startEdit} disabled={deleting}>
          <Icon name="pencil" size={16} />
          Editar
        </button>
        <button
          type="button"
          className="btn btn--danger-link btn--sm"
          aria-expanded={confirming}
          aria-controls={confirmId}
          onClick={() => setMode(confirming ? 'view' : 'confirmDelete')}
          disabled={deleting}
        >
          <Icon name="trash" size={16} />
          Eliminar
        </button>
        <p className="review-card__date">
          Publicada el {formatDate(review.createdAt)}
          {wasEdited && ` · Editada el ${formatDate(review.updatedAt)}`}
        </p>
      </div>

      {confirming && (
        <div
          id={confirmId}
          className="delete-confirm"
          role="alertdialog"
          aria-labelledby={`${confirmId}-title`}
          aria-describedby={`${confirmId}-text`}
        >
          <div className="delete-confirm__message">
            <Icon name="alert" className="delete-confirm__icon" />
            <div>
              <p id={`${confirmId}-title`} className="delete-confirm__title">
                ¿Eliminar tu reseña de {review.movieTitle}?
              </p>
              <p id={`${confirmId}-text`} className="delete-confirm__text">
                {hasOwnPhoto ? 'También se borra la foto. ' : ''}No se puede deshacer.
              </p>
            </div>
          </div>
          <div className="delete-confirm__actions">
            <button
              type="button"
              className="btn btn--sm delete-confirm__cancel"
              onClick={() => setMode('view')}
              disabled={deleting}
              autoFocus
            >
              Cancelar
            </button>
            <button
              type="button"
              className="btn btn--sm delete-confirm__delete"
              onClick={deleteReview}
              disabled={deleting}
            >
              {deleting ? 'Eliminando...' : 'Sí, eliminar'}
            </button>
          </div>
        </div>
      )}
    </article>
  )
}

export default ReviewCard
