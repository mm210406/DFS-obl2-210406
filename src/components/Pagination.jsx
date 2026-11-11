const Pagination = ({ page, pages, onChange, label }) => {
  if (pages <= 1) return null
  
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1)

  return (
    <nav className="pagination" aria-label={label}>
      <button
        type="button"
        className="pagination__arrow"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      {pageNumbers.map((number) => (
        <button
          key={number}
          type="button"
          className={`pagination__number ${number === page ? 'pagination__number--current' : ''}`}
          aria-current={number === page ? 'page' : undefined}
          onClick={() => onChange(number)}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        className="pagination__arrow pagination__arrow--next"
        disabled={page === pages}
        onClick={() => onChange(page + 1)}
      >
        Siguiente
      </button>
    </nav>
  )
}

export default Pagination
