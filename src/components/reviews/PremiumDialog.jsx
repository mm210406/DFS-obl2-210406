import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api, getErrorMessage } from '../../config/api.config'
import { login } from '../../features/user.slice'
import { saveSession } from '../../utils/session'
import FormAlert from '../FormAlert'
import Icon from '../Icon'

const PremiumDialog = ({ open, onClose, onWriteReview }) => {
  const dispatch = useDispatch()
  const total = useSelector((state) => state.reviews.total)
  const dialogRef = useRef(null)
  const [step, setStep] = useState('confirm')
  const [error, setError] = useState(null)

  const sending = step === 'sending'

  useEffect(() => {
    const dialog = dialogRef.current
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  const close = () => {
    if (sending) return
    setStep('confirm')
    setError(null)
    onClose()
  }

  const preventCloseWhileSending = (e) => {
    if (sending) e.preventDefault()
  }

  const upgrade = () => {
    setStep('sending')
    setError(null)

    api
      .patch('/users/plan')
      .then((res) => {
        saveSession(res.data)
        dispatch(login(res.data))
        setStep('success')
      })
      .catch((err) => {
        setError(getErrorMessage(err))
        setStep('confirm')
      })
  }

  const writeReview = () => {
    close()
    onWriteReview()
  }

  return (
    <dialog
      ref={dialogRef}
      className="premium-dialog"
      aria-labelledby="premium-dialog-title"
      onClose={close}
      onCancel={preventCloseWhileSending}
    >
      <button
        type="button"
        className="premium-dialog__close"
        onClick={close}
        disabled={sending}
        aria-label="Cerrar"
      >
        <Icon name="close" size={18} strokeWidth={2.8} />
      </button>

      {step === 'success' ? (
        <div className="premium-dialog__success">
          <div className="premium-ticket" role="img" aria-label="Entrada Premium">
            <span className="premium-ticket__label">Premium</span>
            <span className="premium-ticket__stub">
              <Icon name="star" size={34} filled />
            </span>
          </div>
          <h2 id="premium-dialog-title" className="premium-dialog__title">
            ¡Ya sos Premium!
          </h2>
          <p className="premium-dialog__text" role="status">
            Ahora podés reseñar todas las películas que quieras.
          </p>
          <div className="premium-dialog__actions premium-dialog__actions--center">
            <button type="button" className="btn btn--ghost btn--lg" onClick={close}>
              Cerrar
            </button>
            <button type="button" className="btn btn--primary btn--lg" onClick={writeReview}>
              Escribir una reseña
            </button>
          </div>
        </div>
      ) : (
        <>
          <span className="premium-dialog__icon" aria-hidden="true">
            <Icon name="star" size={30} filled />
          </span>
          <h2 id="premium-dialog-title" className="premium-dialog__title">
            ¿Pasarte a Premium?
          </h2>
          <p className="premium-dialog__text">Vas a dejar el plan Plus. El cambio es inmediato.</p>
          <ul className="premium-dialog__benefits">
            <li>
              <Icon name="check" size={18} strokeWidth={3} />
              <span>Reseñas ilimitadas para toda la familia.</span>
            </li>
            <li>
              <Icon name="check" size={18} strokeWidth={3} />
              <span>
                {total === 1 ? 'Tu reseña queda' : `Tus ${total} reseñas quedan`} como{' '}
                {total === 1 ? 'está' : 'están'}.
              </span>
            </li>
          </ul>
          <p className="premium-dialog__note">Una vez en Premium no se puede volver a Plus.</p>

          {error && (
            <div className="premium-dialog__alert">
              <FormAlert title="No pudimos cambiar tu plan" text={error} />
            </div>
          )}

          <div className="premium-dialog__actions">
            <button type="button" className="btn btn--ghost btn--lg" onClick={close} disabled={sending}>
              Ahora no
            </button>
            <button
              type="button"
              className="btn btn--primary btn--lg"
              onClick={upgrade}
              disabled={sending}
              aria-busy={sending}
            >
              {sending && <span className="spinner" aria-hidden="true" />}
              {sending ? 'Cambiando plan…' : 'Sí, pasarme a Premium'}
            </button>
          </div>
        </>
      )}
    </dialog>
  )
}

export default PremiumDialog
