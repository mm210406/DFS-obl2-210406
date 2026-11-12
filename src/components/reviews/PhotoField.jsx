import { useEffect, useMemo, useRef } from 'react'
import { MAX_IMAGE_SIZE_MB } from '../../validators/image.validators'
import { formatFileSize } from '../../utils/format'
import FieldError from '../FieldError'
import Icon from '../Icon'

const PhotoField = ({ id, register, trigger, setValue, file, error, currentUrl, onRemoveCurrent }) => {
  const fileInputRef = useRef(null)

  const previewUrl = useMemo(
    () => (file && !error ? URL.createObjectURL(file) : null),
    [file, error],
  )

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const { ref, ...field } = register('imagen', { onChange: () => trigger('imagen') })

  const removePhoto = () => {
    setValue('imagen', null, { shouldValidate: true })
    if (fileInputRef.current) fileInputRef.current.value = ''
    if (onRemoveCurrent) onRemoveCurrent()
  }

  const shownUrl = previewUrl || (!file ? currentUrl : null)
  const hasPhoto = Boolean(file || currentUrl)

  return (
    <div className="new-review__photo">
      <span className="field-label">
        Foto <span className="field-label__optional">(opcional)</span>
      </span>
      <input
        id={id}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-describedby={`${id}-error`}
        {...field}
        ref={(element) => {
          ref(element)
          fileInputRef.current = element
        }}
      />

      {!hasPhoto && (
        <label htmlFor={id} className="photo-drop">
          <Icon name="upload" size={28} />
          <span className="photo-drop__title">Elegí una foto</span>
          <span className="photo-drop__hint">Una imagen de hasta {MAX_IMAGE_SIZE_MB} MB</span>
        </label>
      )}

      {hasPhoto && (
        <div className={`photo-drop photo-drop--filled ${error ? 'photo-drop--error' : ''}`}>
          {shownUrl ? (
            <img src={shownUrl} alt="Vista previa de tu foto" className="photo-drop__preview" />
          ) : (
            <span className="photo-drop__title">
              {file.name} · {formatFileSize(file.size)}
            </span>
          )}
          <div className="photo-drop__actions">
            <label htmlFor={id} className="btn btn--ghost btn--sm">
              {error ? 'Elegir otra' : 'Cambiar foto'}
            </label>
            <button type="button" className="btn btn--danger-link btn--sm" onClick={removePhoto}>
              Quitar foto
            </button>
          </div>
        </div>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

export default PhotoField
