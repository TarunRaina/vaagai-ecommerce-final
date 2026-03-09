import { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Notification from "../../components/Notification";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [notifType, setNotifType] = useState("success");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const activeOrders = orders.filter((order) => order.received_status !== "received");
  const orderHistory = orders.filter((order) => order.received_status === "received");

  const handleMarkReceived = async (orderId) => {
    try {
      await api.patch(`/orders/mark-received/${orderId}/`);
      setNotifType("success");
      setNotification("Order marked as received.");
      fetchOrders();
    } catch (err) {
      setNotifType("error");
      setNotification("Failed to update status. Please try again.");
    }
  };

  const getStatusBadge = (status, type) => {
    const isSuccess = status === "paid" || status === "received" || status === "delivered";
    const isWarning = status === "pending" || status === "shipped";

    return (
      <span style={{
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.7rem',
        fontWeight: '800',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        background: isSuccess ? 'rgba(16, 185, 129, 0.1)' : isWarning ? 'rgba(212, 175, 55, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        color: isSuccess ? '#10B981' : isWarning ? '#D4AF37' : '#EF4444',
        border: `1px solid ${isSuccess ? '#10B98133' : isWarning ? '#D4AF3733' : '#EF444433'}`
      }}>
        {status}
      </span>
    );
  };

  const OrderCard = ({ order, isHistory = false }) => (
    <div className="glass-panel animate-fade" style={{
      padding: '30px',
      borderRadius: '24px',
      marginBottom: '25px',
      border: '1px solid var(--border-subtle)',
      opacity: isHistory ? 0.7 : 1,
      transition: 'all 0.3s ease',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '25px' }}>
        <div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: '700', letterSpacing: '2px', marginBottom: '5px' }}>
            ORDER ID #{order.id}
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '500' }}>
            Ordered on {new Date(order.created_at).toLocaleDateString()}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {getStatusBadge(order.payment_status, 'payment')}
          {getStatusBadge(order.received_status, 'received')}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {order.items.map((item) => (
          <div
            key={item.id}
            onClick={() => navigate(`/product/${item.product}`)}
            style={{
              display: 'flex', gap: '20px', alignItems: 'center', padding: '15px',
              background: 'rgba(255,255,255,0.02)', borderRadius: '16px',
              border: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer',
              transition: 'background 0.2s'
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.02)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.02)'}
          >
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', overflow: 'hidden', background: '#111' }}>
              {item.product_image ? (
                <img src={item.product_image} alt={item.product_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)' }}>📦</div>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1.1rem' }}>{item.product_name}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Quantity: <span style={{ color: 'var(--text-main)' }}>{item.quantity}</span></div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: '900', color: 'var(--primary)', fontSize: '1.2rem' }}>₹{parseFloat(item.price * item.quantity).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {!isHistory && order.payment_status === "paid" && (
        <div style={{ marginTop: '30px', borderTop: '1px solid var(--border-subtle)', paddingTop: '25px', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => handleMarkReceived(order.id)}
            className="btn-premium"
            style={{ padding: '12px 25px', borderRadius: '14px', fontSize: '0.85rem' }}
          >
            CONFIRM RECEIPT
          </button>
        </div>
      )}
    </div>
  );

  if (loading && orders.length === 0) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div className="animate-pulse" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '4px' }}>
        LOADING ORDERS...
      </div>
    </div>
  );

  return (
    <div className="animate-fade" style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>My Orders</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>Track your purchases and order history</p>
      </div>

      <section style={{ marginBottom: '60px' }}>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dim)', marginBottom: '30px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Active Orders ({activeOrders.length})
        </h3>
        {activeOrders.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px', color: 'var(--text-dim)' }}>
            You have no active orders.
          </div>
        ) : (
          activeOrders.map(order => <OrderCard key={order.id} order={order} />)
        )}
      </section>

      <section>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: 'var(--text-dim)', marginBottom: '30px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Order History ({orderHistory.length})
        </h3>
        {orderHistory.length === 0 ? (
          <div className="glass-panel" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px', color: 'var(--text-dim)' }}>
            Your past orders will appear here.
          </div>
        ) : (
          orderHistory.map(order => <OrderCard key={order.id} order={order} isHistory={true} />)
        )}
      </section>

      <Notification
        message={notification}
        type={notifType}
        onClose={() => setNotification("")}
      />
    </div>
  );
};

export default Orders;
