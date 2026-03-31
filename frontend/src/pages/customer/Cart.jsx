import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icons";

const Cart = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/cart/");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      const res = await api.patch(`/products/cart/item/${itemId}/`, { quantity: newQuantity });
      setCart(res.data);
    } catch (err) {
      console.error("Failed to update quantity");
    }
  };

  const removeItem = async (itemId) => {
    try {
      const res = await api.delete(`/products/cart/item/${itemId}/`);
      setCart(res.data);
    } catch (err) {
      console.error("Failed to remove item");
    }
  };

  if (loading && !cart) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div className="animate-pulse" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '4px' }}>
        LOADING YOUR COLLECTION...
      </div>
    </div>
  );

  if (!cart || cart.items.length === 0) return (
    <div className="animate-fade" style={{ maxWidth: '800px', margin: '100px auto', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '80px', borderRadius: '40px', border: '1px dashed var(--border-subtle)' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
          <Icon name="cart" size={64} color="var(--border-strong)" />
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-main)', marginBottom: '10px' }}>Your cart is empty</h2>
        <p style={{ color: 'var(--text-dim)', marginBottom: '30px' }}>Looks like you haven't added any artisanal pieces yet.</p>
        <button onClick={() => navigate('/customer/dashboard')} className="btn-premium" style={{ padding: '15px 40px' }}>
          EXPLORE COLLECTION
        </button>
      </div>
    </div>
  );

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Shopping Cart</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>Review your selected artisanal designs</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px', alignItems: 'start' }}>
        {/* Cart Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {cart.items.map((item) => (
            <div key={item.id} className="glass-panel" style={{ 
              display: 'flex', 
              gap: '24px', 
              padding: '24px', 
              borderRadius: '24px',
              border: '1px solid var(--border-subtle)',
              alignItems: 'center'
            }}>
              <div style={{ width: '120px', height: '120px', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
                <img src={item.product.image} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>{item.product.category?.name}</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-main)' }}>{item.product.name}</h3>
                <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>₹{parseFloat(item.product.price).toLocaleString()} / unit</div>
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(0,0,0,0.03)', padding: '8px 16px', borderRadius: '12px' }}>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: '700' }}
                >-</button>
                <span style={{ fontWeight: '800', color: 'var(--text-main)', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', cursor: 'pointer', fontSize: '1.2rem', fontWeight: '700' }}
                >+</button>
              </div>

              <div style={{ textAlign: 'right', minWidth: '120px' }}>
                <div style={{ fontWeight: '900', fontSize: '1.2rem', color: 'var(--text-main)' }}>₹{parseFloat(item.item_total).toLocaleString()}</div>
                <button 
                  onClick={() => removeItem(item.id)}
                  style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', marginTop: '8px', padding: 0 }}
                >REMOVE</button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="glass-panel" style={{ 
          padding: '40px', 
          borderRadius: '32px', 
          border: '1px solid var(--primary-muted)',
          background: 'rgba(212, 175, 55, 0.02)',
          position: 'sticky',
          top: '100px'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '30px', color: 'var(--text-main)' }}>ORDER SUMMARY</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
              <span>Total Items</span>
              <span style={{ color: 'var(--text-main)', fontWeight: '700' }}>{cart.total_items}</span>
            </div>
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>ESTIMATED TOTAL</span>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>₹{parseFloat(cart.total_price).toLocaleString()}</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textAlign: 'center', marginTop: '10px' }}>
              Tax and delivery calculated at checkout
            </p>
            <button 
                onClick={() => navigate('/customer/checkout/cart')}
                className="btn-premium" 
                style={{ width: '100%', padding: '20px', borderRadius: '16px', fontSize: '1rem', marginTop: '20px' }}
            >
              PROCEED TO SECURE CHECKOUT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
