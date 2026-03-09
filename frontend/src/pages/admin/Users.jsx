import { useState, useEffect } from "react";
import api from "../../api/axios";
import Icon from "../../components/Icons";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("All");
    const [sortBy, setSortBy] = useState("Newest");
    const [selectedUser, setSelectedUser] = useState(null);
    const [userOrders, setUserOrders] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await api.get("/admin/users/");
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserOrders = async (userId) => {
        try {
            const res = await api.get(`/admin/users/${userId}/orders/`);
            setUserOrders(res.data);
            setShowModal(true);
        } catch (err) {
            console.error("Error fetching user orders", err);
        }
    };

    let result = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        u.full_name.toLowerCase().includes(search.toLowerCase())
    );

    if (filterType === 'B2C') result = result.filter(u => !u.is_business_account);
    if (filterType === 'B2B') result = result.filter(u => u.is_business_account);
    if (filterType === 'Verified B2B') result = result.filter(u => u.is_verified_business);
    if (filterType === 'Unverified B2B') result = result.filter(u => u.is_business_account && !u.is_verified_business);

    result.sort((a, b) => {
        if (sortBy === 'Newest') return new Date(b.date_joined) - new Date(a.date_joined);
        if (sortBy === 'Oldest') return new Date(a.date_joined) - new Date(b.date_joined);
        if (sortBy === 'Most Orders') return (b.total_orders || 0) - (a.total_orders || 0);
        if (sortBy === 'Least Orders') return (a.total_orders || 0) - (b.total_orders || 0);
        if (sortBy === 'Most Spent') return parseFloat(b.total_spent || 0) - parseFloat(a.total_spent || 0);
        if (sortBy === 'Least Spent') return parseFloat(a.total_spent || 0) - parseFloat(b.total_spent || 0);
        return 0;
    });

    const filteredUsers = result;

    const tableHeaderStyle = {
        padding: "14px 20px",
        textAlign: "left",
        fontSize: "0.72rem",
        textTransform: "uppercase",
        letterSpacing: "1.2px",
        color: "#888",
        fontWeight: "700",
        background: "#F9F5EE",
        borderBottom: "1.5px solid #EDE6D8"
    };

    const tableCellStyle = {
        padding: "16px 20px",
        borderBottom: "1px solid #F0EAE0",
        fontSize: "0.92rem",
        color: "#1A1A1A"
    };

    if (loading) return <div style={{ color: 'var(--text-muted)', padding: '20px' }}>Loading users...</div>;

    return (
        <div className="animate-fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#1A1A1A' }}>Users</h2>
                    <p style={{ color: '#999', marginTop: '4px', fontSize: '0.88rem' }}>Manage customer and business accounts</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1.5px solid var(--border-cohesive)', borderRadius: '10px', fontSize: '0.85rem', width: 'auto' }}
                    >
                        <option value="All">All Users</option>
                        <option value="B2C">B2C (Retail)</option>
                        <option value="B2B">B2B (Enterprise)</option>
                        <option value="Verified B2B">Verified B2B</option>
                        <option value="Unverified B2B">Unverified B2B</option>
                    </select>

                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        style={{ padding: '11px 14px', background: 'var(--bg-surface)', border: '1.5px solid var(--border-cohesive)', borderRadius: '10px', fontSize: '0.85rem', width: 'auto' }}
                    >
                        <option value="Newest">Newest First</option>
                        <option value="Oldest">Oldest First</option>
                        <option value="Most Orders">Most Orders</option>
                        <option value="Least Orders">Least Orders</option>
                        <option value="Most Spent">Top Spenders</option>
                        <option value="Least Spent">Lowest Spenders</option>
                    </select>

                    <div style={{ position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}>
                            <Icon name="eye" size={16} color="#AAA" strokeWidth={1.6} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            style={{
                                width: '300px',
                                paddingLeft: '38px',
                                background: 'var(--bg-surface)',
                                border: '1.5px solid var(--border-cohesive)',
                                borderRadius: '10px',
                                color: '#1A1A1A',
                                fontSize: '0.88rem'
                            }}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div style={{ background: 'var(--bg-surface)', border: '1.5px solid var(--border-cohesive)', borderRadius: '10px', padding: '11px 18px', fontSize: '0.85rem', fontWeight: '700', color: '#555', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Icon name="users" size={16} color="var(--primary)" strokeWidth={1.8} />
                        {users.length} Users
                    </div>
                </div>
            </div>

            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-cohesive)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1.5px solid var(--border-cohesive)' }}>
                            <th style={tableHeaderStyle}>Customer</th>
                            <th style={tableHeaderStyle}>Account Type</th>
                            <th style={tableHeaderStyle}>Orders</th>
                            <th style={tableHeaderStyle}>Total Spent</th>
                            <th style={tableHeaderStyle}>Joined</th>
                            <th style={tableHeaderStyle}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #F0EAE0', transition: 'background 0.15s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#FAF7F2'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                                <td style={{ ...tableCellStyle, borderBottom: 'none' }}>
                                    <div style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '1.05rem' }}>{user.full_name}</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginTop: '2px' }}>{user.email}</div>
                                </td>
                                <td style={{ ...tableCellStyle, borderBottom: 'none' }}>
                                    <span style={{
                                        padding: '5px 12px',
                                        borderRadius: '20px',
                                        fontSize: '0.7rem',
                                        fontWeight: '900',
                                        letterSpacing: '0.5px',
                                        background: user.is_business_account ? 'rgba(212, 175, 55, 0.12)' : 'var(--bg-surface-elevated)',
                                        color: user.is_business_account ? 'var(--primary)' : 'var(--text-muted)',
                                        border: `1px solid ${user.is_business_account ? 'rgba(212, 175, 55, 0.2)' : 'var(--border-strong)'}`
                                    }}>
                                        {user.is_business_account ? 'ENTERPRISE' : 'RETAIL'}
                                    </span>
                                </td>
                                <td style={{ ...tableCellStyle, borderBottom: 'none', fontWeight: '800' }}>{user.total_orders || 0} <span style={{ fontSize: '0.75rem', fontWeight: '400', color: 'var(--text-muted)' }}>Orders</span></td>
                                <td style={{ ...tableCellStyle, borderBottom: 'none', color: 'var(--primary)', fontWeight: '900', fontSize: '1.1rem' }}>
                                    ₹{(user.total_spent || 0).toLocaleString()}
                                </td>
                                <td style={{ ...tableCellStyle, borderBottom: 'none', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                                    {new Date(user.date_joined).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </td>
                                <td style={{ ...tableCellStyle, borderBottom: 'none' }}>
                                    <button
                                        onClick={() => { setSelectedUser(user); fetchUserOrders(user.id); }}
                                        style={{
                                            background: 'var(--bg-surface-elevated)',
                                            border: '1px solid var(--border-cohesive)',
                                            color: '#555',
                                            padding: '8px 14px',
                                            borderRadius: '8px',
                                            fontSize: '0.78rem',
                                            fontWeight: '700',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = '#F5F0E8'; e.currentTarget.style.color = '#555'; e.currentTarget.style.borderColor = '#E8E2D4'; }}
                                    >
                                        View Orders
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Simple Modal Implementation */}
            {showModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, width: '100%', height: '100%',
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 2000,
                    backdropFilter: 'blur(5px)'
                }} onClick={() => setShowModal(false)}>
                    <div style={{
                        width: '720px',
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        padding: '36px',
                        borderRadius: '16px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-cohesive)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                    }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                            <div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '5px' }}>Purchase History</h3>
                                <p style={{ color: 'var(--text-muted)' }}>Viewing orders for {selectedUser?.full_name}</p>
                            </div>
                            <button style={{ background: 'var(--bg-surface)', border: 'none', color: 'var(--text-main)', fontSize: '1.5rem', cursor: 'pointer' }} onClick={() => setShowModal(false)}>×</button>
                        </div>

                        {userOrders.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders found for this customer.</div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {userOrders.map(order => (
                                    <div key={order.id} style={{
                                        padding: '20px',
                                        background: 'var(--bg-surface-elevated)',
                                        borderRadius: '12px',
                                        border: '1px solid var(--border-strong)',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '5px' }}>ORDER #{order.id}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Placed on {new Date(order.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontWeight: '700', fontSize: '1.1rem' }}>₹{order.total_amount.toLocaleString()}</div>
                                            <div style={{
                                                fontSize: '0.7rem',
                                                textTransform: 'uppercase',
                                                color: order.payment_status === 'paid' ? '#4ade80' : '#f87171'
                                            }}>
                                                {order.payment_status}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Users;



