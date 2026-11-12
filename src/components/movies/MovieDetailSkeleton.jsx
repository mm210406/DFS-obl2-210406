const MovieDetailSkeleton = () => {
  return (
    <div className="movie-hero" aria-hidden="true">
      <div className="movie-hero__backdrop" />
      <div className="container container--wide movie-hero__content">
        <div className="movie-hero__poster skeleton" />
        <div className="movie-hero__info">
          <span className="skeleton movie-hero__skeleton-line movie-hero__skeleton-line--title" />
          <span className="skeleton movie-hero__skeleton-line" />
          <span className="skeleton movie-hero__skeleton-line movie-hero__skeleton-line--long" />
          <span className="skeleton movie-hero__skeleton-line movie-hero__skeleton-line--long" />
        </div>
      </div>
    </div>
  )
}

export default MovieDetailSkeleton
