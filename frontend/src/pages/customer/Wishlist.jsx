import { useEffect, useState } from "react"
import api from "../../api/axios"
import { useAuth } from "../../auth/AuthContext"
import Icon from "../../components/Icons"
import Notification from "../../components/Notification"

const Wishlist = () => {
  const { token } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState("");
  const [notifType, setNotifType] = useState("success");

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const response = await api.get("/products/wishlist/");
      setWishlist(response.data);
    } catch (err) {
      console.error("Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/products/wishlist/delete/${id}/`);
      setWishlist(wishlist.filter(item => item.id !== id));
      setNotifType("success");
      setNotification("Removed from wishlist");
    } catch (err) {
      setNotifType("error");
      setNotification("Failed to remove item");
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await api.post("/products/cart/add/", { product_id: productId, quantity: 1 });
      setNotifType("success");
      setNotification("Added to cart!");
    } catch (err) {
      setNotifType("error");
      setNotification("Failed to add to cart");
    }
  };

  if (loading && wishlist.length === 0) return (
    <div style={{ padding: '100px', textAlign: 'center', color: 'var(--text-muted)' }}>
      <div className="animate-pulse" style={{ fontSize: '1.2rem', fontWeight: '800', letterSpacing: '4px' }}>
        LOADING WISHLIST...
      </div>
    </div>
  );

  return (
    <div className="animate-fade">
      <div style={{ marginBottom: '50px', padding: '40px 20px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, letterSpacing: '-1px' }}>My Saved Items</h2>
        <p style={{ color: 'var(--text-dim)', marginTop: '8px', fontSize: '1.1rem' }}>Designs you've saved for later</p>
      </div>

      {wishlist.length === 0 ? (
        <div className="glass-panel" style={{ padding: '80px', textAlign: 'center', borderRadius: '32px', border: '1px dashed var(--border-subtle)' }}>
          <div style={{ marginBottom: '20px', opacity: 0.3, display: 'flex', justifyContent: 'center' }}>
            <Icon name="heartOutline" size={60} color="var(--primary)" />
          </div>
          <h3 style={{ color: 'var(--text-main)', fontSize: '1.5rem', fontWeight: '800', marginBottom: '10px' }}>Your wishlist is empty</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '1rem' }}>Explore our collection and save your favorite pieces here.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px'
        }}>
          {wishlist.map((item) => (
            <div
              key={item.id}
              className="glass-panel hover-grow"
              style={{
                borderRadius: '28px',
                overflow: 'hidden',
                border: '1px solid var(--border-subtle)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{
                height: '240px',
                position: 'relative',
                background: '#fff',
                overflow: 'hidden'
              }}>
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      transition: 'transform 0.5s ease',
                      padding: '10px'
                    }}
                    className="product-img"
                  />
                )}
                <div style={{
                  position: 'absolute',
                  top: '20px',
                  right: '20px',
                  zIndex: 2
                }}>
                  <button
                    onClick={() => handleRemove(item.id)}
                    style={{
                      background: 'rgba(255, 68, 68, 0.15)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 68, 68, 0.2)',
                      color: '#ff4444',
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    title="Remove from wishlist"
                  >
                    <Icon name="trash" size={20} color="#ff4444" />
                  </button>
                </div>
              </div>

              <div style={{ padding: '30px' }}>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--primary)',
                  fontWeight: '800',
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  marginBottom: '10px'
                }}>
                  {item.product.category?.name || "Premium Design"}
                </div>
                <h4 style={{
                  margin: '0 0 15px 0',
                  fontSize: '1.4rem',
                  fontWeight: '900',
                  color: 'var(--text-main)',
                  lineHeight: '1.2'
                }}>{item.product.name}</h4>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)' }}>₹ {parseFloat(item.product.price).toLocaleString()}</div>
                    <a
                      href={`/product/${item.product.id}`}
                      style={{
                        color: 'var(--primary)',
                        textDecoration: 'none',
                        fontWeight: '800',
                        fontSize: '0.85rem',
                        letterSpacing: '1px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      VIEW DETAILS <Icon name="arrowRight" size={14} />
                    </a>
                  </div>
                  
                  <button
                    onClick={() => handleAddToCart(item.product.id)}
                    className="btn-premium"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '800'
                    }}
                  >
                    ADD TO CART
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .hover-grow:hover {
          transform: translateY(-8px);
          border-color: var(--primary-muted);
          background: rgba(255,255,255,0.04) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .hover-grow:hover .product-img {
          transform: scale(1.05);
        }
      `}</style>
      <Notification message={notification} type={notifType} onClose={() => setNotification("")} />
    </div>
  );
}

export default Wishlist