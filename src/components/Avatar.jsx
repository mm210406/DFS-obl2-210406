// Foto de perfil o, si no tiene, las iniciales del nombre de usuario
const Avatar = ({ user, size = 'md' }) => {
  const initials = (user?.name || '?').slice(0, 2).toUpperCase()

  if (user?.avatarUrl) {
    return <img className={`avatar avatar--${size}`} src={user.avatarUrl} alt="" />
  }
  return <span className={`avatar avatar--${size}`} aria-hidden="true">{initials}</span>
}

export default Avatar
