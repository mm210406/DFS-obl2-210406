import { useEffect } from 'react'

// Ejecuta onClose al hacer click fuera de ref o al apretar Escape (solo mientras active sea true)
const useClickOutside = (ref, onClose, active) => {
  useEffect(() => {
    if (!active) return

    const handleClick = (e) => {
      if (!ref.current?.contains(e.target)) onClose()
    }
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [ref, onClose, active])
}

export default useClickOutside
