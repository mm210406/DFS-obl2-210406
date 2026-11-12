import { formatScore } from '../../utils/format'
import { countReviews } from '../../utils/plan'

const MovieScoreTicket = ({ score }) => {
  const countText = score ? countReviews(score.count) : 'Todavía sin reseñas'
  const ariaLabel = score
    ? `Puntaje CineReview: ${formatScore(score.average)} de 10, ${countText}`
    : 'Puntaje CineReview: todavía sin reseñas'

  return (
    <div className="score-ticket score-ticket--lg" role="img" aria-label={ariaLabel}>
      <span className="score-ticket__label">
        <span className="score-ticket__title">Puntaje CineReview</span>
        <span className="score-ticket__count">{countText}</span>
      </span>
      <span className="score-ticket__value">
        {score ? (
          <>
            <span className="score-ticket__number">{formatScore(score.average)}</span>
            <span className="score-ticket__max">/10</span>
          </>
        ) : (
          <span className="score-ticket__number">–</span>
        )}
      </span>
    </div>
  )
}

export default MovieScoreTicket
