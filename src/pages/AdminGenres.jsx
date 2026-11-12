import { useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../config/api.config'
import { setGenres } from '../features/genres.slice'
import FormAlert from '../components/FormAlert'
import Icon from '../components/Icon'
import GenreForm from '../components/admin/GenreForm'
import GenreRow from '../components/admin/GenreRow'

const TABS = [
  { id: 'all', label: 'Todos' },
  { id: 'added', label: 'Agregados' },
  { id: 'missing', label: 'Sin agregar' },
]

const buildRows = (tmdbGenres, dbGenres) =>
  tmdbGenres
    .map((tmdbGenre) => ({
      tmdbId: tmdbGenre.tmdbId,
      tmdbName: tmdbGenre.name,
      genre: dbGenres.find((genre) => genre.tmdbId === tmdbGenre.tmdbId) ?? null,
    }))
    .sort((a, b) =>
      (a.genre?.name ?? a.tmdbName).localeCompare(b.genre?.name ?? b.tmdbName, 'es'),
    )

const AdminGenres = () => {
  const dispatch = useDispatch()
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, rows: null, error: null })
  const [tab, setTab] = useState('all')
  const [editing, setEditing] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [deleteError, setDeleteError] = useState(null)

  const loading = result.key !== attempt
  const { rows, error } = result

  useEffect(() => {
    let ignore = false

    Promise.all([api.get('/genres/tmdb'), api.get('/genres')])
      .then(([tmdbRes, genresRes]) => {
        if (ignore) return
        dispatch(setGenres(genresRes.data))
        setResult({ key: attempt, rows: buildRows(tmdbRes.data, genresRes.data), error: null })
      })
      .catch((err) => {
        if (!ignore) setResult({ key: attempt, rows: null, error: getErrorMessage(err) })
      })

    return () => {
      ignore = true
    }
  }, [attempt, dispatch])

  const refresh = () => setAttempt((current) => current + 1)

  const counts = useMemo(() => {
    const list = rows ?? []
    return {
      allowed: list.filter((row) => row.genre?.allowed).length,
      blocked: list.filter((row) => row.genre && !row.genre.allowed).length,
      missing: list.filter((row) => !row.genre).length,
    }
  }, [rows])

  const visibleRows = (rows ?? []).filter((row) => {
    if (tab === 'added') return row.genre
    if (tab === 'missing') return !row.genre
    return true
  })

  const closeForm = () => setEditing(null)

  const handleSaved = () => {
    setEditing(null)
    refresh()
  }

  const startAdd = (row) => {
    setDeleteError(null)
    setEditing({ tmdbId: row.tmdbId, genre: null })
  }

  const startEdit = (row) => {
    setDeleteError(null)
    setBusyId(row.tmdbId)
    api
      .get(`/genres/${row.genre._id}`)
      .then((res) => setEditing({ tmdbId: row.tmdbId, genre: res.data }))
      .catch((err) => {
        toast.error(getErrorMessage(err, 'No pudimos abrir el género'))
        refresh()
      })
      .finally(() => setBusyId(null))
  }

  const toggle = (row, allowed) => {
    setBusyId(row.tmdbId)
    api
      .patch(`/genres/${row.genre._id}`, { allowed })
      .then((res) => {
        toast.success(`${res.data.name} quedó ${allowed ? 'habilitado' : 'bloqueado'}`)
        refresh()
      })
      .catch((err) => toast.error(getErrorMessage(err, 'No pudimos cambiar el estado')))
      .finally(() => setBusyId(null))
  }

  const remove = (row) => {
    setDeleteError(null)
    setBusyId(row.tmdbId)
    api
      .delete(`/genres/${row.genre._id}`)
      .then(() => {
        toast.success(`Eliminaste ${row.genre.name}`)
        refresh()
      })
      .catch((err) => {
        setDeleteError({
          tmdbId: row.tmdbId,
          name: row.genre.name,
          conflict: err.response?.status === 409,
          message: getErrorMessage(err),
        })
      })
      .finally(() => setBusyId(null))
  }

  const renderList = () => {
    if (!rows && loading) {
      return (
        <p className="muted admin-genres__status" role="status">
          Cargando géneros...
        </p>
      )
    }

    if (!rows && error) {
      return (
        <div className="admin-genres__status">
          <FormAlert title="No pudimos cargar los géneros" text={error} />
          <button type="button" className="btn btn--outline btn--sm" onClick={refresh}>
            <Icon name="refresh" size={16} />
            Reintentar
          </button>
        </div>
      )
    }

    return (
      <>
        <div className="genre-row genre-row--head" aria-hidden="true">
          <span>Ícono</span>
          <span>Género</span>
          <span>Estado</span>
          <span className="genre-row__actions">Acciones</span>
        </div>
        <ul className="admin-genres__list" id="admin-genres-list" role="tabpanel">
          {visibleRows.map((row) => (
            <li
              key={row.tmdbId}
              className={editing?.tmdbId === row.tmdbId ? 'admin-genres__item--editing' : ''}
            >
              {editing?.tmdbId === row.tmdbId ? (
                <GenreForm
                  row={row}
                  genre={editing.genre}
                  onCancel={closeForm}
                  onSaved={handleSaved}
                />
              ) : (
                <GenreRow
                  row={row}
                  busy={busyId === row.tmdbId}
                  onToggle={toggle}
                  onAdd={startAdd}
                  onEdit={startEdit}
                  onDelete={remove}
                />
              )}
              {deleteError?.tmdbId === row.tmdbId && (
                <div className="genre-delete-error" role="alert">
                  <Icon name="alert" className="genre-delete-error__icon" />
                  <div className="genre-delete-error__text">
                    <p className="genre-delete-error__title">
                      No se puede eliminar {deleteError.name}
                    </p>
                    <p>
                      {deleteError.conflict
                        ? 'Hay reseñas de películas de este género. Si no querés que aparezca en el catálogo, dejalo bloqueado.'
                        : deleteError.message}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="genre-delete-error__close"
                    aria-label="Cerrar aviso"
                    onClick={() => setDeleteError(null)}
                  >
                    <Icon name="close" size={18} />
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
        <p className="admin-genres__footer">
          Mostrando {visibleRows.length} de {rows.length} géneros
        </p>
      </>
    )
  }

  return (
    <div className="container section admin-genres">
      <div className="admin-genres__header">
        <div>
          <p className="admin-genres__eyebrow">Administración</p>
          <h1 className="admin-genres__title">Géneros</h1>
          <p className="admin-genres__intro">
            Elegí qué géneros de TMDB usa CineReview. Las películas de un género bloqueado no les
            aparecen a los usuarios en el catálogo ni en las búsquedas.
          </p>
        </div>
        {rows && (
          <ul className="admin-genres__counts" aria-label="Resumen de géneros">
            <li className="genre-count">
              <span className="genre-count__number genre-count__number--allowed">
                {counts.allowed}
              </span>
              {counts.allowed === 1 ? 'habilitado' : 'habilitados'}
            </li>
            <li className="genre-count">
              <span className="genre-count__number genre-count__number--blocked">
                {counts.blocked}
              </span>
              {counts.blocked === 1 ? 'bloqueado' : 'bloqueados'}
            </li>
            <li className="genre-count">
              <span className="genre-count__number">{counts.missing}</span>
              sin agregar
            </li>
          </ul>
        )}
      </div>

      <section className="admin-genres__panel" aria-labelledby="admin-genres-table-title">
        <div className="admin-genres__toolbar">
          <h2 id="admin-genres-table-title" className="admin-genres__table-title">
            Géneros de TMDB
          </h2>
          <div className="admin-genres__tabs" role="tablist" aria-label="Filtrar géneros">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                aria-controls="admin-genres-list"
                className={`admin-genres__tab ${tab === item.id ? 'admin-genres__tab--active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        {renderList()}
      </section>
    </div>
  )
}

export default AdminGenres
