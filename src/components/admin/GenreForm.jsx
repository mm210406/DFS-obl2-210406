import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { toast } from 'react-toastify'
import { getGenreIcon } from '../../utils/genres'
import { api, getErrorMessage } from '../../config/api.config'
import {
  addGenreSchema,
  editGenreSchema,
  GENRE_ICON_MAX,
  GENRE_NAME_MAX,
} from '../../validators/genres.validators'
import FieldError from '../FieldError'
import FormAlert from '../FormAlert'
import EmojiPicker from './EmojiPicker'
import GenreSwitch from './GenreSwitch'

const GenreForm = ({ row, genre, onCancel, onSaved }) => {
  const editing = Boolean(genre)
  const idPrefix = `genre-${row.tmdbId}`
  const [sending, setSending] = useState(false)
  const [formAlert, setFormAlert] = useState('')

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    resolver: joiResolver(editing ? editGenreSchema : addGenreSchema),
    mode: 'onTouched',
    defaultValues: {
      icon: genre?.icon ?? '',
      name: genre?.name ?? '',
      allowed: genre?.allowed ?? true,
    },
  })

  const onSubmit = (data) => {
    const body = { icon: data.icon, allowed: data.allowed }
    if (data.name) body.name = data.name

    setSending(true)
    setFormAlert('')
    const request = editing
      ? api.patch(`/genres/${genre._id}`, body)
      : api.post('/genres', { tmdbId: row.tmdbId, ...body })

    request
      .then((res) => {
        toast.success(
          editing ? `Guardaste los cambios de ${res.data.name}` : `Agregaste ${res.data.name}`,
        )
        onSaved()
      })
      .catch((error) => {
        setFormAlert(getErrorMessage(error))
        setSending(false)
      })
  }

  return (
    <form
      className="genre-form"
      onSubmit={handleSubmit(onSubmit)}
      aria-label={`${editing ? 'Editar' : 'Agregar'} ${genre?.name ?? row.tmdbName}`}
      noValidate
    >
      <div className="genre-form__fields">
        <div className="genre-form__icon">
          <label htmlFor={`${idPrefix}-icon`} className="genre-form__label">
            Ícono
          </label>
          <Controller
            name="icon"
            control={control}
            render={({ field }) => (
              <EmojiPicker
                id={`${idPrefix}-icon`}
                value={field.value}
                fallback={getGenreIcon({ tmdbId: row.tmdbId })}
                invalid={Boolean(errors.icon)}
                describedBy={`${idPrefix}-icon-error`}
                maxLength={GENRE_ICON_MAX}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>
        <div className="genre-form__name">
          <label htmlFor={`${idPrefix}-name`} className="genre-form__label">
            Nombre <span className="genre-form__tmdb">· TMDB {row.tmdbId}</span>
          </label>
          <input
            id={`${idPrefix}-name`}
            className={`input input--sm ${errors.name ? 'input--error' : ''}`}
            placeholder={row.tmdbName}
            maxLength={GENRE_NAME_MAX}
            autoFocus
            aria-invalid={Boolean(errors.name)}
            aria-describedby={`${idPrefix}-name-error ${idPrefix}-hint`}
            {...register('name')}
          />
        </div>
        <div className="genre-form__status">
          <Controller
            name="allowed"
            control={control}
            render={({ field }) => (
              <GenreSwitch
                checked={field.value}
                label={`Habilitar ${genre?.name ?? row.tmdbName}`}
                onChange={field.onChange}
              />
            )}
          />
        </div>
        <div className="genre-form__actions">
          <button type="button" className="btn btn--ghost btn--sm" onClick={onCancel} disabled={sending}>
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn--primary btn--sm"
            disabled={sending || (editing && !isDirty)}
          >
            {sending ? 'Guardando...' : editing ? 'Guardar cambios' : 'Agregar género'}
          </button>
        </div>
      </div>

      <FieldError id={`${idPrefix}-icon-error`} message={errors.icon?.message} />
      <FieldError id={`${idPrefix}-name-error`} message={errors.name?.message} />
      <p id={`${idPrefix}-hint`} className="genre-form__hint">
        {editing ? 'El tmdbId no se puede cambiar.' : 'Si dejás el nombre vacío, se usa el de TMDB.'}
      </p>
      {formAlert && (
        <FormAlert
          title={editing ? 'No pudimos guardar los cambios' : 'No pudimos agregar el género'}
          text={formAlert}
        />
      )}
    </form>
  )
}

export default GenreForm
