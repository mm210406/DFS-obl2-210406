import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { MAX_POINTS } from '../../config/constants'
import {
  catalogFiltersSchema,
  MAX_YEAR,
  MIN_YEAR,
  NO_MIN_SCORE,
} from '../../validators/movies.validators'
import { getGenreIcon } from '../../utils/genres'
import {
  countCatalogFilters,
  hasCatalogFilters,
  NO_CATALOG_FILTERS,
} from '../../utils/catalogFilters'
import FieldError from '../FieldError'
import Icon from '../Icon'

const toggleItem = (list, item) =>
  list.includes(item)
    ? list.filter((value) => value !== item)
    : [...list, item].sort((a, b) => a - b)

const CatalogFilters = ({ filters, genres, onApply, onClear }) => {
  const [open, setOpen] = useState(false)
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    resolver: joiResolver(catalogFiltersSchema),
    defaultValues: filters,
  })

  useEffect(() => {
    reset(filters)
  }, [filters, reset])

  const applyFilters = (values) => {
    onApply(values)
    setOpen(false)
  }

  const clearFilters = () => {
    reset(NO_CATALOG_FILTERS)
    onClear()
  }

  const minScore = watch('minScore')
  const yearError = errors.yearFrom?.message || errors.yearTo?.message
  const appliedCount = countCatalogFilters(filters)

  return (
    <aside className={`catalog-filters ${open ? 'catalog-filters--open' : ''}`}>
      <button
        type="button"
        className="catalog-filters__toggle"
        aria-expanded={open}
        aria-controls="catalog-filters-form"
        onClick={() => setOpen(!open)}
      >
        Filtros
        {appliedCount > 0 && (
          <span className="catalog-filters__count">
            {appliedCount}
            <span className="sr-only"> aplicados</span>
          </span>
        )}
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={18} />
      </button>

      <form
        id="catalog-filters-form"
        className="catalog-filters__form"
        onSubmit={handleSubmit(applyFilters)}
        noValidate
      >
        <h2 className="catalog-filters__title">Filtros</h2>

        <fieldset className="catalog-filters__group">
          <legend className="catalog-filters__legend">Géneros</legend>
          <Controller
            name="genres"
            control={control}
            render={({ field }) => (
              <div className="genre-chips">
                {genres.map((genre) => {
                  const selected = field.value.includes(genre.tmdbId)
                  return (
                    <button
                      key={genre._id}
                      type="button"
                      aria-pressed={selected}
                      className={`genre-chip ${selected ? 'genre-chip--selected' : ''}`}
                      onClick={() => field.onChange(toggleItem(field.value, genre.tmdbId))}
                    >
                      <span aria-hidden="true">{getGenreIcon(genre.tmdbId)}</span>
                      {genre.name}
                    </button>
                  )
                })}
              </div>
            )}
          />
        </fieldset>

        <fieldset className="catalog-filters__group">
          <legend className="catalog-filters__legend">Año de estreno</legend>
          <div className="catalog-filters__years">
            <label htmlFor="filter-year-from" className="sr-only">
              Desde
            </label>
            <input
              id="filter-year-from"
              type="number"
              inputMode="numeric"
              min={MIN_YEAR}
              max={MAX_YEAR}
              placeholder="Desde"
              className={`input input--sm ${errors.yearFrom ? 'input--error' : ''}`}
              aria-invalid={Boolean(errors.yearFrom)}
              aria-describedby="filter-years-error"
              {...register('yearFrom')}
            />
            <span aria-hidden="true">a</span>
            <label htmlFor="filter-year-to" className="sr-only">
              Hasta
            </label>
            <input
              id="filter-year-to"
              type="number"
              inputMode="numeric"
              min={MIN_YEAR}
              max={MAX_YEAR}
              placeholder="Hasta"
              className={`input input--sm ${errors.yearTo ? 'input--error' : ''}`}
              aria-invalid={Boolean(errors.yearTo)}
              aria-describedby="filter-years-error"
              {...register('yearTo')}
            />
          </div>
          <FieldError id="filter-years-error" message={yearError} />
        </fieldset>

        <div className="catalog-filters__group">
          <label
            htmlFor="filter-min-score"
            className="catalog-filters__legend catalog-filters__score-label"
          >
            Puntaje CineReview
            <span className="catalog-filters__score-value">
              {minScore === NO_MIN_SCORE ? 'Todas' : `${minScore} o más`}
            </span>
          </label>
          <p id="filter-min-score-help" className="catalog-filters__help">
            Promedio de las reseñas de las familias. Solo muestra películas que ya tienen reseñas.
          </p>
          <input
            id="filter-min-score"
            type="range"
            min={NO_MIN_SCORE}
            max={MAX_POINTS}
            step={1}
            className="catalog-filters__range"
            aria-describedby="filter-min-score-help"
            aria-valuetext={minScore === NO_MIN_SCORE ? 'Todas' : `${minScore} o más`}
            {...register('minScore', { valueAsNumber: true })}
          />
          <div className="catalog-filters__scale" aria-hidden="true">
            <span>Todas</span>
            <span>5</span>
            <span>10</span>
          </div>
        </div>

        <div className="catalog-filters__actions">
          <button type="submit" className="btn btn--primary btn--block" disabled={!isDirty}>
            Aplicar filtros
          </button>
          <button
            type="button"
            className="catalog-filters__clear"
            onClick={clearFilters}
            disabled={!isDirty && !hasCatalogFilters(filters)}
          >
            Limpiar filtros
          </button>
        </div>
      </form>
    </aside>
  )
}

export default CatalogFilters
