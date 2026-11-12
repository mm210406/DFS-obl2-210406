const SKELETON_CARDS = 8

const MovieGridSkeleton = () => {
  return (
    <div className="movie-grid" aria-hidden="true">
      {Array.from({ length: SKELETON_CARDS }, (_, index) => (
        <div key={index} className="movie-card">
          <div className="movie-card__poster skeleton" />
          <div className="movie-card__body">
            <span className="skeleton movie-card__skeleton-line movie-card__skeleton-line--title" />
            <span className="skeleton movie-card__skeleton-line" />
            <span className="skeleton movie-card__skeleton-line movie-card__skeleton-line--short" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default MovieGridSkeleton
