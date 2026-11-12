import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../config/api.config'
import { PLANS, PLUS_REVIEW_LIMIT } from '../config/constants'
import { setMovie, setMovieReviews, setMyReview } from '../features/movieDetail.slice'
import { countReviews, plusQuotaText } from '../utils/plan'
import FilmDivider from '../components/FilmDivider'
import Icon from '../components/Icon'
import CatalogUnavailable from '../components/movies/CatalogUnavailable'
import MovieDetailSkeleton from '../components/movies/MovieDetailSkeleton'
import MovieHero from '../components/movies/MovieHero'
import MovieNotFound from '../components/movies/MovieNotFound'
import MovieReviewCard from '../components/movies/MovieReviewCard'
import MyMovieReview from '../components/movies/MyMovieReview'
import NewReviewForm from '../components/reviews/NewReviewForm'
import NoQuotaNotice from '../components/reviews/NoQuotaNotice'
import PremiumDialog from '../components/reviews/PremiumDialog'

const REVIEWS_PER_PAGE = 5

const MovieDetail = () => {
  const { tmdbId } = useParams()
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const plan = useSelector((state) => state.user.user.plan)
  const { movie, reviews, myReview, page, pages, total } = useSelector(
    (state) => state.movieDetail,
  )
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, error: null })
  const [reviewsUsed, setReviewsUsed] = useState(0)
  const [formOpen, setFormOpen] = useState(false)
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const requestKey = `${token}#${tmdbId}#${attempt}`
  const loading = result.key !== requestKey
  const error = loading ? null : result.error
  const currentMovie = movie?.tmdbId === Number(tmdbId) ? movie : null

  useEffect(() => {
    let ignore = false

    Promise.all([
      api.get(`/movies/${tmdbId}`),
      api.get(`/movies/${tmdbId}/reviews`, { params: { page: 1, limit: REVIEWS_PER_PAGE } }),
      api.get('/users/me').catch(() => null),
    ])
      .then(([movieRes, reviewsRes, profileRes]) => {
        if (ignore) return
        dispatch(setMovie(movieRes.data))
        dispatch(setMovieReviews(reviewsRes.data))
        if (profileRes) setReviewsUsed(profileRes.data.usage.reviews)
        setResult({ key: requestKey, error: null })
      })
      .catch((err) => {
        if (ignore) return
        setResult({
          key: requestKey,
          error: { status: err.response?.status, message: getErrorMessage(err) },
        })
      })

    return () => {
      ignore = true
    }
  }, [requestKey, tmdbId, dispatch])

  const refresh = () => setAttempt((current) => current + 1)

  const loadMoreReviews = () => {
    setLoadingMore(true)
    api
      .get(`/movies/${tmdbId}/reviews`, { params: { page: page + 1, limit: REVIEWS_PER_PAGE } })
      .then((res) => dispatch(setMovieReviews(res.data)))
      .catch((err) => toast.error(getErrorMessage(err, 'No pudimos cargar más reseñas')))
      .finally(() => setLoadingMore(false))
  }

  const handleCreated = () => {
    setFormOpen(false)
    refresh()
  }

  const handleUpdated = (updatedReview) => {
    dispatch(
      setMyReview({
        ...myReview,
        points: updatedReview.points,
        description: updatedReview.description,
        imageUrl: updatedReview.imageUrl,
        hasImage: Boolean(updatedReview.imagePublicId),
        updatedAt: updatedReview.updatedAt,
      }),
    )
    refresh()
  }

  const handleDeleted = () => {
    dispatch(setMyReview(null))
    let message = `Eliminaste tu reseña de ${currentMovie.title}.`
    if (plan === PLANS.PLUS) message += ` Ahora te ${plusQuotaText(reviewsUsed - 1)}.`
    toast.success(message)
    refresh()
  }

  const openForm = () => {
    setFormOpen(true)
    document.getElementById('movie-reviews-title')?.scrollIntoView({ behavior: 'smooth' })
  }

  if (error?.status === 404) return <MovieNotFound />

  if (error) {
    return (
      <section className="container section">
        <CatalogUnavailable onRetry={refresh} />
      </section>
    )
  }

  if (!currentMovie) {
    return (
      <>
        <p className="sr-only" role="status">
          Cargando película...
        </p>
        <MovieDetailSkeleton />
      </>
    )
  }

  const noQuota = plan === PLANS.PLUS && reviewsUsed >= PLUS_REVIEW_LIMIT
  const canWrite = !myReview && !noQuota
  const othersLeft = pages > page

  return (
    <>
      <MovieHero movie={currentMovie} />
      <FilmDivider />

      <section
        className="container container--wide movie-reviews"
        aria-labelledby="movie-reviews-title"
        aria-busy={loading}
      >
        <div className="movie-reviews__header">
          <div className="movie-reviews__heading">
            <h2 id="movie-reviews-title" className="movie-reviews__title">
              Reseñas
            </h2>
            <p className="muted">{countReviews(total)}</p>
          </div>
          {canWrite && (
            <button
              type="button"
              className="btn btn--primary btn--lg"
              aria-expanded={formOpen}
              aria-controls="new-review-form"
              onClick={() => setFormOpen(!formOpen)}
            >
              Escribir mi reseña
              <Icon name={formOpen ? 'chevronUp' : 'chevronDown'} size={18} />
            </button>
          )}
        </div>

        {!myReview && noQuota && <NoQuotaNotice onUpgrade={() => setPremiumOpen(true)} />}

        {formOpen && canWrite && (
          <NewReviewForm
            fixedMovie={currentMovie}
            reviewsUsed={reviewsUsed}
            onCancel={() => setFormOpen(false)}
            onCreated={handleCreated}
          />
        )}

        {myReview && (
          <MyMovieReview
            key={myReview._id}
            review={myReview}
            movieTitle={currentMovie.title}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
            onRefresh={refresh}
          />
        )}

        {reviews.map((review) => (
          <MovieReviewCard key={review._id} review={review} />
        ))}

        {total === 0 && (
          <div className="panel movie-reviews__empty">
            <p className="movie-reviews__empty-title">Todavía nadie reseñó esta película</p>
            <p className="muted">Contá qué les pareció en familia y sé la primera reseña.</p>
          </div>
        )}

        {othersLeft && (
          <button
            type="button"
            className="btn btn--outline movie-reviews__more"
            onClick={loadMoreReviews}
            disabled={loadingMore}
          >
            {loadingMore ? 'Cargando reseñas...' : 'Ver más reseñas'}
          </button>
        )}
      </section>

      <PremiumDialog
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        onWriteReview={openForm}
      />
    </>
  )
}

export default MovieDetail
