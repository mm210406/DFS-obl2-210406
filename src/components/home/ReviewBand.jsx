import { Link } from 'react-router'
import { ROUTES } from '../../config/constants'

const ReviewBand = () => {
  return (
    <section className="container container--wide review-band" aria-labelledby="review-band-title">
      <div className="score-ticket review-band__ticket">
        <div className="review-band__text">
          <h2 id="review-band-title" className="review-band__title">
            ¿La vieron en familia?
          </h2>
          <p className="review-band__subtitle">
            Contá qué les pareció y ayudá a otras familias a elegir.
          </p>
        </div>
        <div className="review-band__action">
          <Link to={ROUTES.MOVIES} className="btn review-band__link">
            Escribir una reseña
          </Link>
        </div>
      </div>
    </section>
  )
}

export default ReviewBand
