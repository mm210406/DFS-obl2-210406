import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router'
import { api, getErrorMessage } from '../config/api.config'
import { ROUTES } from '../config/constants'
import { isAdmin } from '../utils/session'
import FormAlert from '../components/FormAlert'
import Icon from '../components/Icon'
import ProfileCard from '../components/profile/ProfileCard'
import Recommendations from '../components/profile/Recommendations'
import PlanUsage from '../components/reviews/PlanUsage'
import PlanCard from '../components/reviews/PlanCard'
import PremiumDialog from '../components/reviews/PremiumDialog'

const Profile = () => {
  const navigate = useNavigate()
  const { token, user } = useSelector((state) => state.user)
  const admin = isAdmin(user)
  const [attempt, setAttempt] = useState(0)
  const [result, setResult] = useState({ key: null, profile: null, error: null })
  const [premiumOpen, setPremiumOpen] = useState(false)

  const requestKey = `${token}#${attempt}`
  const loading = result.key !== requestKey
  const { profile, error } = result

  useEffect(() => {
    if (admin) return
    let ignore = false

    api
      .get('/users/me')
      .then((res) => {
        if (!ignore) setResult({ key: requestKey, profile: res.data, error: null })
      })
      .catch((err) => {
        if (!ignore) setResult({ key: requestKey, profile: null, error: getErrorMessage(err) })
      })

    return () => {
      ignore = true
    }
  }, [requestKey, admin])

  const renderClientSections = () => {
    if (!profile && loading) {
      return (
        <p className="muted" role="status">
          Cargando tu perfil...
        </p>
      )
    }

    if (!profile && error) {
      return (
        <div className="profile-page__error">
          <FormAlert title="No pudimos cargar tu perfil" text={error} />
          <button
            type="button"
            className="btn btn--outline btn--sm"
            onClick={() => setAttempt((current) => current + 1)}
          >
            <Icon name="refresh" size={16} />
            Reintentar
          </button>
        </div>
      )
    }

    return (
      <div className="profile-page__grid">
        <Recommendations
          recommendations={profile.recommendations}
          updatedAt={profile.recommendationsUpdatedAt}
          hasReviews={profile.usage.reviews > 0}
        />
        <div className="profile-page__aside">
          <PlanUsage reviewsUsed={profile.usage.reviews} />
          <PlanCard onUpgrade={() => setPremiumOpen(true)} />
          <Link to={ROUTES.MY_REVIEWS} className="profile-page__link">
            Ver mis reseñas →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container section profile-page">
      <ProfileCard />
      {!admin && renderClientSections()}
      <PremiumDialog
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        onWriteReview={() => navigate(ROUTES.MOVIES)}
      />
    </div>
  )
}

export default Profile
