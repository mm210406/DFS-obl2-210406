const RankTicket = ({ position, size = 'md' }) => {
  return (
    <span className={`rank-ticket rank-ticket--${size}`}>
      <span className="sr-only">Puesto </span>#{position}
    </span>
  )
}

export default RankTicket
