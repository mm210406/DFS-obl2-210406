export const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })

export const getYear = (releaseDate) => releaseDate?.slice(0, 4)
