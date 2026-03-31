3
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    mobile_number: "",
    address: "",
    password: "",
    confirm_password: "",
    is_business_account: false
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    // Validation Logic
    if (!anyAlpha(formData.full_name)) {
      setError("Full name must contain at least one letter.");
      return;
    }

    if (!/^\d{10}$/.test(formData.mobile_number)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await api.post("/register/", formData);
      alert("Registration successful! Please login.");
      navigate("/login");
    } catch (err) {
      if (err.response?.data) {
        // Handle field-specific errors from backend if they exist
        const backendErrors = err.response.data;
        let errorMsg = "";
        if (typeof backendErrors === 'object') {
          errorMsg = Object.values(backendErrors).flat().join(" ");
        } else {
          errorMsg = backendErrors.detail || "Registration failed.";
        }
        setError(errorMsg);
      } else {
        setError("Registration failed. Please check your details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const anyAlpha = (str) => /[a-zA-Z]/.test(str);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #EDE8D8 0%, var(--bg-main) 50%, var(--bg-surface-elevated) 100%)',
      padding: '40px 20px'
    }}>
      <div className="glass-panel animate-fade" style={{
        width: '100%',
        maxWidth: '600px',
        padding: '60px 50px',
        borderRadius: '32px',
      }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <h1 style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '10px' }}>JOIN VAAGAI</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Experience the summit of premium furniture.</p>
        </div>

        <form onSubmit={handleRegister}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Name</label>
              <input name="full_name" value={formData.full_name} onChange={handleChange} placeholder="John Doe" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '25px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Mobile</label>
              <input 
                name="mobile_number" 
                value={formData.mobile_number} 
                onChange={handleChange} 
                placeholder="10 digit number" 
                maxLength="10"
                pattern="\d{10}"
                inputMode="numeric"
                required 
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Account Type</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', height: '50px', background: 'var(--bg-surface)', borderRadius: '8px', padding: '0 15px', border: '1px solid var(--border-strong)' }}>
                <input
                  name="is_business_account"
                  type="checkbox"
                  checked={formData.is_business_account}
                  onChange={handleChange}
                  style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '600' }}>B2B Account</span>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Office/Home Address</label>
            <textarea name="address" value={formData.address} onChange={handleChange} placeholder="Street, City, State..." style={{ height: '80px' }} required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '40px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Password</label>
              <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Confirm</label>
              <input name="confirm_password" type="password" value={formData.confirm_password} onChange={handleChange} placeholder="••••••••" required />
            </div>
          </div>

          {error && (
            <div style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', padding: '15px', borderRadius: '10px', marginBottom: '30px', textAlign: 'center', fontWeight: '600', border: '1px solid rgba(255, 68, 68, 0.2)' }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-premium" style={{ width: '100%', padding: '18px', fontSize: '1.2rem' }} disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>
        </form>

        <p style={{ color: 'var(--text-muted)', marginTop: '35px', textAlign: 'center' }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>
            Log in now
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;