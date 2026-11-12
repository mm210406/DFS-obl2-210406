import Icon from '../Icon'

const DeleteReviewConfirm = ({ id, movieTitle, hasPhoto, deleting, onCancel, onConfirm }) => {
  return (
    <div
      id={id}
      className="delete-confirm"
      role="alertdialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-text`}
    >
      <div className="delete-confirm__message">
        <Icon name="alert" className="delete-confirm__icon" />
        <div>
          <p id={`${id}-title`} className="delete-confirm__title">
            ¿Eliminar tu reseña de {movieTitle}?
          </p>
          <p id={`${id}-text`} className="delete-confirm__text">
            {hasPhoto ? 'También se borra la foto. ' : ''}No se puede deshacer.
          </p>
        </div>
      </div>
      <div className="delete-confirm__actions">
        <button
          type="button"
          className="btn btn--sm delete-confirm__cancel"
          onClick={onCancel}
          disabled={deleting}
          autoFocus
        >
          Cancelar
        </button>
        <button
          type="button"
          className="btn btn--sm delete-confirm__delete"
          onClick={onConfirm}
          disabled={deleting}
        >
          {deleting ? 'Eliminando...' : 'Sí, eliminar'}
        </button>
      </div>
    </div>
  )
}

export default DeleteReviewConfirm
