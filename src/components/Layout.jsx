import { Outlet } from 'react-router'
import Navbar from './Navbar'
import ScrollToTop from './ScrollToTop'

const Layout = () => {
  return (
    <div className="page">
      <ScrollToTop />
      <Navbar />
      <main className="page__main">
        <Outlet />
      </main>
      <footer className="footer">
        CineReview · Películas para ver en familia · Ilustración de cortinas:{' '}
        <a href="https://www.magnific.com/author/pch-vector" target="_blank" rel="noreferrer">pch.vector</a>
      </footer>
    </div>
  )
}

export default Layout
