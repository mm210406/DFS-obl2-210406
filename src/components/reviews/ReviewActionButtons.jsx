import Icon from '../Icon'

const ReviewActionButtons = ({ confirmId, confirming, deleting, onEdit, onToggleDelete }) => {
  return (
    <>
      <button
        type="button"
        className="btn btn--outline btn--sm"
        onClick={onEdit}
        disabled={deleting}
      >
        <Icon name="pencil" size={16} />
        Editar
      </button>
      <button
        type="button"
        className="btn btn--danger-link btn--sm"
        aria-expanded={confirming}
        aria-controls={confirmId}
        onClick={onToggleDelete}
        disabled={deleting}
      >
        <Icon name="trash" size={16} />
        Eliminar
      </button>
    </>
  )
}

export default ReviewActionButtons
