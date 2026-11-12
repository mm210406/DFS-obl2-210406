import Joi from 'joi'
import { MAX_POINTS, MIN_POINTS } from '../config/constants'
import { imageFileRule } from './image.validators'

export const DESCRIPTION_MIN = 3
export const DESCRIPTION_MAX = 2000

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
  imagen: imageFileRule,
}

export const newReviewSchema = Joi.object({
  tmdbId: Joi.number().integer().required().messages({
    'number.base': 'Elegí una película',
    'any.required': 'Elegí una película',
  }),
  ...reviewFields,
})

export const editReviewSchema = Joi.object(reviewFields)
