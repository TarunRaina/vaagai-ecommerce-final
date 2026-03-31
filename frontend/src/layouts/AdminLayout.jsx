import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { useState, useEffect } from "react";
import api from "../api/axios";
import Icon from "../components/Icons";

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, token } = useAuth();
  const [unseenCount, setUnseenCount] = useState(0);
  const [unseenOrders, setUnseenOrders] = useState(0);
  const [pendingB2BCount, setPendingB2BCount] = useState(0);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const [unseenRes, b2bRes, orderUnseenRes] = await Promise.all([
            api.get("/appointments/unseen-count/"),
            api.get("/b2b/admin/list/"),
            api.get("/orders/admin/unseen-count/")
          ]);
          setUnseenCount(unseenRes.data.unseen_count);
          setUnseenOrders(orderUnseenRes.data.unseen_count);
          setPendingB2BCount(b2bRes.data.filter(app => app.status === 'pending').length);
        } catch (err) {
          console.error("Error fetching admin counts", err);
        }
      };
      fetchData();
      const interval = setInterval(fetchData, 30000);
      return () => clearInterval(interval);
    }
  }, [token]);

  const menuItems = [
    { name: "Inventory", path: "/admin/dashboard", icon: "inventory" },
    { name: "Products", path: "/admin/products", icon: "products" },
    { name: "Users", path: "/admin/users", icon: "users" },
    { name: "Orders", path: "/admin/orders", icon: "orders", count: unseenOrders },
    { name: "Appointments", path: "/admin/appointments", icon: "appointments", count: unseenCount },
    { name: "B2B Applications", path: "/admin/b2b-approvals", icon: "b2b", count: pendingB2BCount },
    { name: "Analytics", path: "/admin/analytics", icon: "analytics" },
    { name: "Shipping Locations", path: "/admin/shipping-locations", icon: "locations" },
    { name: "B2B Settings", path: "/admin/b2b-settings", icon: "settings" },
  ];

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{
        width: "256px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background: "var(--bg-surface-elevated)",
        borderRight: "1px solid var(--border-cohesive)",
        display: "flex",
        flexDirection: "column",
        zIndex: 100,
        boxSizing: "border-box",
        boxShadow: "4px 0 15px rgba(0,0,0,0.02)"
      }}>
        {/* Logo Area */}
        <div style={{
          padding: "28px 24px 24px",
          borderBottom: "1px solid var(--border-cohesive)"
        }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px"
          }}>
            <div style={{
              width: "34px",
              height: "34px",
              background: "var(--primary)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Icon name="shield" size={18} color="#fff" strokeWidth={2} />
            </div>
            <div>
              <div style={{ fontSize: "0.95rem", fontWeight: "800", color: "#1A1A1A", letterSpacing: "0.5px", fontFamily: "'Outfit', sans-serif" }}>VAAGAI</div>
              <div style={{ fontSize: "0.6rem", fontWeight: "700", color: "var(--primary)", letterSpacing: "2px", textTransform: "uppercase" }}>Admin Console</div>
            </div>
          </div>
        </div>

        {/* Navigation Section Label */}
        <div style={{ padding: "20px 24px 8px" }}>
          <span style={{ fontSize: "0.65rem", fontWeight: "700", color: "#AAA09A", letterSpacing: "1.5px", textTransform: "uppercase" }}>Navigation</span>
        </div>

        {/* Nav Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: "0 12px" }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <div
                key={item.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  color: isActive ? "var(--primary)" : "#555",
                  background: isActive ? "var(--bg-surface)" : "transparent",
                  borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
                  transition: "all 0.15s ease",
                  marginBottom: "2px",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: isActive ? "700" : "500",
                }}
                onClick={() => navigate(item.path)}
                onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(0,0,0,0.03)'; }}
                onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
              >
                <Icon
                  name={item.icon}
                  size={18}
                  color={isActive ? "var(--primary)" : "#888"}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />
                <span style={{ flex: 1 }}>{item.name}</span>
                {item.count > 0 && (
                  <span style={{
                    background: "var(--primary)",
                    color: "#fff",
                    fontSize: "0.6rem",
                    fontWeight: "800",
                    padding: "2px 7px",
                    borderRadius: "100px",
                    minWidth: "18px",
                    textAlign: "center"
                  }}>
                    {item.count}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom: Logout */}
        <div style={{ padding: "16px 12px 24px", borderTop: "1px solid var(--border-cohesive)" }}>
          <button
            onClick={() => { logout(); navigate("/admin/login"); }}
            style={{
              width: "100%",
              background: "transparent",
              color: "#999",
              padding: "10px 12px",
              borderRadius: "8px",
              textAlign: "left",
              fontSize: "0.88rem",
              fontWeight: "500",
              border: 'none',
              cursor: 'pointer',
              display: "flex",
              alignItems: "center",
              gap: "12px",
              transition: "all 0.15s"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.06)'; e.currentTarget.style.color = '#dc2626'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#999'; }}
          >
            <Icon name="logout" size={18} color="currentColor" strokeWidth={1.8} />
            Sign Out
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        marginLeft: "256px",
        flex: 1,
        width: "calc(100% - 256px)",
        minHeight: "100vh",
        background: "var(--bg-main)",
      }}>
        {/* Top Header Bar */}
        <div style={{
          background: "var(--bg-surface-elevated)",
          borderBottom: "1px solid var(--border-cohesive)",
          padding: "0 48px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          position: "sticky",
          top: 0,
          zIndex: 50,
          boxShadow: "0 2px 5px rgba(0,0,0,0.02)" // Lighter shadow as per instruction
        }}>
          <div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: "700", margin: 0, color: "#1A1A1A" }}>
              {menuItems.find(i => location.pathname === i.path)?.name || "Dashboard"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "0.88rem", fontWeight: "700", color: "#1A1A1A" }}>Super Admin</div>
              <div style={{ fontSize: "0.75rem", color: "#999" }}>admin@vaagai.com</div>
            </div>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(184,134,11,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1.5px solid rgba(184,134,11,0.3)"
            }}>
              <Icon name="shield" size={16} color="var(--primary)" strokeWidth={2} />
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div style={{ padding: "40px 48px", position: 'relative', minHeight: 'calc(100vh - 64px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
