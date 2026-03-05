import { BrowserRouter, Route, Routes } from "react-router-dom";
import RoleProtectedRoute from "./auth/RoleProtectedRoute";

import LandingLayout from "./layouts/LandingLayout";
import CustomerLayout from "./layouts/CustomerLayout";
import AdminLayout from "./layouts/AdminLayout";

import Landing from "./pages/Landing";
import Dashboard from "./pages/customer/Dashboard";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import EditProduct from "./pages/admin/EditProduct";
import Register from "./pages/customer/Register";
import Login from "./pages/customer/Login";
// import Profile from "./pages/customer/Profile";
import Wishlist from "./pages/customer/Wishlist";
import Orders from "./pages/customer/Orders";
import OrderForm from "./pages/customer/OrderForm";
import AdminOrders from "./pages/admin/Orders";
import Appointments from "./pages/customer/Appointments";
import AdminAppointments from "./pages/admin/Appointments";
import Profile from "./pages/customer/Profile";

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
        <Route
          path="/admin/products/edit/:id"
          element={
            <RoleProtectedRoute>
              <AdminLayout>
                <EditProduct />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />

        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/customer/profile"
          element={
            <CustomerLayout>
              <Profile />
            </CustomerLayout>
          }
        />

        <Route
          path="/customer/wishlist"
          element={
            <CustomerLayout>
              <Wishlist />
            </CustomerLayout>
          }
        />

        <Route
          path="/customer/orders"
          element={
            <CustomerLayout>
              <Orders />
            </CustomerLayout>
          }
        />

        <Route
          path="/customer/order/:productId"
          element={
            <CustomerLayout>
              <OrderForm />
            </CustomerLayout>
          }
        />

        <Route
          path="/admin/orders"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminOrders />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/customer/appointments"
          element={
            <CustomerLayout>
              <Appointments />
            </CustomerLayout>
          }
        />

        <Route
          path="/admin/appointments"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout>
                <AdminAppointments />
              </AdminLayout>
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/customer/profile"
          element={
            <CustomerLayout>
              <Profile />
            </CustomerLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
