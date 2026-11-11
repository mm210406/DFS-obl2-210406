import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../config/api.config'
import { PLANS, PLUS_REVIEW_LIMIT, REVIEWS_PER_PAGE } from '../config/constants'
import { setReviews, removeReview } from '../features/reviews.slice'
import FormAlert from '../components/FormAlert'
import Icon from '../components/Icon'
import ReviewCard from '../components/reviews/ReviewCard'
import Pagination from '../components/Pagination'
import PlanUsage from '../components/reviews/PlanUsage'
import GenreChart from '../components/reviews/GenreChart'
import PlanCard from '../components/reviews/PlanCard'
import EmptyReviews from '../components/reviews/EmptyReviews'
import NewReviewForm from '../components/reviews/NewReviewForm'
import NoQuotaNotice from '../components/reviews/NoQuotaNotice'
import PremiumDialog from '../components/reviews/PremiumDialog'

const MyReviews = () => {
  const dispatch = useDispatch()
  const plan = useSelector((state) => state.user.user.plan)
  const { reviews, pages, total } = useSelector((state) => state.reviews)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [premiumOpen, setPremiumOpen] = useState(false)

  const loadReviews = useCallback(
    (page) =>
      api
        .get('/reviews', { params: { page, limit: REVIEWS_PER_PAGE } })
        .then((res) => dispatch(setReviews(res.data))),
    [dispatch],
  )

  useEffect(() => {
    loadReviews(currentPage)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [currentPage, loadReviews])

  const changePage = (page) => {
    setLoading(true)
    setError(null)
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  const openForm = () => {
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const refreshReviews = () => {
    loadReviews(currentPage).catch(() => toast.error('No pudimos actualizar la lista de reseñas'))
  }

  const handleCreated = () => {
    setFormOpen(false)
    if (currentPage === 1) {
      refreshReviews()
    } else {
      changePage(1)
    }
  }

  const handleDeleted = (review) => {
    dispatch(removeReview(review._id))

    let message = `Eliminaste tu reseña de ${review.movieTitle}.`
    if (plan === PLANS.PLUS) {
      const remaining = PLUS_REVIEW_LIMIT - (total - 1)
      message += ` Ahora te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'reseña' : 'reseñas'} de las ${PLUS_REVIEW_LIMIT} del plan Plus.`
    }
    toast.success(message)

    if (reviews.length === 1 && currentPage > 1) {
      changePage(currentPage - 1)
    } else {
      refreshReviews()
    }
  }

  const noQuota = plan === PLANS.PLUS && total >= PLUS_REVIEW_LIMIT
  const ready = !loading && !error

  const pageText = pages > 1 ? ` · Página ${currentPage} de ${pages}` : ''
  const countText = `${total} ${total === 1 ? 'reseña' : 'reseñas'}${pageText}`

  return (
    <section className="container section">
      <div className="page-header page-header--with-action">
        <div>
          <h1 className="page-title">Mis reseñas</h1>
          <p className="page-subtitle">Lo que tu familia opinó de cada película.</p>
        </div>
        <button
          type="button"
          className="btn btn--primary btn--lg"
          aria-expanded={formOpen}
          aria-controls="new-review-form"
          aria-describedby={noQuota ? 'no-quota-notice' : undefined}
          disabled={!ready || noQuota}
          onClick={() => setFormOpen(!formOpen)}
        >
          <Icon name="plus" size={18} strokeWidth={3} />
          Nueva reseña
          {!noQuota && <Icon name={formOpen ? 'chevronUp' : 'chevronDown'} size={18} />}
        </button>
      </div>

      {loading && <p className="muted">Cargando reseñas...</p>}

      {!loading && error && <FormAlert title="No pudimos cargar tus reseñas" text={error} />}

      {ready && (
        <>
          {noQuota && <NoQuotaNotice onUpgrade={() => setPremiumOpen(true)} />}

          {formOpen && !noQuota && (
            <NewReviewForm onCancel={() => setFormOpen(false)} onCreated={handleCreated} />
          )}

          <div className="my-reviews__summary">
            <GenreChart />
            <div className="my-reviews__aside">
              <PlanUsage />
              <PlanCard onUpgrade={() => setPremiumOpen(true)} />
            </div>
          </div>

          <section className="my-reviews__list" aria-labelledby="my-reviews-list-title">
            <div className="my-reviews__list-header">
              <h2 id="my-reviews-list-title" className="section-title">
                Tus reseñas
              </h2>
              <p className="muted">{countText}</p>
            </div>

            {reviews.length === 0 ? (
              <EmptyReviews onNewReview={openForm} />
            ) : (
              <>
                <div className="review-list">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      onDeleted={handleDeleted}
                      onRefresh={refreshReviews}
                    />
                  ))}
                </div>
                <Pagination
                  page={currentPage}
                  pages={pages}
                  onChange={changePage}
                  label="Páginas de mis reseñas"
                />
              </>
            )}
          </section>
        </>
      )}

      <PremiumDialog
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        onWriteReview={openForm}
      />
    </section>
  )
}

export default MyReviews
