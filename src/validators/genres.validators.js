import Joi from 'joi'

export const GENRE_NAME_MAX = 50
export const GENRE_ICON_MAX = 16

const iconRule = Joi.string().trim().max(GENRE_ICON_MAX).allow('').messages({
  'string.max': `El ícono puede tener hasta ${GENRE_ICON_MAX} caracteres`,
})

const nameRule = Joi.string().trim().min(2).max(GENRE_NAME_MAX).messages({
  'string.empty': 'Escribí un nombre',
  'string.min': 'El nombre debe tener al menos {#limit} caracteres',
  'string.max': `El nombre puede tener hasta ${GENRE_NAME_MAX} caracteres`,
})

export const addGenreSchema = Joi.object({
  icon: iconRule,
  name: nameRule.allow(''),
  allowed: Joi.boolean(),
})

export const editGenreSchema = Joi.object({
  icon: iconRule,
  name: nameRule.required(),
  allowed: Joi.boolean(),
})
