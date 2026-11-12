import { PLUS_REVIEW_LIMIT } from '../config/constants'

export const countReviews = (count) => `${count} ${count === 1 ? 'reseña' : 'reseñas'}`

export const plusQuotaText = (used) => {
  const remaining = PLUS_REVIEW_LIMIT - used
  return `${remaining === 1 ? 'queda' : 'quedan'} ${countReviews(remaining)} de las ${PLUS_REVIEW_LIMIT} del plan Plus`
}
