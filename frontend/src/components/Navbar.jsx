// import { useAuth } from "../auth/AuthContext"
// import { useNavigate } from "react-router-dom"
// import { useState } from "react"

// const Navbar = () => {
//   const { isAuthenticated, logout } = useAuth()
//   const navigate = useNavigate()

//   const [search, setSearch] = useState("")

//   const handleLogout = () => {
//     logout()
//     navigate("/")
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()
//     navigate(`/customer/dashboard?search=${search}`)
//   }

//   return (
//     <div style={{ padding: "15px", borderBottom: "1px solid #ccc" }}>
      
//       {/* Search Bar */}
//       <form onSubmit={handleSearch} style={{ display: "inline-block", marginRight: "30px" }}>
//         <input
//           type="text"
//           placeholder="Search products..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//         <button type="submit">Search</button>
//       </form>

//       {/* Right Side Buttons */}
//       {!isAuthenticated ? (
//         <>
//           <button onClick={() => navigate("/register")}>Signup</button>
//           <button onClick={() => navigate("/login")}>Login</button>
//         </>
//       ) : (
//         <>
//           <button onClick={() => navigate("/customer/orders")}>Orders</button>
//           <button onClick={() => navigate("/customer/wishlist")}>Wishlist</button>
//           <button onClick={() => navigate("/customer/appointments")}>Appointments</button>
//           <button onClick={handleLogout}>Logout</button>
//         </>
//       )}
//     </div>
//   )
// }

// export default Navbar

import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const handleSearch = (e) => {
    e.preventDefault()
    navigate(`/customer/dashboard?search=${search}`)
  }

  return (
    <div style={{ padding: "15px", borderBottom: "1px solid #ccc" }}>

      {/* Profile Icon */}
      {isAuthenticated && (
        <button onClick={() => navigate("/customer/profile")}>
          👤
        </button>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} style={{ display: "inline-block", marginLeft: "20px", marginRight: "30px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* Right Side */}
      {!isAuthenticated ? (
        <>
          <button onClick={() => navigate("/register")}>Signup</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </>
      ) : (
        <>
          <button onClick={() => navigate("/customer/orders")}>Orders</button>
          <button onClick={() => navigate("/customer/wishlist")}>Wishlist</button>
          <button onClick={() => navigate("/customer/appointments")}>Appointments</button>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}
    </div>
  )
}

export default Navbar