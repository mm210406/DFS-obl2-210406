const MAX_VISIBLE_PAGES = 7

const getPageItems = (page, pages) => {
  if (pages <= MAX_VISIBLE_PAGES) {
    return Array.from({ length: pages }, (_, index) => index + 1)
  }

  const start = Math.max(2, Math.min(page - 1, pages - 4))
  const end = Math.min(pages - 1, Math.max(page + 1, 5))
  const items = [1]

  if (start > 2) items.push('gap-start')
  for (let number = start; number <= end; number++) items.push(number)
  if (end < pages - 1) items.push('gap-end')
  items.push(pages)

  return items
}

const Pagination = ({ page, pages, onChange, label }) => {
  if (pages <= 1) return null

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
      {getPageItems(page, pages).map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="pagination__gap" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            className={`pagination__number ${item === page ? 'pagination__number--current' : ''}`}
            aria-current={item === page ? 'page' : undefined}
            aria-label={`Página ${item}`}
            onClick={() => onChange(item)}
          >
            {item}
          </button>
        ),
      )}
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
