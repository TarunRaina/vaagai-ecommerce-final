import React, { useEffect, useState } from "react"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"

const Appointments = () => {
  const { token, user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [bookingError, setBookingError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRow, setExpandedRow] = useState(null);
  const itemsPerPage = 10;

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    user_note: "",
  });

  const fetchAppointments = async () => {
    try {
      const res = await api.get("/appointments/my/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAppointments(res.data);

      // Mark as seen on fetch
      await api.post("/appointments/mark-user-seen/", {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAppointments();
    }
  }, [token]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingError("");
    try {
      await api.post("/appointments/book/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Appointment booked successfully!");
      setFormData({ date: "", time: "", user_note: "" });
      fetchAppointments();
    } catch (err) {
      console.error("Booking error:", err.response?.data);
      const errorMsg = err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.date?.[0] ||
        err.response?.data?.time?.[0] ||
        "Error booking appointment. Please check the date/time.";
      setBookingError(errorMsg);
    }
  };

  const paginatedAppointments = appointments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(appointments.length / itemsPerPage);

  const styles = {
    container: {
      padding: '40px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'minmax(350px, 1fr) 2fr',
      gap: '32px',
    },
    card: {
      background: 'var(--bg-surface)',
      borderRadius: '16px',
      padding: '32px',
      border: '1px solid var(--border-cohesive)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
    },
    title: {
      fontSize: '1.4rem',
      fontWeight: '800',
      marginBottom: '28px',
      color: '#1A1A1A',
      letterSpacing: '-0.3px',
    },
    formGroup: {
      marginBottom: '20px',
    },
    label: {
      display: 'block',
      fontSize: '0.8rem',
      color: '#888',
      marginBottom: '8px',
      fontWeight: '700',
    },
    input: {
      width: '100%',
      padding: '12px 14px',
      background: 'var(--bg-main)',
      border: '1.5px solid var(--border-cohesive)',
      borderRadius: '10px',
      color: '#1A1A1A',
      fontSize: '0.9rem',
      transition: 'border-color 0.2s',
      outline: 'none',
    },
    button: {
      width: '100%',
      padding: '12px',
      background: 'var(--primary)',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      fontWeight: '700',
      fontSize: '0.9rem',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'opacity 0.2s',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
    },
    th: {
      textAlign: 'left',
      padding: '14px 16px',
      fontSize: '0.72rem',
      color: '#999',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      borderBottom: '1.5px solid var(--border-cohesive)',
    },
    td: {
      padding: '18px 16px',
      borderBottom: '1px solid var(--border-cohesive)',
      color: '#333',
      fontSize: '0.9rem',
    },
    statusBadge: (status) => ({
      padding: '4px 12px',
      borderRadius: '100px',
      fontSize: '0.72rem',
      fontWeight: '800',
      textTransform: 'uppercase',
      backgroundColor: status === 'approved' ? 'rgba(22,163,74,0.1)' : status === 'rejected' ? 'rgba(220,38,38,0.1)' : 'rgba(217,119,6,0.1)',
      color: status === 'approved' ? '#16A34A' : status === 'rejected' ? '#DC2626' : '#D97706',
      border: `1px solid ${status === 'approved' ? 'rgba(22,163,74,0.2)' : status === 'rejected' ? 'rgba(220,38,38,0.2)' : 'rgba(217,119,6,0.2)'}`,
    }),
    paginationButton: {
      padding: '8px 20px',
      background: 'var(--bg-surface)',
      border: '1.5px solid var(--border-cohesive)',
      borderRadius: '8px',
      color: '#444',
      fontSize: '0.82rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'all 0.2s',
      opacity: (disabled) => disabled ? 0.5 : 1,
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        <div style={styles.card}>
          <h2 style={styles.title}>Book Appointment</h2>
          <form onSubmit={handleBooking}>
            {bookingError && <div style={styles.error}>{bookingError}</div>}
            <div style={styles.formGroup}>
              <label style={styles.label}>Date</label>
              <input
                type="date"
                required
                style={styles.input}
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Time</label>
              <input
                type="time"
                required
                style={styles.input}
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Note to Admin</label>
              <textarea
                style={{ ...styles.input, minHeight: '100px', resize: 'vertical' }}
                value={formData.user_note}
                onChange={(e) => setFormData({ ...formData, user_note: e.target.value })}
                placeholder="Briefly describe your request..."
              />
            </div>
            <button type="submit" style={styles.button}>Request Appointment</button>
          </form>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>My Appointments</h2>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date/Time</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Responses</th>
              </tr>
            </thead>
            <tbody>
              {paginatedAppointments.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ ...styles.td, textAlign: 'center', padding: '60px 0', color: '#999' }}>
                    No appointments found
                  </td>
                </tr>
              ) : paginatedAppointments.map((app) => (
                <tr key={app.id}>
                  <td style={styles.td}>
                    <div style={{ fontWeight: '800', color: '#1A1A1A' }}>{app.date}</div>
                    <div style={{ fontSize: '0.78rem', color: '#888', marginTop: '2px', fontWeight: '500' }}>{app.time}</div>
                  </td>
                  <td style={styles.td}>
                    <span style={styles.statusBadge(app.status)}>{app.status}</span>
                  </td>
                  <td style={styles.td}>
                    {app.admin_reason ? (
                      <div style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic', fontWeight: '500' }}>
                        "{app.admin_reason}"
                      </div>
                    ) : (
                      <span style={{ color: '#AAA', fontSize: '0.85rem' }}>Pending review</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px', alignItems: 'center' }}>
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                style={{
                  ...styles.paginationButton,
                  opacity: currentPage === 1 ? 0.4 : 1,
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                }}
              >
                Previous
              </button>
              <span style={{ color: '#999', fontSize: '0.82rem', fontWeight: '600' }}>
                Page <span style={{ color: '#1A1A1A' }}>{currentPage}</span> of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                style={{
                  ...styles.paginationButton,
                  opacity: currentPage === totalPages ? 0.4 : 1,
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                }}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Appointments;