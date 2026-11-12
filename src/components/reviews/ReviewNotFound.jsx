import Icon from '../Icon'

const ReviewNotFound = ({ onRefresh }) => {
  return (
    <div className="review-missing" role="alert">
      <Icon name="alert" className="review-missing__icon" />
      <div className="review-missing__text">
        <p className="review-missing__title">Esta reseña ya no existe</p>
        <p>Puede que la hayas borrado desde otra pestaña.</p>
      </div>
      <button type="button" className="btn btn--outline btn--sm" onClick={onRefresh}>
        <Icon name="refresh" size={16} />
        Actualizar reseñas
      </button>
    </div>
  )
}

export default ReviewNotFound
