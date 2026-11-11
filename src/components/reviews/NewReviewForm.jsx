import { useEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../../config/api.config'
import { PLANS, PLUS_REVIEW_LIMIT } from '../../config/constants'
import {
  newReviewSchema,
  DESCRIPTION_MIN,
  DESCRIPTION_MAX,
  MAX_IMAGE_SIZE_MB,
} from '../../validators/reviews.validators'
import { formatFileSize, getYear } from '../../utils/format'
import MovieSearch from './MovieSearch'
import FieldError from '../FieldError'
import FormAlert from '../FormAlert'
import Icon from '../Icon'

const POINTS = Array.from({ length: 10 }, (_, index) => index + 1)

const NewReviewForm = ({ onCancel, onCreated }) => {
  const plan = useSelector((state) => state.user.user.plan)
  const total = useSelector((state) => state.reviews.total)
  const [movie, setMovie] = useState(null)
  const [sending, setSending] = useState(false)
  const [formAlert, setFormAlert] = useState(null)
  const fileInputRef = useRef(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isValid },
  } = useForm({
    resolver: joiResolver(newReviewSchema),
    mode: 'onTouched',
    defaultValues: { tmdbId: '', points: null, description: '', imagen: null },
  })

  const points = Number(watch('points'))
  const description = watch('description') || ''
  const imageFile = watch('imagen')?.[0]
  const imageIsValid = imageFile && !errors.imagen

  const previewUrl = useMemo(
    () => (imageIsValid ? URL.createObjectURL(imageFile) : null),
    [imageFile, imageIsValid],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const { ref: imageRef, ...imageField } = register('imagen', {
    onChange: () => trigger('imagen'),
  })

  const selectMovie = (selected) => {
    setMovie(selected)
    setValue('tmdbId', selected.tmdbId, { shouldValidate: true })
    setFormAlert(null)
  }

  const changeMovie = () => {
    setMovie(null)
    setValue('tmdbId', '', { shouldValidate: true })
  }

  const removeImage = () => {
    setValue('imagen', null, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const onSubmit = (data) => {
    const formData = new FormData()
    formData.append('tmdbId', data.tmdbId)
    formData.append('points', data.points)
    formData.append('description', data.description)
    if (data.imagen?.[0]) formData.append('imagen', data.imagen[0])

    setSending(true)
    setFormAlert(null)

    api
      .post('/reviews', formData)
      .then(() => {
        toast.success(`¡Publicaste tu reseña de ${movie.title}!`)
        onCreated()
      })
      .catch((error) => {
        setFormAlert({ title: 'No pudimos publicar la reseña', text: getErrorMessage(error) })
      })
      .finally(() => setSending(false))
  }

  const remaining = PLUS_REVIEW_LIMIT - total
  const quotaText =
    plan === PLANS.PLUS
      ? `Te ${remaining === 1 ? 'queda' : 'quedan'} ${remaining} ${remaining === 1 ? 'reseña' : 'reseñas'} de las ${PLUS_REVIEW_LIMIT} del plan Plus`
      : 'Plan Premium: reseñas ilimitadas'

  return (
    <form
      id="new-review-form"
      className="new-review"
      onSubmit={handleSubmit(onSubmit)}
      aria-labelledby="new-review-title"
      noValidate
    >
      <div className="new-review__header">
        <h2 id="new-review-title" className="new-review__title">
          Nueva reseña
        </h2>
        <p className="panel__note">{quotaText}</p>
      </div>

      <div className="new-review__movie">
        <input type="hidden" {...register('tmdbId')} />
        {movie ? (
          <>
            <span className="field-label">Película</span>
            <div className="selected-movie">
              <span className="selected-movie__poster" aria-hidden="true">
                {movie.posterUrl ? <img src={movie.posterUrl} alt="" /> : <Icon name="film" />}
              </span>
              <div className="selected-movie__info">
                <p className="selected-movie__title">
                  {movie.title}{' '}
                  <span className="selected-movie__year">{getYear(movie.releaseDate)}</span>
                </p>
                <p className="selected-movie__genres">
                  {movie.genres.map((genre) => genre.name).join(' · ')}
                </p>
              </div>
              <button type="button" className="btn btn--ghost btn--sm" onClick={changeMovie}>
                Cambiar película
              </button>
            </div>
          </>
        ) : (
          <MovieSearch onSelect={selectMovie} />
        )}
      </div>

      <fieldset className="new-review__fields" disabled={!movie}>
        <div className="new-review__main">
          <fieldset className="points-picker">
            <legend className="field-label">Puntaje</legend>
            <div className="points-picker__options">
              {POINTS.map((value) => (
                <label
                  key={value}
                  className={`points-picker__option ${points === value ? 'points-picker__option--selected' : ''}`}
                >
                  <input type="radio" value={value} className="sr-only" {...register('points')} />
                  {value}
                </label>
              ))}
            </div>
            <FieldError id="points-error" message={errors.points?.message} />
          </fieldset>

          <div className="field">
            <label htmlFor="new-review-description" className="field-label">
              Comentario
            </label>
            <textarea
              id="new-review-description"
              rows={5}
              maxLength={DESCRIPTION_MAX}
              placeholder="Contá qué les pareció en familia"
              className={`input textarea ${errors.description ? 'input--error' : ''}`}
              aria-invalid={!!errors.description}
              aria-describedby="description-help description-error"
              {...register('description')}
            />
            <div className="new-review__help" id="description-help">
              <span>Mínimo {DESCRIPTION_MIN} caracteres.</span>
              <span>
                {description.length} / {DESCRIPTION_MAX}
              </span>
            </div>
            <FieldError id="description-error" message={errors.description?.message} />
          </div>
        </div>

        <div className="new-review__photo">
          <span className="field-label">
            Foto <span className="field-label__optional">(opcional)</span>
          </span>
          <input
            id="new-review-photo"
            type="file"
            accept="image/*"
            className="sr-only"
            aria-describedby="photo-error"
            {...imageField}
            ref={(element) => {
              imageRef(element)
              fileInputRef.current = element
            }}
          />

          {!imageFile && (
            <label htmlFor="new-review-photo" className="photo-drop">
              <Icon name="upload" size={28} />
              <span className="photo-drop__title">Elegí una foto</span>
              <span className="photo-drop__hint">Una imagen de hasta {MAX_IMAGE_SIZE_MB} MB</span>
            </label>
          )}

          {imageFile && (
            <div className={`photo-drop photo-drop--filled ${errors.imagen ? 'photo-drop--error' : ''}`}>
              {previewUrl ? (
                <img src={previewUrl} alt="Vista previa de tu foto" className="photo-drop__preview" />
              ) : (
                <span className="photo-drop__title">
                  {imageFile.name} · {formatFileSize(imageFile.size)}
                </span>
              )}
              <div className="photo-drop__actions">
                <label htmlFor="new-review-photo" className="btn btn--ghost btn--sm">
                  {errors.imagen ? 'Elegir otra' : 'Cambiar foto'}
                </label>
                <button type="button" className="btn btn--danger-link btn--sm" onClick={removeImage}>
                  Quitar foto
                </button>
              </div>
            </div>
          )}
          <FieldError id="photo-error" message={errors.imagen?.message} />
        </div>
      </fieldset>

      {formAlert && (
        <div className="new-review__alert">
          <FormAlert title={formAlert.title} text={formAlert.text} />
        </div>
      )}

      <div className="new-review__actions">
        {!movie && <p className="panel__note new-review__hint">Elegí una película para seguir.</p>}
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn--primary" disabled={!isValid || sending}>
          {sending ? 'Publicando...' : 'Publicar reseña'}
        </button>
      </div>
    </form>
  )
}

export default NewReviewForm
