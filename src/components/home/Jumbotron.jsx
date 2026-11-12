import curtain from '../../assets/curtain.png'
import valance from '../../assets/valance.png'
import BrandTicket from '../BrandTicket'

const Jumbotron = () => {
  return (
    <section className="jumbotron" aria-labelledby="home-title">
      <div className="jumbotron__floor" aria-hidden="true" />
      <div className="jumbotron__spot" aria-hidden="true" />
      <img className="jumbotron__curtain jumbotron__curtain--left" src={curtain} alt="" />
      <img className="jumbotron__curtain jumbotron__curtain--right" src={curtain} alt="" />
      <img className="jumbotron__valance" src={valance} alt="" />

      <div className="jumbotron__content">
        <h1 id="home-title" className="sr-only">
          CineReview
        </h1>
        <div className="jumbotron__ticket">
          <BrandTicket />
        </div>
        <p className="jumbotron__subtitle">Lo que las familias están viendo y reseñando.</p>
      </div>
    </section>
  )
}

export default Jumbotron
