import { Link, useLocation } from 'react-router'
import { ROUTES } from '../../config/constants'
import useGenres from '../../hooks/useGenres'
import { getYear } from '../../utils/format'
import { getGenreIcon } from '../../utils/genres'
import Icon from '../Icon'
import MovieScoreTicket from './MovieScoreTicket'

const MovieHero = ({ movie }) => {
  const location = useLocation()
  const allGenres = useGenres()
  const backTo = location.state?.backTo ?? ROUTES.MOVIES
  const year = getYear(movie.releaseDate)

  const fullGenre = (genre) => allGenres.find((item) => item._id === genre._id)

  return (
    <section className="movie-hero" aria-labelledby="movie-title">
      <div className="movie-hero__backdrop" aria-hidden="true">
        {movie.backdropUrl && <img src={movie.backdropUrl} alt="" />}
      </div>

      <div className="container container--wide movie-hero__content">
        <div className="movie-hero__poster">
          {movie.posterUrl ? (
            <img src={movie.posterUrl} alt={`Póster de ${movie.title}`} />
          ) : (
            <Icon name="film" size={48} strokeWidth={1.5} />
          )}
        </div>

        <div className="movie-hero__info">
          <Link to={backTo} className="catalog-header__back">
            <Icon name="chevronLeft" size={16} strokeWidth={2.6} />
            Volver al catálogo
          </Link>
          <h1 id="movie-title" className="movie-hero__title">
            {movie.title}
          </h1>
          {year && <p className="movie-hero__year">Estrenada en {year}</p>}
          {movie.genres.length > 0 && (
            <ul className="movie-hero__genres" aria-label="Géneros">
              {movie.genres.map((genre) => (
                <li key={genre._id} className="movie-hero__genre">
                  <span aria-hidden="true">{getGenreIcon(fullGenre(genre))}</span>
                  {genre.name}
                </li>
              ))}
            </ul>
          )}
          <p className="movie-hero__overview">
            {movie.overview || 'Todavía no tenemos la sinopsis de esta película.'}
          </p>
        </div>

        <div className="movie-hero__score">
          <MovieScoreTicket score={movie.score} />
        </div>
      </div>
    </section>
  )
}

export default MovieHero
