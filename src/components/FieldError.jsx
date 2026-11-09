import Icon from './Icon'

const FieldError = ({ id, message }) => {
  if (!message) return null

  return (
    <p id={id} className="error">
      <Icon name="alert" size={14} strokeWidth={2.6} />
      {message}
    </p>
  )
}

export default FieldError
