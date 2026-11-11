import { DESCRIPTION_MIN, DESCRIPTION_MAX } from '../../validators/reviews.validators'
import FieldError from '../FieldError'

const DescriptionField = ({ id, register, value = '', error }) => {
  return (
    <div className="field">
      <label htmlFor={id} className="field-label">
        Comentario
      </label>
      <textarea
        id={id}
        rows={5}
        maxLength={DESCRIPTION_MAX}
        placeholder="Contá qué les pareció en familia"
        className={`input textarea ${error ? 'input--error' : ''}`}
        aria-invalid={!!error}
        aria-describedby={`${id}-help ${id}-error`}
        {...register('description')}
      />
      <div className="new-review__help" id={`${id}-help`}>
        <span>Mínimo {DESCRIPTION_MIN} caracteres.</span>
        <span>
          {value.length} / {DESCRIPTION_MAX}
        </span>
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

export default DescriptionField
