import { useState } from 'react'
import Icon from './Icon'

const PasswordInput = ({ className = '', ...props }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="input-wrap">
      <input {...props} type={visible ? 'text' : 'password'} className={`input input--icon ${className}`} />
      <button
        type="button"
        className="input-wrap__toggle"
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        onClick={() => setVisible(!visible)}
      >
        <Icon name={visible ? 'eyeOff' : 'eye'} strokeWidth={2.2} />
      </button>
    </div>
  )
}

export default PasswordInput
