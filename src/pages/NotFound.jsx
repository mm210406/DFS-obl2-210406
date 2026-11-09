import { Link } from 'react-router'
import { useSelector } from 'react-redux'
import { homePath } from '../utils/session'

const NotFound = () => {
  const user = useSelector((state) => state.user.user)

  return (
    <section className="container section not-found">
      <p className="not-found__code">404</p>
      <h1 className="page-title">Esta función no existe</h1>
      <p className="muted">La página que buscás no está en cartelera.</p>
      <Link to={homePath(user)} className="btn btn--primary">Volver al inicio</Link>
    </section>
  )
}

export default NotFound
