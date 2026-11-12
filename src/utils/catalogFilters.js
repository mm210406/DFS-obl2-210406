import { NO_MIN_SCORE } from '../validators/movies.validators'

export const NO_CATALOG_FILTERS = {
  genres: [],
  yearFrom: '',
  yearTo: '',
  minScore: NO_MIN_SCORE,
}

export const countCatalogFilters = (filters) =>
  filters.genres.length +
  (filters.yearFrom !== '' ? 1 : 0) +
  (filters.yearTo !== '' ? 1 : 0) +
  (filters.minScore !== NO_MIN_SCORE ? 1 : 0)

export const hasCatalogFilters = (filters) => countCatalogFilters(filters) > 0

const toGenreList = (value) =>
  value
    ? [...new Set(value.split(',').map(Number))]
        .filter((id) => Number.isInteger(id) && id > 0)
        .sort((a, b) => a - b)
    : []

export const filtersFromParams = (params) => ({
  genres: toGenreList(params.get('genres')),
  yearFrom: params.get('yearFrom') ?? '',
  yearTo: params.get('yearTo') ?? '',
  minScore: Number(params.get('minScore')) || NO_MIN_SCORE,
})

export const pageFromParams = (params) => Math.max(1, Number.parseInt(params.get('page'), 10) || 1)

export const buildCatalogParams = ({ title = '', filters = NO_CATALOG_FILTERS, page = 1 }) => {
  const params = {}
  if (title) params.title = title
  if (filters.genres.length > 0) params.genres = filters.genres.join(',')
  if (filters.yearFrom !== '') params.yearFrom = String(filters.yearFrom)
  if (filters.yearTo !== '') params.yearTo = String(filters.yearTo)
  if (filters.minScore !== NO_MIN_SCORE) params.minScore = String(filters.minScore)
  if (page > 1) params.page = String(page)
  return params
}
