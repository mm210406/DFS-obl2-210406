import { MAX_POINTS, MIN_POINTS } from '../../config/constants'
import FieldError from '../FieldError'

const POINTS = Array.from({ length: MAX_POINTS - MIN_POINTS + 1 }, (_, index) => MIN_POINTS + index)

const PointsPicker = ({ id, register, value, error }) => {
  return (
    <fieldset className="points-picker" aria-describedby={`${id}-error`}>
      <legend className="field-label">Puntaje</legend>
      <div className="points-picker__options">
        {POINTS.map((points) => (
          <label
            key={points}
            className={`points-picker__option ${value === points ? 'points-picker__option--selected' : ''}`}
          >
            <input type="radio" value={points} className="sr-only" {...register('points')} />
            {points}
          </label>
        ))}
      </div>
      <FieldError id={`${id}-error`} message={error} />
    </fieldset>
  )
}

export default PointsPicker
