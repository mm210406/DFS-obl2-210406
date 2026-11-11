import Icon from '../Icon'
import PointsRange, { isFullPointsRange } from './PointsRange'

const ReviewFilters = ({
  title,
  genreId,
  points,
  genres,
  onTitleChange,
  onGenreChange,
  onPointsChange,
  onClear,
}) => {
  const hasFilters = Boolean(title || genreId) || !isFullPointsRange(points)

  return (
    <form
      role="search"
      aria-label="Filtrar mis reseñas"
      className="review-filters"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="review-filters__field">
        <label htmlFor="filter-title" className="review-filters__label">
          Película
        </label>
        <div className="review-filters__search">
          <Icon name="search" size={18} className="review-filters__icon" />
          <input
            id="filter-title"
            type="search"
            className="review-filters__control review-filters__control--search"
            placeholder="Buscar por título"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
          />
        </div>
      </div>

      <div className="review-filters__field">
        <label htmlFor="filter-genre" className="review-filters__label">
          Género
        </label>
        <select
          id="filter-genre"
          className="review-filters__control"
          value={genreId}
          onChange={(e) => onGenreChange(e.target.value)}
        >
          <option value="">Todos</option>
          {genres.map((genre) => (
            <option key={genre._id} value={genre._id}>
              {genre.name}
            </option>
          ))}
        </select>
      </div>

      <div className="review-filters__field">
        <span id="filter-points-label" className="review-filters__label">
          Puntaje
        </span>
        <PointsRange
          labelId="filter-points-label"
          from={points.from}
          to={points.to}
          onChange={onPointsChange}
        />
      </div>

      <button
        type="button"
        className="review-filters__clear"
        onClick={onClear}
        disabled={!hasFilters}
      >
        Limpiar
      </button>
    </form>
  )
}

export default ReviewFilters
