import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [isBusiness, setIsBusiness] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    // Basic validation
    if (
      fullName.trim() === "" ||
      email.trim() === "" ||
      mobileNumber.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      setIsError(true);
      setMessage("All required fields must be filled.");
      return;
    }

    if (password !== confirmPassword) {
      setIsError(true);
      setMessage("Passwords do not match.");
      return;
    }

    try {
      await api.post("/register/", {
        email,
        full_name: fullName,
        mobile_number: mobileNumber,
        address,
        is_business_account: isBusiness,
        password,
        confirm_password: confirmPassword,
      });

      setIsError(false);
      setMessage("Registration successful! Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setIsError(true);

      if (err.response && err.response.data) {
        const errors = err.response.data;
        const firstError = Object.values(errors)[0];
        setMessage(
          Array.isArray(firstError) ? firstError[0] : "Registration failed"
        );
      } else {
        setMessage("Registration failed");
      }
    }
  };

  return (
    <div>
      <h2>Customer Registration</h2>

      <form onSubmit={handleSubmit} noValidate>

        <div>
          <label>Full Name *</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        <div>
          <label>Email *</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label>Mobile Number *</label>
          <input
            type="text"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
          />
        </div>

        <div>
          <label>Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              checked={isBusiness}
              onChange={(e) => setIsBusiness(e.target.checked)}
            />
            Business Account
          </label>
        </div>

        <div>
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div>
          <label>Confirm Password *</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button type="submit">Register</button>

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

export default Register;