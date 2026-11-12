import { useSelector } from 'react-redux'
import { PLANS, PLUS_REVIEW_LIMIT } from '../../config/constants'

const PlanUsage = ({ reviewsUsed }) => {
  const plan = useSelector((state) => state.user.user.plan)
  const loadedTotal = useSelector((state) => state.reviews.total)
  const total = reviewsUsed ?? loadedTotal

  if (plan === PLANS.PREMIUM) {
    return (
      <section className="panel plan-usage" aria-labelledby="plan-usage-title">
        <div className="plan-usage__header">
          <h2 id="plan-usage-title" className="panel__title">
            Tu uso del plan
          </h2>
          <span className="plan-usage__plan">Plan Premium</span>
        </div>
        <p className="plan-usage__count">
          <span className="plan-usage__ticket">{total}</span>
          <span>
            reseñas
            <br />
            publicadas
          </span>
        </p>
        <p className="panel__note">Sin límite: podés reseñar todas las películas que quieras.</p>
      </section>
    )
  }

  const used = Math.min(total, PLUS_REVIEW_LIMIT)
  const percentage = Math.round((used / PLUS_REVIEW_LIMIT) * 100)
  const remaining = PLUS_REVIEW_LIMIT - used
  const slots = Array.from({ length: PLUS_REVIEW_LIMIT }, (_, index) => index + 1)

  let remainingText = `Te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'reseña' : 'reseñas'}. Si borrás una, recuperás el lugar.`
  if (used === 0) remainingText = `Tenés ${PLUS_REVIEW_LIMIT} reseñas para escribir.`
  if (remaining === 0) remainingText = 'Llegaste al límite. Si borrás una reseña, recuperás el lugar.'

  return (
    <section className="panel plan-usage" aria-labelledby="plan-usage-title">
      <div className="plan-usage__header">
        <h2 id="plan-usage-title" className="panel__title">
            Tu uso del plan
          </h2>
        <span className="plan-usage__plan">Plan Plus</span>
      </div>
      <p className="plan-usage__percentage">
        <span className="plan-usage__number">{percentage}%</span>
        <span>
          {used} de {PLUS_REVIEW_LIMIT} reseñas usadas
        </span>
      </p>
      <ul className="plan-usage__slots" aria-label="Reseñas del plan Plus">
        {slots.map((slot) => (
          <li
            key={slot}
            role="img"
            className={`plan-usage__slot ${slot <= used ? 'plan-usage__slot--used' : ''}`}
            aria-label={`Reseña ${slot}: ${slot <= used ? 'usada' : 'disponible'}`}
          >
            {slot}
          </li>
        ))}
      </ul>
      <p className="panel__note">{remainingText}</p>
    </section>
  )
}

export default PlanUsage
