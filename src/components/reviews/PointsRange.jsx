import { MAX_POINTS, MIN_POINTS } from '../../config/constants'
import { isFullPointsRange } from '../../utils/points'

const POINTS = Array.from({ length: MAX_POINTS - MIN_POINTS + 1 }, (_, index) => MIN_POINTS + index)
const MIDDLE_POINTS = (MIN_POINTS + MAX_POINTS) / 2

const toPercent = (value) => ((value - MIN_POINTS) / (MAX_POINTS - MIN_POINTS)) * 100

const PointsRange = ({ labelId, from, to, onChange }) => {
  const changeFrom = (e) => onChange({ from: Math.min(Number(e.target.value), to), to })
  const changeTo = (e) => onChange({ from, to: Math.max(Number(e.target.value), from) })

  const fromOnTop = from === to && from > MIDDLE_POINTS
  const ticketClass = `points-range__ticket ${isFullPointsRange({ from, to }) ? 'points-range__ticket--muted' : ''}`

  return (
    <div
      role="group"
      aria-labelledby={labelId}
      className="points-range"
      style={{ '--from': toPercent(from), '--to': toPercent(to) }}
    >
      <span className={`${ticketClass} points-range__ticket--from`} aria-hidden="true">
        {from}
      </span>

      <div className="points-range__slider">
        <div className="points-range__fill" />
        <input
          type="range"
          min={MIN_POINTS}
          max={MAX_POINTS}
          value={from}
          onChange={changeFrom}
          aria-label="Puntaje mínimo"
          className={`points-range__input ${fromOnTop ? 'points-range__input--top' : ''}`}
        />
        <input
          type="range"
          min={MIN_POINTS}
          max={MAX_POINTS}
          value={to}
          onChange={changeTo}
          aria-label="Puntaje máximo"
          className="points-range__input"
        />
      </div>

      <span className={`${ticketClass} points-range__ticket--to`} aria-hidden="true">
        {to}
      </span>

      <div className="points-range__scale" aria-hidden="true">
        {POINTS.map((points) => (
          <span
            key={points}
            className={`points-range__mark ${points >= from && points <= to ? 'points-range__mark--in' : ''}`}
            style={{ '--value': toPercent(points) }}
          >
            {points}
          </span>
        ))}
      </div>
    </div>
  )
}

export default PointsRange
