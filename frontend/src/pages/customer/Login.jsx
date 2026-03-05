import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (email.trim() === "" || password.trim() === "") {
      setIsError(true);
      setMessage("Email and Password are required.");
      return;
    }

    try {
      const response = await api.post("/token/", {
        email,
        password,
      });

      const accessToken = response.data.access;

      // Decode JWT
      const payload = JSON.parse(atob(accessToken.split(".")[1]));

      // Check role
      if (payload.user_type !== "customer") {
        setIsError(true);
        setMessage("Admin accounts must login from admin portal.");
        return;
      }

      login({
        user: { email: payload.email, userType: payload.user_type },
        token: accessToken,
      });

      navigate("/customer/dashboard");
    } catch (err) {
      setIsError(true);
      setMessage("Invalid credentials.");
    }
  };

  return (
    <div>
      <h2>Customer Login</h2>

      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit">Login</button>

        {message && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px 15px",
              borderRadius: "6px",
              backgroundColor: isError ? "#ffe5e5" : "#e6ffed",
              color: isError ? "#b30000" : "#006600",
              fontWeight: "500",
            }}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default Login;
