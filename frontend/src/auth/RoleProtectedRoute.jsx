// import { Navigate } from 'react-router-dom'
// import { useAuth } from './AuthContext'

// const RoleProtectedRoute = ({ allowedRoles = [], children }) => {
//   const { isAuthenticated, userType } = useAuth()

//   if (!isAuthenticated) {
//     return <Navigate to="/" replace />
//   }

//   if (!allowedRoles.includes(userType)) {
//     return <Navigate to="/" replace />
//   }

//   return children
// }

// export default RoleProtectedRoute

import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

const RoleProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RoleProtectedRoute