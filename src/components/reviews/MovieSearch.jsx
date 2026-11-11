import { useEffect, useState } from 'react'
import { api } from '../../config/api.config'
import { getYear } from '../../utils/format'
import Icon from '../Icon'

const MIN_SEARCH_LENGTH = 2
const SEARCH_DELAY_MS = 400
const MAX_RESULTS = 6

const MovieSearch = ({ onSelect }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searchedTitle, setSearchedTitle] = useState('')
  const [searchError, setSearchError] = useState(false)

  const title = query.trim()
  const canSearch = title.length >= MIN_SEARCH_LENGTH

  useEffect(() => {
    if (!canSearch) return

    let ignore = false
    const timer = setTimeout(() => {
      api
        .get('/movies', { params: { title } })
        .then((res) => {
          if (!ignore) setResults(res.data.movies.slice(0, MAX_RESULTS))
        })
        .catch(() => {
          if (!ignore) setSearchError(true)
        })
        .finally(() => {
          if (!ignore) setSearchedTitle(title)
        })
    }, SEARCH_DELAY_MS)

    return () => {
      ignore = true
      clearTimeout(timer)
    }
  }, [title, canSearch])

  const changeQuery = (e) => {
    setQuery(e.target.value)
    setSearchError(false)
  }

  const upToDate = searchedTitle === title

  let status = ''
  if (!upToDate) status = 'Buscando películas...'
  else if (searchError) status = 'No pudimos buscar películas. Probá de nuevo.'
  else if (results.length === 0) status = 'No encontramos películas con ese nombre.'

  return (
    <div className="movie-search">
      <label htmlFor="movie-search-input" className="field-label">
        Película
      </label>
      <div className="movie-search__box">
        <Icon name="search" className="movie-search__icon" />
        <input
          id="movie-search-input"
          type="search"
          className="input movie-search__input"
          placeholder="Buscá la película por su nombre"
          value={query}
          onChange={changeQuery}
          autoComplete="off"
          autoFocus
        />
      </div>

      {canSearch && (
        <div className="movie-search__results">
          <p className="movie-search__status" role="status">
            {status}
          </p>
          {upToDate && !searchError && results.length > 0 && (
            <ul className="movie-search__list" aria-label="Películas encontradas">
              {results.map((movie) => (
                <li key={movie.tmdbId}>
                  <button
                    type="button"
                    className="movie-option"
                    disabled={movie.reviewedByMe}
                    onClick={() => onSelect(movie)}
                  >
                    <span className="movie-option__poster" aria-hidden="true">
                      {movie.posterUrl ? <img src={movie.posterUrl} alt="" /> : <Icon name="film" />}
                    </span>
                    <span className="movie-option__info">
                      <span className="movie-option__title">
                        {movie.title}{' '}
                        <span className="movie-option__year">{getYear(movie.releaseDate)}</span>
                      </span>
                      <span className="movie-option__genres">
                        {movie.genres.map((genre) => genre.name).join(' · ')}
                      </span>
                    </span>
                    {movie.reviewedByMe && (
                      <span className="movie-option__badge">Ya la reseñaste</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default MovieSearch
