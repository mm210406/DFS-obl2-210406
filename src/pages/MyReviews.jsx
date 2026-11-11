import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api, getErrorMessage } from '../config/api.config'
import { REVIEWS_PER_PAGE } from '../config/constants'
import { setReviews } from '../features/reviews.slice'
import FormAlert from '../components/FormAlert'
import ReviewCard from '../components/reviews/ReviewCard'
import Pagination from '../components/Pagination'
import PlanUsage from '../components/reviews/PlanUsage'
import GenreChart from '../components/reviews/GenreChart'

const MyReviews = () => {
  const dispatch = useDispatch()
  const { reviews, pages } = useSelector((state) => state.reviews)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api
      .get('/reviews', { params: { page: currentPage, limit: REVIEWS_PER_PAGE } })
      .then((res) => dispatch(setReviews(res.data)))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false))
  }, [currentPage, dispatch])

  const changePage = (page) => {
    setLoading(true)
    setError(null)
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

  return (
    <section className="container section">
      <h1 className="page-title">Mis reseñas</h1>

      {loading && <p className="muted">Cargando reseñas...</p>}

      {!loading && error && <FormAlert title="No pudimos cargar tus reseñas" text={error} />}

      {!loading && !error && (
        <div className="my-reviews__summary">
          {reviews.length > 0 && <GenreChart />}
          <PlanUsage />
        </div>
      )}

      {!loading && !error && reviews.length === 0 && (
        <p className="muted">Todavía no escribiste ninguna reseña.</p>
      )}

      {!loading && !error && reviews.length > 0 && (
        <>
          <div className="review-list">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
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
  )
}

export default MyReviews
