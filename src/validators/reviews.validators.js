import Joi from 'joi'
import { MAX_POINTS, MIN_POINTS } from '../config/constants'
import { formatFileSize } from '../utils/format'

export const DESCRIPTION_MIN = 3
export const DESCRIPTION_MAX = 2000
export const MAX_IMAGE_SIZE_MB = 4

const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024

const reviewFields = {
  points: Joi.number().integer().min(MIN_POINTS).max(MAX_POINTS).required().messages({
    'number.base': 'Elegí un puntaje',
    'any.required': 'Elegí un puntaje',
  }),
  description: Joi.string().trim().min(DESCRIPTION_MIN).max(DESCRIPTION_MAX).required().messages({
    'string.empty': 'Contá qué les pareció',
    'string.min': `El comentario debe tener al menos ${DESCRIPTION_MIN} caracteres`,
    'string.max': `El comentario no puede tener más de ${DESCRIPTION_MAX} caracteres`,
    'any.required': 'Contá qué les pareció',
  }),
  imagen: Joi.any()
    .custom((value, helpers) => {
      const file = value?.[0]

      if (!file) {
        return value
      }

      if (!file.type?.startsWith('image/')) {
        return helpers.error('file.type')
      }

      if (file.size > MAX_IMAGE_SIZE_BYTES) {
        return helpers.error('file.size', { size: formatFileSize(file.size) })
      }

      return value
    })
    .messages({
      'file.type': 'El archivo tiene que ser una imagen (JPG, PNG, WebP…).',
      'file.size': `La imagen pesa {#size}. El máximo es ${MAX_IMAGE_SIZE_MB} MB.`,
    }),
}

export const newReviewSchema = Joi.object({
  tmdbId: Joi.number().integer().required().messages({
    'number.base': 'Elegí una película',
    'any.required': 'Elegí una película',
  }),
  ...reviewFields,
})

export const editReviewSchema = Joi.object(reviewFields)
