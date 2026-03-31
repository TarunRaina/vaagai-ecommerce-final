import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { useAuth } from "../../auth/AuthContext";
import Icon from "../../components/Icons";

const OrderForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [orderType, setOrderType] = useState("individual");
  const [installationType, setInstallationType] = useState("product_only");
  const [deliveryMethod, setDeliveryMethod] = useState("home_delivery");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [message, setMessage] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  const [tempOrderData, setTempOrderData] = useState(null);

  const isCartOrder = !productId;

  useEffect(() => {
    if (productId) {
      fetchProduct();
    } else {
      fetchCart();
    }
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

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/products/cart/");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const calculatePricing = () => {
    if (isCartOrder) {
      return {
        subtotal: cart?.total_price || 0,
        total: cart?.total_price || 0,
        itemsCount: cart?.total_items || 0
      };
    }
    
    if (!product) return { subtotal: 0, total: 0 };

    const subtotal = product.price * quantity;
    let total = subtotal;

    if (product.b2b_discounted_price) {
      total = product.b2b_discounted_price * quantity;
      
      // Bulk logic consistency
      if (quantity >= 10) {
        total = (product.price * 0.82) * quantity;
      }
    }

    return {
      subtotal: subtotal.toFixed(2),
      total: total.toFixed(2)
    };
  };

  const pricing = calculatePricing();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let items_payload = [];
    if (isCartOrder) {
      items_payload = cart.items.map(i => ({ product_id: i.product.id, quantity: i.quantity }));
    } else {
      if (quantity > product.stock) {
        setMessage("Order quantity exceeds available stock.");
        return;
      }
      items_payload = [{ product_id: productId, quantity }];
    }

    try {
      if (paymentMethod === "online") {
        setLoading(true);
        const res = await api.post("/orders/payment/mock/initiate/", {
          items: items_payload,
          order_type: orderType,
          installation_type: installationType,
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          delivery_address: deliveryMethod === "home_delivery" ? deliveryAddress : "",
          pincode: deliveryMethod === "home_delivery" ? pincode : "",
        });
        setTempOrderData(res.data);
        setShowPaymentModal(true);
        setLoading(false);
      } else {
        await api.post("/orders/create/", {
          items: items_payload,
          order_type: orderType,
          installation_type: installationType,
          delivery_method: deliveryMethod,
          payment_method: paymentMethod,
          delivery_address: deliveryMethod === "home_delivery" ? deliveryAddress : "",
          pincode: deliveryMethod === "home_delivery" ? pincode : "",
        });
        setMessage("Order placed! Redirecting to your orders...");
        setErrors({});
        setTimeout(() => navigate("/customer/orders"), 2000);
      }
    } catch (err) {
      if (err.response?.data && typeof err.response.data === 'object') {
        setErrors(err.response.data);
      } else {
        setErrors({});
      }
      setMessage("Order failed. Please check your details and try again.");
      setLoading(false);
    }
  };

  const handlePaymentVerify = async () => {
    setPaymentProcessing(true);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    try {
      await api.post("/orders/payment/mock/verify/", {
        order_id: tempOrderData.order_id
      });
      setShowPaymentModal(false);
      navigate("/customer/orders");
    } catch (err) {
      alert("Payment verification failed. Please contact support.");
      setShowPaymentModal(false);
    } finally {
      setPaymentProcessing(false);
    }
  };

  const handlePaymentCancel = async () => {
    try {
      await api.post("/orders/payment/mock/cancel/", {
        order_id: tempOrderData.order_id
      });
      setShowPaymentModal(false);
      setMessage("Order cancelled.");
    } catch (err) {
      console.error("Cancellation failed", err);
      setShowPaymentModal(false);
    }
  };

  if (loading) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div className="animate-pulse" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '4px' }}>
        LOADING CHECKOUT...
      </div>
    </div>
  );

  const glassStyle = {
    background: 'rgba(255,255,255,0.02)',
    borderRadius: '32px',
    border: '1px solid var(--border-strong)',
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
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>Checkout</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>
          {isCartOrder ? `Complete your order for ${cart?.total_items} items` : `Finalize your purchase of ${product?.name}`}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '40px', alignItems: 'start' }}>
        {/* Left Pane: Order Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          <div style={glassStyle}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '25px', letterSpacing: '1px', color: 'var(--text-main)' }}>ITEMS SUMMARY</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {isCartOrder ? (
                cart?.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={item.product.image} style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#fff', borderRadius: '4px' }} alt="" />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{item.product.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Qty: {item.quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '700' }}>₹{parseFloat(item.item_total).toLocaleString()}</div>
                  </div>
                ))
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <img src={product.image} style={{ width: '50px', height: '50px', objectFit: 'contain', background: '#fff', borderRadius: '4px' }} alt="" />
                      <div>
                        <div style={{ fontSize: '1rem', fontWeight: '800' }}>{product.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Qty: {quantity}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: '800', fontSize: '1.1rem' }}>₹{parseFloat(pricing.subtotal).toLocaleString()}</div>
                </div>
              )}
            </div>

            <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: '2px solid var(--primary-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: '800', color: 'var(--text-main)' }}>ESTIMATED TOTAL</span>
              <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>₹{parseFloat(pricing.total).toLocaleString()}</span>
            </div>
          </div>
          
          <div style={{ ...glassStyle, background: 'rgba(212, 175, 55, 0.03)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)' }}>
              <Icon name="shield" size={24} color="var(--primary)" />
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: '800' }}>Artisanal Quality Guarantee</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Every piece is inspected by our master craftsmen before dispatch.</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Pane: Checkout Form */}
        <div style={glassStyle}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
            {!isCartOrder && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={product?.stock}
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
            )}

            {isCartOrder && (
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
            )}

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
              <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Delivery Address</label>
                  <textarea
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    style={{
                      minHeight: '100px',
                      resize: 'none',
                      background: 'rgba(0,0,0,0.03)',
                      border: errors.delivery_address ? '1.5px solid #EF4444' : '1px solid var(--border-strong)',
                      color: 'var(--text-main)',
                      padding: '12px',
                      borderRadius: '8px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                    placeholder="Enter your full delivery address..."
                  />
                  {errors.delivery_address && <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '5px', fontWeight: '700' }}>{errors.delivery_address}</div>}
                </div>

                <div>
                  <label style={labelStyle}>Pincode (6 Digits)</label>
                  <input
                    type="text"
                    maxLength="6"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
                    required
                    placeholder="e.g. 638112"
                    style={{
                      background: 'rgba(0,0,0,0.03)',
                      border: errors.pincode ? '1.5px solid #EF4444' : '1px solid var(--border-strong)',
                      color: 'var(--text-main)',
                      padding: '12px',
                      borderRadius: '8px',
                      width: '100%',
                      boxSizing: 'border-box'
                    }}
                  />
                  {errors.pincode ? (
                    <div style={{ color: '#EF4444', fontSize: '0.75rem', marginTop: '5px', fontWeight: '700' }}>{errors.pincode}</div>
                  ) : (
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem', marginTop: '5px' }}>Currently delivering to TN, Kerala, and Karnataka.</div>
                  )}
                </div>
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
                <option value="online">Online Payment (Secure Mock)</option>
              </select>
            </div>

            <div style={{ marginTop: '20px' }}>
              <button
                type="submit"
                className="btn-premium"
                disabled={isCartOrder ? !cart?.items.length : product?.stock === 0}
                style={{ width: '100%', padding: '20px', borderRadius: '16px', fontSize: '1rem' }}
              >
                PLACE ORDER
              </button>
            </div>

            {Object.keys(errors).length > 0 && (
              <div style={{
                background: 'rgba(239, 68, 68, 0.05)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '15px',
                marginTop: '10px'
              }}>
                <div style={{ color: '#EF4444', fontSize: '0.85rem', fontWeight: '800', marginBottom: '8px' }}>ERRORS DETECTED:</div>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#EF4444', fontSize: '0.8rem', fontWeight: '600', lineHeight: '1.6' }}>
                  {Object.entries(errors).map(([field, fieldErrors]) => (
                    <li key={field}>
                      <strong>{field.replace('_', ' ')}:</strong> {Array.isArray(fieldErrors) ? fieldErrors.join(', ') : fieldErrors}
                    </li>
                  ))}
                </ul>
              </div>
            )}

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
      {/* Mock Payment Modal */}
      {showPaymentModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="glass-panel animate-fade" style={{
            maxWidth: '500px', width: '90%', padding: '50px', borderRadius: '32px',
            textAlign: 'center', background: 'var(--bg-main)', border: '1px solid var(--primary-muted)'
          }}>
            <div style={{ marginBottom: '30px' }}>
              <Icon name="shield" size={60} color="var(--primary)" />
              <h3 style={{ marginTop: '20px', fontSize: '1.8rem', fontWeight: '900', letterSpacing: '-1px' }}>VAAGAI SECURE PAY</h3>
              <p style={{ color: 'var(--text-dim)' }}>Digital transaction safely encrypted</p>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.03)', padding: '20px', borderRadius: '16px', marginBottom: '30px', textAlign: 'left' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>TRANSACTION ID</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: '800' }}>{tempOrderData?.transaction_id}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1rem', fontWeight: '800' }}>TOTAL AMOUNT</span>
                  <span style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)' }}>₹{parseFloat(tempOrderData?.amount).toLocaleString()}</span>
               </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px', textAlign: 'left' }}>
               <div>
                  <label style={labelStyle}>Card Number</label>
                  <input 
                    type="text" 
                    placeholder="Card Number (Dummy)" 
                    defaultValue="4111 2222 3333 4444"
                    style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', padding: '15px', borderRadius: '8px', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }}
                  />
               </div>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={labelStyle}>Expiry Date</label>
                    <input placeholder="MM/YY" defaultValue="12/28" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', padding: '15px', borderRadius: '8px', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }} />
                  </div>
                  <div>
                    <label style={labelStyle}>CVV</label>
                    <input placeholder="CVV" defaultValue="731" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', padding: '15px', borderRadius: '8px', color: 'var(--text-main)', width: '100%', boxSizing: 'border-box' }} />
                  </div>
               </div>
            </div>

            {paymentProcessing ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                <div className="animate-spin" style={{ width: '40px', height: '40px', border: '3px solid var(--primary-muted)', borderTopColor: 'var(--primary)', borderRadius: '50%' }}></div>
                <div style={{ fontWeight: '800', letterSpacing: '2px', color: 'var(--primary)' }}>VERIFYING WITH BANK...</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <button 
                  onClick={handlePaymentVerify}
                  className="btn-premium" 
                  style={{ width: '100%', padding: '18px', fontSize: '1.1rem' }}
                >
                  PAY SECURELY
                </button>
                <button 
                  onClick={handlePaymentCancel}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontWeight: '700', cursor: 'pointer' }}
                >
                  CANCEL TRANSACTION
                </button>
              </div>
            )}

            <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700' }}>
               <Icon name="lock" size={12} color="var(--text-muted)" />
               SECURED BY VAAGAI CLOUD GATEWAY
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderForm;
