import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const response = await api.post("/token/", {
        email: username,
        password,
      });

      const accessToken = response.data.access;

      // Decode JWT
      const payload = JSON.parse(atob(accessToken.split(".")[1]));

      // Check role
      if (payload.user_type !== "admin") {
        setError("Only admin accounts can login here");
        return;
      }

      login({
        user: { email: payload.email, userType: payload.user_type },
        token: accessToken,
      });

      navigate("/admin/dashboard");
    } catch (requestError) {
      setError("Invalid admin credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="username">Email</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      <button type="submit">Login</button>

      {error && <p>{error}</p>}
    </form>
  );
};

export default AdminLogin;
