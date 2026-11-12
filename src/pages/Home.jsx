import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router'
import { api } from '../config/api.config'
import { ROUTES } from '../config/constants'
import FilmDivider from '../components/FilmDivider'
import Jumbotron from '../components/home/Jumbotron'
import ReviewBand from '../components/home/ReviewBand'
import TopFeatured from '../components/home/TopFeatured'
import TopMovieCard from '../components/home/TopMovieCard'

const Home = () => {
  const token = useSelector((state) => state.user.token)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, top: null, failed: false })

  const requestKey = `${token}#${attempt}`
  const loading = result.key !== requestKey
  const { top, failed } = result

  useEffect(() => {
    let ignore = false

    api
      .get('/movies/top')
      .then((res) => {
        if (!ignore) setResult({ key: requestKey, top: res.data, failed: false })
      })
      .catch(() => {
        if (!ignore) setResult({ key: requestKey, top: null, failed: true })
      })

    return () => {
      ignore = true
    }
  }, [requestKey])

  const renderTop = () => {
    if (!top && loading) {
      return (
        <>
          <p className="sr-only" role="status">
            Cargando el Top 10...
          </p>
          <div className="top-featured top-featured--skeleton skeleton" aria-hidden="true" />
        </>
      )
    }

    if (!top && failed) {
      return (
        <div className="catalog-state" role="alert">
          <div className="broken-film" aria-hidden="true">
            {['left', 'right'].map((side) => (
              <div key={side} className={`broken-film__strip broken-film__strip--${side}`}>
                <div className="broken-film__holes" />
                <div className="broken-film__frames" />
                <div className="broken-film__holes" />
              </div>
            ))}
          </div>
          <h3 className="catalog-state__title">No pudimos conectar con CineReview</h3>
          <p className="catalog-state__text">
            Puede ser tu conexión o nuestro servidor. Probá de nuevo en un momento.
          </p>
          <div className="catalog-state__actions">
            <button
              type="button"
              className="btn btn--primary"
              onClick={() => setAttempt((current) => current + 1)}
            >
              Reintentar
            </button>
          </div>
        </div>
      )
    }

    if (top.movies.length === 0) {
      return (
        <div className="catalog-state">
          <h3 className="catalog-state__title">Todavía no hay reseñas este mes</h3>
          <p className="catalog-state__text">
            Elegí una película que hayan visto en familia y sé la primera en contar qué les pareció.
          </p>
          <div className="catalog-state__actions">
            <Link to={ROUTES.MOVIES} className="btn btn--primary">
              Ir al catálogo
            </Link>
          </div>
        </div>
      )
    }

    const [first, ...others] = top.movies

    return (
      <>
        <TopFeatured movie={first} />
        {others.length > 0 && (
          <ul className="top-grid">
            {others.map((movie) => (
              <li key={movie.tmdbId}>
                <TopMovieCard movie={movie} />
              </li>
            ))}
          </ul>
        )}
      </>
    )
  }

  return (
    <>
      <Jumbotron />
      <FilmDivider />

      <section className="container container--wide top-ten" aria-labelledby="top-ten-title">
        <div className="top-ten__header">
          <h2 id="top-ten-title" className="top-ten__title">
            Top 10
          </h2>
          <p className="top-ten__subtitle">
            Las mejor reseñadas de los últimos {top?.days ?? 30} días
          </p>
        </div>
        {renderTop()}
      </section>

      <FilmDivider />
      <ReviewBand />
    </>
  )
}

export default Home
