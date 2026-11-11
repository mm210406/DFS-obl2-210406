import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { api } from '../config/api.config'
import { setGenres } from '../features/genres.slice'

const useGenres = () => {
  const dispatch = useDispatch()
  const genres = useSelector((state) => state.genres.list)

  useEffect(() => {
    if (genres.length > 0) return

    api
      .get('/genres')
      .then((res) => dispatch(setGenres(res.data)))
      .catch(() => {})
  }, [genres.length, dispatch])

  return genres
}

export default useGenres
