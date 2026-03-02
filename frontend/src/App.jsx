
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import RoleProtectedRoute from './auth/RoleProtectedRoute'

import LandingLayout from './layouts/LandingLayout'
import CustomerLayout from './layouts/CustomerLayout'
import AdminLayout from './layouts/AdminLayout'

import Landing from './pages/Landing'
import Dashboard from './pages/customer/Dashboard'
import AdminDashboard from './pages/admin/Dashboard'
import AdminLogin from './pages/admin/AdminLogin'

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Landing Page */}
        <Route
          path="/"
          element={
            <LandingLayout>
              <Landing />
            </LandingLayout>
          }
        />

        {/* Customer Dashboard (Public for now) */}
        <Route
          path="/customer/dashboard"
          element={
            <CustomerLayout>
              <Dashboard />
            </CustomerLayout>
          }
        />

        {/* Admin Login (Public) */}
        <Route
          path="/admin"
          element={
            <LandingLayout>
              <AdminLogin />
            </LandingLayout>
          }
        />

        {/* Admin Dashboard (Protected) */}
        <Route
          path="/admin/dashboard"
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