import logoIcon from '../assets/logo-icon.png'

const BrandTicket = () => {
  return (
    <div className="brand-ticket-shadow">
      <div className="brand-ticket" role="img" aria-label="CineReview">
        <span className="brand-ticket__title">CineReview</span>
        <span className="brand-ticket__stub">
          <img src={logoIcon} alt="" />
        </span>
      </div>
    </div>
  )
}

export default BrandTicket
