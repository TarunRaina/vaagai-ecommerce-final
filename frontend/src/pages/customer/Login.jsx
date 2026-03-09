import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/token/", { email, password });
      login(res.data.access, res.data.user);
      navigate("/customer/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-main) 60%, #EDE8D8 100%)',
      padding: '20px'
    }}>
      <div className="glass-panel animate-fade" style={{
        width: '100%',
        maxWidth: '450px',
        padding: '50px 40px',
        borderRadius: '24px',
        textAlign: 'center'
      }}>
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', color: 'var(--primary)' }}>VAAGAI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Welcome back to luxury.</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: '100%' }}>
          <div style={{ textAlign: 'left', marginBottom: '25px', width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              style={{ width: '100%' }}
              required
            />
          </div>

          <div style={{ textAlign: 'left', marginBottom: '30px', width: '100%' }}>
            <label style={{ display: 'block', marginBottom: '10px', fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%' }}
              required
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(255, 68, 68, 0.1)',
              color: '#ff4444',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              border: '1px solid rgba(255, 68, 68, 0.2)'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-premium"
            style={{ width: '100%', padding: '16px', fontSize: '1.1rem', marginBottom: '25px' }}
            disabled={loading}
          >
            {loading ? "SIGNING IN..." : "SIGN IN"}
          </button>
        </form>

        <p style={{ color: 'var(--text-muted)', marginTop: '20px' }}>
          Don't have an account?{" "}
          <Link to="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
