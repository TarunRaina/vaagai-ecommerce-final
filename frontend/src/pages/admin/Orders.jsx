import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icons";

const Orders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const { token } = useAuth();

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [notifType, setNotifType] = useState("success");

  // Get today's date in YYYY-MM-DD format for local timezone comparison
  const todayStr = new Date().toLocaleDateString('en-CA'); // en-CA gives YYYY-MM-DD
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    markOrdersAsSeen();
  }, []);

  const markOrdersAsSeen = async () => {
    try {
      await api.post("/orders/admin/mark-seen/", {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (err) {
      console.error("Failed to mark orders as seen", err);
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get("/orders/admin/list/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders.filter((order) => {
    if (filter === "unpaid") return order.payment_status === "unpaid";
    if (filter === "shipped") return order.received_status === "shipped";
    if (filter === "completed") return order.received_status === "delivered";
    return true;
  });

  const stats = [
    { label: "Total Orders", value: orders.length, color: "var(--primary)", icon: "orders" },
    { label: "Unpaid", value: orders.filter(o => o.payment_status === "unpaid").length, color: "#dc2626", icon: "dollar" },
    { label: "Shipped", value: orders.filter(o => o.received_status === "shipped").length, color: "#2563eb", icon: "clock" },
    { label: "Completed", value: orders.filter(o => o.received_status === "delivered").length, color: "#16a34a", icon: "check" },
  ];

  const toggleOrder = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const markPaid = async (orderId) => {
    try {
      await api.patch(`/orders/admin/mark-paid/${orderId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) { console.error("Failed to mark paid"); }
  };

  const markShipped = async (orderId) => {
    try {
      await api.patch(`/orders/admin/mark-shipped/${orderId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) { console.error("Failed to mark shipped"); }
  };

  const markDelivered = async (orderId) => {
    try {
      await api.patch(`/orders/admin/mark-delivered/${orderId}/`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) { console.error("Failed to mark delivered"); }
  };

  const updateLogistics = async (orderId, estDate) => {
    try {
      await api.patch(`/orders/admin/logistics/${orderId}/`, { estimated_delivery: estDate }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchOrders();
    } catch (err) { console.error("Failed to update logistics"); }
  };

  return (
    <div className="animate-fade">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: '#1A1A1A' }}>Orders</h2>
          <p style={{ color: '#999', marginTop: '4px', fontSize: '0.88rem' }}>Track and manage customer orders</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {["all", "unpaid", "shipped", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '8px 18px',
                background: filter === f ? 'var(--primary)' : '#fff',
                border: filter === f ? '1.5px solid var(--primary)' : '1.5px solid #E0D9CC',
                borderRadius: '8px',
                color: filter === f ? '#fff' : '#555',
                cursor: 'pointer',
                fontWeight: '700',
                fontSize: '0.82rem',
                textTransform: 'capitalize',
                transition: 'all 0.15s'
              }}
            >
              {f === 'all' ? 'All Orders' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '25px', marginBottom: '50px' }}>
        {stats.map((s, i) => (
          <div key={i} style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-cohesive)',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '18px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
          }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '12px',
              background: `${s.color}18`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1px solid ${s.color}30`,
              flexShrink: 0
            }}>
              <Icon name={s.icon} size={22} color={s.color} strokeWidth={1.8} />
            </div>
            <div>
              <div style={{ fontSize: '0.78rem', color: '#999', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '1.9rem', fontWeight: '800', color: '#1A1A1A', lineHeight: 1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {loading ? (
        <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '100px' }}>Syncing order data...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '80px', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '20px' }}>📦</div>
          <h3 style={{ color: 'var(--text-main)' }}>No Active Orders</h3>
          <p>Orders will appear here once customers start purchasing.</p>
        </div>
      ) : (
        <div className="glass-panel" style={{ borderRadius: '20px', overflow: 'hidden' }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-strong)' }}>
                <th style={{ padding: '18px 25px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Order ID</th>
                <th style={{ padding: '18px 25px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer</th>
                <th style={{ padding: '18px 25px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Summary</th>
                      <th style={{ textAlign: "left", padding: "15px 24px", color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Total Amount</th>
                      <th style={{ textAlign: "left", padding: "15px 24px", color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Expected Delivery</th>
                      <th style={{ textAlign: "left", padding: "15px 24px", color: "var(--text-dim)", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px" }}>Status</th>
                <th style={{ padding: '18px 25px', fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((order) => (
                <React.Fragment key={order.id}>
                  <tr
                    key={order.id}
                    style={{
                      cursor: "pointer",
                      borderBottom: "1px solid var(--border-subtle)",
                      transition: "all 0.2s",
                      background: !order.is_seen ? 'rgba(184,134,11,0.03)' : (expandedOrder === order.id ? "var(--bg-surface-elevated)" : "transparent"),
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = !order.is_seen ? 'rgba(184,134,11,0.05)' : "var(--bg-surface-elevated)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = !order.is_seen ? 'rgba(184,134,11,0.03)' : (expandedOrder === order.id ? "var(--bg-surface-elevated)" : "transparent"))}
                    onClick={() => toggleOrder(order.id)}
                  >
                    <td style={{ padding: "20px 25px" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {!order.is_seen && (
                          <span style={{ 
                            width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)',
                            boxShadow: '0 0 8px var(--primary)'
                          }}></span>
                        )}
                        <span style={{ fontWeight: "800", color: "var(--text-main)" }}>#{order.id}</span>
                      </div>
                    </td>
                    <td style={{ padding: '20px 25px' }}>
                      <div style={{ fontWeight: "700", color: 'var(--text-main)' }}>{order.user_name || "Guest"}</div>
                      <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{order.user_email}</div>
                    </td>

                    <td style={{ padding: '20px 25px' }}>
                      <span style={{ fontWeight: "600", color: 'var(--text-dim)' }}>{order.total_items} item(s)</span>
                      <div style={{ fontSize: "0.8rem", color: "var(--primary)", marginTop: '4px' }}>
                        {expandedOrder === order.id ? "Close Details" : "Expand Details"}
                      </div>
                    </td>

                    <td style={{ padding: '20px 25px', fontWeight: '800', color: 'var(--text-main)' }}>₹{parseFloat(order.total_amount).toLocaleString()}</td>
                    <td style={{ padding: '20px 25px' }}>
                      {order.estimated_delivery ? (
                        <div style={{ 
                          display: 'flex', alignItems: 'center', gap: '6px',
                          color: (order.estimated_delivery === todayStr && order.received_status !== 'delivered') ? '#dc2626' : 'var(--text-main)',
                          fontWeight: '700', fontSize: '0.85rem'
                        }}>
                          <Icon name="clock" size={14} color="currentColor" />
                          {new Date(order.estimated_delivery).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                          {order.estimated_delivery === todayStr && order.received_status !== 'delivered' && (
                            <span style={{ fontSize: '0.65rem', background: '#dc2626', color: '#fff', padding: '1px 5px', borderRadius: '4px', marginLeft: '4px', animation: 'pulse 2s infinite' }}>TODAY</span>
                          )}
                        </div>
                      ) : (
                        <span style={{ color: '#BBB', fontSize: '0.8rem', fontStyle: 'italic' }}>Not Set</span>
                      )}
                    </td>
                    <td style={{ padding: "20px 25px" }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <span style={{
                          padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "900", textAlign: 'center', width: 'fit-content',
                          background: order.payment_status === "paid" ? "rgba(74, 222, 128, 0.1)" : "rgba(255, 68, 68, 0.1)",
                          color: order.payment_status === "paid" ? "#16a34a" : "#dc2626",
                          border: `1px solid ${order.payment_status === "paid" ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 68, 68, 0.2)'}`
                        }}>
                          {order.payment_status.toUpperCase()}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <span style={{
                            padding: "4px 10px", borderRadius: "20px", fontSize: "0.7rem", fontWeight: "900", textAlign: 'center', width: 'fit-content',
                            background: order.received_status === "delivered" ? "rgba(74, 222, 128, 0.1)" : 
                                        order.received_status === "shipped" ? "rgba(37, 99, 235, 0.08)" : "var(--bg-surface-elevated)",
                            color: order.received_status === "delivered" ? "#16a34a" : 
                                   order.received_status === "shipped" ? "#2563eb" : "var(--text-muted)",
                            border: `1px solid ${order.received_status === "delivered" ? 'rgba(74, 222, 128, 0.2)' : 
                                                order.received_status === "shipped" ? 'rgba(37, 99, 235, 0.2)' : 'var(--border-strong)'}`
                          }}>
                            {order.received_status.toUpperCase()}
                          </span>
                          {order.estimated_delivery === todayStr && order.received_status !== 'delivered' && (
                            <span style={{
                              padding: "2px 8px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: "900", 
                              background: '#ef4444', color: '#fff', textAlign: 'center', width: 'fit-content',
                              animation: 'pulse 2s infinite'
                            }}>
                              DUE TODAY
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '20px 25px' }} onClick={(e) => e.stopPropagation()}>
                      <div style={{ display: "flex", gap: "8px" }}>
                        {order.payment_status === "unpaid" && (
                          <button
                            onClick={() => markPaid(order.id)}
                            style={{ background: "#4ade80", color: "#000", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: '0.75rem', fontWeight: '800' }}
                          >
                            PAID
                          </button>
                        )}
                        {order.received_status === "pending" && (
                          <button
                            onClick={() => markShipped(order.id)}
                            style={{ background: "#2563eb", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: '0.75rem', fontWeight: '800' }}
                          >
                            SHIP
                          </button>
                        )}
                        {order.received_status === "shipped" ? (
                          <button
                            onClick={() => markDelivered(order.id)}
                            style={{ background: "#16a34a", color: "#fff", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "pointer", fontSize: '0.75rem', fontWeight: '800' }}
                          >
                            DELIVERED
                          </button>
                        ) : order.received_status === "delivered" ? (
                          <button
                            disabled
                            style={{ background: "#e5e7eb", color: "#9ca3af", border: "none", padding: "8px 12px", borderRadius: "8px", cursor: "default", fontSize: '0.75rem', fontWeight: '800' }}
                          >
                            DELIVERED
                          </button>
                        ) : null}
                      </div>
                    </td>
                  </tr>

                  {expandedOrder === order.id && (
                    <tr style={{ background: 'var(--bg-surface-elevated)' }}>
                      <td colSpan="6" style={{ padding: "0" }}>
                        <div style={{ padding: "30px 40px", borderBottom: "1px solid var(--border-strong)" }}>
                          <h4 style={{ margin: "0 0 20px 0", color: 'var(--primary)', letterSpacing: '1px' }}>INVOICE ITEMS</h4>
                          <table style={{ width: "100%", borderCollapse: "collapse" }}>
                            <thead>
                              <tr style={{ textAlign: "left", fontSize: "0.8rem", color: "var(--text-muted)", borderBottom: "1px solid var(--border-strong)" }}>
                                <th style={{ padding: "12px" }}>PRODUCT</th>
                                <th style={{ padding: "12px" }}>PRICE</th>
                                <th style={{ padding: "12px" }}>QTY</th>
                                <th style={{ padding: "12px" }}>LINE TOTAL</th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.items.map((item) => (
                                <tr key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.03)" }}>
                                  <td style={{ padding: "12px", fontWeight: '700', color: 'var(--text-main)' }}>{item.product_name}</td>
                                  <td style={{ padding: "12px", color: 'var(--text-dim)' }}>₹{Number(item.price).toLocaleString()}</td>
                                  <td style={{ padding: "12px", color: 'var(--text-dim)' }}>{item.quantity}</td>
                                  <td style={{ padding: "12px", fontWeight: '800', color: 'var(--text-main)' }}>₹{(item.price * item.quantity).toLocaleString()}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <div style={{ marginTop: "30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px", background: 'var(--bg-surface-elevated)', padding: '25px', borderRadius: '16px' }}>
                            <div>
                              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: 'var(--primary)' }}>ORDER TYPE:</strong> {order.order_type?.toUpperCase()}</p>
                              <p style={{ margin: 0 }}><strong style={{ color: 'var(--primary)' }}>INSTALLATION:</strong> {order.installation_type?.toUpperCase()}</p>
                            </div>
                            <div>
                              <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: 'var(--primary)' }}>DELIVERY:</strong> {order.delivery_method?.replace('_', ' ').toUpperCase()}</p>
                              {order.delivery_method === "home_delivery" && (
                                <>
                                  <p style={{ margin: '0 0 10px 0' }}><strong style={{ color: 'var(--primary)' }}>ADDRESS:</strong> <span style={{ color: 'var(--text-dim)' }}>{order.delivery_address}</span></p>
                                  <p style={{ margin: 0 }}><strong style={{ color: 'var(--primary)' }}>PINCODE:</strong> <span style={{ color: 'var(--text-dim)' }}>{order.pincode}</span></p>
                                </>
                              )}
                              
                              <div style={{ marginTop: '20px', padding: '15px', background: 'rgba(0,0,0,0.02)', borderRadius: '10px', border: '1px dashed var(--border-cohesive)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                                  <strong style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>ESTIMATED DELIVERY:</strong>
                                  <input 
                                    type="date" 
                                    defaultValue={order.estimated_delivery} 
                                    onChange={(e) => updateLogistics(order.id, e.target.value)}
                                    style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-cohesive)', fontSize: '0.8rem' }}
                                  />
                                </div>
                                {order.shipped_at && (
                                  <p style={{ margin: '5px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <strong>Shipped:</strong> {new Date(order.shipped_at).toLocaleString()}
                                  </p>
                                )}
                                {order.delivered_at && (
                                  <p style={{ margin: '5px 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <strong>Delivered:</strong> {new Date(order.delivered_at).toLocaleString()}
                                  </p>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Orders;



