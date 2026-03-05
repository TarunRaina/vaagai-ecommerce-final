// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../auth/AuthContext";

// const AdminLayout = ({ children }) => {
//   const { logout } = useAuth();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     navigate("/");
//   };

//   return (
//     <div>
//       {/* Top Navbar */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           padding: "15px 30px",
//           borderBottom: "1px solid #ccc",
//         }}
//       >
//         <h3>Welcome, Vaagai Admin</h3>
//         <button onClick={() => navigate("/admin/orders")}>Orders</button>
//         <button onClick={handleLogout}>Logout</button>
//       </div>

//       {/* Main Content */}
//       <div style={{ padding: "30px" }}>{children}</div>
//     </div>
//   );
// };

// export default AdminLayout;
import { useNavigate } from "react-router-dom"
import { useAuth } from "../auth/AuthContext"

const AdminLayout = ({ children }) => {

  const navigate = useNavigate()
  const { logout } = useAuth()

  return (
    <div>

      <div style={{ display: "flex", justifyContent: "space-between", padding: "10px", borderBottom: "1px solid #ccc" }}>

        <div>
          <strong>Welcome, Vaagai Admin</strong>
        </div>

        <div>

          <button onClick={() => navigate("/admin/dashboard")}>
            Inventory
          </button>

          <button onClick={() => navigate("/admin/orders")}>
            Orders
          </button>

          <button onClick={() => {
            logout()
            navigate("/")
          }}>
            Logout
          </button>

        </div>

      </div>

      <div style={{ padding: "20px" }}>
        {children}
      </div>

    </div>
  )
}

export default AdminLayout