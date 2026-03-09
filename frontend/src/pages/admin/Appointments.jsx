import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"

const AdminAppointments = () => {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [reasons, setReasons] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const getConflicts = (app) => {
    return appointments.filter(a =>
      a.id !== app.id &&
      a.date === app.date &&
      a.time === app.time &&
      (a.status === 'pending' || a.status === 'approved')
    );
  };

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await api.get("/appointments/admin/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);

      await api.post("/appointments/mark-admin-seen/", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchAppointments();
  }, [token]);

  const handleReasonChange = (id, value) => {
    setReasons(prev => ({ ...prev, [id]: value }));
  };

  const updateStatus = async (id, status) => {
    const currentApp = appointments.find(a => a.id === id);
    const reason = reasons[id] !== undefined ? reasons[id] : currentApp.admin_reason || "";

    try {
      await api.patch(
        `/appointments/update/${id}/`,
        { status, admin_reason: reason },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAppointments();
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const labelStyle = { display: 'block', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '1px' };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>Consultation Schedule</h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Review and manage client visit requests</p>
        </div>
        <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Pending Sessions:</span>
          <span style={{ marginLeft: '10px', fontWeight: '800', fontSize: '1.1rem' }}>{appointments.filter(a => a.status === 'pending').length}</span>
        </div>
      </div>

      <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-strong)' }}>
              <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Customer</th>
              <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Schedule</th>
              <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Notes</th>
              <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Status</th>
              <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>Synchronizing calendar...</td></tr>
            ) : paginatedAppointments.length === 0 ? (
              <tr><td colSpan="5" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>No appointment data available.</td></tr>
            ) : paginatedAppointments.map(app => {
              const conflicts = getConflicts(app);
              const hasConflict = conflicts.length > 0;
              const isPending = app.status === 'pending';

              return (
                <tr key={app.id} style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  background: (hasConflict && isPending) ? 'rgba(212,175,55,0.04)' : 'transparent',
                  transition: 'all 0.2s'
                }}>
                  <td style={{ padding: '25px' }}>
                    <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.05rem' }}>{app.user_name || "Guest"}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{app.user_email}</div>
                  </td>
                  <td style={{ padding: '25px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1rem' }}>{new Date(app.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginTop: '2px' }}>{app.time}</div>
                    {hasConflict && isPending && (
                      <div style={{ marginTop: '10px', background: 'rgba(212,175,55,0.1)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)', border: '1px solid rgba(212,175,55,0.2)' }}>
                        ⚠️ {conflicts.length} SCHEDULE OVERLAP
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '25px' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', margin: 0, fontStyle: app.user_note ? 'normal' : 'italic' }}>
                      {app.user_note ? `"${app.user_note}"` : "No specific briefing provided."}
                    </p>
                  </td>
                  <td style={{ padding: '25px' }}>
                    <span style={{
                      padding: "6px 12px", borderRadius: "10px", fontSize: "0.7rem", fontWeight: "900", letterSpacing: '0.5px',
                      background: app.status === 'approved' ? 'rgba(74, 222, 128, 0.1)' : app.status === 'rejected' ? 'rgba(255, 68, 68, 0.1)' : 'rgba(212, 175, 55, 0.1)',
                      color: app.status === 'approved' ? '#16a34a' : app.status === 'rejected' ? '#dc2626' : 'var(--primary)',
                      border: `1px solid ${app.status === 'approved' ? 'rgba(74, 222, 128, 0.2)' : app.status === 'rejected' ? 'rgba(255, 68, 68, 0.2)' : 'rgba(212, 175, 55, 0.2)'}`
                    }}>
                      {app.status.toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '25px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <textarea
                        placeholder="Official response..."
                        style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: '10px', color: 'var(--text-main)', padding: '12px', fontSize: '0.85rem', minHeight: '80px', resize: 'none', width: '100%', boxSizing: 'border-box' }}
                        value={reasons[app.id] !== undefined ? reasons[app.id] : app.admin_reason || ""}
                        onChange={(e) => handleReasonChange(app.id, e.target.value)}
                      />
                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => updateStatus(app.id, "approved")}
                          style={{ flex: 1, background: '#16a34a', color: '#fff', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800' }}
                        >
                          CONFIRM
                        </button>
                        <button
                          onClick={() => updateStatus(app.id, "rejected")}
                          style={{ flex: 1, background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.2)', padding: '10px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '800' }}
                        >
                          DECLINE
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '25px', background: 'var(--bg-surface-elevated)', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-strong)', padding: '10px 20px', borderRadius: '10px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.4 : 1, fontSize: '0.8rem', fontWeight: '700' }}
            >
              ← PREVIOUS
            </button>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: '600' }}>
              RECORDS {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, appointments.length)} OF {appointments.length}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              style={{ background: 'var(--bg-surface)', color: 'var(--text-main)', border: '1px solid var(--border-strong)', padding: '10px 20px', borderRadius: '10px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.4 : 1, fontSize: '0.8rem', fontWeight: '700' }}
            >
              NEXT →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminAppointments;



