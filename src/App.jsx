import { BrowserRouter, Routes, Route } from 'react-router'
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import './styles.css'
import { store } from './store/store'
import { ROLES, ROUTES } from './config/constants'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import AuthLayout from './components/auth/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Movies from './pages/Movies'
import MovieDetail from './pages/MovieDetail'
import MyReviews from './pages/MyReviews'
import Profile from './pages/Profile'
import AdminGenres from './pages/AdminGenres'
import NotFound from './pages/NotFound'

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Sin sesión */}
          <Route element={<PublicRoute />}>
            <Route element={<AuthLayout />}>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route path={ROUTES.REGISTER} element={<Register />} />
            </Route>
          </Route>

          {/* Con sesión */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path={ROUTES.PROFILE} element={<Profile />} />

              {/* Solo clientes: el admin no ve el catálogo ni hace reseñas */}
              <Route element={<ProtectedRoute role={ROLES.CLIENT} />}>
                <Route path={ROUTES.HOME} element={<Home />} />
                <Route path={ROUTES.MOVIES} element={<Movies />} />
                <Route path={`${ROUTES.MOVIES}/:tmdbId`} element={<MovieDetail />} />
                <Route path={ROUTES.MY_REVIEWS} element={<MyReviews />} />
              </Route>

              {/* Solo admin */}
              <Route element={<ProtectedRoute role={ROLES.ADMIN} />}>
                <Route path={ROUTES.ADMIN_GENRES} element={<AdminGenres />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer position="bottom-right" autoClose={4000} theme="dark" />
    </Provider>
  )
}

export default App
