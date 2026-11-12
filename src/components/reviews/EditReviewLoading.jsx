const EditReviewLoading = () => {
  return (
    <div className="new-review edit-review" aria-busy="true">
      <p className="edit-review__loading" role="status">
        <span className="spinner spinner--light" aria-hidden="true" />
        Cargando tu reseña…
      </p>
      <div className="edit-review__skeleton" aria-hidden="true">
        <div className="edit-review__skeleton-column">
          <span className="skeleton edit-review__bar edit-review__bar--short" />
          <span className="skeleton edit-review__bar edit-review__bar--field" />
          <span className="skeleton edit-review__bar edit-review__bar--short" />
          <span className="skeleton edit-review__bar edit-review__bar--area" />
        </div>
        <div className="edit-review__skeleton-column">
          <span className="skeleton edit-review__bar edit-review__bar--short" />
          <span className="skeleton edit-review__bar edit-review__bar--photo" />
        </div>
      </div>
    </div>
  )
}

export default EditReviewLoading
