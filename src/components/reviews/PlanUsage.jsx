import { useSelector } from 'react-redux'
import { PLANS, PLUS_REVIEW_LIMIT } from '../../config/constants'

const PlanUsage = () => {
  const plan = useSelector((state) => state.user.user.plan)
  const total = useSelector((state) => state.reviews.total)

  if (plan === PLANS.PREMIUM) {
    return (
      <section className="plan-usage" aria-labelledby="plan-usage-title">
        <div className="plan-usage__header">
          <h2 id="plan-usage-title">Tu uso del plan</h2>
          <span className="plan-usage__plan">Plan Premium</span>
        </div>
        <p className="plan-usage__count">
          <span>{total}</span> reseñas publicadas
        </p>
        <p className="muted">Sin límite: podés reseñar todas las películas que quieras.</p>
      </section>
    )
  }

  const used = Math.min(total, PLUS_REVIEW_LIMIT)
  const percentage = Math.round((used / PLUS_REVIEW_LIMIT) * 100)
  const remaining = PLUS_REVIEW_LIMIT - used
  const slots = Array.from({ length: PLUS_REVIEW_LIMIT }, (_, index) => index + 1)

  const remainingText =
    remaining === 0
      ? 'Llegaste al límite. Si borrás una reseña, recuperás el lugar.'
      : `Te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'reseña' : 'reseñas'}. Si borrás una, recuperás el lugar.`

  return (
    <section className="plan-usage" aria-labelledby="plan-usage-title">
      <div className="plan-usage__header">
        <h2 id="plan-usage-title">Tu uso del plan</h2>
        <span className="plan-usage__plan">Plan Plus</span>
      </div>
      <p className="plan-usage__percentage">
        <span>{percentage}%</span> {used} de {PLUS_REVIEW_LIMIT} reseñas usadas
      </p>
      <ul className="plan-usage__slots" aria-label="Reseñas del plan Plus">
        {slots.map((slot) => (
          <li
            key={slot}
            className={slot <= used ? 'plan-usage__slot--used' : ''}
            aria-label={`Reseña ${slot}: ${slot <= used ? 'usada' : 'disponible'}`}
          >
            {slot}
          </li>
        ))}
      </ul>
      <p className="muted">{remainingText}</p>
    </section>
  )
}

export default PlanUsage
