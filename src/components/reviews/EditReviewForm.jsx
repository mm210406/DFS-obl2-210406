import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../../config/api.config'
import { editReviewSchema } from '../../validators/reviews.validators'
import { formatDate } from '../../utils/format'
import PointsPicker from './PointsPicker'
import DescriptionField from './DescriptionField'
import PhotoField from './PhotoField'
import FormAlert from '../FormAlert'

const EditReviewForm = ({ review, onCancel, onSaved, onNotFound }) => {
  const [removeCurrentPhoto, setRemoveCurrentPhoto] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formAlert, setFormAlert] = useState(null)
  const idPrefix = `edit-${review._id}`

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid, isDirty },
  } = useForm({
    resolver: joiResolver(editReviewSchema),
    mode: 'onTouched',
    defaultValues: {
      points: String(review.points),
      description: review.description,
      imagen: null,
    },
  })

  const points = Number(watch('points'))
  const description = watch('description')
  const imageFile = watch('imagen')?.[0]

  const hasOwnPhoto = Boolean(review.imagePublicId)
  const currentPhotoUrl = hasOwnPhoto && !removeCurrentPhoto ? review.imageUrl : null
  const hasChanges = isDirty || removeCurrentPhoto
  const wasEdited = review.updatedAt !== review.createdAt

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('points', data.points)
    formData.append('description', data.description)
    if (data.imagen?.[0]) formData.append('imagen', data.imagen[0])
    else if (removeCurrentPhoto) formData.append('removeImage', 'true')

    setSaving(true)
    setFormAlert(null)

    api
      .patch(`/reviews/${review._id}`, formData)
      .then((res) => {
        toast.success(`Guardaste los cambios de tu reseña de ${review.movieTitle}`)
        onSaved(res.data)
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          onNotFound()
          return
        }
        setFormAlert({ title: 'No pudimos guardar los cambios', text: getErrorMessage(error) })
      })
      .finally(() => setSaving(false))
  }

  return (
    <form
      className="new-review edit-review"
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby={`${idPrefix}-title`}
      noValidate
    >
      <div className="new-review__header">
        <div>
          <h3 id={`${idPrefix}-title`} className="new-review__title">
            Editar tu reseña de {review.movieTitle}
          </h3>
          <p className="panel__note">
            Publicada el {formatDate(review.createdAt)}
            {wasEdited && ` · Editada el ${formatDate(review.updatedAt)}`}
          </p>
        </div>
      </div>

      <div className="new-review__fields">
        <div className="new-review__main">
          <PointsPicker
            id={`${idPrefix}-points`}
            register={register}
            value={points}
            error={errors.points?.message}
          />
          <DescriptionField
            id={`${idPrefix}-description`}
            register={register}
            value={description}
            error={errors.description?.message}
          />
        </div>
        <PhotoField
          id={`${idPrefix}-photo`}
          register={register}
          trigger={trigger}
          setValue={setValue}
          file={imageFile}
          error={errors.imagen?.message}
          currentUrl={currentPhotoUrl}
          onRemoveCurrent={() => setRemoveCurrentPhoto(hasOwnPhoto)}
        />
      </div>

      {formAlert && (
        <div className="new-review__alert">
          <FormAlert title={formAlert.title} text={formAlert.text} />
        </div>
      )}

      <div className="new-review__actions">
        {removeCurrentPhoto && !imageFile && (
          <p className="panel__note new-review__hint">
            Al guardar se quita tu foto y la reseña vuelve a mostrar el póster.
          </p>
        )}
        <button type="button" className="btn btn--ghost" onClick={onCancel} disabled={saving}>
          Cancelar
        </button>
        <button
          type="submit"
          className="btn btn--primary"
          disabled={!isValid || !hasChanges || saving}
        >
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

export default EditReviewForm
