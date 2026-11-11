import { PLUS_REVIEW_LIMIT } from '../../config/constants'

const NoQuotaNotice = ({ onUpgrade }) => {
  return (
    <div id="no-quota-notice" className="no-quota" role="status">
      <div>
        <p className="no-quota__title">Usaste tus {PLUS_REVIEW_LIMIT} reseñas del plan Plus</p>
        <p className="no-quota__text">
          Para publicar otra, pasate a Premium o borrá alguna de tus reseñas.
        </p>
      </div>
      <button type="button" className="btn btn--primary no-quota__button" onClick={onUpgrade}>
        Cambiar a Premium
      </button>
    </div>
  )
}

export default NoQuotaNotice
