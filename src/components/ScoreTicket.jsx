const ScoreTicket = ({ points }) => {
  return (
    <div className="score-ticket" role="img" aria-label={`Puntaje: ${points} de 10`}>
      <span className="score-ticket__label">Puntaje</span>
      <span className="score-ticket__value">{points}</span>
    </div>
  )
}

export default ScoreTicket
