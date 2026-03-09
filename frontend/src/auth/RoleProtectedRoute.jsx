import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './AuthContext'

const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, userType } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) {
    const isAdminRoute = location.pathname.startsWith('/admin')
    return <Navigate to={isAdminRoute ? "/admin" : "/login"} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleProtectedRoute