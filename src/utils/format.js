export const formatDate = (date) =>
  new Date(date).toLocaleDateString('es-UY', { day: 'numeric', month: 'long', year: 'numeric' })

export const getYear = (releaseDate) => releaseDate?.slice(0, 4)

const MEGABYTE = 1024 * 1024

export const formatFileSize = (bytes) => {
  if (bytes < MEGABYTE) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / MEGABYTE).toLocaleString('es-UY', { maximumFractionDigits: 1 })} MB`
}
