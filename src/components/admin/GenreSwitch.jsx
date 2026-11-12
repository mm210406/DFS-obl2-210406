const GenreSwitch = ({ checked, label, disabled = false, onChange }) => {
  return (
    <label className="genre-switch">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        className="genre-switch__track"
        disabled={disabled}
        onClick={() => onChange(!checked)}
      >
        <span className="genre-switch__thumb" />
      </button>
      <span className={`genre-switch__text ${checked ? '' : 'genre-switch__text--off'}`}>
        {checked ? 'Habilitado' : 'Bloqueado'}
      </span>
    </label>
  )
}

export default GenreSwitch
