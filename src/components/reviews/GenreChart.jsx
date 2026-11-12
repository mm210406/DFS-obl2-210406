import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import { api } from '../../config/api.config'

ChartJS.register(ArcElement, Tooltip)

const COLORS = [
  '#F6C445',
  '#E07A5F',
  '#9C99E6',
  '#6C8FD9',
  '#C77DBA',
  '#4FB3A2',
  '#D83A2E',
  '#A3C76D',
  '#F0A3B5',
  '#7FC8E8',
]

const groupGenres = (genres) => {
  if (genres.length <= COLORS.length) return genres

  const main = genres.slice(0, COLORS.length - 1)
  const othersCount = genres
    .slice(COLORS.length - 1)
    .reduce((sum, genre) => sum + genre.count, 0)

  return [...main, { genreId: 'others', name: 'Otros', count: othersCount }]
}

const options = {
  cutout: '60%',
  plugins: { legend: { display: false } },
}

const GenreChart = () => {
  const total = useSelector((state) => state.reviews.total)
  const edits = useSelector((state) => state.reviews.edits)
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (total === 0) return

    api
      .get('/users/me/stats')
      .then((res) => {
        setStats(res.data)
        setError(false)
      })
      .catch(() => setError(true))
  }, [total, edits])

  const header = (
    <div>
      <h2 id="genre-chart-title" className="panel__title">
        Tus reseñas por género
      </h2>
      <p className="panel__note">
        Una película puede contar en varios géneros, por eso suman más que tus reseñas.
      </p>
    </div>
  )

  if (total === 0) {
    return (
      <section className="panel genre-chart" aria-labelledby="genre-chart-title">
        {header}
        <div className="genre-chart__empty">
          <span className="genre-chart__empty-ring" aria-hidden="true" />
          <p>Cuando escribas tu primera reseña, acá vas a ver qué géneros mira más tu familia.</p>
        </div>
      </section>
    )
  }

  if (error) return <p className="muted">No pudimos cargar tus estadísticas.</p>

  if (!stats) {
    return (
      <section className="panel genre-chart" aria-labelledby="genre-chart-title" aria-busy="true">
        {header}
        <div className="genre-chart__content" aria-hidden="true">
          <div className="genre-chart__doughnut">
            <div className="skeleton skeleton--circle" />
          </div>
          <ul className="genre-chart__legend">
            {[1, 2, 3, 4].map((line) => (
              <li key={line}>
                <span className="skeleton skeleton--line" />
              </li>
            ))}
          </ul>
        </div>
        <p className="genre-chart__footer" aria-hidden="true">
          <span className="skeleton skeleton--line" />
        </p>
      </section>
    )
  }

  const genres = groupGenres(stats.genres)
  const genresTotal = genres.reduce((sum, genre) => sum + genre.count, 0)
  const percentage = (count) => Math.round((count / genresTotal) * 100)

  const data = {
    labels: genres.map((genre) => genre.name),
    datasets: [
      {
        data: genres.map((genre) => genre.count),
        backgroundColor: COLORS,
        borderColor: '#10103A',
        borderWidth: 3,
      },
    ],
  }

  const chartLabel = `Reseñas por género. ${genres
    .map((genre) => `${genre.name}: ${genre.count}`)
    .join('; ')}.`

  return (
    <section className="panel genre-chart" aria-labelledby="genre-chart-title">
      {header}

      <div className="genre-chart__content">
        <div className="genre-chart__doughnut">
          <Doughnut data={data} options={options} role="img" aria-label={chartLabel} />
          <p className="genre-chart__center" aria-hidden="true">
            <span>{stats.reviews}</span> reseñas
          </p>
        </div>

        <ul className="genre-chart__legend" aria-hidden="true">
          {genres.map((genre, index) => (
            <li key={genre.genreId}>
              <span className="genre-chart__color" style={{ background: COLORS[index] }} />
              <span className="genre-chart__name">{genre.name}</span>
              <span className="genre-chart__count">{genre.count}</span>
              <span className="genre-chart__percentage">{percentage(genre.count)}%</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="genre-chart__footer">
        Tu promedio: <strong className="genre-chart__average">{stats.average.toLocaleString('es-UY')}</strong> · Tu favorito:{' '}
        <strong>{stats.favoriteGenre}</strong>
      </p>
    </section>
  )
}

export default GenreChart
