import Joi from 'joi'

const emailRule = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.empty': 'El email es obligatorio',
    'string.email': 'El email debe tener un formato válido',
    'any.required': 'El email es obligatorio',
  })

export const loginSchema = Joi.object({
  email: emailRule,
  password: Joi.string().required().messages({
    'string.empty': 'La contraseña es obligatoria',
    'any.required': 'La contraseña es obligatoria',
  }),
})

export const PASSWORD_MIN = 6
export const PASSWORD_PATTERN = /^(?=.*[a-zA-Z])(?=.*[0-9])/

export const registerSchema = Joi.object({
  name: Joi.string().trim().min(3).max(30).required().messages({
    'string.empty': 'El nombre de usuario es obligatorio',
    'string.min': 'El nombre de usuario debe tener al menos {#limit} caracteres',
    'string.max': 'El nombre de usuario no puede tener más de {#limit} caracteres',
    'any.required': 'El nombre de usuario es obligatorio',
  }),
  email: emailRule,
  password: Joi.string().min(PASSWORD_MIN).pattern(PASSWORD_PATTERN).required().messages({
    'string.empty': 'La contraseña es obligatoria',
    'string.min': 'La contraseña debe tener al menos {#limit} caracteres',
    'string.pattern.base': 'La contraseña debe tener al menos una letra y un número',
    'any.required': 'La contraseña es obligatoria',
  }),
  repeatPassword: Joi.string().valid(Joi.ref('password')).required().messages({
    'any.only': 'Las contraseñas no coinciden',
    'any.required': 'Repetí la contraseña',
    'string.empty': 'Repetí la contraseña',
  }),
})
