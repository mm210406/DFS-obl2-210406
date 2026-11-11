import { useSelector } from 'react-redux'
import { PLANS } from '../../config/constants'
import Icon from '../Icon'

const PlanCard = ({ onUpgrade }) => {
  const plan = useSelector((state) => state.user.user.plan)
  const isPremium = plan === PLANS.PREMIUM

  return (
    <section
      className={`panel plan-card ${isPremium ? '' : 'plan-card--offer'}`}
      aria-labelledby="plan-card-title"
    >
      <div className="plan-card__header">
        <Icon name="star" size={22} filled className="plan-card__icon" />
        <h2 id="plan-card-title" className="panel__title">
          {isPremium ? 'Tenés Premium' : 'Pasate a Premium'}
        </h2>
      </div>
      <p className="plan-card__text">
        Reseñas ilimitadas para toda la familia.{' '}
        {isPremium ? 'Ya tenés el plan más completo.' : 'El cambio es inmediato.'}
      </p>
      {!isPremium && (
        <button type="button" className="btn btn--primary plan-card__button" onClick={onUpgrade}>
          Cambiar a Premium
        </button>
      )}
    </section>
  )
}

export default PlanCard
