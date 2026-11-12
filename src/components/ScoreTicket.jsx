const ScoreTicket = ({ points, label = 'Puntaje', ariaLabel = `Puntaje: ${points} de 10` }) => {
  return (
    <div className="score-ticket" role="img" aria-label={ariaLabel}>
      <span className="score-ticket__label">{label}</span>
      <span className="score-ticket__value">{points}</span>
    </div>
  )
}

export default ScoreTicket
