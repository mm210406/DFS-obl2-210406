import { useCallback, useRef, useState } from 'react'
import useClickOutside from '../../hooks/useClickOutside'
import { GENRE_ICON_OPTIONS } from '../../utils/genres'

const EmojiPicker = ({ id, value, fallback, invalid, describedBy, maxLength, onChange, onBlur }) => {
  const [open, setOpen] = useState(false)
  const [custom, setCustom] = useState('')
  const pickerRef = useRef(null)
  const buttonRef = useRef(null)
  const panelId = `${id}-panel`

  const closePanel = useCallback(() => {
    setOpen(false)
    onBlur()
  }, [onBlur])
  useClickOutside(pickerRef, closePanel, open)

  const choose = (emoji) => {
    onChange(emoji)
    setCustom('')
    closePanel()
    buttonRef.current?.focus()
  }

  const chooseCustom = () => {
    if (custom.trim()) choose(custom.trim())
  }

  const handleCustomKey = (e) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    chooseCustom()
  }

  return (
    <div className="emoji-picker" ref={pickerRef}>
      <button
        type="button"
        id={id}
        ref={buttonRef}
        className={`input input--sm emoji-picker__button ${invalid ? 'input--error' : ''}`}
        title="Cambiar ícono"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        onClick={() => (open ? closePanel() : setOpen(true))}
      >
        <span className={value ? '' : 'emoji-picker__fallback'}>{value || fallback}</span>
      </button>

      {open && (
        <div id={panelId} className="emoji-picker__panel" role="dialog" aria-label="Elegir ícono">
          <p className="emoji-picker__title">Elegí un ícono</p>
          <div className="emoji-picker__grid">
            {GENRE_ICON_OPTIONS.map((emoji) => (
              <button
                key={emoji}
                type="button"
                className="emoji-picker__option"
                aria-label={`Usar ${emoji}`}
                aria-pressed={emoji === value}
                onClick={() => choose(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="emoji-picker__custom">
            <input
              className="input input--sm"
              placeholder="O pegá otro emoji"
              aria-label="Otro emoji"
              maxLength={maxLength}
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={handleCustomKey}
            />
            <button
              type="button"
              className="btn btn--primary btn--sm"
              disabled={!custom.trim()}
              onClick={chooseCustom}
            >
              Usar
            </button>
          </div>
          {value && value !== fallback && (
            <button type="button" className="emoji-picker__reset" onClick={() => choose('')}>
              Volver al ícono por defecto ({fallback})
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default EmojiPicker
