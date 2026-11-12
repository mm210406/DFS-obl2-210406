import { useSelector } from 'react-redux'
import { MAX_IMAGE_SIZE_MB } from '../../validators/image.validators'
import { isAdmin } from '../../utils/session'
import useLogout from '../../hooks/useLogout'
import Icon from '../Icon'
import AvatarUploader from './AvatarUploader'

const ProfileCard = () => {
  const user = useSelector((state) => state.user.user)
  const logout = useLogout()

  return (
    <section className="profile-card" aria-labelledby="profile-title">
      <AvatarUploader />

      <div className="profile-card__info">
        <p className="profile-card__eyebrow">Mi perfil</p>
        <h1 id="profile-title" className="profile-card__name">
          @{user.name}
        </h1>
        <p className="profile-card__email">{user.email}</p>
        <span className="plan-ticket">{isAdmin(user) ? 'ADMIN' : user.plan}</span>
        <p id="avatar-hint" className="profile-card__hint">
          Una imagen de hasta {MAX_IMAGE_SIZE_MB} MB. Se recorta cuadrada, centrada en la cara.
        </p>
      </div>

      <button type="button" className="btn btn--ghost profile-card__logout" onClick={logout}>
        <Icon name="logout" size={16} />
        Cerrar sesión
      </button>
    </section>
  )
}

export default ProfileCard
