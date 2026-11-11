import { useRef } from 'react'
import Icon from './Icon'

const FilmStripPhoto = ({ src, alt }) => {
  const dialogRef = useRef(null)

  const open = () => dialogRef.current.showModal()
  const close = () => dialogRef.current.close()

  const closeOnBackdrop = (e) => {
    if (e.target === dialogRef.current) close()
  }

  return (
    <>
      <button type="button" className="film-strip" onClick={open} aria-label={`Ver ${alt} en grande`}>
        <span className="film-strip__holes" aria-hidden="true" />
        <img className="film-strip__photo" src={src} alt="" />
        <span className="film-strip__holes" aria-hidden="true" />
      </button>

      <dialog ref={dialogRef} className="photo-dialog" aria-label={alt} onClick={closeOnBackdrop}>
        <img className="photo-dialog__image" src={src} alt={alt} />
        <button type="button" className="photo-dialog__close" onClick={close} aria-label="Cerrar">
          <Icon name="close" size={22} />
        </button>
      </dialog>
    </>
  )
}

export default FilmStripPhoto
