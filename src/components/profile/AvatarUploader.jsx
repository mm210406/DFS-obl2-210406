import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../../config/api.config'
import { updateUser } from '../../features/user.slice'
import { saveSession } from '../../utils/session'
import { avatarSchema } from '../../validators/image.validators'
import Avatar from '../Avatar'
import FieldError from '../FieldError'
import Icon from '../Icon'

const AvatarUploader = () => {
  const dispatch = useDispatch()
  const { token, user } = useSelector((state) => state.user)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const saveUser = (updatedUser) => {
    saveSession({ token, user: { ...user, ...updatedUser } })
    dispatch(updateUser(updatedUser))
  }

  const upload = (e) => {
    const file = e.target.files[0]
    e.target.value = ''
    if (!file) return

    const { error: validationError } = avatarSchema.validate({ imagen: [file] })
    if (validationError) {
      setError(validationError.message)
      return
    }

    const formData = new FormData()
    formData.append('imagen', file)

    setSending(true)
    setError('')
    api
      .put('/users/me/avatar', formData)
      .then((res) => {
        saveUser(res.data.user)
        toast.success('Actualizaste tu foto de perfil')
      })
      .catch((err) => setError(getErrorMessage(err, 'No pudimos subir la foto')))
      .finally(() => setSending(false))
  }

  const remove = () => {
    setSending(true)
    setError('')
    api
      .delete('/users/me/avatar')
      .then((res) => {
        saveUser(res.data.user)
        toast.success('Quitaste tu foto de perfil')
      })
      .catch((err) => setError(getErrorMessage(err, 'No pudimos quitar la foto')))
      .finally(() => setSending(false))
  }

  return (
    <div className="avatar-uploader">
      <div className="avatar-uploader__photo" aria-busy={sending}>
        <Avatar user={user} size="xl" />
        {sending && (
          <span className="avatar-uploader__loading" role="status">
            <span className="spinner spinner--light" aria-hidden="true" />
            <span className="sr-only">Guardando tu foto...</span>
          </span>
        )}
      </div>

      <div className="avatar-uploader__actions">
        <label
          htmlFor="avatar-file"
          className={`btn btn--ghost btn--sm avatar-uploader__change ${sending ? 'is-disabled' : ''}`}
        >
          <Icon name="upload" size={16} />
          {user.avatarUrl ? 'Cambiar foto' : 'Subir foto'}
        </label>
        {user.avatarUrl && (
          <button
            type="button"
            className="btn btn--danger-link btn--sm"
            onClick={remove}
            disabled={sending}
          >
            <Icon name="trash" size={16} />
            Quitar foto
          </button>
        )}
      </div>
      <input
        id="avatar-file"
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={upload}
        disabled={sending}
        aria-describedby="avatar-hint avatar-error"
      />
      <FieldError id="avatar-error" message={error} />
    </div>
  )
}

export default AvatarUploader
