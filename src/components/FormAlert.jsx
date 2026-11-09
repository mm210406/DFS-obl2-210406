import Icon from './Icon'

const FormAlert = ({ title, text }) => {
  return (
    <div className="alert" role="alert">
      <Icon name="alert" className="alert__icon" />
      <div>
        <p className="alert__title">{title}</p>
        {text && <p className="alert__text">{text}</p>}
      </div>
    </div>
  )
}

export default FormAlert
