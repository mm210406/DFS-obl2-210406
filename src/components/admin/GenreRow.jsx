import { getGenreIcon } from '../../utils/genres'
import Icon from '../Icon'
import GenreSwitch from './GenreSwitch'

const GenreRow = ({ row, busy, onToggle, onAdd, onEdit, onDelete }) => {
  const { genre } = row
  const name = genre?.name ?? row.tmdbName

  return (
    <div className={`genre-row ${genre ? '' : 'genre-row--missing'}`}>
      <span className="genre-row__icon" aria-hidden="true">
        {genre ? getGenreIcon(genre) : '?'}
      </span>
      <div className="genre-row__name">
        <p className="genre-row__title">{name}</p>
        <p className="genre-row__tmdb">TMDB {row.tmdbId}</p>
      </div>
      <div className="genre-row__status">
        {genre ? (
          <GenreSwitch
            checked={genre.allowed}
            label={`Habilitar ${name}`}
            disabled={busy}
            onChange={(allowed) => onToggle(row, allowed)}
          />
        ) : (
          <span className="genre-row__missing">Sin agregar</span>
        )}
      </div>
      <div className="genre-row__actions">
        {genre ? (
          <>
            <button
              type="button"
              className="btn btn--outline btn--sm"
              onClick={() => onEdit(row)}
              disabled={busy}
            >
              <Icon name="pencil" size={16} />
              Editar
            </button>
            <button
              type="button"
              className="btn btn--danger-link btn--sm"
              onClick={() => onDelete(row)}
              disabled={busy}
              aria-label={`Eliminar ${name}`}
            >
              <Icon name="trash" size={16} />
              Eliminar
            </button>
          </>
        ) : (
          <button
            type="button"
            className="btn btn--primary btn--sm"
            onClick={() => onAdd(row)}
            disabled={busy}
            aria-label={`Agregar ${name}`}
          >
            <Icon name="plus" size={16} strokeWidth={3} />
            Agregar
          </button>
        )}
      </div>
    </div>
  )
}

export default GenreRow
