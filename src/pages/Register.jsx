import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../config/api.config'
import { registerSchema, PASSWORD_MIN, PASSWORD_PATTERN } from '../validators/auth.validators'
import { login } from '../features/user.slice'
import { ROUTES } from '../config/constants'
import { saveSession } from '../utils/session'
import AuthTabs from '../components/auth/AuthTabs'
import PasswordInput from '../components/PasswordInput'
import FieldError from '../components/FieldError'
import FormAlert from '../components/FormAlert'
import Icon from '../components/Icon'

const Register = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formAlert, setFormAlert] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, touchedFields, isValid },
  } = useForm({ resolver: joiResolver(registerSchema), mode: 'onTouched' })

  const password = watch('password') || ''
  const requirements = [
    { text: `Al menos ${PASSWORD_MIN} caracteres`, done: password.length >= PASSWORD_MIN },
    { text: 'Una letra y un número', done: PASSWORD_PATTERN.test(password) },
  ]

  const inputClass = (field) => {
    if (errors[field]) return 'input--error'
    if (touchedFields[field]) return 'input--valid'
    return ''
  }

  const onSubmit = (data) => {
    setLoading(true)
    setFormAlert(null)

    api
      .post('/auth/register', data)
      .then((res) => {
        saveSession(res.data)
        dispatch(login(res.data))
        toast.success(`¡Bienvenido/a a CineReview, @${res.data.user.name}!`)
        navigate(ROUTES.HOME)
      })
      .catch((error) => {
        const status = error.response?.status
        if (status === 409) {
          setError('email', { message: getErrorMessage(error) })
        } else if (status === 429) {
          setFormAlert({ title: 'Demasiados intentos', text: getErrorMessage(error), blocked: true })
        } else {
          setFormAlert({ title: 'No pudimos crear tu cuenta', text: getErrorMessage(error) })
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit(onSubmit)} aria-labelledby="register-title" noValidate>
      <AuthTabs />
      <div>
        <h1 id="register-title" className="auth-card__title">Creá tu cuenta</h1>
        <p className="auth-card__subtitle">Empezás con el plan Plus: 4 reseñas gratis.</p>
      </div>

      <div className="field">
        <label htmlFor="name">Nombre de usuario</label>
        <div className="input-wrap">
          <span className="input-wrap__prefix" aria-hidden="true">@</span>
          <input
            id="name"
            type="text"
            placeholder="tunombre"
            autoComplete="username"
            className={`input input--prefixed input--sm ${inputClass('name')}`}
            aria-invalid={!!errors.name}
            aria-describedby="name-error"
            {...register('name')}
          />
        </div>
        <FieldError id="name-error" message={errors.name?.message} />
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          autoComplete="email"
          className={`input input--sm ${inputClass('email')}`}
          aria-invalid={!!errors.email}
          aria-describedby="email-error"
          {...register('email')}
        />
        <FieldError id="email-error" message={errors.email?.message} />
      </div>

      <div className="field">
        <label htmlFor="password">Contraseña</label>
        <PasswordInput
          id="password"
          autoComplete="new-password"
          className={`input--sm ${inputClass('password')}`}
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          {...register('password')}
        />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>

      <ul className="requirements" aria-label="Requisitos de la contraseña">
        {requirements.map((req) => (
          <li key={req.text} className={req.done ? 'requirements__item--done' : ''}>
            <Icon name={req.done ? 'check' : 'circle'} size={14} strokeWidth={3} />
            {req.text}
            <span className="sr-only">{req.done ? ': cumplido' : ': pendiente'}</span>
          </li>
        ))}
      </ul>

      <div className="field">
        <label htmlFor="repeatPassword">Repetí la contraseña</label>
        <PasswordInput
          id="repeatPassword"
          autoComplete="new-password"
          className={`input--sm ${inputClass('repeatPassword')}`}
          aria-invalid={!!errors.repeatPassword}
          aria-describedby="repeat-error"
          {...register('repeatPassword')}
        />
        <FieldError id="repeat-error" message={errors.repeatPassword?.message} />
      </div>

      {formAlert && <FormAlert title={formAlert.title} text={formAlert.text} />}

      <button
        type="submit"
        className="btn btn--primary btn--block"
        disabled={!isValid || loading || formAlert?.blocked}
      >
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
      <p className="auth-card__footer">
        ¿Ya tenés cuenta? <Link to={ROUTES.LOGIN}>Ingresá</Link>
      </p>
    </form>
  )
}

export default Register
