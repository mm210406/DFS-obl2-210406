import { NO_MIN_SCORE } from '../../validators/movies.validators'
import Icon from '../Icon'

const buildChips = (filters, genres) => {
  const chips = filters.genres.map((tmdbId) => ({
    key: `genre-${tmdbId}`,
    label: genres.find((genre) => genre.tmdbId === tmdbId)?.name ?? `Género ${tmdbId}`,
    filters: { ...filters, genres: filters.genres.filter((id) => id !== tmdbId) },
  }))

  if (filters.yearFrom !== '') {
    chips.push({
      key: 'year-from',
      label: `Desde ${filters.yearFrom}`,
      filters: { ...filters, yearFrom: '' },
    })
  }
  if (filters.yearTo !== '') {
    chips.push({
      key: 'year-to',
      label: `Hasta ${filters.yearTo}`,
      filters: { ...filters, yearTo: '' },
    })
  }
  if (filters.minScore !== NO_MIN_SCORE) {
    chips.push({
      key: 'min-score',
      label: `Puntaje CineReview ${filters.minScore} o más`,
      filters: { ...filters, minScore: NO_MIN_SCORE },
    })
  }

  return chips
}

const ActiveFilters = ({ filters, genres, onChange }) => {
  const chips = buildChips(filters, genres)
  if (chips.length === 0) return null

  return (
    <ul className="active-filters" aria-label="Filtros aplicados">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            className="active-filters__chip"
            aria-label={`Quitar filtro ${chip.label}`}
            onClick={() => onChange(chip.filters)}
          >
            {chip.label}
            <Icon name="close" size={14} strokeWidth={3} />
          </button>
        </li>
      ))}
    </ul>
  )
}

export default ActiveFilters
