import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { joiResolver } from '@hookform/resolvers/joi'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { api, getErrorMessage } from '../config/api.config'
import { loginSchema } from '../validators/auth.validators'
import { login } from '../features/user.slice'
import { ROUTES } from '../config/constants'
import { saveSession, homePath } from '../utils/session'
import AuthTabs from '../components/auth/AuthTabs'
import PasswordInput from '../components/PasswordInput'
import FieldError from '../components/FieldError'
import FormAlert from '../components/FormAlert'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [formAlert, setFormAlert] = useState(null)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: joiResolver(loginSchema), mode: 'onTouched' })

  // "Ingresar" queda deshabilitado mientras falte el email o la contraseña
  const email = watch('email')
  const password = watch('password')
  const incomplete = !email?.trim() || !password

  const onSubmit = (data) => {
    setLoading(true)
    setFormAlert(null)

    api
      .post('/auth/login', data)
      .then((res) => {
        saveSession(res.data)
        dispatch(login(res.data))
        navigate(homePath(res.data.user))
      })
      .catch((error) => {
        const status = error.response?.status
        if (status === 401) {
          setFormAlert({ title: 'Email o contraseña incorrectos', text: 'Revisá los datos e intentá de nuevo.' })
        } else if (status === 429) {
          setFormAlert({ title: 'Demasiados intentos', text: getErrorMessage(error), blocked: true })
        } else {
          setFormAlert({ title: 'No pudimos iniciar sesión', text: getErrorMessage(error) })
        }
      })
      .finally(() => setLoading(false))
  }

  return (
    <form className="auth-card" onSubmit={handleSubmit(onSubmit)} aria-labelledby="login-title" noValidate>
      <AuthTabs />
      <div>
        <h1 id="login-title" className="auth-card__title">Ingresá a tu cuenta</h1>
        <p className="auth-card__subtitle">Para reseñar y ver lo que opinan otras familias.</p>
      </div>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="nombre@ejemplo.com"
          autoComplete="email"
          className={`input ${errors.email ? 'input--error' : ''}`}
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
          autoComplete="current-password"
          className={errors.password ? 'input--error' : ''}
          aria-invalid={!!errors.password}
          aria-describedby="password-error"
          {...register('password')}
        />
        <FieldError id="password-error" message={errors.password?.message} />
      </div>

      {formAlert && <FormAlert title={formAlert.title} text={formAlert.text} />}

      <button type="submit" className="btn btn--primary btn--block" disabled={incomplete || loading || formAlert?.blocked}>
        {loading ? 'Ingresando...' : 'Ingresar'}
      </button>
      <p className="auth-card__footer">
        ¿No tenés cuenta? <Link to={ROUTES.REGISTER}>Creá una</Link>
      </p>
    </form>
  )
}

export default Login
