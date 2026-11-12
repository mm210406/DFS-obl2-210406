import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useSearchParams } from 'react-router'
import { api, getErrorMessage } from '../config/api.config'
import { ROUTES } from '../config/constants'
import { setMovies } from '../features/movies.slice'
import useGenres from '../hooks/useGenres'
import { allowedGenres } from '../utils/genres'
import {
  buildCatalogParams,
  filtersFromParams,
  hasCatalogFilters,
  pageFromParams,
} from '../utils/catalogFilters'
import FilmDivider from '../components/FilmDivider'
import FormAlert from '../components/FormAlert'
import Icon from '../components/Icon'
import Pagination from '../components/Pagination'
import ActiveFilters from '../components/movies/ActiveFilters'
import CatalogFilters from '../components/movies/CatalogFilters'
import CatalogUnavailable from '../components/movies/CatalogUnavailable'
import MovieCard from '../components/movies/MovieCard'
import MovieGridSkeleton from '../components/movies/MovieGridSkeleton'
import NoMovies from '../components/movies/NoMovies'

const isServiceDown = (error) => !error.status || error.status >= 500

const Movies = () => {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.user.token)
  const { movies, totalPages } = useSelector((state) => state.movies)
  const allGenres = useGenres()
  const genres = useMemo(() => allowedGenres(allGenres), [allGenres])
  const [searchParams, setSearchParams] = useSearchParams()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, error: null })

  const query = searchParams.toString()
  const title = searchParams.get('title')?.trim() ?? ''
  const page = pageFromParams(searchParams)
  const filters = useMemo(() => filtersFromParams(new URLSearchParams(query)), [query])

  const requestKey = `${token}#${query}#${attempt}`
  const loading = result.key !== requestKey
  const error = loading ? null : result.error

  useEffect(() => {
    let ignore = false

    api
      .get('/movies', { params: buildCatalogParams({ title, filters, page }) })
      .then((res) => {
        if (ignore) return
        dispatch(setMovies(res.data))
        setResult({ key: requestKey, error: null })
      })
      .catch((err) => {
        if (ignore) return
        setResult({
          key: requestKey,
          error: { status: err.response?.status, message: getErrorMessage(err) },
        })
      })

    return () => {
      ignore = true
    }
  }, [requestKey, title, filters, page, dispatch])

  const applyFilters = (newFilters) => {
    setSearchParams(buildCatalogParams({ title, filters: newFilters }))
  }

  const clearFilters = () => {
    setSearchParams(buildCatalogParams({ title }))
  }

  const changePage = (newPage) => {
    setSearchParams(buildCatalogParams({ title, filters, page: newPage }))
    document.getElementById('catalog-results')?.scrollIntoView({ behavior: 'smooth' })
  }

  const retry = () => setAttempt((current) => current + 1)

  const renderResults = () => {
    if (error && isServiceDown(error)) return <CatalogUnavailable onRetry={retry} />

    if (error) {
      return (
        <div className="catalog__alert">
          <FormAlert title="No pudimos mostrar las películas" text={error.message} />
          <button type="button" className="btn btn--outline btn--sm" onClick={clearFilters}>
            Limpiar filtros
          </button>
        </div>
      )
    }

    if (movies.length === 0) {
      return loading ? (
        <MovieGridSkeleton />
      ) : (
        <NoMovies title={title} hasFilters={hasCatalogFilters(filters)} onClear={clearFilters} />
      )
    }

    return (
      <>
        <div className={`movie-grid ${loading ? 'movie-grid--loading' : ''}`}>
          {movies.map((movie) => (
            <MovieCard key={movie.tmdbId} movie={movie} />
          ))}
        </div>
        <Pagination
          page={page}
          pages={totalPages}
          onChange={changePage}
          label={title ? 'Páginas de resultados' : 'Páginas del catálogo'}
        />
      </>
    )
  }

  return (
    <>
      <div className="container container--wide catalog-header">
        {title && (
          <Link to={ROUTES.MOVIES} className="catalog-header__back">
            <Icon name="chevronLeft" size={16} strokeWidth={2.6} />
            Volver al catálogo
          </Link>
        )}
        <h1 className="catalog-header__title">
          {title ? `Resultados para “${title}”` : 'Catálogo'}
        </h1>
        <p className="page-subtitle">
          {title
            ? 'Podés afinar la búsqueda con los filtros.'
            : 'Películas aptas para ver en familia. Elegí una y contá qué les pareció.'}
        </p>
      </div>

      <FilmDivider />

      <div className="container container--wide catalog">
        <CatalogFilters
          filters={filters}
          genres={genres}
          onApply={applyFilters}
          onClear={clearFilters}
        />

        <section
          id="catalog-results"
          className="catalog__results"
          aria-label="Películas"
          aria-busy={loading}
        >
          <div className="catalog__toolbar">
            <ActiveFilters filters={filters} genres={genres} onChange={applyFilters} />
            {!error && totalPages > 0 && movies.length > 0 && (
              <p className="catalog__page muted">
                Página {page} de {totalPages}
              </p>
            )}
          </div>

          {loading && (
            <p className="sr-only" role="status">
              Cargando películas...
            </p>
          )}

          {renderResults()}
        </section>
      </div>
    </>
  )
}

export default Movies
