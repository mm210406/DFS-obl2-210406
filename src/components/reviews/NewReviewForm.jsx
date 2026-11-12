import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../../config/api.config'
import { PLANS } from '../../config/constants'
import { newReviewSchema } from '../../validators/reviews.validators'
import { getYear } from '../../utils/format'
import { plusQuotaText } from '../../utils/plan'
import MovieSearch from './MovieSearch'
import PointsPicker from './PointsPicker'
import DescriptionField from './DescriptionField'
import PhotoField from './PhotoField'
import FormAlert from '../FormAlert'
import Icon from '../Icon'

const NewReviewForm = ({ fixedMovie, reviewsUsed, onCancel, onCreated }) => {
  const plan = useSelector((state) => state.user.user.plan)
  const loadedTotal = useSelector((state) => state.reviews.total)
  const total = reviewsUsed ?? loadedTotal
  const [movie, setMovie] = useState(fixedMovie ?? null)
  const [sending, setSending] = useState(false)
  const [formAlert, setFormAlert] = useState(null)

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
    defaultValues: {
      tmdbId: fixedMovie?.tmdbId ?? '',
      points: null,
      description: '',
      imagen: null,
    },
  })

  const points = Number(watch('points'))
  const description = watch('description') || ''
  const imageFile = watch('imagen')?.[0]

  const selectMovie = (selected) => {
    setMovie(selected)
    setValue('tmdbId', selected.tmdbId, { shouldValidate: true })
    setFormAlert(null)
  }

  const changeMovie = () => {
    setMovie(null)
    setValue('tmdbId', '', { shouldValidate: true })
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
      .then((res) => {
        toast.success(`¡Publicaste tu reseña de ${movie.title}!`)
        onCreated(res.data)
      })
      .catch((error) => {
        setFormAlert({ title: 'No pudimos publicar la reseña', text: getErrorMessage(error) })
      })
      .finally(() => setSending(false))
  }

  const quotaText =
    plan === PLANS.PLUS ? `Te ${plusQuotaText(total)}` : 'Plan Premium: reseñas ilimitadas'

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
          {fixedMovie ? `Tu reseña de ${fixedMovie.title}` : 'Nueva reseña'}
        </h2>
        <p className="panel__note">{quotaText}</p>
      </div>

      <input type="hidden" {...register('tmdbId')} />
      {!fixedMovie && (
        <div className="new-review__movie">
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
      )}

      <fieldset className="new-review__fields" disabled={!movie}>
        <div className="new-review__main">
          <PointsPicker
            id="new-review-points"
            register={register}
            value={points}
            error={errors.points?.message}
          />
          <DescriptionField
            id="new-review-description"
            register={register}
            value={description}
            error={errors.description?.message}
          />
        </div>
        <PhotoField
          id="new-review-photo"
          register={register}
          trigger={trigger}
          setValue={setValue}
          file={imageFile}
          error={errors.imagen?.message}
        />
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
