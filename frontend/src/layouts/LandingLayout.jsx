import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const LandingLayout = ({ children }) => {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-main)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      <Navbar />
      {/* Subtle Grain Texture Overlay */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'url("https://www.transparenttextures.com/patterns/white-diamond-dark.png")',
        opacity: 0.03,
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <main style={{ flex: 1, position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </main>

      <Footer />
    </div>
  )
}

export default LandingLayout
