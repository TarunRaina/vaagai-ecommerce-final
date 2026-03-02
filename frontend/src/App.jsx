import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RoleProtectedRoute from './auth/RoleProtectedRoute'
import LandingLayout from './layouts/LandingLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'
import Landing from './pages/Landing'
import Dashboard from './pages/customer/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <LandingLayout>
              <Landing />
            </LandingLayout>
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            <CustomerLayout>
              <Dashboard />
            </CustomerLayout>
          }
        />
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminDashboard />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
