import { useAuth } from "../../auth/AuthContext"
import { useNavigate } from "react-router-dom"

const Profile = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  return (
    <div>
      <h2>Profile</h2>

      <p>You are :</p>
      <strong>{user?.email}</strong>

      <br /><br />

      <button onClick={() => navigate("/customer/dashboard")}>
        Back to Dashboard
      </button>
    </div>
  )
}

export default Profile