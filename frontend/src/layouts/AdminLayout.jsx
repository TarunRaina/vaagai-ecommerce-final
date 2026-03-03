import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const AdminLayout = ({ children }) => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div>
      {/* Top Navbar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          borderBottom: '1px solid #ccc',
        }}
      >
        <h3>Welcome, Vaagai Admin</h3>
        <button onClick={handleLogout}>Logout</button>
      </div>

      {/* Main Content */}
      <div style={{ padding: '30px' }}>
        {children}
      </div>
    </div>
  )
}

export default AdminLayout