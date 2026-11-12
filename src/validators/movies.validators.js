import Joi from 'joi'
import { MAX_POINTS } from '../config/constants'

export const MIN_YEAR = 1888
export const MAX_YEAR = 2100
export const NO_MIN_SCORE = 0

const yearRule = Joi.number().integer().min(MIN_YEAR).max(MAX_YEAR).allow('').messages({
  'number.base': 'Escribí un año',
  'number.integer': 'Escribí un año sin decimales',
  'number.min': `El año tiene que ser ${MIN_YEAR} o posterior`,
  'number.max': `El año tiene que ser ${MAX_YEAR} o anterior`,
})

export const catalogFiltersSchema = Joi.object({
  genres: Joi.array().items(Joi.number().integer()),
  yearFrom: yearRule,
  yearTo: yearRule.when('yearFrom', {
    is: Joi.number().required(),
    then: Joi.number().min(Joi.ref('yearFrom')).messages({
      'number.min': 'El año hasta no puede ser anterior al año desde',
    }),
  }),
  minScore: Joi.number().integer().min(NO_MIN_SCORE).max(MAX_POINTS),
})
