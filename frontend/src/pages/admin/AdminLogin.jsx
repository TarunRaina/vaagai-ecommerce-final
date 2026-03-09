import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import api from "../../api/axios";
import Icon from "../../components/Icons";

const AdminLogin = () => {
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

      if (res.data.user.user_type !== 'admin') {
        setError("Access Denied: Not an administrator account.");
        return;
      }

      login(res.data.access, res.data.user);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid credentials.");
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
      background: 'linear-gradient(135deg, var(--bg-surface-elevated) 0%, var(--bg-main) 50%, #E8E2D4 100%)',
      padding: '20px'
    }}>
      <div className="animate-fade" style={{ width: '100%', maxWidth: '420px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            width: '72px',
            height: '72px',
            background: 'rgba(184, 134, 11, 0.1)',
            borderRadius: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            border: '1.5px solid rgba(184,134,11,0.25)'
          }}>
            <Icon name="lock" size={30} color="var(--primary)" strokeWidth={1.6} />
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>Admin Portal</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>Vaagai Management Console</p>
        </div>

        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-strong)',
          borderRadius: '24px',
          padding: '40px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)'
        }}>
          <form style={{ width: '100%' }} onSubmit={handleLogin}>
            <div style={{ marginBottom: '25px', width: '100%' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@vaagai.com"
                required
              />
            </div>

            <div style={{ marginBottom: '35px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '1.2px' }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            {error && <div style={{ color: '#dc2626', marginBottom: '25px', fontSize: '0.9rem', fontWeight: '700', textAlign: 'center', background: 'rgba(220,38,38,0.08)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(220,38,38,0.2)' }}>{error}</div>}

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', padding: '16px', fontSize: '1.1rem', letterSpacing: '2px', borderRadius: '12px' }}
              disabled={loading}
            >
              {loading ? "SIGNING IN..." : "SIGN IN"}
            </button>
          </form>
        </div>

        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => navigate("/")}
            style={{
              background: 'var(--bg-surface)',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '600'
            }}
          >
            ← Return to Public Site
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;



