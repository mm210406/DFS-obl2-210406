import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../config/api.config'
import {
  MAX_POINTS,
  MIN_POINTS,
  PLANS,
  PLUS_REVIEW_LIMIT,
  REVIEWS_PER_PAGE,
} from '../config/constants'
import { setReviews, removeReview, replaceReview } from '../features/reviews.slice'
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
import ReviewFilters from '../components/reviews/ReviewFilters'
import useGenres from '../hooks/useGenres'
import { countReviews, plusQuotaText } from '../utils/plan'
import { isFullPointsRange } from '../utils/points'

const NO_FILTERS = { title: '', genreId: '', pointsFrom: '', pointsTo: '' }
const ALL_POINTS = { from: MIN_POINTS, to: MAX_POINTS }
const FILTER_DELAY_MS = 400

const toPointsFilters = (points) =>
  isFullPointsRange(points)
    ? { pointsFrom: '', pointsTo: '' }
    : { pointsFrom: points.from, pointsTo: points.to }

const activeFilters = (filters) =>
  Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== ''))

const hasActiveFilters = (filters) => Object.keys(activeFilters(filters)).length > 0

const MyReviews = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const plan = useSelector((state) => state.user.user.plan)
  const { reviews, pages, total, resultsTotal } = useSelector((state) => state.reviews)
  const genres = useGenres()
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState(NO_FILTERS)
  const [titleInput, setTitleInput] = useState('')
  const [pointsInput, setPointsInput] = useState(ALL_POINTS)
  const [loading, setLoading] = useState(true)
  const [hasLoaded, setHasLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [premiumOpen, setPremiumOpen] = useState(false)

  const loadReviews = useCallback(
    (page, appliedFilters) => {
      return api
        .get('/reviews', {
          params: { page, limit: REVIEWS_PER_PAGE, ...activeFilters(appliedFilters) },
        })
        .then((res) => {
          dispatch(setReviews({ ...res.data, filtered: hasActiveFilters(appliedFilters) }))
          setHasLoaded(true)
        })
    },
    [dispatch],
  )

  useEffect(() => {
    loadReviews(currentPage, filters)
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [currentPage, filters, loadReviews, token])

  const applyFilters = useCallback((newFilters) => {
    setLoading(true)
    setError(null)
    setCurrentPage(1)
    setFilters(newFilters)
  }, [])

  useEffect(() => {
    const title = titleInput.trim()
    const { pointsFrom, pointsTo } = toPointsFilters(pointsInput)
    const unchanged =
      title === filters.title &&
      pointsFrom === filters.pointsFrom &&
      pointsTo === filters.pointsTo
    if (unchanged) return

    const timer = setTimeout(
      () => applyFilters({ ...filters, title, pointsFrom, pointsTo }),
      FILTER_DELAY_MS,
    )
    return () => clearTimeout(timer)
  }, [titleInput, pointsInput, filters, applyFilters])

  const changeGenre = (genreId) => {
    applyFilters({ ...filters, genreId })
  }

  const resetFilterInputs = () => {
    setTitleInput('')
    setPointsInput(ALL_POINTS)
  }

  const clearFilters = () => {
    resetFilterInputs()
    if (hasActiveFilters(filters)) applyFilters(NO_FILTERS)
  }

  const changePage = (page) => {
    setLoading(true)
    setError(null)
    setCurrentPage(page)
    document.getElementById('my-reviews-list-title')?.scrollIntoView({ behavior: 'smooth' })
  }

  const openForm = () => {
    setFormOpen(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const refreshReviews = () => {
    loadReviews(currentPage, filters).catch(() =>
      toast.error('No pudimos actualizar la lista de reseñas'),
    )
  }

  const handleCreated = () => {
    setFormOpen(false)
    resetFilterInputs()
    if (currentPage === 1 && !hasActiveFilters(filters)) {
      refreshReviews()
    } else {
      applyFilters(NO_FILTERS)
    }
  }

  const handleDeleted = (review) => {
    dispatch(removeReview(review._id))

    let message = `Eliminaste tu reseña de ${review.movieTitle}.`
    if (plan === PLANS.PLUS) message += ` Ahora te ${plusQuotaText(total - 1)}.`
    toast.success(message)

    if (reviews.length === 1 && currentPage > 1) {
      changePage(currentPage - 1)
    } else {
      refreshReviews()
    }
  }

  const noQuota = plan === PLANS.PLUS && total >= PLUS_REVIEW_LIMIT

  const pageText = pages > 1 ? ` · Página ${currentPage} de ${pages}` : ''
  const totalText = countReviews(total)
  const countText = `Mostrando ${resultsTotal} de ${totalText}${pageText}`

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
          disabled={!hasLoaded || noQuota}
          onClick={() => setFormOpen(!formOpen)}
        >
          <Icon name="plus" size={18} strokeWidth={3} />
          Nueva reseña
          {!noQuota && <Icon name={formOpen ? 'chevronUp' : 'chevronDown'} size={18} />}
        </button>
      </div>

      {!hasLoaded && loading && <p className="muted">Cargando reseñas...</p>}

      {!hasLoaded && !loading && error && (
        <FormAlert title="No pudimos cargar tus reseñas" text={error} />
      )}

      {hasLoaded && (
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

            {total > 0 && (
              <ReviewFilters
                title={titleInput}
                genreId={filters.genreId}
                points={pointsInput}
                genres={genres}
                onTitleChange={setTitleInput}
                onGenreChange={changeGenre}
                onPointsChange={setPointsInput}
                onClear={clearFilters}
              />
            )}

            {loading && (
              <p className="muted my-reviews__status" role="status">
                Cargando reseñas...
              </p>
            )}

            {!loading && error && (
              <FormAlert title="No pudimos cargar tus reseñas" text={error} />
            )}

            {!loading && !error && total === 0 && <EmptyReviews onNewReview={openForm} />}

            {!loading && !error && total > 0 && reviews.length === 0 && (
              <div className="panel no-results">
                <p className="no-results__title">Ninguna reseña coincide con los filtros</p>
                <p className="muted">Probá con otro título, género o puntaje.</p>
                <button type="button" className="btn btn--outline btn--sm" onClick={clearFilters}>
                  Limpiar filtros
                </button>
              </div>
            )}

            {!loading && !error && reviews.length > 0 && (
              <>
                <div className="review-list">
                  {reviews.map((review) => (
                    <ReviewCard
                      key={review._id}
                      review={review}
                      onUpdated={(updatedReview) => dispatch(replaceReview(updatedReview))}
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
