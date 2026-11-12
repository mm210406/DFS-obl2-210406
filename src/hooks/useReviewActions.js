import { useState } from 'react'
import { toast } from 'react-toastify'
import { api, getErrorMessage } from '../config/api.config'

const useReviewActions = (reviewId, onDeleted) => {
  const [mode, setMode] = useState('view')
  const [freshReview, setFreshReview] = useState(null)

  const startEdit = () => {
    setMode('loadingEdit')
    api
      .get(`/reviews/${reviewId}`)
      .then((res) => {
        setFreshReview(res.data)
        setMode('edit')
      })
      .catch((error) => {
        if (error.response?.status === 404) {
          setMode('notFound')
          return
        }
        toast.error(getErrorMessage(error, 'No pudimos abrir tu reseña para editarla'))
        setMode('view')
      })
  }

  const deleteReview = () => {
    setMode('deleting')
    api
      .delete(`/reviews/${reviewId}`)
      .then(() => onDeleted())
      .catch((error) => {
        if (error.response?.status === 404) {
          setMode('notFound')
          return
        }
        toast.error(getErrorMessage(error, 'No pudimos eliminar tu reseña'))
        setMode('confirmDelete')
      })
  }

  const confirming = mode === 'confirmDelete' || mode === 'deleting'

  return {
    mode,
    freshReview,
    confirming,
    deleting: mode === 'deleting',
    startEdit,
    deleteReview,
    showReview: () => setMode('view'),
    showNotFound: () => setMode('notFound'),
    toggleConfirm: () => setMode(confirming ? 'view' : 'confirmDelete'),
  }
}

export default useReviewActions
