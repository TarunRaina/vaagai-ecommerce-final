import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const B2BApprovals = () => {
    const { token } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const res = await api.get("/b2b/admin/list/", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setApplications(res.data);
        } catch (err) {
            console.error("Failed to fetch B2B applications");
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (id, status, notes = "") => {
        try {
            await api.patch(`/b2b/admin/review/${id}/`, { status, admin_notes: notes }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchApplications();
            alert(`Application ${status} successfully!`);
        } catch (err) {
            alert("Failed to update application status.");
        }
    };

    if (loading) return <p>Loading applications...</p>;

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '2.2rem', fontWeight: '800', margin: 0 }}>Partnership Applications</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '5px' }}>Verify and onboard new business entities</p>
                </div>
                <div className="glass-card" style={{ padding: '10px 20px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '1px' }}>New Requests:</span>
                    <span style={{ marginLeft: '10px', fontWeight: '800', fontSize: '1.1rem' }}>{applications.filter(a => a.status === 'pending').length}</span>
                </div>
            </div>

            <div className="glass-panel" style={{ borderRadius: '24px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-strong)' }}>
                            <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Business</th>
                            <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>GST Number</th>
                            <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Sector</th>
                            <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Status</th>
                            <th style={{ padding: '20px 25px', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Date</th>
                            <th style={{ padding: '20px 25px', textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>Fetching partner dossiers...</td></tr>
                        ) : applications.length === 0 ? (
                            <tr><td colSpan="6" style={{ padding: '80px', textAlign: 'center', color: 'var(--text-muted)' }}>No active B2B applications found.</td></tr>
                        ) : applications.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface-elevated)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ padding: '25px' }}>
                                    <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem' }}>{app.business_name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '4px' }}>{app.user_full_name} <span style={{ opacity: 0.5 }}>|</span> {app.user_email}</div>
                                </td>
                                <td style={{ padding: '25px' }}>
                                    <div style={{ fontWeight: '700', color: 'var(--primary)', letterSpacing: '1px' }}>{app.gst_number || "NOT PROVIDED"}</div>
                                </td>
                                <td style={{ padding: '25px' }}>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{app.business_type?.toUpperCase()}</div>
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
                                <td style={{ padding: '25px', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    {new Date(app.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td style={{ padding: '25px' }}>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        {app.status === 'pending' ? (
                                            <>
                                                <button
                                                    onClick={() => handleReview(app.id, 'approved')}
                                                    style={{ background: '#16a34a', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                                >
                                                    APPROVE
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        const notes = prompt("Enter rationale for rejection:");
                                                        if (notes) handleReview(app.id, 'rejected', notes);
                                                    }}
                                                    style={{ background: 'rgba(255, 68, 68, 0.1)', color: '#ff4444', border: '1px solid rgba(255, 68, 68, 0.2)', padding: '10px 18px', borderRadius: '10px', fontSize: '0.75rem', fontWeight: '800', cursor: 'pointer' }}
                                                >
                                                    REJECT
                                                </button>
                                            </>
                                        ) : (
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700' }}>DECISION MADE</span>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default B2BApprovals;



