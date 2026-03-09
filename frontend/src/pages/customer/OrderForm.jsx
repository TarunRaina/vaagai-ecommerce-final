import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";

const OrderForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("individual");
  const [installationType, setInstallationType] = useState("product_only");
  const [deliveryMethod, setDeliveryMethod] = useState("home_delivery");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [message, setMessage] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/products/${productId}/`);
      setProduct(res.data);
    } catch (err) {
      console.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    if (!product) return { subtotal: 0, discount: 0, bulkBonus: 0, total: 0 };

    const baseSubtotal = product.price * quantity;
    let currentTotal = baseSubtotal;
    let b2bDiscount = 0;
    let bulkBonus = 0;

    if (product.b2b_discounted_price) {
      b2bDiscount = (product.price - product.b2b_discounted_price) * quantity;
      currentTotal = product.b2b_discounted_price * quantity;

      if (quantity >= 10) {
        const bulkPrice = product.price * 0.82;
        bulkBonus = (product.b2b_discounted_price - bulkPrice) * quantity;
        currentTotal = bulkPrice * quantity;
      }
    }

    return {
      subtotal: baseSubtotal.toFixed(2),
      discount: b2bDiscount.toFixed(2),
      bulkBonus: bulkBonus.toFixed(2),
      total: currentTotal.toFixed(2)
    };
  };

  const pricing = calculatePricing();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity > product.stock) {
      setMessage("Order quantity exceeds available stock.");
      return;
    }
    try {
      await api.post("/orders/create/", {
        items: [{ product_id: productId, quantity }],
        order_type: orderType,
        installation_type: installationType,
        delivery_method: deliveryMethod,
        payment_method: paymentMethod,
        delivery_address: deliveryMethod === "home_delivery" ? deliveryAddress : "",
      });
      setMessage("Order placed! Redirecting to your orders...");
      setTimeout(() => navigate("/customer/orders"), 2000);
    } catch (err) {
      setMessage("Order failed. Please check your details and try again.");
    }
  };

  if (loading) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div className="animate-pulse" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '4px' }}>
        LOADING ORDER DETAILS...
      </div>
    </div>
  );

  const glassStyle = {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '32px',
    border: '1px solid var(--border-strong)', // Brighter border for visibility
    padding: '40px',
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

  return (
    <div className="animate-fade" style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <div style={{ marginBottom: '50px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Order Details</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>Complete your order for {product.name}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'start' }}>
        {/* Left Pane: Asset Intelligence */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={glassStyle}>
            <div style={{
              width: '100%',
              height: '300px',
              borderRadius: '24px',
              overflow: 'hidden',
              background: '#000',
              border: '1px solid var(--border-strong)',
              marginBottom: '25px'
            }}>
              <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '2px', textTransform: 'uppercase' }}>
              {product.category?.name || "Premium Design"}
            </div>
            <h3 style={{ fontSize: '2rem', fontWeight: '900', margin: '10px 0', color: 'var(--text-main)' }}>{product.name}</h3>
            <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>₹{parseFloat(product.price).toLocaleString()}</div>
              {product.stock <= 5 && (
                <div style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: '800', background: 'rgba(239,68,68,0.1)', padding: '4px 12px', borderRadius: '10px' }}>
                  ONLY {product.stock} REMAINING
                </div>
              )}
            </div>
          </div>

          <div style={{ ...glassStyle, background: 'rgba(212, 175, 55, 0.03)', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '25px', letterSpacing: '1px', color: 'var(--text-main)' }}>PRICE SUMMARY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-dim)' }}>
                <span>Subtotal</span>
                <span>₹{parseFloat(pricing.subtotal).toLocaleString()}</span>
              </div>
              {parseFloat(pricing.discount) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981' }}>
                  <span>Business Discount</span>
                  <span>-₹{parseFloat(pricing.discount).toLocaleString()}</span>
                </div>
              )}
              {parseFloat(pricing.bulkBonus) > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: '700' }}>
                  <span>Bulk Discount</span>
                  <span>-₹{parseFloat(pricing.bulkBonus).toLocaleString()}</span>
                </div>
              )}
              <div style={{ marginTop: '10px', paddingTop: '20px', borderTop: '1px solid var(--border-strong)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>TOTAL</span>
                <span style={{ fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>₹{parseFloat(pricing.total).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Acquisition Console */}
        <div style={glassStyle}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Quantity</label>
                <input
                  type="number"
                  min="1"
                  max={product.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-strong)', color: 'var(--text-main)', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Order Type</label>
                <select
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-strong)', color: 'var(--text-main)', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="individual">Personal Use</option>
                  <option value="b2b">Business Project</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Delivery Method</label>
                <select
                  value={deliveryMethod}
                  onChange={(e) => setDeliveryMethod(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-strong)', color: 'var(--text-main)', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="home_delivery">Home Delivery</option>
                  <option value="shop_pickup">Store Pickup</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Installation</label>
                <select
                  value={installationType}
                  onChange={(e) => setInstallationType(e.target.value)}
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-strong)', color: 'var(--text-main)', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
                >
                  <option value="product_only">Product Only</option>
                  <option value="installation_required">In-Home Installation</option>
                </select>
              </div>
            </div>

            {deliveryMethod === "home_delivery" && (
              <div className="animate-fade">
                <label style={labelStyle}>Delivery Address</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  required
                  style={{
                    minHeight: '100px',
                    resize: 'none',
                    background: 'rgba(0,0,0,0.03)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text-main)',
                    padding: '12px',
                    borderRadius: '8px',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Enter your full delivery address..."
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid var(--border-strong)', color: 'var(--text-main)', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="razorpay" disabled>Online Payment (Coming Soon)</option>
              </select>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="submit"
                className="btn-premium"
                disabled={product.stock === 0}
                style={{ width: '100%', padding: '20px', borderRadius: '16px', fontSize: '1rem' }}
              >
                PLACE ORDER
              </button>
            </div>

            {message && (
              <div style={{
                marginTop: '10px',
                textAlign: 'center',
                color: message.includes('failed') ? '#EF4444' : 'var(--primary)',
                fontSize: '0.9rem',
                fontWeight: '700',
                letterSpacing: '1px'
              }}>
                {message.toUpperCase()}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
