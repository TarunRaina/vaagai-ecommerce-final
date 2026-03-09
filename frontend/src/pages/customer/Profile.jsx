import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const Profile = () => {
  const { token } = useAuth();

  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [applying, setApplying] = useState(false);
  const [appData, setAppData] = useState({
    business_name: "",
    gst_number: "",
    business_type: "",
    business_address: "",
    contact_number: "",
  });
  const [appStatus, setAppStatus] = useState(null);

  useEffect(() => {
    fetchProfile();
    fetchApplication();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile/");
      setProfile(res.data);
    } catch (err) {
      console.error("Failed to load profile");
    }
  };

  const fetchApplication = async () => {
    try {
      const res = await api.get("/b2b/my-application/");
      setAppStatus(res.data);
      // If rejected, pre-fill form for re-application
      if (res.data.status === 'rejected') {
        setAppData({
          business_name: res.data.business_name || "",
          gst_number: res.data.gst_number || "",
          business_type: res.data.business_type || "",
          business_address: res.data.business_address || "",
          contact_number: res.data.contact_number || "",
        });
      }
    } catch (err) {
      // Might not exist yet
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      await api.post("/b2b/apply/", appData);
      setApplying(false);
      fetchApplication();
    } catch (err) {
      alert("Validation failed. Please verify your business credentials.");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.patch("/profile/", profile);
      setEditMode(false);
    } catch (err) {
      console.error("Update failed");
    }
  };

  if (!profile) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div className="animate-pulse" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '4px' }}>
        LOADING PROFILE...
      </div>
    </div>
  );

  const glassStyle = {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '24px',
    border: '1px solid var(--border-subtle)',
    padding: '40px',
    marginBottom: '30px',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: '800',
    color: 'var(--text-dim)',
    marginBottom: '8px',
    letterSpacing: '1px',
    textTransform: 'uppercase'
  };

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    background: 'rgba(0,0,0,0.03)',
    border: '1px solid var(--border-strong)',
    borderRadius: '12px',
    color: 'var(--text-main)',
    fontSize: '0.95rem',
    outline: 'none',
    marginBottom: '20px',
    boxSizing: 'border-box'
  };

  return (
    <div className="animate-fade" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>My Profile</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>Manage your account settings and business information</p>
      </div>

      {/* Identity Segment */}
      <div style={glassStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'linear-gradient(45deg, var(--bg-surface-elevated), #222)',
              border: '2px solid var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              overflow: 'hidden'
            }}>
              {profile.profile_image ? (
                <img src={profile.profile_image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : "🎭"}
            </div>
            <div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: '900', margin: 0, color: 'var(--text-main)' }}>{profile.full_name}</h3>
              <p style={{ color: 'var(--text-dim)', marginTop: '5px', fontSize: '1rem' }}>{profile.email}</p>
              {profile.is_verified_business && (
                <div style={{
                  marginTop: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  padding: '5px 12px',
                  borderRadius: '10px',
                  border: '1px solid rgba(212, 175, 55, 0.3)'
                }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--primary)', letterSpacing: '1px' }}>✓ VERIFIED BUSINESS</span>
                </div>
              )}
            </div>
          </div>
          {!editMode && (
            <button
              onClick={() => setEditMode(true)}
              style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-main)', fontWeight: '700', cursor: 'pointer' }}
            >
              Update Profile
            </button>
          )}
        </div>

        {!editMode ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            <div>
              <label style={labelStyle}>Phone Number</label>
              <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '500' }}>{profile.mobile_number || "Not set"}</div>
            </div>
            <div>
              <label style={labelStyle}>Delivery Address</label>
              <div style={{ color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '500' }}>{profile.address || "No address provided"}</div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="animate-fade">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} value={profile.full_name || ""} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} />
              </div>
              <div>
                <label style={labelStyle}>Phone Number</label>
                <input style={inputStyle} value={profile.mobile_number || ""} onChange={(e) => setProfile({ ...profile, mobile_number: e.target.value })} />
              </div>
            </div>
            <label style={labelStyle}>Primary Address</label>
            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} value={profile.address || ""} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" className="btn-premium" style={{ padding: '12px 30px', borderRadius: '12px' }}>Save Changes</button>
              <button type="button" onClick={() => setEditMode(false)} style={{ padding: '12px 20px', borderRadius: '12px', border: '1px solid var(--border-strong)', background: 'transparent', color: 'var(--text-dim)', fontWeight: '700' }}>Cancel</button>
            </div>
          </form>
        )}
      </div>

      {/* Partnership Segment - Only visible to Business Accounts */}
      {profile.is_business_account && !profile.is_verified_business && !appStatus && !applying && (
        <div style={{ ...glassStyle, border: '1px solid rgba(16, 185, 129, 0.3)', background: 'rgba(16, 185, 129, 0.05)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10B981', margin: '0 0 15px 0' }}>Business Verification</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.6', marginBottom: '30px' }}>
            Complete your business profile to unlock special trade pricing and professional tools.
          </p>
          <button className="btn-premium" style={{ padding: '15px 35px', background: '#10B981', color: 'var(--bg-main)', borderRadius: '14px' }} onClick={() => setApplying(true)}>
            APPLY FOR VERIFICATION
          </button>
        </div>
      )}

      {applying && (
        <div className="glass-panel animate-fade" style={{ ...glassStyle, border: '2px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', margin: '0 0 30px 0' }}>Partnership Registry</h3>
          <form onSubmit={handleApply}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div>
                <label style={labelStyle}>Business Name</label>
                <input style={inputStyle} required value={appData.business_name} onChange={e => setAppData({ ...appData, business_name: e.target.value })} placeholder="e.g. Vaagai Architects Ltd." />
              </div>
              <div>
                <label style={labelStyle}>GST / Tax ID</label>
                <input style={inputStyle} required value={appData.gst_number} onChange={e => setAppData({ ...appData, gst_number: e.target.value })} placeholder="XX-XXXXXX" />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px' }}>
              <div>
                <label style={labelStyle}>Industry</label>
                <input style={inputStyle} required value={appData.business_type} onChange={e => setAppData({ ...appData, business_type: e.target.value })} placeholder="Retail / Construction" />
              </div>
              <div>
                <label style={labelStyle}>Business Phone</label>
                <input style={inputStyle} required value={appData.contact_number} onChange={e => setAppData({ ...appData, contact_number: e.target.value })} placeholder="Phone Number" />
              </div>
            </div>
            <label style={labelStyle}>Business Address</label>
            <textarea style={{ ...inputStyle, minHeight: '100px', resize: 'none' }} required value={appData.business_address} onChange={e => setAppData({ ...appData, business_address: e.target.value })} />

            <div style={{ display: 'flex', gap: '15px' }}>
              <button type="submit" className="btn-premium" style={{ padding: '15px 40px', borderRadius: '14px' }}>Submit Credentials</button>
              <button type="button" onClick={() => setApplying(false)} style={{ padding: '12px 25px', borderRadius: '12px', background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-dim)', fontWeight: '700' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {appStatus && appStatus.status === 'pending' && !profile.is_verified_business && (
        <div style={{ ...glassStyle, border: '1px solid var(--primary)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', margin: '0 0 15px 0' }}>Verification Pending</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>
            We are currently reviewing the business information for <strong>{appStatus.business_name}</strong>. You will be notified once verified.
          </p>
          <div style={{
            marginTop: '20px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'rgba(212, 175, 55, 0.1)',
            display: 'inline-block',
            fontSize: '0.8rem',
            fontWeight: '800',
            color: 'var(--primary)',
            letterSpacing: '1px'
          }}>
            STATUS: {appStatus.status.toUpperCase()}
          </div>
        </div>
      )}

      {appStatus && appStatus.status === 'rejected' && !profile.is_verified_business && !applying && (
        <div style={{ ...glassStyle, border: '1px solid #EF4444', background: 'rgba(239, 68, 68, 0.05)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#EF4444', margin: '0 0 15px 0' }}>Application Rejected</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', marginBottom: '20px' }}>
            Unfortunately, your business application for <strong>{appStatus.business_name}</strong> was not approved.
          </p>

          {appStatus.admin_notes && (
            <div style={{
              marginBottom: '25px',
              padding: '15px 20px',
              background: 'rgba(239, 68, 68, 0.08)',
              borderRadius: '12px',
              borderLeft: '4px solid #EF4444'
            }}>
              <label style={{ ...labelStyle, color: '#EF4444', marginBottom: '5px' }}>Reason from Admin</label>
              <p style={{ color: 'var(--text-main)', margin: 0, fontSize: '0.95rem' }}>{appStatus.admin_notes}</p>
            </div>
          )}

          <button
            className="btn-premium"
            style={{ padding: '15px 35px', background: '#EF4444', color: '#fff', borderRadius: '14px' }}
            onClick={() => setApplying(true)}
          >
            RE-APPLY WITH UPDATED INFO
          </button>
        </div>
      )}

      {profile.is_verified_business && (
        <div style={{ ...glassStyle, border: '1px solid #10B981', background: 'rgba(16, 185, 129, 0.05)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10B981', margin: '0 0 15px 0' }}>✓ Business Verified</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem', lineHeight: '1.6' }}>
            Your business profile is verified. You can now access exclusive trade pricing and professional tools.
          </p>
        </div>
      )}
    </div>
  );
};

export default Profile;
