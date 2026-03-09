import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

const CustomerLayout = ({ children }) => {
  return (
    <div style={{ background: 'var(--bg-main)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <div style={{
        flex: 1,
        paddingTop: "120px",
        paddingLeft: "4%", // Reduced to allow 4-item grid to fit
        paddingRight: "4%",
        paddingBottom: "80px",
        maxWidth: "1600px",
        margin: "0 auto",
        width: '100%',
        boxSizing: 'border-box'
      }}>
        {children}
      </div>
      <Footer />
    </div>
  )
}

export default CustomerLayout